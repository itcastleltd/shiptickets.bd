-- ShipTickets.bd - lets a customer pay the full fare instead of the advance.
-- Changes one function and no existing rows. The old call still works, as the new option defaults to off.

BEGIN;

DROP FUNCTION create_booking(UUID, TEXT, TEXT, TEXT, DATE, DATE, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT[], payment_method_type, TEXT);

CREATE FUNCTION create_booking(
  p_client_request_id UUID,
  p_ship_slug TEXT,
  p_category_code TEXT,
  p_trip_type TEXT,
  p_travel_date DATE,
  p_return_date DATE,
  p_quantity INTEGER,
  p_seat_preference TEXT,
  p_full_name TEXT,
  p_mobile_number TEXT,
  p_email TEXT,
  p_co_passengers TEXT[],
  p_payment_method_type payment_method_type,
  p_transaction_id TEXT,
  p_pay_in_full BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Dhaka')::DATE;
  v_existing bookings;
  v_ship_id UUID;
  v_category_id UUID;
  v_fare NUMERIC(12,2);
  v_setting JSONB;
  v_percentage NUMERIC(5,2);
  v_total NUMERIC(12,2);
  v_advance NUMERIC(12,2);
  v_method_id UUID;
  v_prefix TEXT;
  v_reference TEXT;
  v_customer_id UUID;
  v_booking_id UUID;
  v_item_id UUID;
  v_name TEXT;
BEGIN
  SELECT * INTO v_existing FROM bookings WHERE client_request_id = p_client_request_id;
  IF FOUND THEN
    RETURN jsonb_build_object(
      'reference', v_existing.booking_reference,
      'total', v_existing.grand_total,
      'advance', v_existing.advance_amount,
      'balance', v_existing.grand_total - v_existing.advance_amount,
      'advancePercentage', v_existing.advance_percentage
    );
  END IF;

  IF p_client_request_id IS NULL OR p_quantity IS NULL OR p_quantity NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION 'INVALID_QUANTITY' USING ERRCODE = '22023';
  END IF;
  IF p_trip_type NOT IN ('one_way', 'round_trip') OR p_travel_date IS NULL OR p_travel_date < v_today THEN
    RAISE EXCEPTION 'INVALID_DATE' USING ERRCODE = '22023';
  END IF;
  IF p_trip_type = 'round_trip' AND (p_return_date IS NULL OR p_return_date < p_travel_date) THEN
    RAISE EXCEPTION 'INVALID_DATE' USING ERRCODE = '22023';
  END IF;
  IF coalesce(btrim(p_full_name), '') = '' OR coalesce(btrim(p_mobile_number), '') = '' OR coalesce(btrim(p_transaction_id), '') = '' THEN
    RAISE EXCEPTION 'INVALID_DETAILS' USING ERRCODE = '22023';
  END IF;

  SELECT s.id, c.id INTO v_ship_id, v_category_id
  FROM ships s
  JOIN ship_categories c ON c.ship_id = s.id
  WHERE s.slug = p_ship_slug AND s.is_published AND c.code = p_category_code AND c.is_active;

  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'CATEGORY_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  -- Prices come only from here. A missing fare stops the booking.
  SELECT amount INTO v_fare
  FROM fare_rules
  WHERE category_id = v_category_id
    AND trip_type = p_trip_type
    AND is_active
    AND fare_type = 'regular'
    AND passenger_type = 'adult'
    AND (valid_from IS NULL OR valid_from <= p_travel_date)
    AND (valid_until IS NULL OR valid_until >= p_travel_date)
  ORDER BY valid_from DESC NULLS LAST
  LIMIT 1;

  IF v_fare IS NULL OR v_fare <= 0 THEN
    RAISE EXCEPTION 'FARE_MISSING' USING ERRCODE = 'P0002';
  END IF;

  SELECT value INTO v_setting FROM system_settings WHERE key = 'advance_percentage_office';
  IF v_setting IS NULL OR jsonb_typeof(v_setting) <> 'number' THEN
    RAISE EXCEPTION 'ADVANCE_NOT_SET' USING ERRCODE = 'P0002';
  END IF;
  v_percentage := (v_setting #>> '{}')::NUMERIC;
  IF v_percentage NOT BETWEEN 0 AND 100 THEN
    RAISE EXCEPTION 'ADVANCE_NOT_SET' USING ERRCODE = 'P0002';
  END IF;

  SELECT id INTO v_method_id FROM payment_methods WHERE type = p_payment_method_type AND is_active ORDER BY sort_order LIMIT 1;
  IF v_method_id IS NULL OR p_payment_method_type NOT IN ('bkash_merchant', 'bank_transfer') THEN
    RAISE EXCEPTION 'PAYMENT_METHOD_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  v_total := v_fare * p_quantity;
  v_advance := round(v_total * v_percentage / 100, 2);

  -- Paying in full is recorded as a 100% advance, which leaves no balance.
  IF coalesce(p_pay_in_full, FALSE) THEN
    v_percentage := 100;
    v_advance := v_total;
  END IF;

  SELECT coalesce(value #>> '{}', 'STB') INTO v_prefix FROM system_settings WHERE key = 'booking_prefix';
  LOOP
    v_reference := coalesce(v_prefix, 'STB') || '-' || upper(substr(md5(random()::TEXT || clock_timestamp()::TEXT), 1, 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference = v_reference);
  END LOOP;

  INSERT INTO customers (full_name, mobile_number, email)
  VALUES (btrim(p_full_name), btrim(p_mobile_number), nullif(btrim(p_email), ''))
  RETURNING id INTO v_customer_id;

  INSERT INTO bookings (
    booking_reference, client_request_id, customer_id, booking_source, booking_status,
    total_amount, grand_total, balance_due, advance_percentage, advance_amount, collection_method
  )
  VALUES (
    v_reference, p_client_request_id, v_customer_id, 'web_form', 'Awaiting Payment',
    v_total, v_total, v_total, v_percentage, v_advance, 'whatsapp'
  )
  RETURNING id INTO v_booking_id;

  INSERT INTO booking_items (
    booking_id, category_id, quantity, unit_fare_snapshot, line_total,
    trip_type, travel_date, return_date, seat_preference
  )
  VALUES (
    v_booking_id, v_category_id, p_quantity, v_fare, v_total,
    p_trip_type, p_travel_date, CASE WHEN p_trip_type = 'round_trip' THEN p_return_date END, nullif(btrim(p_seat_preference), '')
  )
  RETURNING id INTO v_item_id;

  INSERT INTO booking_passengers (booking_id, booking_item_id, full_name, mobile_number)
  VALUES (v_booking_id, v_item_id, btrim(p_full_name), btrim(p_mobile_number));

  FOREACH v_name IN ARRAY coalesce(p_co_passengers, ARRAY[]::TEXT[]) LOOP
    IF btrim(v_name) <> '' THEN
      INSERT INTO booking_passengers (booking_id, booking_item_id, full_name)
      VALUES (v_booking_id, v_item_id, btrim(v_name));
    END IF;
  END LOOP;

  -- A reused TrxID stops here and undoes everything above.
  INSERT INTO payments (booking_id, payment_method_id, transaction_id, amount, payment_date)
  VALUES (v_booking_id, v_method_id, upper(btrim(p_transaction_id)), v_advance, NOW());

  INSERT INTO booking_status_history (booking_id, booking_status, notes)
  VALUES (v_booking_id, 'Awaiting Payment', 'Booking submitted on the website');

  INSERT INTO sheet_sync_queue (booking_id) VALUES (v_booking_id);

  INSERT INTO audit_logs (action, entity_type, entity_id, metadata)
  VALUES ('booking.created', 'booking', v_booking_id::TEXT, jsonb_build_object('reference', v_reference, 'total', v_total));

  RETURN jsonb_build_object(
    'reference', v_reference,
    'total', v_total,
    'advance', v_advance,
    'balance', v_total - v_advance,
    'advancePercentage', v_percentage
  );
END;
$$;

REVOKE ALL ON FUNCTION create_booking(UUID, TEXT, TEXT, TEXT, DATE, DATE, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT[], payment_method_type, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_booking(UUID, TEXT, TEXT, TEXT, DATE, DATE, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT[], payment_method_type, TEXT, BOOLEAN) TO service_role;

COMMIT;
