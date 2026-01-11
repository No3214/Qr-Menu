-- Demo Menu Content for Kozbeyli Konağı
-- Similar to thefoost.com style menus

-- First, get or create the restaurant
DO $$
DECLARE
  rest_id uuid;
BEGIN
  -- Get existing restaurant or use a placeholder
  SELECT id INTO rest_id FROM restaurants WHERE slug = 'kozbeyli-konagi' LIMIT 1;

  IF rest_id IS NULL THEN
    INSERT INTO restaurants (name, slug, phone, address)
    VALUES ('Kozbeyli Konağı', 'kozbeyli-konagi', '+90 232 XXX XX XX', 'İzmir, Türkiye')
    RETURNING id INTO rest_id;
  END IF;

  -- Delete existing categories and items to avoid duplicates
  DELETE FROM menu_items WHERE restaurant_id = rest_id;
  DELETE FROM menu_categories WHERE restaurant_id = rest_id;

  -- Create Categories
  -- 1. Başlangıçlar (Appetizers)
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000001',
    rest_id,
    'Başlangıçlar',
    'Geleneksel Türk mutfağının en seçkin mezeleri',
    1,
    true,
    false
  );

  -- 2. Soğuk Mezeler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000002',
    rest_id,
    'Soğuk Mezeler',
    'Taze ve lezzetli soğuk başlangıçlar',
    2,
    true,
    false
  );

  -- 3. Sıcak Mezeler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000003',
    rest_id,
    'Sıcak Mezeler',
    'Sıcak servis edilen özel lezzetler',
    3,
    true,
    false
  );

  -- 4. Ana Yemekler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000004',
    rest_id,
    'Ana Yemekler',
    'Şefimizin özenle hazırladığı ana yemekler',
    4,
    true,
    false
  );

  -- 5. Izgara Çeşitleri
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000005',
    rest_id,
    'Izgara Çeşitleri',
    'Kömür ateşinde pişirilen lezzetler',
    5,
    true,
    false
  );

  -- 6. Salatalar
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000006',
    rest_id,
    'Salatalar',
    'Taze sebzelerle hazırlanan salatalar',
    6,
    true,
    false
  );

  -- 7. Tatlılar
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000007',
    rest_id,
    'Tatlılar',
    'Geleneksel ve modern tatlı çeşitleri',
    7,
    true,
    false
  );

  -- 8. İçecekler
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000008',
    rest_id,
    'İçecekler',
    'Soğuk ve sıcak içecek çeşitleri',
    8,
    true,
    false
  );

  -- 9. Özel Menü (Special)
  INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order, is_active, is_special)
  VALUES (
    'a1000000-0000-0000-0000-000000000009',
    rest_id,
    'Şefin Önerileri',
    'Bu hafta şefimizin özel olarak hazırladığı lezzetler',
    0,
    true,
    true
  );

  -- ========================================
  -- MENU ITEMS
  -- ========================================

  -- Başlangıçlar
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000001', 'Humus', 'Nohut ezmesi, tahin, zeytinyağı ve limon ile', 85.00, 180, 150, 5, false, false, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000001', 'Babaganuş', 'Közlenmiş patlıcan ezmesi, tahin ve sarımsak ile', 95.00, 160, 150, 5, false, false, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000001', 'Çiğ Köfte', 'Geleneksel usül acılı çiğ köfte, marul ve nar ekşisi ile', 110.00, 220, 200, 10, true, false, 3),
  (rest_id, 'a1000000-0000-0000-0000-000000000001', 'Mücver', 'Kabak, havuç ve otlarla hazırlanan çıtır köfteler', 90.00, 240, 180, 15, false, false, 4);

  -- Soğuk Mezeler
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000002', 'Atom', 'Acılı domates ezmesi, ceviz ve biber ile', 75.00, 120, 120, 5, false, false, 1, ARRAY['vegan']),
  (rest_id, 'a1000000-0000-0000-0000-000000000002', 'Haydari', 'Yoğurt, sarımsak ve dereotu ile hazırlanan meze', 70.00, 150, 130, 5, false, false, 2, ARRAY['vegetarian']),
  (rest_id, 'a1000000-0000-0000-0000-000000000002', 'Patlıcan Salatası', 'Közlenmiş patlıcan, biber ve domates ile', 85.00, 140, 150, 10, false, false, 3, ARRAY['vegan']),
  (rest_id, 'a1000000-0000-0000-0000-000000000002', 'Cacık', 'Yoğurt, salatalık, sarımsak ve nane ile', 65.00, 100, 150, 5, false, false, 4, ARRAY['vegetarian']),
  (rest_id, 'a1000000-0000-0000-0000-000000000002', 'Zeytinyağlı Enginar', 'Taze enginar, bezelye ve havuç ile', 120.00, 180, 200, 30, false, true, 5, ARRAY['vegan']),
  (rest_id, 'a1000000-0000-0000-0000-000000000002', 'Yaprak Sarma', 'Zeytinyağlı asma yaprağı dolması', 95.00, 200, 180, 20, false, false, 6, ARRAY['vegan']);

  -- Sıcak Mezeler
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000003', 'Sigara Böreği', 'Çıtır yufka içinde beyaz peynir, 4 adet', 95.00, 320, 160, 10, false, false, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000003', 'Midye Tava', 'Çıtır kaplamalı midye, tarator sos ile', 145.00, 380, 200, 15, true, false, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000003', 'Kalamar Tava', 'Çıtır kaplamalı kalamar halkaları', 165.00, 350, 200, 15, false, false, 3),
  (rest_id, 'a1000000-0000-0000-0000-000000000003', 'Karides Güveç', 'Tereyağlı karides, domates ve sarımsak ile', 195.00, 320, 250, 20, false, true, 4),
  (rest_id, 'a1000000-0000-0000-0000-000000000003', 'Arnavut Ciğeri', 'Baharatlı dana ciğer, soğan ile', 135.00, 280, 200, 15, false, false, 5),
  (rest_id, 'a1000000-0000-0000-0000-000000000003', 'Paçanga Böreği', 'Pastırmalı ve kaşarlı çıtır börek', 125.00, 400, 180, 15, false, false, 6);

  -- Ana Yemekler
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'Kuzu Tandır', 'Fırında yavaş pişirilmiş kuzu eti, pilav ile', 385.00, 650, 350, 180, true, false, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'Hünkar Beğendi', 'Dana eti, patlıcan püresi üzerinde', 295.00, 520, 320, 45, false, false, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'Ali Nazik', 'Yoğurtlu patlıcan püresi üzerinde dana kavurma', 275.00, 480, 300, 35, false, false, 3),
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'İskender Kebap', 'Döner, tereyağı, domates sosu ve yoğurt ile', 265.00, 580, 350, 20, true, false, 4),
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'Karnıyarık', 'Patlıcan dolması, kıymalı, pilav ile', 195.00, 420, 300, 40, false, false, 5),
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'Mantı', 'El açması mantı, yoğurt ve tereyağlı sos ile', 175.00, 380, 280, 25, false, false, 6),
  (rest_id, 'a1000000-0000-0000-0000-000000000004', 'Levrek Buğulama', 'Buharda pişirilmiş levrek, sebzeler ile', 285.00, 320, 300, 25, false, true, 7);

  -- Izgara Çeşitleri
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Kuzu Pirzola', 'Izgara kuzu pirzola, 4 adet', 395.00, 580, 320, 20, true, false, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Adana Kebap', 'Acılı el yapımı kebap, lavaş ve közlenmiş sebze ile', 225.00, 450, 280, 15, false, false, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Urfa Kebap', 'Acısız el yapımı kebap, lavaş ve közlenmiş sebze ile', 225.00, 440, 280, 15, false, false, 3),
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Tavuk Şiş', 'Marine edilmiş tavuk göğsü şiş', 175.00, 320, 250, 15, false, false, 4),
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Köfte', 'Geleneksel ızgara köfte, pilav ile', 185.00, 420, 260, 15, false, false, 5),
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Karışık Izgara', 'Pirzola, Adana, köfte ve tavuk şiş (2 kişilik)', 595.00, 980, 500, 25, true, false, 6),
  (rest_id, 'a1000000-0000-0000-0000-000000000005', 'Beyti Sarma', 'Adana kebap, lavaş sarma, yoğurt ve tereyağ ile', 265.00, 520, 320, 20, false, false, 7);

  -- Salatalar
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order, dietary_restrictions)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000006', 'Çoban Salata', 'Domates, salatalık, biber, soğan ve maydanoz', 65.00, 80, 200, 5, false, false, 1, ARRAY['vegan']),
  (rest_id, 'a1000000-0000-0000-0000-000000000006', 'Akdeniz Salata', 'Yeşillik, domates, zeytin, beyaz peynir', 95.00, 180, 250, 5, false, false, 2, ARRAY['vegetarian']),
  (rest_id, 'a1000000-0000-0000-0000-000000000006', 'Sezar Salata', 'Marul, parmesan, kruton, özel sos ile', 115.00, 280, 280, 10, false, false, 3, ARRAY[]::text[]),
  (rest_id, 'a1000000-0000-0000-0000-000000000006', 'Izgara Hellim Salata', 'Yeşillik, ızgara hellim peyniri, cherry domates', 135.00, 320, 300, 10, false, true, 4, ARRAY['vegetarian']),
  (rest_id, 'a1000000-0000-0000-0000-000000000006', 'Roka Salata', 'Roka, parmesan, nar ve ceviz', 105.00, 220, 200, 5, false, false, 5, ARRAY['vegetarian']);

  -- Tatlılar
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Künefe', 'Sıcak servis, kadayıf ve peynir ile', 145.00, 480, 200, 15, true, false, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Baklava', 'Antep fıstıklı baklava, 4 dilim', 125.00, 520, 150, 5, false, false, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Sütlaç', 'Fırın sütlaç, tarçın ile', 75.00, 280, 180, 5, false, false, 3),
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Kazandibi', 'Geleneksel karamelize muhallebi', 85.00, 300, 180, 5, false, false, 4),
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Katmer', 'Antep usulü, fıstık ve kaymak ile', 155.00, 550, 180, 10, false, true, 5),
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Profiterol', 'Çikolata soslu, kremalı', 95.00, 420, 160, 5, false, false, 6),
  (rest_id, 'a1000000-0000-0000-0000-000000000007', 'Dondurma (3 Top)', 'Vanilyalı, çikolatalı veya meyveli', 65.00, 240, 120, 2, false, false, 7);

  -- İçecekler
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Türk Kahvesi', 'Geleneksel usül pişirilmiş', 45.00, 10, 80, 5, false, false, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Çay', 'Demlik çay', 25.00, 0, 200, 2, false, false, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Ayran', 'Ev yapımı ayran', 35.00, 80, 300, 2, false, false, 3),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Şalgam', 'Adana usulü şalgam suyu', 40.00, 30, 300, 2, false, false, 4),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Limonata', 'Taze sıkılmış limonata', 55.00, 120, 350, 5, false, false, 5),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Meyveli Soda', 'Elma, şeftali veya vişne', 45.00, 80, 330, 2, false, false, 6),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Su (500ml)', 'Doğal kaynak suyu', 15.00, 0, 500, 1, false, false, 7),
  (rest_id, 'a1000000-0000-0000-0000-000000000008', 'Gazlı İçecek', 'Cola, Fanta, Sprite', 35.00, 140, 330, 1, false, false, 8);

  -- Şefin Önerileri (Special Category)
  INSERT INTO menu_items (restaurant_id, category_id, name, description, price, calories, grams, prep_minutes, featured, is_new, sort_order)
  VALUES
  (rest_id, 'a1000000-0000-0000-0000-000000000009', 'Özel Kuzu Incik', 'Fırında 6 saat pişirilmiş kuzu incik, sebze püresli', 425.00, 720, 400, 360, true, true, 1),
  (rest_id, 'a1000000-0000-0000-0000-000000000009', 'Deniz Mahsulleri Güveci', 'Karides, kalamar, midye ve levrek, özel sos ile', 365.00, 480, 380, 30, true, true, 2),
  (rest_id, 'a1000000-0000-0000-0000-000000000009', 'Mevsim Özel Tatlısı', 'Şefin günlük özel tatlı seçimi', 135.00, 380, 180, 15, false, true, 3);

  -- Update restaurant settings
  INSERT INTO restaurant_settings (restaurant_id, primary_language, supported_languages, theme)
  VALUES (rest_id, 'tr', ARRAY['tr', 'en'], '{"primaryColor": "#8B4513", "backgroundColor": "#FDF5E6"}'::jsonb)
  ON CONFLICT (restaurant_id) DO UPDATE SET
    supported_languages = ARRAY['tr', 'en'],
    theme = '{"primaryColor": "#8B4513", "backgroundColor": "#FDF5E6"}'::jsonb;

END $$;
