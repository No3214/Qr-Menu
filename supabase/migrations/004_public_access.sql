-- Public access policies for menu viewing (unauthenticated users)
-- These policies allow anyone to view public menu data

-- Drop existing public policies if they exist
DROP POLICY IF EXISTS "restaurants_public_read" ON restaurants;
DROP POLICY IF EXISTS "menu_categories_public_read" ON menu_categories;
DROP POLICY IF EXISTS "menu_items_public_read" ON menu_items;
DROP POLICY IF EXISTS "restaurant_settings_public_read" ON restaurant_settings;
DROP POLICY IF EXISTS "translations_public_read" ON translations;

-- Public read access for restaurants (by slug)
CREATE POLICY "restaurants_public_read" ON restaurants
  FOR SELECT USING (true);

-- Public read access for active menu categories
CREATE POLICY "menu_categories_public_read" ON menu_categories
  FOR SELECT USING (is_active = true);

-- Public read access for available menu items
CREATE POLICY "menu_items_public_read" ON menu_items
  FOR SELECT USING (is_available = true);

-- Public read access for restaurant settings
CREATE POLICY "restaurant_settings_public_read" ON restaurant_settings
  FOR SELECT USING (true);

-- Public read access for translations
CREATE POLICY "translations_public_read" ON translations
  FOR SELECT USING (true);

-- Public read access for public events
DROP POLICY IF EXISTS "events_public_read" ON events;
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (status = 'published');
