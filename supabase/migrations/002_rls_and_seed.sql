
-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ship_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ship_cabins ENABLE ROW LEVEL SECURITY;
ALTER TABLE sailings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fare_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sailing_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_booking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION has_role(role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.name = role_name
  );
END;
$$;

-- Helper function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles()
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT r.name FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = auth.uid();
END;
$$;

-- Public read access for ships, sailings, routes (for website)
CREATE POLICY "Public can view published ships" ON ships FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active routes" ON routes FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view active seasons" ON seasons FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view active sailings" ON sailings FOR SELECT USING (schedule_status = 'active');
CREATE POLICY "Public can view ship categories" ON ship_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view payment methods" ON payment_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view delivery charges" ON delivery_charges FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view fare rules" ON fare_rules FOR SELECT USING (is_active = true);

-- Profiles - users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Authenticated users with roles can access admin
CREATE POLICY "Authenticated users can view roles" ON roles FOR SELECT TO authenticated USING (true);

-- Admin access policies (service role bypasses RLS, but for authenticated users)
CREATE POLICY "Admins can manage ships" ON ships FOR ALL TO authenticated 
  USING (has_role('admin') OR has_role('super_admin') OR has_role('content_manager'))
  WITH CHECK (has_role('admin') OR has_role('super_admin') OR has_role('content_manager'));

CREATE POLICY "Booking managers can manage bookings" ON bookings FOR ALL TO authenticated
  USING (has_role('booking_manager') OR has_role('admin') OR has_role('super_admin') OR has_role('accounts'))
  WITH CHECK (has_role('booking_manager') OR has_role('admin') OR has_role('super_admin') OR has_role('accounts'));

CREATE POLICY "Accounts can manage payments" ON payments FOR ALL TO authenticated
  USING (has_role('accounts') OR has_role('admin') OR has_role('super_admin'))
  WITH CHECK (has_role('accounts') OR has_role('admin') OR has_role('super_admin'));

CREATE POLICY "Booking managers can manage operator bookings" ON operator_bookings FOR ALL TO authenticated
  USING (has_role('booking_manager') OR has_role('admin') OR has_role('super_admin'))
  WITH CHECK (has_role('booking_manager') OR has_role('admin') OR has_role('super_admin'));

CREATE POLICY "Booking managers can manage tickets" ON tickets FOR ALL TO authenticated
  USING (has_role('booking_manager') OR has_role('admin') OR has_role('super_admin'))
  WITH CHECK (has_role('booking_manager') OR has_role('admin') OR has_role('super_admin'));

CREATE POLICY "Users can view own notifications" ON notifications FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view audit logs" ON audit_logs FOR SELECT TO authenticated 
  USING (has_role('admin') OR has_role('super_admin'));

-- Seed roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
('super_admin', 'Super Administrator', '["*"]', true),
('admin', 'Administrator', '["ships:*", "bookings:*", "payments:view", "operator_bookings:*", "tickets:*"]', true),
('booking_manager', 'Booking Manager', '["bookings:*", "operator_bookings:*", "tickets:*"]', true),
('accounts', 'Accounts Team', '["bookings:view", "payments:*"]', true),
('support_agent', 'Support Agent', '["bookings:view", "bookings:update"]', true),
('content_manager', 'Content Manager', '["ships:*"]', true);

-- Seed system settings
INSERT INTO system_settings (key, value) VALUES
('site_name', '"ShipTickets.bd"'),
('advance_percentage_office', '50'),
('advance_percentage_delivery', '100'),
('booking_prefix', '"STB"'),
('delivery_charges', '{"dhaka": 80, "outside_dhaka": 150}');

-- Seed payment methods
INSERT INTO payment_methods (name, type, instructions, is_active, sort_order) VALUES
('bKash Merchant', 'bkash_merchant', 'Pay to bKash Merchant Number: [MERCHANT_NUMBER]. Send money and enter Transaction ID.', true, 1),
('Bank Transfer', 'bank_transfer', 'Transfer to bank account. Bank details will be provided.', true, 2),
('Cash at Office', 'cash', 'Pay cash at our office.', true, 3);
