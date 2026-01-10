-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- restaurant_users: user can see their row
CREATE POLICY "ru_select_own" ON restaurant_users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "ru_insert_own" ON restaurant_users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- restaurants: only via restaurant_users
CREATE POLICY "restaurants_select_own" ON restaurants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurants.id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "restaurants_insert" ON restaurants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "restaurants_update_own" ON restaurants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurants.id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- menu_categories
CREATE POLICY "cat_select_own" ON menu_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_categories.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "cat_insert_own" ON menu_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_categories.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "cat_update_own" ON menu_categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_categories.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "cat_delete_own" ON menu_categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_categories.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- menu_items
CREATE POLICY "items_select_own" ON menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_items.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "items_insert_own" ON menu_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_items.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "items_update_own" ON menu_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_items.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "items_delete_own" ON menu_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = menu_items.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- subcategories inherit via category->restaurant
CREATE POLICY "subcat_select_own" ON menu_subcategories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM menu_categories c
      JOIN restaurant_users ru ON ru.restaurant_id = c.restaurant_id
      WHERE c.id = menu_subcategories.category_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "subcat_insert_own" ON menu_subcategories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM menu_categories c
      JOIN restaurant_users ru ON ru.restaurant_id = c.restaurant_id
      WHERE c.id = menu_subcategories.category_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "subcat_update_own" ON menu_subcategories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM menu_categories c
      JOIN restaurant_users ru ON ru.restaurant_id = c.restaurant_id
      WHERE c.id = menu_subcategories.category_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "subcat_delete_own" ON menu_subcategories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM menu_categories c
      JOIN restaurant_users ru ON ru.restaurant_id = c.restaurant_id
      WHERE c.id = menu_subcategories.category_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- options inherit via item
CREATE POLICY "opt_select_own" ON menu_item_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM menu_items i
      JOIN restaurant_users ru ON ru.restaurant_id = i.restaurant_id
      WHERE i.id = menu_item_options.menu_item_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "opt_insert_own" ON menu_item_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM menu_items i
      JOIN restaurant_users ru ON ru.restaurant_id = i.restaurant_id
      WHERE i.id = menu_item_options.menu_item_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "opt_update_own" ON menu_item_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM menu_items i
      JOIN restaurant_users ru ON ru.restaurant_id = i.restaurant_id
      WHERE i.id = menu_item_options.menu_item_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "opt_delete_own" ON menu_item_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM menu_items i
      JOIN restaurant_users ru ON ru.restaurant_id = i.restaurant_id
      WHERE i.id = menu_item_options.menu_item_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- translations
CREATE POLICY "translations_select_own" ON translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = translations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "translations_insert_own" ON translations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = translations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "translations_update_own" ON translations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = translations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "translations_delete_own" ON translations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = translations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- reviews
CREATE POLICY "reviews_select_own" ON reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = reviews.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "reviews_insert_public" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "reviews_delete_own" ON reviews
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = reviews.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- events
CREATE POLICY "events_select_own" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = events.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "events_insert_own" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = events.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "events_update_own" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = events.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "events_delete_own" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = events.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- event_reservations
CREATE POLICY "resv_select_own" ON event_reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = event_reservations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "resv_insert_public" ON event_reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "resv_update_own" ON event_reservations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = event_reservations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "resv_delete_own" ON event_reservations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = event_reservations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- analytics_events
CREATE POLICY "analytics_select_own" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = analytics_events.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "analytics_insert_public" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- restaurant_settings
CREATE POLICY "settings_select_own" ON restaurant_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurant_settings.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "settings_insert_own" ON restaurant_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurant_settings.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "settings_update_own" ON restaurant_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = restaurant_settings.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

-- recommendations
CREATE POLICY "recommendations_select_own" ON recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = recommendations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "recommendations_insert_own" ON recommendations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = recommendations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "recommendations_update_own" ON recommendations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = recommendations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "recommendations_delete_own" ON recommendations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurant_users ru
      WHERE ru.restaurant_id = recommendations.restaurant_id
      AND ru.auth_user_id = auth.uid()
    )
  );
