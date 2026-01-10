-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  cover_image_url text,
  video_url text,
  phone text,
  address text,
  default_currency text NOT NULL DEFAULT 'TRY',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Restaurant users (multi-tenant)
CREATE TABLE IF NOT EXISTS restaurant_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  auth_user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(auth_user_id)
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_special boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Menu subcategories
CREATE TABLE IF NOT EXISTS menu_subcategories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES menu_subcategories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'TRY',
  image_url text,
  video_url text,
  featured boolean NOT NULL DEFAULT false,
  calories int,
  grams int,
  prep_minutes int,
  dietary_restrictions text[] NOT NULL DEFAULT '{}',
  allergen_warnings text[] NOT NULL DEFAULT '{}',
  nutrition_facts text[] NOT NULL DEFAULT '{}',
  lifestyle_options text[] NOT NULL DEFAULT '{}',
  spice_level text,
  ingredient_source text[] NOT NULL DEFAULT '{}',
  special_features text[] NOT NULL DEFAULT '{}',
  is_available boolean NOT NULL DEFAULT true,
  is_new boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Menu item options
CREATE TABLE IF NOT EXISTS menu_item_options (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  extra_price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'TRY',
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  source_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  target_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, source_item_id, target_item_id)
);

-- Translations
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  language_code text NOT NULL,
  field_name text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, entity_type, entity_id, language_code, field_name)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  comment text,
  rating int CHECK (rating >= 1 AND rating <= 5),
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  media_url text,
  price numeric(10,2),
  currency text NOT NULL DEFAULT 'TRY',
  capacity int,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  operation_type text,
  contact_name text,
  contact_email text,
  contact_phone text,
  rules text[] NOT NULL DEFAULT '{}',
  payment_policy text,
  cancel_policy text,
  placement_mode text NOT NULL DEFAULT 'special_category',
  event_category_name text,
  position_after_category_id uuid REFERENCES menu_categories(id),
  theme_color text,
  menu_enabled boolean NOT NULL DEFAULT false,
  menu_name text,
  menu_price numeric(10,2),
  menu_price_type text NOT NULL DEFAULT 'per_person',
  menu_category_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Event reservations
CREATE TABLE IF NOT EXISTS event_reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  party_size int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  entity_type text,
  entity_id uuid,
  qr_entrypoint text,
  session_id text,
  device_type text,
  platform text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Restaurant settings
CREATE TABLE IF NOT EXISTS restaurant_settings (
  restaurant_id uuid PRIMARY KEY REFERENCES restaurants(id) ON DELETE CASCADE,
  primary_language text NOT NULL DEFAULT 'tr',
  supported_languages text[] NOT NULL DEFAULT ARRAY['tr'],
  guest_info_html text,
  ai_chat_enabled boolean NOT NULL DEFAULT false,
  ai_chat_monthly_quota int NOT NULL DEFAULT 750,
  ai_chat_used int NOT NULL DEFAULT 0,
  pdf_paper_size text NOT NULL DEFAULT 'A4',
  pdf_font_size int NOT NULL DEFAULT 12,
  pdf_font_style text NOT NULL DEFAULT 'Normal',
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_restaurant ON analytics_events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_events_restaurant ON events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(restaurant_id, entity_type, entity_id, language_code);
