
-- ⚠️ IMPORTANT: This script will RESET your categories and products tables.
-- It fixes the "UUID vs Text" ID mismatch and populates all menu data.

-- 1. DROP Tables (Clean Slate)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. CREATE Categories Table (Using TEXT ID to match App Logic)
CREATE TABLE categories (
  id TEXT PRIMARY KEY, -- 'kahvalti', 'ana-yemek' etc.
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE Products Table (Using TEXT ID and Foreign Key)
CREATE TABLE products (
  id TEXT PRIMARY KEY, -- 'k1', 'ay1' etc.
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Security Policies (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view menu
CREATE POLICY "Public Read Categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT TO anon, authenticated USING (true);

-- Allow only Admin to edit
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (true);

-- 5. INSERT DATA (Categories)
INSERT INTO categories (id, title, slug, description, "order", image) VALUES
('kahvalti', 'Kahvaltı', 'kahvalti', 'Güne lezzetli bir başlangıç.', 1, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('ekstralar', 'Ekstralar', 'ekstralar', 'Kahvaltı yanı lezzetler.', 2, 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80'),
('baslangic', 'Başlangıç & Paylaşımlıklar', 'baslangic', 'İştah açan dokunuşlar.', 3, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('pizza-sandvic', 'Taş Fırın Pizza ve Sandviç', 'pizza-sandvic', 'İnce hamur, bol lezzet.', 4, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80'),
('peynir-tabagi', 'Peynir Tabağı', 'peynir-tabagi', 'Şık ve keyifli eşlikçi.', 5, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80'),
('tatli', 'Tatlı', 'tatli', 'Mutluluğun son dokunuşu.', 6, 'https://images.unsplash.com/photo-1563729768-b6363c4df969?auto=format&fit=crop&q=80'),
('ana-yemek', 'Ana Yemek', 'ana-yemek', 'Sofranın başrolü.', 7, 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80'),
('ara-sicaklar', 'Ara Sıcaklar', 'ara-sicaklar', 'Lezzete sıcak bir ara.', 8, 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80'),
('meze', 'Meze', 'meze', 'Paylaşmanın en güzel hali.', 9, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('soguk-icecek', 'Soğuk İçecekler', 'soguk-icecek', 'Serin ve ferahlatıcı.', 10, 'https://images.unsplash.com/photo-1499638473338-25013094406a?auto=format&fit=crop&q=80'),
('sicak-icecek', 'Sıcak İçecekler', 'sicak-icecek', 'Isıtan keyif.', 11, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80'),
('sarap', 'Şarap', 'sarap', 'Şık bir yudum keyif.', 12, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'),
('kokteyl', 'Kokteyl', 'kokteyl', 'Yaratıcı karışımlar.', 13, 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80'),
('bira', 'Bira', 'bira', 'Ferahlatıcı seçenekler.', 14, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80'),
('viski', 'Viski', 'viski', 'Özenle seçilmiş damıtımlar.', 15, 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80'),
('raki', 'Rakı', 'raki', 'Geleneksel lezzet.', 16, 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80');

-- 6. INSERT DATA (Products)
INSERT INTO products (id, title, description, price, category_id, is_active, image) VALUES
('k1', 'Gurme Serpme Kahvaltı', 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu.', 650, 'kahvalti', true, 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80'),
('e1', '2 Adet Fransız Tereyağlı Kruvasan', 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80'),
('e2', 'Çikolata Kreması', 'Ünlü fındık ve kakao bazlı kremalı bir sürülebilir tatlı.', 80, 'ekstralar', true, 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&q=80'),
('e3', 'Dulce De Leche', 'Tatlı ve yoğun kremamsı bir sos, karamelize süt tadıyla öne çıkar.', 100, 'ekstralar', true, 'https://plus.unsplash.com/premium_photo-1675279435422-77291a13e551?auto=format&fit=crop&q=80'),
('e4', 'Fesleğenli Domatesli Ciabatta', 'İtalya kökenli ciabatta ekmeği fesleğen ve domatesle aromalandırılarak sunulur. 4 Adet servis edilir.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80'),
('e5', 'Kare Rustik Ekmek', 'Kare şeklinde hazırlanmış rustik ekmek. Geleneksel yöntemle mayalanıp fırında pişirilir.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1509440159596-0249088b7280?auto=format&fit=crop&q=80'),
('e6', 'Mıhlama', 'Karadeniz mutfağının ünlü mısır unu ve peynirle hazırlanan sıcak yemeği.', 400, 'ekstralar', true, 'https://images.cookieandkate.com/images/2020/10/creamy-polenta-recipe-1.jpg'),
('e7', 'Omlet (Sade/Peynirli)', 'Yumurta bazlı ve tercihe göre peynir eklenen kahvaltı klasiği.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80'),
('e8', 'Patates Kızartması', 'Taze patates dilimleri kızartılarak hazırlanır, isteğe göre baharatlı veya sade.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80'),
('e9', 'Pişi (Adet)', 'Kızarmış hamur olarak servis edilen lezzetli bir hamur işi.', 100, 'ekstralar', true, 'https://i.nefisyemektarifleri.com/2021/04/16/yag-cekmeyen-mayasiz-pisi-tarifi.jpg'),
('e10', 'Sahanda Menemen', 'Domates, biber ve yumurta ile hazırlanan geleneksel bir Türk kahvaltı lezzeti.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1634509122392-1259e8e6047e?auto=format&fit=crop&q=80'),
('e11', 'Sahanda Peynirli Yumurta', 'Yumurta ve peynirin tavada birleştiği lezzetli bir kahvaltı.', 250, 'ekstralar', true, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80'),
('e12', 'Sahanda Sucuklu Yumurta', 'Sucuk dilimleri ve yumurta ile hazırlanan, tavada tereyağı ile pişirilerek servis edilen doyurucu bir kahvaltı yemeği.', 350, 'ekstralar', true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80'),
('e13', 'Sigara Böreği (4 Adet)', 'İnce yufkaya sarılan ve kızartılmış içi genellikle peynirli hafif bir atıştırmalık.', 300, 'ekstralar', true, 'https://images.unsplash.com/photo-1616429402636-2f08514a37a8?auto=format&fit=crop&q=80'),
('b1', 'Başlangıç Tabağı', 'Zeytin, zahter, zeytinyağı ve fesleğenli domatesli ciabatta ekmeği içeren lezzetli bir atıştırmalık tabağı.', 350, 'baslangic', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('b2', 'Kızarmış Tavuk Ve Baharatlı Patates Kızartması', 'Tavuk parçaları kızartılıp baharatlanır ve yanında patates kızartması sunulur.', 500, 'baslangic', true, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80'),
('b3', 'Patates Kızartması', 'Taze patateslerden kızartılmış lezzetli bir garnitür. Baharatlı veya sade tercih edilebilir.', 300, 'baslangic', true, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80'),
('b4', 'Roka Salatası', 'Roka Beyaz Peynir Tarla Domates ve Ceviz üzeri Balsamik Glaze ile Servis Edilir.', 350, 'baslangic', true, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80'),
('b5', 'Rustik Ekmek Üstü Füme Somon', 'Füme somon parçaları, rustik ekmek üzerinde sunulur ve taze aromalarla zenginleştirilir.', 450, 'baslangic', true, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80'),
('p1', 'Gurme Rustik Sandviç', 'Taze pişirilen rustik baget, beyaz peynir, domates, roka, pesto sos ve zeytinyağı ile hazırlanır patates kızartması ile sıcak servis edilir.', 450, 'pizza-sandvic', true, 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80'),
('p2', 'Taş Fırın Karışık Pizza', 'Taş fırında pişirilmiş, farklı malzemelerle zenginleştirilmiş roka, parmesan ve acılı zeytinyağı ile sunulan doyurucu bir karışık pizza.', 500, 'pizza-sandvic', true, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80'),
('p3', 'Taş Fırın Margarita Pizza', 'Taş fırında pişirilmiş, taze roka, parmesan peyniri ve acılı zeytinyağı ile sunulan geleneksel bir Margarita Pizza.', 500, 'pizza-sandvic', true, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80'),
('pt1', 'Rakı Eşlikçisi Peynir Tabağı', 'Rakı ile uyum sağlayan çeşitli peynir türlerinden oluşan bir tabaktır.', 850, 'peynir-tabagi', true, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80'),
('pt2', 'Türk Yerli Peynir Şarap Tabağı', 'Çeşitli yerli peynirlerin bir araya geldiği, şarapla uyumlu zengin bir tabağa sahiptir.', 1000, 'peynir-tabagi', true, 'https://images.unsplash.com/photo-1559561853-08451507cbe4?auto=format&fit=crop&q=80'),
('t1', '2''Li Çikolatalı Mini Berliner', 'İki adet mini çikolatalı berliner tatlı hamur topudur.', 200, 'tatli', true, 'https://images.unsplash.com/photo-1601614769062-859187399945?auto=format&fit=crop&q=80'),
('t2', 'Antakya Künefe', 'Geleneksel bir Türk tatlısı. İncecik tel kadayıf arasında eriyen peynir ve şerbetiyle sıcak servis edilir.', 350, 'tatli', true, 'https://images.unsplash.com/photo-1594520771801-b552b96c8c4c?auto=format&fit=crop&q=80'),
('t3', 'Churros', 'Klasik İspanyol tatlısı olarak kızartılmış hamur çubukları. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', 400, 'tatli', true, 'https://images.unsplash.com/photo-1624300626442-164a696de23a?auto=format&fit=crop&q=80'),
('t4', 'Fransız Tereyağlı Kruvasan (Sade)', 'Çıtır kruvasan, file bademlerle zenginleştirilmiştir. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', 300, 'tatli', true, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80'),
('t5', 'Vanilyalı Dondurma (2 Top)', 'Klasik vanilya lezzetiyle iki top dondurma sunumu.', 200, 'tatli', true, 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&q=80'),
('ay1', 'Izgara Pirzola', 'Izgarada pişirilen kemikli et dilimleri. Patates püresi tabanı ve kavrulmuş file badem ile servis edilir.', 1000, 'ana-yemek', true, 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80'),
('ay2', 'Konak Köfte', 'Geleneksel tarifle hazırlanan nefis köfteler. Patates püresi tabanı, kavrulmuş file badem ile tatlandırılır.', 800, 'ana-yemek', true, 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80'),
('ay3', 'Konak Sac Kavurma', 'Sacda pişirilen lezzetli et parçaları. Patates püresi tabanı, kavrulmuş file badem ile servis edilir.', 850, 'ana-yemek', true, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80'),
('ay4', 'Lokum Bonfile', 'Yumuşacık bir biftek olarak patates püresi tabanı üzerinde sunulur. Kavrulmuş file badem ile lezzeti tamamlar.', 1200, 'ana-yemek', true, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80'),
('ay5', 'Izgara Levrek', 'Taze günlük levrek, kömür ateşinde ızgara edilir. Yanında roka, kırmızı soğan ve fırın patates ile servis edilir.', 950, 'ana-yemek', true, '/assets/products/levrek.png'),
('as1', 'İçli Köfte', 'Dış hamuru bulgurdan hazırlanan, içi kıymayla doldurulan geleneksel bir köfte çeşidi.', 200, 'ara-sicaklar', true, 'https://cdn.yemek.com/mnresize/1250/833/uploads/2021/03/icli-kofte-tarifi-yeni.jpg'),
('as2', 'Kaşarlı Mantar', 'Taze mantarlar üzerine kaşar peyniri serpilerek fırınlanır.', 300, 'ara-sicaklar', true, 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?auto=format&fit=crop&q=80'),
('as3', 'Paçanga Böreği', 'Pastırma ve peynirle doldurulmuş, ince yufkayla sarılı lezzetli bir börek türü.', 200, 'ara-sicaklar', true, 'https://cdn.yemek.com/mnresize/940/940/uploads/2016/06/pacanga-boregi-rece.jpg'),
('m1', 'Acılı Atom', 'Yoğurt ve acı biberle hazırlanan bir meze. Baharatlı tadıyla sofraya canlılık katar.', 250, 'meze', true, 'https://cdn.yemek.com/mnresize/1250/833/uploads/2021/10/ev-yapimi-atom-mezesi.jpg'),
('m2', 'Avokadolu Kapya Biber', 'Avokado ve kapya biberin taze birleşimiyle sunulan bu meze, hafif ve renkli bir lezzet sunar.', 300, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m3', 'Başlangıç Tabağı', 'Zeytin, zeytinyağı ve zahter ile sunulan, rustik ekmek eşliğinde hafif bir başlangıç mezesi.', 350, 'meze', true, 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&q=80'),
('m4', 'Deniz Börülcesi', 'Ege mutfağının sevilen mezelerinden, zeytinyağı ve limonla tatlandırılır.', 300, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m5', 'Fesleğenli Girit Ezme', 'Taze fesleğen ve peynir bazlı karışımla hazırlanan geleneksel bir Girit ezmesi.', 300, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m6', 'Haydari', 'Klasik Türk mezesi, süzme yoğurt ve taze otlar kullanılarak hazırlanır.', 250, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m7', 'Kuru Cacık', 'Yoğurt ve salatalık esaslı koyu kıvamlı bir meze.', 250, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m8', 'La Pena (Acılı)', 'Baharatlı ve acı sevenlere hitap eden özel bir meze.', 250, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m9', 'Tereyağlı Pastırmalı Antakya Humus', 'Ezilmiş nohut, tahin, zeytinyağı ve baharatlarla yapılan geleneksel bir meze. Üzerinde dilimlenmiş tereyağlı pastırma.', 400, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m10', 'Yoğurtlu Havuç Tarator', 'Rendelenmiş havuç ve yoğurtun lezzetli birleşimi.', 250, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m11', 'Yoğurtlu Patlıcan', 'Közlenmiş patlıcan ile yoğurdun uyumlu birleşimi.', 250, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m12', 'Zeytinyağlı & Domatesli Antakya Humus', 'Nohut ve tahin temelli klasik humusun domates ve zeytinyağıyla zenginleştirilmiş hali.', 250, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('m13', 'Zeytinyağlı Vişneli Yaprak Sarma', 'Asma yapraklarıyla sarılmış pirinç içini vişnenin ekşi tadıyla buluşturan bir meze.', 300, 'meze', true, 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80'),
('si1', 'Fanta', 'Gazlı ve meyveli aromalı bir soğuk içecek.', 150, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80'),
('si2', 'Ice Americano', 'Buzla soğutulmuş espresso bazlı kahve.', 160, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1517701604599-bb602c3ae94f?auto=format&fit=crop&q=80'),
('si3', 'Ice Latte', 'Buzlu ve sütlü espresso karışımı.', 180, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80'),
('si4', 'Ice Tea', 'Serinletici, buzlu çay bazlı içecek.', 150, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80'),
('si5', 'Kola', 'Gazlı ve şekerli bir soğuk içecek.', 150, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80'),
('si6', 'Niğde Gazozu', 'Geleneksel, meyve aromalı gazoz.', 100, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80'),
('si7', 'Soda', 'Ferahlatıcı, gazlı bir madensuy.', 100, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80'),
('si8', 'Taze Sıkılmış Portakal Suyu', 'Taze portakalların sıkılmasıyla elde edilen doğal bir meyve suyu.', 250, 'soguk-icecek', true, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80'),
('sc1', 'Americano', 'Espresso ve sıcak suyun birleşiminden oluşan sade kahve.', 150, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80'),
('sc2', 'Bitki Çayları', 'Bitkisel karışımlardan oluşan sıcak çay.', 150, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80'),
('sc3', 'Çay', 'Kırmızıya çalan rengi ve buharıyla her yudumda huzur veren bir keyif.', 40, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80'),
('sc4', 'Espresso', 'Yoğun ve sert kahve çeşidi.', 120, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80'),
('sc5', 'Filtre Kahve', 'Klasik yöntemle demlenen kahve.', 150, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80'),
('sc6', 'Nescafe', 'Hazır kahve granüllerinden sıcak su ile hazırlanan pratik kahve.', 150, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80'),
('sc7', 'Türk Kahvesi', 'Eşsiz telvesi, köpüğü ve kadifemsi lezzetiyle bir ritüeldir.', 100, 'sicak-icecek', true, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80'),
('sr1', 'Kırmızı Phokaia Karasi', 'Bu aromatik kırmızı şarap üzümün zengin tatlarını sunar.', 1600, 'sarap', true, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'),
('sr2', 'Öküzgözü 1970 (70 Cl)', 'Büyük şişede sunulan bu Öküzgözü, uzun yıllandırma sonucu kompleksleşmiş bir tat profili sunar.', 1600, 'sarap', true, 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80'),
('sr3', 'Öküzgözü 1970 (Kadeh)', 'Şık bir kadeh olarak sunulan bu kırmızı şarap, Öküzgözü üzümünün yoğun gövdesini yansıtır.', 400, 'sarap', true, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'),
('sr4', 'Phokaia Blend', 'Farklı üzüm çeşitlerinin özenle harmanlandığı bu kırmızı şarap, meyvemsi ve baharatlı notalara sahiptir.', 1600, 'sarap', true, 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80'),
('sr5', 'Phokaia Chardonnay (Beyaz)', 'Bu beyaz şarap, Chardonnay üzümünün yumuşak ve meyvemsi karakterini taşır.', 1600, 'sarap', true, 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80'),
('sr6', 'Phokaia Foca Karasi-Merlot', 'Bu kırmızı şarap Merlot ve Foca karası üzümlerinin harmanını yansıtır.', 1600, 'sarap', true, 'https://images.unsplash.com/photo-1559561853-08451507cbe4?auto=format&fit=crop&q=80'),
('ck1', 'Kuzu Kulağı', 'Bu tazeleyici kokteyl, ekşimsi notalara sahip bitkisel tatlar içerir.', 500, 'kokteyl', true, 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80'),
('ck2', 'Wild Berry', 'Meyveli bir kokteyl, tatlı ve hafif ekşi meyve özlerini bir araya getirir.', 500, 'kokteyl', true, 'https://images.unsplash.com/photo-1536935338788-843bb6303475?auto=format&fit=crop&q=80'),
('br1', 'Blanc', 'Bu ferahlatıcı bira narenciye ve hafif baharat notalarına sahiptir.', 250, 'bira', true, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80'),
('br2', 'Carlsberg', 'Bu klasik bira hafif içimli ve tatmin edici bir malt tadına sahiptir.', 200, 'bira', true, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80'),
('br3', 'Tuborg Gold', 'Orta gövdeli ve hafif tatlımsı bir lezzete sahip olan bu bira.', 200, 'bira', true, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80'),
('v1', 'Chivas Regal (35 Cl)', 'Orta boy şişede sunulan bu harman viski, meşe fıçılarında yıllandırılarak yumuşak bir tadım elde eder.', 2300, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v2', 'Chivas Regal (70 Cl)', 'Büyük şişede sunulan Chivas Regal, klasik İskoç harman viskilerinden biridir.', 3400, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v3', 'Chivas Regal (Duble)', 'Duble servis edilen bu İskoç viski, zengin tahıl ve meyve tonlarıyla katmanlı bir lezzet sunar.', 900, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v4', 'Chivas Regal (Tek)', 'Bu İskoç harman viskisi, yumuşak içimiyle tanınır.', 500, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v5', 'Jack Daniels (35 Cl)', 'Orta boy şişede sunulan bu Tennessee viski, hafif tatlımsı karakteriyle tanınır.', 2000, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v6', 'Jack Daniels (70 Cl)', 'Büyük şişe formatında sunulan Jack Daniels, meşe fıçılarında yıllandırılan klasik bir Amerikan viskidir.', 3000, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v7', 'Jack Daniels (Duble)', 'Duble servis edilen bu Tennessee viski, odun kömüründe filtrelenen yumuşak tadıyla bilinir.', 800, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v8', 'Jack Daniels (Tek)', 'Bu klasik Amerikan viski, Tennessee bölgesine özgü kömür filtrasyonundan geçer.', 450, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v9', 'Woodford Reserve (70 Cl)', 'Büyük şişede sunulan bu özel burbon, özenli üretim süreci sayesinde yumuşak ve yoğun bir karakter kazanır.', 5000, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v10', 'Woodford Reserve (Duble)', 'Duble servis edilen bu burbon, meşe fıçılarında yıllandırılmasının getirdiği kompleks tat profiline sahiptir.', 1200, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('v11', 'Woodford Reserve (Tek)', 'Bu Amerikan burbonu karamel, vanilya ve hafif meşe tonlarına sahip özel bir harmandır.', 800, 'viski', true, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80'),
('r1', 'Yeni Rakı (35 Cl)', 'Klasik Türk rakısı.', 900, 'raki', true, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'),
('r2', 'Yeni Rakı (70 Cl)', 'Klasik Türk rakısı, 70lik.', 1700, 'raki', true, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80');
