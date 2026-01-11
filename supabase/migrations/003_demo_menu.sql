-- Foost-Style Demo Menu Content
-- Modern restaurant menu with international cuisine

DO $$
DECLARE
  rest_id uuid;
BEGIN
  -- Get existing restaurant or create new one
  SELECT id INTO rest_id FROM restaurants WHERE slug = 'kozbeyli-konagi' LIMIT 1;

  IF rest_id IS NULL THEN
    INSERT INTO restaurants (name, slug, phone, address, default_currency)
    VALUES ('Kozbeyli Konağı', 'kozbeyli-konagi', '+90 232 XXX XX XX', 'İzmir, Türkiye', 'USD')
    RETURNING id INTO rest_id;
  ELSE
    UPDATE restaurants SET default_currency = 'USD' WHERE id = rest_id;
  END IF;

  -- Clean up existing menu data
  DELETE FROM menu_items WHERE restaurant_id = rest_id;
  DELETE FROM menu_categories WHERE restaurant_id = rest_id;

  -- ========================================
  -- CATEGORIES (Foost Style)
  -- ========================================

  -- 1. Cold - Soğuk Mezeler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000001',
    rest_id,
    'Cold',
    'Fresh salads and cold appetizers',
    1,
    true,
    false
  );

  -- 2. Hot - Sıcak Yemekler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000002',
    rest_id,
    'Hot',
    'Warm dishes and appetizers',
    2,
    true,
    false
  );

  -- 3. Pizzaaa - Pizzalar
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000003',
    rest_id,
    'Pizzaaa',
    'Wood-fired artisan pizzas',
    3,
    true,
    false
  );

  -- 4. Main Course - Ana Yemekler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000004',
    rest_id,
    'Main Course',
    'Signature dishes and entrées',
    4,
    true,
    false
  );

  -- 5. Brunch
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000005',
    rest_id,
    'Brunch',
    'Weekend brunch favorites',
    5,
    true,
    false
  );

  -- 6. Sweet - Tatlılar
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000006',
    rest_id,
    'Sweet',
    'Desserts and sweet treats',
    6,
    true,
    false
  );

  -- 7. Cocktails - Kokteyller
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000007',
    rest_id,
    'Cocktails',
    'Signature cocktails and drinks',
    7,
    true,
    false
  );

  -- 8. Spirit Free - Alkolsüz
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000008',
    rest_id,
    'Spirit Free',
    'Refreshing non-alcoholic beverages',
    8,
    true,
    false
  );

  -- 9. Chef's Special (Featured)
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'c1000000-0000-0000-0000-000000000009',
    rest_id,
    'Chef''s Special',
    'This week''s special creations by our chef',
    0,
    true,
    true
  );

  -- ========================================
  -- MENU ITEMS
  -- ========================================

  -- COLD (Soğuk Mezeler)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Little Gem Salad', 'Baby gem lettuce, shaved parmesan, anchovy vinaigrette, garlic croutons', 12.50, 'USD', 180, 200, 10, false, false, 1, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Rainbow Beets', 'Roasted rainbow beets, goat cheese mousse, candied walnuts, micro greens, honey balsamic', 12.50, 'USD', 220, 180, 10, false, false, 2, ARRAY['vegetarian', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Tuscan Kale', 'Lacinato kale, lemon caesar dressing, pecorino romano, toasted breadcrumbs', 12.50, 'USD', 190, 180, 8, false, false, 3, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Burrata Caprese', 'Burrata di gioia, fresh basil, heirloom cherry tomato, basil walnut pesto, grey salt, baguette', 13.50, 'USD', 320, 220, 8, true, false, 4, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Lettuce Cups', 'Butter lettuce, spiced chicken, pickled vegetables, thai basil, sweet chili sauce', 14.00, 'USD', 280, 200, 12, false, false, 5, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Tuna Tartare', 'Fresh ahi tuna, avocado, sesame soy dressing, crispy wonton chips', 16.00, 'USD', 240, 180, 10, false, true, 6, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000001', 'Mediterranean Mezze', 'Hummus, baba ganoush, tzatziki, marinated olives, warm pita bread', 15.00, 'USD', 380, 280, 10, false, false, 7, ARRAY['vegetarian']);

  -- HOT (Sıcak Yemekler)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Scallop Medallions', 'Pan-seared sea scallops, cauliflower purée, brown butter, crispy capers', 17.00, 'USD', 320, 180, 15, true, false, 1, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Bacari Fries', 'Truffle parmesan fries, rosemary aioli, pecorino romano', 12.50, 'USD', 480, 250, 12, false, false, 2, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Beef Cheek', 'Braised beef cheek, creamy polenta, gremolata, natural jus', 16.50, 'USD', 520, 280, 25, false, false, 3, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Crispy Calamari', 'Flash-fried calamari, cherry peppers, lemon aioli, fresh herbs', 14.50, 'USD', 380, 200, 12, false, false, 4, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Meatballs Al Forno', 'Beef and pork meatballs, san marzano tomato, ricotta, fresh basil', 13.50, 'USD', 420, 220, 18, false, false, 5, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Roasted Bone Marrow', 'Herb-crusted bone marrow, parsley salad, grilled sourdough', 15.00, 'USD', 380, 200, 20, false, true, 6, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000002', 'Mushroom Arancini', 'Crispy risotto balls, wild mushroom, truffle cream, parmesan', 12.00, 'USD', 340, 180, 15, false, false, 7, ARRAY['vegetarian']);

  -- PIZZAAA
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Margherita', 'San marzano tomato, fresh mozzarella, basil, extra virgin olive oil', 15.00, 'USD', 680, 320, 15, false, false, 1, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Smoked Mushroom', 'Smoked wild mushrooms, fontina, truffle oil, fresh thyme', 15.00, 'USD', 720, 320, 15, false, false, 2, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Vegan Delight', 'Cashew ricotta, roasted vegetables, arugula, balsamic glaze', 15.00, 'USD', 580, 300, 15, false, false, 3, ARRAY['vegan']),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Asian Pear & Brie', 'Asian pear, double cream brie, guava fromage blanc, wild arugula, grey salt, frantoia olive oil', 15.00, 'USD', 640, 300, 15, true, false, 4, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Bacon & Brie', 'Applewood bacon, double cream brie, organic tomato sauce, fresh jalapeño', 16.00, 'USD', 780, 340, 15, false, false, 5, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Prosciutto', 'Prosciutto di parma, burrata, arugula, balsamic reduction', 17.00, 'USD', 720, 320, 15, false, false, 6, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Pepperoni Classic', 'Cup and char pepperoni, mozzarella, san marzano tomato, oregano', 15.00, 'USD', 820, 340, 15, false, false, 7, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000003', 'Quattro Formaggi', 'Mozzarella, gorgonzola, fontina, parmesan, honey drizzle', 16.00, 'USD', 760, 320, 15, false, true, 8, ARRAY['vegetarian']);

  -- MAIN COURSE (Ana Yemekler)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000004', 'Grilled Ribeye', '12oz prime ribeye, roasted fingerlings, chimichurri, seasonal vegetables', 38.00, 'USD', 780, 450, 25, true, false, 1, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000004', 'Pan-Roasted Salmon', 'Atlantic salmon, quinoa, roasted broccolini, lemon butter sauce', 28.00, 'USD', 520, 350, 20, false, false, 2, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000004', 'Lamb Chops', 'New Zealand lamb chops, mint pesto, whipped potatoes, asparagus', 34.00, 'USD', 680, 380, 22, false, false, 3, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000004', 'Chicken Milanese', 'Crispy chicken cutlet, arugula, cherry tomatoes, shaved parmesan, lemon', 24.00, 'USD', 620, 350, 18, false, false, 4, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000004', 'Seafood Linguine', 'Shrimp, mussels, clams, white wine garlic sauce, fresh herbs', 26.00, 'USD', 580, 380, 20, false, false, 5, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000004', 'Braised Short Rib', 'Red wine braised short rib, celery root purée, glazed carrots', 32.00, 'USD', 720, 400, 30, false, true, 6, ARRAY['gluten-free']);

  -- BRUNCH
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Shakshouka', 'Baked eggs, spiced tomato, bell peppers, feta cheese, crusty bread', 12.50, 'USD', 380, 280, 18, false, false, 1, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Avocado Toast', 'Smashed avocado, poached eggs, everything seasoning, microgreens, sourdough', 13.50, 'USD', 420, 250, 12, true, false, 2, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Chef''s French Toast', 'Brioche french toast, mascarpone, fresh berries, maple syrup, candied pecans', 12.50, 'USD', 580, 280, 15, false, false, 3, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Eggs Benedict', 'Poached eggs, canadian bacon, hollandaise, english muffin, breakfast potatoes', 14.00, 'USD', 620, 320, 15, false, false, 4, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Açai Bowl', 'Açai blend, granola, fresh fruits, coconut, honey drizzle', 11.00, 'USD', 340, 300, 8, false, false, 5, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Breakfast Burrito', 'Scrambled eggs, chorizo, black beans, cheddar, avocado, salsa verde', 13.00, 'USD', 680, 350, 12, false, false, 6, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000005', 'Greek Yogurt Parfait', 'Greek yogurt, house granola, seasonal fruits, honey', 9.00, 'USD', 280, 250, 5, false, false, 7, ARRAY['vegetarian', 'gluten-free']);

  -- SWEET (Tatlılar)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'Bread Pudding', 'Warm brioche bread pudding, bourbon caramel, vanilla ice cream', 9.00, 'USD', 520, 180, 10, false, false, 1, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'Double Chocolate Cake', 'Rich chocolate layer cake, chocolate ganache, fresh raspberries', 10.00, 'USD', 580, 160, 5, true, false, 2, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'The Best Tiramisu', 'Classic tiramisu, espresso-soaked ladyfingers, mascarpone cream', 9.00, 'USD', 480, 160, 5, false, false, 3, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'Bacari Ice Cream', 'Vanilla bean gelato, walnut, clover honey drizzle', 8.00, 'USD', 320, 140, 3, false, false, 4, ARRAY['vegetarian', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'Crème Brûlée', 'Classic vanilla custard, caramelized sugar, fresh berries', 9.00, 'USD', 380, 150, 5, false, false, 5, ARRAY['vegetarian', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'Affogato', 'Vanilla gelato, fresh espresso shot, biscotti', 7.00, 'USD', 280, 120, 3, false, false, 6, ARRAY['vegetarian']),
  (rest_id, 'c1000000-0000-0000-0000-000000000006', 'Seasonal Fruit Tart', 'Buttery pastry crust, vanilla pastry cream, fresh seasonal fruits', 10.00, 'USD', 420, 160, 5, false, true, 7, ARRAY['vegetarian']);

  -- COCKTAILS
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Bacarita', 'Premium tequila, fresh lime, agave, triple sec, salted rim', 17.00, 'USD', 180, 200, 5, true, false, 1, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Chill Pill', 'Vodka, elderflower liqueur, cucumber, mint, lime, soda', 17.00, 'USD', 160, 200, 5, false, false, 2, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'True Signature', 'Bourbon, amaretto, orange bitters, luxardo cherry', 17.00, 'USD', 200, 180, 5, false, false, 3, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Espresso Martini', 'Vodka, kahlúa, fresh espresso, vanilla', 16.00, 'USD', 220, 180, 5, false, false, 4, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Aperol Spritz', 'Aperol, prosecco, soda, fresh orange', 14.00, 'USD', 150, 220, 3, false, false, 5, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Moscow Mule', 'Premium vodka, fresh lime, ginger beer, mint', 15.00, 'USD', 170, 200, 4, false, false, 6, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Negroni', 'Gin, campari, sweet vermouth, orange peel', 16.00, 'USD', 190, 150, 3, false, false, 7, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000007', 'Passion Fruit Mojito', 'White rum, passion fruit, mint, lime, soda', 16.00, 'USD', 180, 220, 5, false, true, 8, ARRAY['vegan', 'gluten-free']);

  -- SPIRIT FREE (Alkolsüz)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Got It Goin'' On (G.I.G.O)', 'Grapefruit, lavender, honey, fresh lemon, soda water', 10.50, 'USD', 80, 250, 5, true, false, 1, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Berry Bliss', 'Mixed berries, vanilla, lime, ginger ale', 9.50, 'USD', 90, 250, 5, false, false, 2, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Cucumber Cooler', 'Fresh cucumber, mint, lime, simple syrup, soda', 9.00, 'USD', 60, 250, 4, false, false, 3, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Fresh Lemonade', 'House-made lemonade, fresh mint', 7.00, 'USD', 120, 300, 3, false, false, 4, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Sparkling Water', 'San Pellegrino or Acqua Panna (750ml)', 6.00, 'USD', 0, 750, 1, false, false, 5, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Fresh Orange Juice', 'Freshly squeezed orange juice', 8.00, 'USD', 110, 300, 3, false, false, 6, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Iced Coffee', 'Cold brew coffee, oat milk option available', 6.00, 'USD', 50, 350, 2, false, false, 7, ARRAY['vegan', 'gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000008', 'Matcha Latte', 'Premium matcha, steamed oat milk, honey', 7.50, 'USD', 140, 300, 4, false, true, 8, ARRAY['vegan', 'gluten-free']);

  -- CHEF'S SPECIAL (Özel Menü)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, currency, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions) VALUES
  (rest_id, 'c1000000-0000-0000-0000-000000000009', 'Wagyu Beef Tartare', 'A5 wagyu beef, quail egg yolk, truffle aioli, crostini', 28.00, 'USD', 380, 180, 12, true, true, 1, ARRAY[]::text[]),
  (rest_id, 'c1000000-0000-0000-0000-000000000009', 'Lobster Risotto', 'Maine lobster, saffron arborio rice, mascarpone, chives', 36.00, 'USD', 620, 350, 25, true, true, 2, ARRAY['gluten-free']),
  (rest_id, 'c1000000-0000-0000-0000-000000000009', 'Truffle Honey Pizza', 'Black truffle, burrata, wild honey, arugula, parmesan', 22.00, 'USD', 680, 300, 15, true, true, 3, ARRAY['vegetarian']);

  -- Update restaurant settings
  INSERT INTO restaurant_settings (restaurant_id, primary_language, supported_languages, theme)
  VALUES (rest_id, 'en', ARRAY['en', 'tr', 'es', 'fr', 'de', 'it', 'ru', 'ar', 'zh', 'ja', 'ko'],
    '{"primaryColor": "#1a1a2e", "backgroundColor": "#16213e", "accentColor": "#e94560"}'::jsonb)
  ON CONFLICT (restaurant_id) DO UPDATE SET
    primary_language = 'en',
    supported_languages = ARRAY['en', 'tr', 'es', 'fr', 'de', 'it', 'ru', 'ar', 'zh', 'ja', 'ko'],
    theme = '{"primaryColor": "#1a1a2e", "backgroundColor": "#16213e", "accentColor": "#e94560"}'::jsonb;

END $$;
