-- Clean existing data (optional, be careful in production)
-- TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE;

-- Categories
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
('raki', 'Rakı', 'raki', 'Geleneksel lezzet.', 16, 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, title, description, price, category_id, is_active) VALUES
-- Kahvalti
('k1', 'Gurme Serpme Kahvaltı', 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu.', 650, 'kahvalti', true),
-- Ekstralar
('e1', '2 Adet Fransız Tereyağlı Kruvasan', 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan.', 300, 'ekstralar', true),
('e2', 'Çikolata Kreması', 'Ünlü fındık ve kakao bazlı kremalı bir sürülebilir tatlı.', 80, 'ekstralar', true),
('e3', 'Dulce De Leche', 'Tatlı ve yoğun kremamsı bir sos, karamelize süt tadıyla öne çıkar.', 100, 'ekstralar', true),
('e4', 'Fesleğenli Domatesli Ciabatta', 'İtalya kökenli ciabatta ekmeği fesleğen ve domatesle aromalandırılarak sunulur. 4 Adet servis edilir.', 300, 'ekstralar', true),
('e5', 'Kare Rustik Ekmek', 'Kare şeklinde hazırlanmış rustik ekmek. Geleneksel yöntemle mayalanıp fırında pişirilir.', 300, 'ekstralar', true),
('e6', 'Mıhlama', 'Karadeniz mutfağının ünlü mısır unu ve peynirle hazırlanan sıcak yemeği.', 400, 'ekstralar', true),
('e7', 'Omlet (Sade/Peynirli)', 'Yumurta bazlı ve tercihe göre peynir eklenen kahvaltı klasiği.', 300, 'ekstralar', true),
('e8', 'Patates Kızartması', 'Taze patates dilimleri kızartılarak hazırlanır, isteğe göre baharatlı veya sade.', 300, 'ekstralar', true),
('e9', 'Pişi (Adet)', 'Kızarmış hamur olarak servis edilen lezzetli bir hamur işi.', 100, 'ekstralar', true),
('e10', 'Sahanda Menemen', 'Domates, biber ve yumurta ile hazırlanan geleneksel bir Türk kahvaltı lezzeti.', 300, 'ekstralar', true),
('e11', 'Sahanda Peynirli Yumurta', 'Yumurta ve peynirin tavada birleştiği lezzetli bir kahvaltı.', 250, 'ekstralar', true),
('e12', 'Sahanda Sucuklu Yumurta', 'Sucuk dilimleri ve yumurta ile hazırlanan, tavada tereyağı ile pişirilerek servis edilen doyurucu bir kahvaltı yemeği.', 350, 'ekstralar', true),
('e13', 'Sigara Böreği (4 Adet)', 'İnce yufkaya sarılan ve kızartılmış içi genellikle peynirli hafif bir atıştırmalık.', 300, 'ekstralar', true),
-- Baslangic
('b1', 'Başlangıç Tabağı', 'Zeytin, zahter, zeytinyağı ve fesleğenli domatesli ciabatta ekmeği içeren lezzetli bir atıştırmalık tabağı.', 350, 'baslangic', true),
('b2', 'Kızarmış Tavuk Ve Baharatlı Patates Kızartması', 'Tavuk parçaları kızartılıp baharatlanır ve yanında patates kızartması sunulur.', 500, 'baslangic', true),
('b3', 'Patates Kızartması', 'Taze patateslerden kızartılmış lezzetli bir garnitür. Baharatlı veya sade tercih edilebilir.', 300, 'baslangic', true),
('b4', 'Roka Salatası', 'Roka Beyaz Peynir Tarla Domates ve Ceviz üzeri Balsamik Glaze ile Servis Edilir.', 350, 'baslangic', true),
('b5', 'Rustik Ekmek Üstü Füme Somon', 'Füme somon parçaları, rustik ekmek üzerinde sunulur ve taze aromalarla zenginleştirilir.', 450, 'baslangic', true),
-- Pizza
('p1', 'Gurme Rustik Sandviç', 'Taze pişirilen rustik baget, beyaz peynir, domates, roka, pesto sos ve zeytinyağı ile hazırlanır patates kızartması ile sıcak servis edilir.', 450, 'pizza-sandvic', true),
('p2', 'Taş Fırın Karışık Pizza', 'Taş fırında pişirilmiş, farklı malzemelerle zenginleştirilmiş roka, parmesan ve acılı zeytinyağı ile sunulan doyurucu bir karışık pizza.', 500, 'pizza-sandvic', true),
('p3', 'Taş Fırın Margarita Pizza', 'Taş fırında pişirilmiş, taze roka, parmesan peyniri ve acılı zeytinyağı ile sunulan geleneksel bir Margarita Pizza.', 500, 'pizza-sandvic', true),
-- Peynir
('pt1', 'Rakı Eşlikçisi Peynir Tabağı', 'Rakı ile uyum sağlayan çeşitli peynir türlerinden oluşan bir tabaktır.', 850, 'peynir-tabagi', true),
('pt2', 'Türk Yerli Peynir Şarap Tabağı', 'Çeşitli yerli peynirlerin bir araya geldiği, şarapla uyumlu zengin bir tabağa sahiptir.', 1000, 'peynir-tabagi', true),
-- Tatli
('t1', '2''Li Çikolatalı Mini Berliner', 'İki adet mini çikolatalı berliner tatlı hamur topudur.', 200, 'tatli', true),
('t2', 'Antakya Künefe', 'Geleneksel bir Türk tatlısı. İncecik tel kadayıf arasında eriyen peynir ve şerbetiyle sıcak servis edilir.', 350, 'tatli', true),
('t3', 'Churros', 'Klasik İspanyol tatlısı olarak kızartılmış hamur çubukları. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', 400, 'tatli', true),
('t4', 'Fransız Tereyağlı Kruvasan (Sade)', 'Çıtır kruvasan, file bademlerle zenginleştirilmiştir. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', 300, 'tatli', true),
('t5', 'Vanilyalı Dondurma (2 Top)', 'Klasik vanilya lezzetiyle iki top dondurma sunumu.', 200, 'tatli', true),
-- Ana Yemek
('ay1', 'Izgara Pirzola', 'Izgarada pişirilen kemikli et dilimleri. Patates püresi tabanı ve kavrulmuş file badem ile servis edilir.', 1000, 'ana-yemek', true),
('ay2', 'Konak Köfte', 'Geleneksel tarifle hazırlanan nefis köfteler. Patates püresi tabanı, kavrulmuş file badem ile tatlandırılır.', 800, 'ana-yemek', true),
('ay3', 'Konak Sac Kavurma', 'Sacda pişirilen lezzetli et parçaları. Patates püresi tabanı, kavrulmuş file badem ile servis edilir.', 850, 'ana-yemek', true),
('ay4', 'Lokum Bonfile', 'Yumuşacık bir biftek olarak patates püresi tabanı üzerinde sunulur. Kavrulmuş file badem ile lezzeti tamamlar.', 1200, 'ana-yemek', true),
-- Ara Sicaklar
('as1', 'İçli Köfte', 'Dış hamuru bulgurdan hazırlanan, içi kıymayla doldurulan geleneksel bir köfte çeşidi.', 200, 'ara-sicaklar', true),
('as2', 'Kaşarlı Mantar', 'Taze mantarlar üzerine kaşar peyniri serpilerek fırınlanır.', 300, 'ara-sicaklar', true),
('as3', 'Paçanga Böreği', 'Pastırma ve peynirle doldurulmuş, ince yufkayla sarılı lezzetli bir börek türü.', 200, 'ara-sicaklar', true),
-- Meze
('m1', 'Acılı Atom', 'Yoğurt ve acı biberle hazırlanan bir meze. Baharatlı tadıyla sofraya canlılık katar.', 250, 'meze', true),
('m2', 'Avokadolu Kapya Biber', 'Avokado ve kapya biberin taze birleşimiyle sunulan bu meze, hafif ve renkli bir lezzet sunar.', 300, 'meze', true),
('m3', 'Başlangıç Tabağı', 'Zeytin, zeytinyağı ve zahter ile sunulan, rustik ekmek eşliğinde hafif bir başlangıç mezesi.', 350, 'meze', true),
('m4', 'Deniz Börülcesi', 'Ege mutfağının sevilen mezelerinden, zeytinyağı ve limonla tatlandırılır.', 300, 'meze', true),
('m5', 'Fesleğenli Girit Ezme', 'Taze fesleğen ve peynir bazlı karışımla hazırlanan geleneksel bir Girit ezmesi.', 300, 'meze', true),
('m6', 'Haydari', 'Klasik Türk mezesi, süzme yoğurt ve taze otlar kullanılarak hazırlanır.', 250, 'meze', true),
('m7', 'Kuru Cacık', 'Yoğurt ve salatalık esaslı koyu kıvamlı bir meze.', 250, 'meze', true),
('m8', 'La Pena (Acılı)', 'Baharatlı ve acı sevenlere hitap eden özel bir meze.', 250, 'meze', true),
('m9', 'Tereyağlı Pastırmalı Antakya Humus', 'Ezilmiş nohut, tahin, zeytinyağı ve baharatlarla yapılan geleneksel bir meze. Üzerinde dilimlenmiş tereyağlı pastırma.', 400, 'meze', true),
('m10', 'Yoğurtlu Havuç Tarator', 'Rendelenmiş havuç ve yoğurtun lezzetli birleşimi.', 250, 'meze', true),
('m11', 'Yoğurtlu Patlıcan', 'Közlenmiş patlıcan ile yoğurdun uyumlu birleşimi.', 250, 'meze', true),
('m12', 'Zeytinyağlı & Domatesli Antakya Humus', 'Nohut ve tahin temelli klasik humusun domates ve zeytinyağıyla zenginleştirilmiş hali.', 250, 'meze', true),
('m13', 'Zeytinyağlı Vişneli Yaprak Sarma', 'Asma yapraklarıyla sarılmış pirinç içini vişnenin ekşi tadıyla buluşturan bir meze.', 300, 'meze', true),
-- Soguk Icecek
('si1', 'Fanta', 'Gazlı ve meyveli aromalı bir soğuk içecek.', 150, 'soguk-icecek', true),
('si2', 'Ice Americano', 'Buzla soğutulmuş espresso bazlı kahve.', 160, 'soguk-icecek', true),
('si3', 'Ice Latte', 'Buzlu ve sütlü espresso karışımı.', 180, 'soguk-icecek', true),
('si4', 'Ice Tea', 'Serinletici, buzlu çay bazlı içecek.', 150, 'soguk-icecek', true),
('si5', 'Kola', 'Gazlı ve şekerli bir soğuk içecek.', 150, 'soguk-icecek', true),
('si6', 'Niğde Gazozu', 'Geleneksel, meyve aromalı gazoz.', 100, 'soguk-icecek', true),
('si7', 'Soda', 'Ferahlatıcı, gazlı bir madensuy.', 100, 'soguk-icecek', true),
('si8', 'Taze Sıkılmış Portakal Suyu', 'Taze portakalların sıkılmasıyla elde edilen doğal bir meyve suyu.', 250, 'soguk-icecek', true),
-- Sicak Icecek
('sc1', 'Americano', 'Espresso ve sıcak suyun birleşiminden oluşan sade kahve.', 150, 'sicak-icecek', true),
('sc2', 'Bitki Çayları', 'Bitkisel karışımlardan oluşan sıcak çay.', 150, 'sicak-icecek', true),
('sc3', 'Çay', 'Kırmızıya çalan rengi ve buharıyla her yudumda huzur veren bir keyif.', 40, 'sicak-icecek', true),
('sc4', 'Espresso', 'Yoğun ve sert kahve çeşidi.', 120, 'sicak-icecek', true),
('sc5', 'Filtre Kahve', 'Klasik yöntemle demlenen kahve.', 150, 'sicak-icecek', true),
('sc6', 'Nescafe', 'Hazır kahve granüllerinden sıcak su ile hazırlanan pratik kahve.', 150, 'sicak-icecek', true),
('sc7', 'Türk Kahvesi', 'Eşsiz telvesi, köpüğü ve kadifemsi lezzetiyle bir ritüeldir.', 100, 'sicak-icecek', true),
-- Sarap
('sr1', 'Kırmızı Phokaia Karasi', 'Bu aromatik kırmızı şarap üzümün zengin tatlarını sunar.', 1600, 'sarap', true),
('sr2', 'Öküzgözü 1970 (70 Cl)', 'Büyük şişede sunulan bu Öküzgözü, uzun yıllandırma sonucu kompleksleşmiş bir tat profili sunar.', 1600, 'sarap', true),
('sr3', 'Öküzgözü 1970 (Kadeh)', 'Şık bir kadeh olarak sunulan bu kırmızı şarap, Öküzgözü üzümünün yoğun gövdesini yansıtır.', 400, 'sarap', true),
('sr4', 'Phokaia Blend', 'Farklı üzüm çeşitlerinin özenle harmanlandığı bu kırmızı şarap, meyvemsi ve baharatlı notalara sahiptir.', 1600, 'sarap', true),
('sr5', 'Phokaia Chardonnay (Beyaz)', 'Bu beyaz şarap, Chardonnay üzümünün yumuşak ve meyvemsi karakterini taşır.', 1600, 'sarap', true),
('sr6', 'Phokaia Foca Karasi-Merlot', 'Bu kırmızı şarap Merlot ve Foca karası üzümlerinin harmanını yansıtır.', 1600, 'sarap', true),
-- Kokteyl
('ck1', 'Kuzu Kulağı', 'Bu tazeleyici kokteyl, ekşimsi notalara sahip bitkisel tatlar içerir.', 500, 'kokteyl', true),
('ck2', 'Wild Berry', 'Meyveli bir kokteyl, tatlı ve hafif ekşi meyve özlerini bir araya getirir.', 500, 'kokteyl', true),
-- Bira
('br1', 'Blanc', 'Bu ferahlatıcı bira narenciye ve hafif baharat notalarına sahiptir.', 250, 'bira', true),
('br2', 'Carlsberg', 'Bu klasik bira hafif içimli ve tatmin edici bir malt tadına sahiptir.', 200, 'bira', true),
('br3', 'Tuborg Gold', 'Orta gövdeli ve hafif tatlımsı bir lezzete sahip olan bu bira.', 200, 'bira', true),
-- Viski
('v1', 'Chivas Regal (35 Cl)', 'Orta boy şişede sunulan bu harman viski, meşe fıçılarında yıllandırılarak yumuşak bir tadım elde eder.', 2300, 'viski', true),
('v2', 'Chivas Regal (70 Cl)', 'Büyük şişede sunulan Chivas Regal, klasik İskoç harman viskilerinden biridir.', 3400, 'viski', true),
('v3', 'Chivas Regal (Duble)', 'Duble servis edilen bu İskoç viski, zengin tahıl ve meyve tonlarıyla katmanlı bir lezzet sunar.', 900, 'viski', true),
('v4', 'Chivas Regal (Tek)', 'Bu İskoç harman viskisi, yumuşak içimiyle tanınır.', 500, 'viski', true),
('v5', 'Jack Daniels (35 Cl)', 'Orta boy şişede sunulan bu Tennessee viski, hafif tatlımsı karakteriyle tanınır.', 2000, 'viski', true),
('v6', 'Jack Daniels (70 Cl)', 'Büyük şişe formatında sunulan Jack Daniels, meşe fıçılarında yıllandırılan klasik bir Amerikan viskidir.', 3000, 'viski', true),
('v7', 'Jack Daniels (Duble)', 'Duble servis edilen bu Tennessee viski, odun kömüründe filtrelenen yumuşak tadıyla bilinir.', 800, 'viski', true),
('v8', 'Jack Daniels (Tek)', 'Bu klasik Amerikan viski, Tennessee bölgesine özgü kömür filtrasyonundan geçer.', 450, 'viski', true),
('v9', 'Woodford Reserve (70 Cl)', 'Büyük şişede sunulan bu özel burbon, özenli üretim süreci sayesinde yumuşak ve yoğun bir karakter kazanır.', 5000, 'viski', true),
('v10', 'Woodford Reserve (Duble)', 'Duble servis edilen bu burbon, meşe fıçılarında yıllandırılmasının getirdiği kompleks tat profiline sahiptir.', 1200, 'viski', true),
('v11', 'Woodford Reserve (Tek)', 'Bu Amerikan burbonu karamel, vanilya ve hafif meşe tonlarına sahip özel bir harmandır.', 800, 'viski', true)
ON CONFLICT (id) DO NOTHING;
