-- ShipTickets.bd - booking foundation
-- Additive changes on top of 001-003, which are already applied.
--
-- Changes existing data in three places:
--   1. Both advance percentage settings become 20. Recover by setting them back
--      to 50 (office) and 100 (delivery).
--   2. The delivery_charges settings row is removed after its values are copied
--      to the delivery_charges table, which becomes the only source.
--   3. The bKash Merchant and Bank Transfer instructions and account details are
--      replaced. These are meant to be public, because customers need them to pay.

-- ---------------------------------------------------------------------------
-- Privacy and security
-- ---------------------------------------------------------------------------

-- RLS filters rows, not columns, so the public could read sailings.internal_note.
REVOKE SELECT ON sailings FROM anon, authenticated;
GRANT SELECT (
  id, ship_id, route_id, season_id, departure_at, arrival_at, boarding_point,
  reporting_time, schedule_status, public_note, created_at, updated_at
) ON sailings TO anon, authenticated;

-- Users may edit their own name and phone, but not their account status.
REVOKE UPDATE ON profiles FROM anon, authenticated;
GRANT UPDATE (full_name, phone) ON profiles TO authenticated;

ALTER FUNCTION has_role(TEXT) SET search_path = public;
ALTER FUNCTION get_user_roles() SET search_path = public;
ALTER FUNCTION update_updated_at_column() SET search_path = public;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------

-- Staff can change these at any time. Each booking keeps its own copy below.
UPDATE system_settings
SET value = '20'::jsonb, updated_at = NOW()
WHERE key IN ('advance_percentage_office', 'advance_percentage_delivery');

INSERT INTO delivery_charges (type, charge)
SELECT seed.type, seed.charge
FROM (VALUES ('dhaka', 80::NUMERIC), ('outside_dhaka', 150::NUMERIC)) AS seed(type, charge)
WHERE NOT EXISTS (SELECT 1 FROM delivery_charges existing WHERE existing.type = seed.type);

DELETE FROM system_settings WHERE key = 'delivery_charges';

ALTER TABLE payment_methods ADD COLUMN instructions_bn TEXT;

UPDATE payment_methods
SET instructions = 'Open the bKash app, choose Payment, and pay Merchant Number 017-11928982 (Ghuri Travel & Tourism). Then send your Transaction ID (TrxID) and a payment screenshot to our WhatsApp. Our team checks every payment before confirming your booking.',
    instructions_bn = E'bKash App খুলুন।\nPayment অপশন নির্বাচন করুন।\nMerchant Number: 017-11928982\nMerchant Name: Ghuri Travel & Tourism\nপেমেন্ট সম্পন্ন করুন।\n\nপেমেন্ট সম্পন্ন হলে ট্রানজেকশন আইডি (TrxID) এবং পেমেন্টের Screenshot আমাদের WhatsApp-এ পাঠিয়ে দিন। আমাদের টিম পেমেন্ট যাচাই করে বুকিং নিশ্চিত করবে।',
    account_details = '{"merchantNumber": "017-11928982", "merchantName": "Ghuri Travel & Tourism"}'::jsonb,
    updated_at = NOW()
WHERE type = 'bkash_merchant';

UPDATE payment_methods
SET instructions = 'Transfer to Southeast Bank PLC, Dhanmondi Branch, Dhaka. Account Name: Tripzic. Account Number: 001211100015997. Routing Number: 205261181. Then send your Transaction ID (TrxID) and a payment screenshot to our WhatsApp. Our team checks every payment before confirming your booking.',
    instructions_bn = E'ব্যাংক ট্রান্সফার — Southeast Bank PLC\nAccount Name: Tripzic\nAccount Number: 001211100015997\nBranch: Dhanmondi, Dhaka\nRouting Number: 205261181\nBank: Southeast Bank PLC\n\nপেমেন্ট সম্পন্ন হলে ট্রানজেকশন আইডি (TrxID) এবং পেমেন্টের Screenshot আমাদের WhatsApp-এ পাঠিয়ে দিন। আমাদের টিম পেমেন্ট যাচাই করে বুকিং নিশ্চিত করবে।',
    account_details = '{"bankName": "Southeast Bank PLC", "accountName": "Tripzic", "accountNumber": "001211100015997", "branch": "Dhanmondi, Dhaka", "routingNumber": "205261181"}'::jsonb,
    updated_at = NOW()
WHERE type = 'bank_transfer';

-- ---------------------------------------------------------------------------
-- Fares and booking details
-- ---------------------------------------------------------------------------

ALTER TABLE fare_rules
  ADD COLUMN trip_type TEXT CHECK (trip_type IN ('one_way', 'round_trip'));

-- A booking must find exactly one active fare for a category and trip type.
CREATE UNIQUE INDEX uq_fare_rules_active
  ON fare_rules (category_id, route_id, season_id, trip_type, fare_type, passenger_type, valid_from)
  NULLS NOT DISTINCT
  WHERE is_active AND trip_type IS NOT NULL;

ALTER TABLE booking_items
  ADD COLUMN trip_type TEXT CHECK (trip_type IN ('one_way', 'round_trip')),
  ADD COLUMN travel_date DATE,
  ADD COLUMN return_date DATE,
  ADD COLUMN return_sailing_id UUID REFERENCES sailings(id),
  ADD COLUMN seat_preference TEXT CHECK (char_length(seat_preference) <= 200),
  ADD CONSTRAINT booking_items_return_after_travel
    CHECK (return_date IS NULL OR travel_date IS NULL OR return_date >= travel_date);

-- Later changes to the setting must not alter bookings already made.
ALTER TABLE bookings
  ADD COLUMN advance_percentage NUMERIC(5,2) CHECK (advance_percentage BETWEEN 0 AND 100),
  ADD COLUMN advance_amount NUMERIC(12,2) CHECK (advance_amount >= 0);

-- ---------------------------------------------------------------------------
-- Money rules. NOT VALID applies them to new and changed rows without failing
-- on any existing row.
-- ---------------------------------------------------------------------------

ALTER TABLE bookings
  ADD CONSTRAINT bookings_amounts_not_negative CHECK (
    total_amount >= 0 AND discount_amount >= 0 AND delivery_charge >= 0
    AND grand_total >= 0 AND verified_paid >= 0 AND balance_due >= 0
  ) NOT VALID;

ALTER TABLE booking_items
  ADD CONSTRAINT booking_items_amounts_valid CHECK (
    quantity > 0 AND unit_fare_snapshot >= 0 AND line_total >= 0
  ) NOT VALID;

ALTER TABLE fare_rules ADD CONSTRAINT fare_rules_amount_positive CHECK (amount > 0) NOT VALID;
ALTER TABLE delivery_charges ADD CONSTRAINT delivery_charges_not_negative CHECK (charge >= 0) NOT VALID;
ALTER TABLE refunds ADD CONSTRAINT refunds_amount_positive CHECK (amount > 0) NOT VALID;

ALTER TABLE payments
  ADD CONSTRAINT payments_amount_positive CHECK (amount > 0) NOT VALID,
  ADD CONSTRAINT payments_status_valid CHECK (status IN ('Submitted', 'Verified', 'Rejected')) NOT VALID;

-- A TrxID can be used once per method. A rejected one can be submitted again,
-- because rejections are often caused by a typing mistake.
CREATE UNIQUE INDEX uq_payments_method_transaction
  ON payments (payment_method_id, upper(btrim(transaction_id)))
  WHERE transaction_id IS NOT NULL AND status <> 'Rejected';

-- ---------------------------------------------------------------------------
-- Payment review. Called by the server after a permission check.
-- ---------------------------------------------------------------------------

CREATE FUNCTION review_payment(
  p_payment_id UUID,
  p_actor_id UUID,
  p_approve BOOLEAN,
  p_rejection_reason TEXT DEFAULT NULL
)
RETURNS payments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment payments;
  v_booking bookings;
  v_verified_paid NUMERIC(12,2);
BEGIN
  IF p_approve IS NULL THEN
    RAISE EXCEPTION 'A review decision is required' USING ERRCODE = '22023';
  END IF;

  IF NOT p_approve AND coalesce(btrim(p_rejection_reason), '') = '' THEN
    RAISE EXCEPTION 'A rejection reason is required' USING ERRCODE = '22023';
  END IF;

  -- Only one review can win. A repeat finds no Submitted row and changes nothing.
  UPDATE payments
  SET status = CASE WHEN p_approve THEN 'Verified' ELSE 'Rejected' END,
      verified_by = CASE WHEN p_approve THEN p_actor_id END,
      verified_at = CASE WHEN p_approve THEN NOW() END,
      rejection_reason = CASE WHEN p_approve THEN NULL ELSE btrim(p_rejection_reason) END
  WHERE id = p_payment_id AND status = 'Submitted'
  RETURNING * INTO v_payment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment is not awaiting review' USING ERRCODE = 'P0002';
  END IF;

  IF p_approve THEN
    SELECT * INTO v_booking FROM bookings WHERE id = v_payment.booking_id FOR UPDATE;

    v_verified_paid := v_booking.verified_paid + v_payment.amount;

    IF v_verified_paid > v_booking.grand_total THEN
      RAISE EXCEPTION 'Payment is more than the amount due' USING ERRCODE = '22023';
    END IF;

    UPDATE bookings
    SET verified_paid = v_verified_paid,
        balance_due = grand_total - v_verified_paid,
        payment_status = CASE
          WHEN v_verified_paid >= grand_total THEN 'Fully Paid'::payment_status
          ELSE 'Partially Paid'::payment_status
        END,
        booking_status = CASE
          WHEN booking_status IN ('New Request', 'Awaiting Payment') THEN 'Processing'::booking_status
          ELSE booking_status
        END
    WHERE id = v_booking.id;

    IF v_booking.booking_status IN ('New Request', 'Awaiting Payment') THEN
      INSERT INTO booking_status_history (booking_id, booking_status, changed_by, notes)
      VALUES (v_booking.id, 'Processing', p_actor_id, 'Payment verified');
    END IF;
  END IF;

  INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
  VALUES (
    p_actor_id,
    CASE WHEN p_approve THEN 'payment.verified' ELSE 'payment.rejected' END,
    'payment',
    v_payment.id::TEXT,
    jsonb_build_object('booking_id', v_payment.booking_id, 'amount', v_payment.amount)
  );

  RETURN v_payment;
END;
$$;

REVOKE ALL ON FUNCTION review_payment(UUID, UUID, BOOLEAN, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION review_payment(UUID, UUID, BOOLEAN, TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- Google Sheets copy. The database is the record. Each row asks a worker to
-- copy one booking to the Sheet, so a Sheets outage never loses a booking.
-- It stores no customer details: the worker reads them when it runs, and NIDs
-- are never sent to the Sheet.
-- ---------------------------------------------------------------------------

CREATE TABLE sheet_sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'booking_created',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS with no policies: only the server's service role can reach this table.
ALTER TABLE sheet_sync_queue ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sheet_sync_due ON sheet_sync_queue (next_attempt_at) WHERE status = 'pending';
CREATE INDEX idx_sheet_sync_booking ON sheet_sync_queue (booking_id);

-- ---------------------------------------------------------------------------
-- Private files. Access is through short-lived signed URLs from the server.
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false),
       ('ticket-documents', 'ticket-documents', false)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Indexes for foreign keys and common filters
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking ON booking_items (booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_sailing ON booking_items (sailing_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_return_sailing ON booking_items (return_sailing_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_category ON booking_items (category_id);
CREATE INDEX IF NOT EXISTS idx_booking_passengers_booking ON booking_passengers (booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking ON booking_status_history (booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments (payment_method_id);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers (mobile_number);
CREATE INDEX IF NOT EXISTS idx_ship_categories_ship ON ship_categories (ship_id);
CREATE INDEX IF NOT EXISTS idx_fare_rules_category ON fare_rules (category_id);
CREATE INDEX IF NOT EXISTS idx_fare_rules_ship ON fare_rules (ship_id);
CREATE INDEX IF NOT EXISTS idx_sailing_inventory_category ON sailing_inventory (category_id);
CREATE INDEX IF NOT EXISTS idx_operator_bookings_booking ON operator_bookings (booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_booking ON tickets (booking_id);
CREATE INDEX IF NOT EXISTS idx_refunds_booking ON refunds (booking_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_booking ON deliveries (booking_id);
