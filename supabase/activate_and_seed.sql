
-- 1. Enable pgcrypto for UUID generation if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Activate ALL products
UPDATE products SET is_active = true WHERE is_active = false;

-- 3. Ensure Categories Exist & Populate Samples if Empty
-- We'll creating a robust seeding block.

DO $$
DECLARE
    cat_kahvalti_id UUID;
    cat_ana_yemek_id UUID;
    cat_icecek_id UUID;
    cat_tatli_id UUID;
    cat_atistirmalik_id UUID;
BEGIN
    -- Get or Create Categories
    -- Kahvaltı
    SELECT id INTO cat_kahvalti_id FROM categories WHERE title = 'Kahvaltı' LIMIT 1;
    IF cat_kahvalti_id IS NULL THEN
        INSERT INTO categories (title, icon, "order") VALUES ('Kahvaltı', '🍳', 1) RETURNING id INTO cat_kahvalti_id;
    END IF;

    -- Ana Yemekler
    SELECT id INTO cat_ana_yemek_id FROM categories WHERE title = 'Ana Yemekler' LIMIT 1;
    IF cat_ana_yemek_id IS NULL THEN
        INSERT INTO categories (title, icon, "order") VALUES ('Ana Yemekler', '🍖', 2) RETURNING id INTO cat_ana_yemek_id;
    END IF;

    -- İçecekler
    SELECT id INTO cat_icecek_id FROM categories WHERE title = 'İçecekler' LIMIT 1;
    IF cat_icecek_id IS NULL THEN
        INSERT INTO categories (title, icon, "order") VALUES ('İçecekler', '☕', 3) RETURNING id INTO cat_icecek_id;
    END IF;

    -- Tatlılar
    SELECT id INTO cat_tatli_id FROM categories WHERE title = 'Tatlılar' LIMIT 1;
    IF cat_tatli_id IS NULL THEN
        INSERT INTO categories (title, icon, "order") VALUES ('Tatlılar', '🍰', 4) RETURNING id INTO cat_tatli_id;
    END IF;

    -- Atıştırmalıklar
    SELECT id INTO cat_atistirmalik_id FROM categories WHERE title = 'Atıştırmalıklar' LIMIT 1;
    IF cat_atistirmalik_id IS NULL THEN
        INSERT INTO categories (title, icon, "order") VALUES ('Atıştırmalıklar', '🍟', 5) RETURNING id INTO cat_atistirmalik_id;
    END IF;


    -- 4. INSERT SAMPLE PRODUCTS (If not exist)
    
    -- Kahvaltı Samples
    IF NOT EXISTS (SELECT 1 FROM products WHERE category = 'Kahvaltı') THEN
        INSERT INTO products (title, description, price, category, image, is_active, preparation_time, calories) VALUES
        ('Serpme Köy Kahvaltısı', 'Organik reçeller, köy peynirleri, bal-kaymak, sıcak ekmek sepeti ve sınırsız çay ile.', 450, 'Kahvaltı', '/assets/products/kahvalti-serpme.png', true, 20, 1200),
        ('Menemen', 'Domates, biber ve köy yumurtası ile hazırlanan klasik lezzet.', 180, 'Kahvaltı', 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=400', true, 15, 350);
    END IF;

    -- Ana Yemek Samples
    IF NOT EXISTS (SELECT 1 FROM products WHERE category = 'Ana Yemekler') THEN
        INSERT INTO products (title, description, price, category, image, is_active, preparation_time, calories) VALUES
        ('Kozbeyli Köfte', 'Özel baharatlarla yoğrulmuş, közlenmiş sebzeler ve pilav eşliğinde.', 320, 'Ana Yemekler', 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400', true, 25, 650),
        ('Izgara Levrek', 'Deniz tuzu ile ızgaralanmış, roka salatası ve limon ile.', 380, 'Ana Yemekler', '/assets/products/levrek.png', true, 30, 480);
    END IF;

    -- İçecek Samples
    IF NOT EXISTS (SELECT 1 FROM products WHERE category = 'İçecekler') THEN
        INSERT INTO products (title, description, price, category, image, is_active, preparation_time, calories) VALUES
        ('Dibek Kahvesi', 'Geleneksel taş dibekte dövülmüş, yumuşak içimli Türk kahvesi.', 90, 'İçecekler', 'https://images.unsplash.com/photo-1574519969406-8dce46d997da?auto=format&fit=crop&w=400', true, 10, 5),
        ('Ev Yapımı Limonata', 'Taze nane ve limon dilimleri ile doğal serinlik.', 85, 'İçecekler', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400', true, 5, 120);
    END IF;

    -- Tatlı Samples
    IF NOT EXISTS (SELECT 1 FROM products WHERE category = 'Tatlılar') THEN
        INSERT INTO products (title, description, price, category, image, is_active, preparation_time, calories) VALUES
        ('Fırın Sütlaç', 'Üzeri nar gibi kızarmış, fındık kırıkları ile servis edilen geleneksel tat.', 120, 'Tatlılar', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400', true, 0, 300),
        ('San Sebastian Cheesecake', 'İçi akışkan, enfes yanık cheesecake. Çikolata sos ile.', 160, 'Tatlılar', 'https://images.unsplash.com/photo-1567316314818-ef6f0592934d?auto=format&fit=crop&w=400', true, 0, 450);
    END IF;

    -- Atıştırmalık Samples
    IF NOT EXISTS (SELECT 1 FROM products WHERE category = 'Atıştırmalıklar') THEN
        INSERT INTO products (title, description, price, category, image, is_active, preparation_time, calories) VALUES
        ('Paçanga Böreği', 'Pastırma ve kaşar peyniri dolgulu, çıtır çıtır lezzet.', 140, 'Atıştırmalıklar', 'https://images.unsplash.com/photo-1626359503419-f55a9b7c8df8?auto=format&fit=crop&w=400', true, 15, 380),
        ('Karışık Çerez Tabağı', 'Özel kavrulmuş taze kuruyemişler.', 90, 'Atıştırmalıklar', 'https://images.unsplash.com/photo-1598514930263-fb6513470da7?auto=format&fit=crop&w=400', true, 0, 550);
    END IF;

END $$;
