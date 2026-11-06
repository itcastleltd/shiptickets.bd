-- ShipTickets.bd - Initial Schema Migration
-- Based on system-architecture-FRD.md
-- Manual inventory, assisted booking workflow

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE booking_status AS ENUM ('New Request', 'Awaiting Payment', 'Confirmed', 'Processing', 'Completed', 'Cancelled', 'Issue');
CREATE TYPE payment_status AS ENUM ('Unpaid', 'Partially Paid', 'Fully Paid', 'Refund Pending', 'Partially Refunded', 'Refunded');
CREATE TYPE operator_booking_status AS ENUM ('Not Started', 'In Progress', 'Submitted', 'Operator Confirmed', 'Ticket Received', 'Failed', 'Cancelled');
CREATE TYPE ticket_status AS ENUM ('Not Issued', 'Awaiting Operator Ticket', 'Uploaded', 'Delivered', 'Cancelled', 'Replaced');
CREATE TYPE delivery_status AS ENUM ('Not Required', 'Office Collection', 'Ready', 'Dispatched', 'Delivered', 'Failed');
CREATE TYPE schedule_status AS ENUM ('active', 'cancelled', 'completed');
CREATE TYPE payment_method_type AS ENUM ('bkash_merchant', 'bank_transfer', 'cash', 'other');

-- Roles and Permissions
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Operators
CREATE TABLE operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_path TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  portal_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ships
CREATE TABLE ships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES operators(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ship_code TEXT,
  description TEXT,
  summary_en TEXT,
  summary_bn TEXT,
  ship_type TEXT,
  featured_image TEXT,
  image_alt TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  facilities JSONB DEFAULT '[]'::jsonb,
  capacity TEXT,
  journey_duration TEXT,
  departure TEXT,
  jetty TEXT,
  check_in TEXT,
  cancellation TEXT,
  status TEXT DEFAULT 'verified',
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  meta_description TEXT,
  last_verified_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routes
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  boarding_point TEXT,
  arrival_point TEXT,
  estimated_duration TEXT,
  instructions TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seasons
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_name TEXT NOT NULL,
  season_code TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ship Categories
CREATE TABLE ship_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_bn TEXT,
  code TEXT,
  category_type TEXT,
  description TEXT,
  default_capacity INTEGER DEFAULT 0,
  inventory_mode TEXT DEFAULT 'manual',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ship Cabins
CREATE TABLE ship_cabins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
  cabin_number TEXT,
  name TEXT NOT NULL,
  category TEXT,
  occupancy INTEGER DEFAULT 1,
  ac_non_ac TEXT,
  bathroom_type TEXT,
  bed_configuration TEXT,
  facilities JSONB DEFAULT '[]'::jsonb,
  fare NUMERIC(12,2),
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sailings
CREATE TABLE sailings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id),
  season_id UUID REFERENCES seasons(id),
  departure_at TIMESTAMPTZ NOT NULL,
  arrival_at TIMESTAMPTZ,
  boarding_point TEXT,
  reporting_time TEXT,
  schedule_status schedule_status DEFAULT 'active',
  operator_status TEXT DEFAULT 'Not Confirmed',
  public_note TEXT,
  internal_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fare Rules
CREATE TABLE fare_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
  category_id UUID REFERENCES ship_categories(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id),
  season_id UUID REFERENCES seasons(id),
  fare_type TEXT DEFAULT 'regular',
  passenger_type TEXT DEFAULT 'adult',
  amount NUMERIC(12,2) NOT NULL,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manual Inventory
CREATE TABLE sailing_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sailing_id UUID REFERENCES sailings(id) ON DELETE CASCADE,
  category_id UUID REFERENCES ship_categories(id) ON DELETE CASCADE,
  total_capacity INTEGER DEFAULT 0,
  internal_available INTEGER DEFAULT 0,
  internal_reserved INTEGER DEFAULT 0,
  internal_confirmed INTEGER DEFAULT 0,
  notes TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sailing_id, category_id)
);

CREATE TABLE inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sailing_inventory_id UUID REFERENCES sailing_inventory(id) ON DELETE CASCADE,
  adjustment_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  adjusted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  booking_source TEXT DEFAULT 'web_form',
  booking_status booking_status DEFAULT 'New Request',
  payment_status payment_status DEFAULT 'Unpaid',
  ticket_status ticket_status DEFAULT 'Not Issued',
  total_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  delivery_charge NUMERIC(12,2) DEFAULT 0,
  grand_total NUMERIC(12,2) DEFAULT 0,
  verified_paid NUMERIC(12,2) DEFAULT 0,
  balance_due NUMERIC(12,2) DEFAULT 0,
  collection_method TEXT,
  customer_note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE booking_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sailing_id UUID REFERENCES sailings(id),
  category_id UUID REFERENCES ship_categories(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_fare_snapshot NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE booking_passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile_number TEXT,
  nid_encrypted TEXT,
  date_of_birth DATE,
  passenger_type TEXT DEFAULT 'adult',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  booking_status booking_status,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type payment_method_type NOT NULL,
  instructions TEXT,
  account_details JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  transaction_id TEXT,
  sender_reference TEXT,
  amount NUMERIC(12,2) NOT NULL,
  payment_date TIMESTAMPTZ,
  receipt_path TEXT,
  status TEXT DEFAULT 'Submitted',
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  amount NUMERIC(12,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_charges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  charge NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operator Bookings
CREATE TABLE operator_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES operators(id),
  ship_id UUID REFERENCES ships(id),
  sailing_id UUID REFERENCES sailings(id),
  operator_reference TEXT,
  operator_fare NUMERIC(12,2),
  status operator_booking_status DEFAULT 'Not Started',
  booked_by UUID REFERENCES profiles(id),
  booked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE operator_booking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_booking_id UUID REFERENCES operator_bookings(id) ON DELETE CASCADE,
  status operator_booking_status,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  operator_booking_id UUID REFERENCES operator_bookings(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES booking_passengers(id),
  ticket_number TEXT,
  operator_reference TEXT,
  document_path TEXT,
  ticket_status ticket_status DEFAULT 'Not Issued',
  issued_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  document_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Deliveries
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  delivery_method TEXT NOT NULL,
  recipient_name TEXT,
  phone TEXT,
  address TEXT,
  district TEXT,
  delivery_charge NUMERIC(12,2) DEFAULT 0,
  courier_name TEXT,
  tracking_number TEXT,
  status delivery_status DEFAULT 'Not Required',
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  collected_by UUID REFERENCES profiles(id),
  collected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_sailings_ship_date ON sailings(ship_id, departure_at);
CREATE INDEX idx_operator_bookings_status ON operator_bookings(status);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);


-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ships_updated_at BEFORE UPDATE ON ships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operator_bookings_updated_at BEFORE UPDATE ON operator_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();