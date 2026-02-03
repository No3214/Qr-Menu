
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from root directory
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
    { id: 'kahvalti', title: 'Kahvaltı', slug: 'kahvalti', description: 'Güne lezzetli bir başlangıç.', order: 1, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'ekstralar', title: 'Ekstralar', slug: 'ekstralar', description: 'Kahvaltı yanı lezzetler.', order: 2, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'baslangic', title: 'Başlangıç & Paylaşımlıklar', slug: 'baslangic', description: 'İştah açan dokunuşlar.', order: 3, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'pizza-sandvic', title: 'Taş Fırın Pizza ve Sandviç', slug: 'pizza-sandvic', description: 'İnce hamur, bol lezzet.', order: 4, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80' },
    { id: 'peynir-tabagi', title: 'Peynir Tabağı', slug: 'peynir-tabagi', description: 'Şık ve keyifli eşlikçi.', order: 5, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80' },
    { id: 'tatli', title: 'Tatlı', slug: 'tatli', description: 'Mutluluğun son dokunuşu.', order: 6, image: 'https://images.unsplash.com/photo-1563729768-b6363c4df969?auto=format&fit=crop&q=80' },
    { id: 'ana-yemek', title: 'Ana Yemek', slug: 'ana-yemek', description: 'Sofranın başrolü.', order: 7, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'ara-sicaklar', title: 'Ara Sıcaklar', slug: 'ara-sicaklar', description: 'Lezzete sıcak bir ara.', order: 8, image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80' },
    { id: 'meze', title: 'Meze', slug: 'meze', description: 'Paylaşmanın en güzel hali.', order: 9, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'soguk-icecek', title: 'Soğuk İçecekler', slug: 'soguk-icecek', description: 'Serin ve ferahlatıcı.', order: 10, image: 'https://images.unsplash.com/photo-1499638473338-25013094406a?auto=format&fit=crop&q=80' },
    { id: 'sicak-icecek', title: 'Sıcak İçecekler', slug: 'sicak-icecek', description: 'Isıtan keyif.', order: 11, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80' },
    { id: 'sarap', title: 'Şarap', slug: 'sarap', description: 'Şık bir yudum keyif.', order: 12, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'kokteyl', title: 'Kokteyl', slug: 'kokteyl', description: 'Yaratıcı karışımlar.', order: 13, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'bira', title: 'Bira', slug: 'bira', description: 'Ferahlatıcı seçenekler.', order: 14, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'viski', title: 'Viski', slug: 'viski', description: 'Özenle seçilmiş damıtımlar.', order: 15, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'raki', title: 'Rakı', slug: 'raki', description: 'Geleneksel lezzet.', order: 16, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' }
];

const PRODUCTS = [
    { id: 'k1', title: 'Gurme Serpme Kahvaltı', description: 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu.', price: 650, category_id: 'kahvalti', is_active: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'e1', title: '2 Adet Fransız Tereyağlı Kruvasan', description: 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
    { id: 'e2', title: 'Çikolata Kreması', description: 'Ünlü fındık ve kakao bazlı kremalı bir sürülebilir tatlı.', price: 80, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&q=80' },
    { id: 'e3', title: 'Dulce De Leche', description: 'Tatlı ve yoğun kremamsı bir sos, karamelize süt tadıyla öne çıkar.', price: 100, category_id: 'ekstralar', is_active: true, image: 'https://plus.unsplash.com/premium_photo-1675279435422-77291a13e551?auto=format&fit=crop&q=80' },
    { id: 'e4', title: 'Fesleğenli Domatesli Ciabatta', description: 'İtalya kökenli ciabatta ekmeği fesleğen ve domatesle aromalandırılarak sunulur. 4 Adet servis edilir.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80' },
    { id: 'e5', title: 'Kare Rustik Ekmek', description: 'Kare şeklinde hazırlanmış rustik ekmek. Geleneksel yöntemle mayalanıp fırında pişirilir.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088b7280?auto=format&fit=crop&q=80' },
    { id: 'e6', title: 'Mıhlama', description: 'Karadeniz mutfağının ünlü mısır unu ve peynirle hazırlanan sıcak yemeği.', price: 400, category_id: 'ekstralar', is_active: true, image: 'https://images.cookieandkate.com/images/2020/10/creamy-polenta-recipe-1.jpg' },
    { id: 'e7', title: 'Omlet (Sade/Peynirli)', description: 'Yumurta bazlı ve tercihe göre peynir eklenen kahvaltı klasiği.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80' },
    { id: 'e8', title: 'Patates Kızartması', description: 'Taze patates dilimleri kızartılarak hazırlanır, isteğe göre baharatlı veya sade.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80' },
    { id: 'e9', title: 'Pişi (Adet)', description: 'Kızarmış hamur olarak servis edilen lezzetli bir hamur işi.', price: 100, category_id: 'ekstralar', is_active: true, image: 'https://i.nefisyemektarifleri.com/2021/04/16/yag-cekmeyen-mayasiz-pisi-tarifi.jpg' },
    { id: 'e10', title: 'Sahanda Menemen', description: 'Domates, biber ve yumurta ile hazırlanan geleneksel bir Türk kahvaltı lezzeti.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1634509122392-1259e8e6047e?auto=format&fit=crop&q=80' },
    { id: 'e11', title: 'Sahanda Peynirli Yumurta', description: 'Yumurta ve peynirin tavada birleştiği lezzetli bir kahvaltı.', price: 250, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80' },
    { id: 'e12', title: 'Sahanda Sucuklu Yumurta', description: 'Sucuk dilimleri ve yumurta ile hazırlanan, tavada tereyağı ile pişirilerek servis edilen doyurucu bir kahvaltı yemeği.', price: 350, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80' },
    { id: 'e13', title: 'Sigara Böreği (4 Adet)', description: 'İnce yufkaya sarılan ve kızartılmış içi genellikle peynirli hafif bir atıştırmalık.', price: 300, category_id: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1616429402636-2f08514a37a8?auto=format&fit=crop&q=80' },
    { id: 'b1', title: 'Başlangıç Tabağı', description: 'Zeytin, zahter, zeytinyağı ve fesleğenli domatesli ciabatta ekmeği içeren lezzetli bir atıştırmalık tabağı.', price: 350, category_id: 'baslangic', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'b2', title: 'Kızarmış Tavuk Ve Baharatlı Patates Kızartması', description: 'Tavuk parçaları kızartılıp baharatlanır ve yanında patates kızartması sunulur.', price: 500, category_id: 'baslangic', is_active: true, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80' },
    { id: 'b3', title: 'Patates Kızartması', description: 'Taze patateslerden kızartılmış lezzetli bir garnitür. Baharatlı veya sade tercih edilebilir.', price: 300, category_id: 'baslangic', is_active: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80' },
    { id: 'b4', title: 'Roka Salatası', description: 'Roka Beyaz Peynir Tarla Domates ve Ceviz üzeri Balsamik Glaze ile Servis Edilir.', price: 350, category_id: 'baslangic', is_active: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80' },
    { id: 'b5', title: 'Rustik Ekmek Üstü Füme Somon', description: 'Füme somon parçaları, rustik ekmek üzerinde sunulur ve taze aromalarla zenginleştirilir.', price: 450, category_id: 'baslangic', is_active: true, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80' },
    { id: 'p1', title: 'Gurme Rustik Sandviç', description: 'Taze pişirilen rustik baget, beyaz peynir, domates, roka, pesto sos ve zeytinyağı ile hazırlanır patates kızartması ile sıcak servis edilir.', price: 450, category_id: 'pizza-sandvic', is_active: true, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80' },
    { id: 'p2', title: 'Taş Fırın Karışık Pizza', description: 'Taş fırında pişirilmiş, farklı malzemelerle zenginleştirilmiş roka, parmesan ve acılı zeytinyağı ile sunulan doyurucu bir karışık pizza.', price: 500, category_id: 'pizza-sandvic', is_active: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80' },
    { id: 'p3', title: 'Taş Fırın Margarita Pizza', description: 'Taş fırında pişirilmiş, taze roka, parmesan peyniri ve acılı zeytinyağı ile sunulan geleneksel bir Margarita Pizza.', price: 500, category_id: 'pizza-sandvic', is_active: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80' },
    { id: 'pt1', title: 'Rakı Eşlikçisi Peynir Tabağı', description: 'Rakı ile uyum sağlayan çeşitli peynir türlerinden oluşan bir tabaktır.', price: 850, category_id: 'peynir-tabagi', is_active: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80' },
    { id: 'pt2', title: 'Türk Yerli Peynir Şarap Tabağı', description: 'Çeşitli yerli peynirlerin bir araya geldiği, şarapla uyumlu zengin bir tabağa sahiptir.', price: 1000, category_id: 'peynir-tabagi', is_active: true, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe4?auto=format&fit=crop&q=80' },
    { id: 't1', title: '2\'Li Çikolatalı Mini Berliner', description: 'İki adet mini çikolatalı berliner tatlı hamur topudur.', price: 200, category_id: 'tatli', is_active: true, image: 'https://images.unsplash.com/photo-1601614769062-859187399945?auto=format&fit=crop&q=80' },
    { id: 't2', title: 'Antakya Künefe', description: 'Geleneksel bir Türk tatlısı. İncecik tel kadayıf arasında eriyen peynir ve şerbetiyle sıcak servis edilir.', price: 350, category_id: 'tatli', is_active: true, image: 'https://images.unsplash.com/photo-1594520771801-b552b96c8c4c?auto=format&fit=crop&q=80' },
    { id: 't3', title: 'Churros', description: 'Klasik İspanyol tatlısı olarak kızartılmış hamur çubukları. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', price: 400, category_id: 'tatli', is_active: true, image: 'https://images.unsplash.com/photo-1624300626442-164a696de23a?auto=format&fit=crop&q=80' },
    { id: 't4', title: 'Fransız Tereyağlı Kruvasan (Sade)', description: 'Çıtır kruvasan, file bademlerle zenginleştirilmiştir. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', price: 300, category_id: 'tatli', is_active: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
    { id: 't5', title: 'Vanilyalı Dondurma (2 Top)', description: 'Klasik vanilya lezzetiyle iki top dondurma sunumu.', price: 200, category_id: 'tatli', is_active: true, image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&q=80' },
    { id: 'ay1', title: 'Izgara Pirzola', description: 'Izgarada pişirilen kemikli et dilimleri. Patates püresi tabanı ve kavrulmuş file badem ile servis edilir.', price: 1000, category_id: 'ana-yemek', is_active: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'ay2', title: 'Konak Köfte', description: 'Geleneksel tarifle hazırlanan nefis köfteler. Patates püresi tabanı, kavrulmuş file badem ile tatlandırılır.', price: 800, category_id: 'ana-yemek', is_active: true, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80' },
    { id: 'ay3', title: 'Konak Sac Kavurma', description: 'Sacda pişirilen lezzetli et parçaları. Patates püresi tabanı, kavrulmuş file badem ile servis edilir.', price: 850, category_id: 'ana-yemek', is_active: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80' },
    { id: 'ay4', title: 'Lokum Bonfile', description: 'Yumuşacık bir biftek olarak patates püresi tabanı üzerinde sunulur. Kavrulmuş file badem ile lezzeti tamamlar.', price: 1200, category_id: 'ana-yemek', is_active: true, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80' },
    { id: 'ay5', title: 'Izgara Levrek', description: 'Taze günlük levrek, kömür ateşinde ızgara edilir. Yanında roka, kırmızı soğan ve fırın patates ile servis edilir.', price: 950, category_id: 'ana-yemek', is_active: true, image: '/assets/products/levrek.png' },
    { id: 'as1', title: 'İçli Köfte', description: 'Dış hamuru bulgurdan hazırlanan, içi kıymayla doldurulan geleneksel bir köfte çeşidi.', price: 200, category_id: 'ara-sicaklar', is_active: true, image: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2021/03/icli-kofte-tarifi-yeni.jpg' },
    { id: 'as2', title: 'Kaşarlı Mantar', description: 'Taze mantarlar üzerine kaşar peyniri serpilerek fırınlanır.', price: 300, category_id: 'ara-sicaklar', is_active: true, image: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?auto=format&fit=crop&q=80' },
    { id: 'as3', title: 'Paçanga Böreği', description: 'Pastırma ve peynirle doldurulmuş, ince yufkayla sarılı lezzetli bir börek türü.', price: 200, category_id: 'ara-sicaklar', is_active: true, image: 'https://cdn.yemek.com/mnresize/940/940/uploads/2016/06/pacanga-boregi-rece.jpg' },
    { id: 'm1', title: 'Acılı Atom', description: 'Yoğurt ve acı biberle hazırlanan bir meze. Baharatlı tadıyla sofraya canlılık katar.', price: 250, category_id: 'meze', is_active: true, image: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2021/10/ev-yapimi-atom-mezesi.jpg' },
    { id: 'm2', title: 'Avokadolu Kapya Biber', description: 'Avokado ve kapya biberin taze birleşimiyle sunulan bu meze, hafif ve renkli bir lezzet sunar.', price: 300, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm3', title: 'Başlangıç Tabağı', description: 'Zeytin, zeytinyağı ve zahter ile sunulan, rustik ekmek eşliğinde hafif bir başlangıç mezesi.', price: 350, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&q=80' },
    { id: 'm4', title: 'Deniz Börülcesi', description: 'Ege mutfağının sevilen mezelerinden, zeytinyağı ve limonla tatlandırılır.', price: 300, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm5', title: 'Fesleğenli Girit Ezme', description: 'Taze fesleğen ve peynir bazlı karışımla hazırlanan geleneksel bir Girit ezmesi.', price: 300, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm6', title: 'Haydari', description: 'Klasik Türk mezesi, süzme yoğurt ve taze otlar kullanılarak hazırlanır.', price: 250, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm7', title: 'Kuru Cacık', description: 'Yoğurt ve salatalık esaslı koyu kıvamlı bir meze.', price: 250, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm8', title: 'La Pena (Acılı)', description: 'Baharatlı ve acı sevenlere hitap eden özel bir meze.', price: 250, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm9', title: 'Tereyağlı Pastırmalı Antakya Humus', description: 'Ezilmiş nohut, tahin, zeytinyağı ve baharatlarla yapılan geleneksel bir meze. Üzerinde dilimlenmiş tereyağlı pastırma.', price: 400, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm10', title: 'Yoğurtlu Havuç Tarator', description: 'Rendelenmiş havuç ve yoğurtun lezzetli birleşimi.', price: 250, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm11', title: 'Yoğurtlu Patlıcan', description: 'Közlenmiş patlıcan ile yoğurdun uyumlu birleşimi.', price: 250, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm12', title: 'Zeytinyağlı & Domatesli Antakya Humus', description: 'Nohut ve tahin temelli klasik humusun domates ve zeytinyağıyla zenginleştirilmiş hali.', price: 250, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm13', title: 'Zeytinyağlı Vişneli Yaprak Sarma', description: 'Asma yapraklarıyla sarılmış pirinç içini vişnenin ekşi tadıyla buluşturan bir meze.', price: 300, category_id: 'meze', is_active: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'si1', title: 'Fanta', description: 'Gazlı ve meyveli aromalı bir soğuk içecek.', price: 150, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80' },
    { id: 'si2', title: 'Ice Americano', description: 'Buzla soğutulmuş espresso bazlı kahve.', price: 160, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1517701604599-bb602c3ae94f?auto=format&fit=crop&q=80' },
    { id: 'si3', title: 'Ice Latte', description: 'Buzlu ve sütlü espresso karışımı.', price: 180, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80' },
    { id: 'si4', title: 'Ice Tea', description: 'Serinletici, buzlu çay bazlı içecek.', price: 150, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80' },
    { id: 'si5', title: 'Kola', description: 'Gazlı ve şekerli bir soğuk içecek.', price: 150, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80' },
    { id: 'si6', title: 'Niğde Gazozu', description: 'Geleneksel, meyve aromalı gazoz.', price: 100, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80' },
    { id: 'si7', title: 'Soda', description: 'Ferahlatıcı, gazlı bir madensuy.', price: 100, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80' },
    { id: 'si8', title: 'Taze Sıkılmış Portakal Suyu', description: 'Taze portakalların sıkılmasıyla elde edilen doğal bir meyve suyu.', price: 250, category_id: 'soguk-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80' },
    { id: 'sc1', title: 'Americano', description: 'Espresso ve sıcak suyun birleşiminden oluşan sade kahve.', price: 150, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },
    { id: 'sc2', title: 'Bitki Çayları', description: 'Bitkisel karışımlardan oluşan sıcak çay.', price: 150, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80' },
    { id: 'sc3', title: 'Çay', description: 'Kırmızıya çalan rengi ve buharıyla her yudumda huzur veren bir keyif.', price: 40, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80' },
    { id: 'sc4', title: 'Espresso', description: 'Yoğun ve sert kahve çeşidi.', price: 120, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80' },
    { id: 'sc5', title: 'Filtre Kahve', description: 'Klasik yöntemle demlenen kahve.', price: 150, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80' },
    { id: 'sc6', title: 'Nescafe', description: 'Hazır kahve granüllerinden sıcak su ile hazırlanan pratik kahve.', price: 150, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },
    { id: 'sc7', title: 'Türk Kahvesi', description: 'Eşsiz telvesi, köpüğü ve kadifemsi lezzetiyle bir ritüeldir.', price: 100, category_id: 'sicak-icecek', is_active: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },
    { id: 'sr1', title: 'Kırmızı Phokaia Karasi', description: 'Bu aromatik kırmızı şarap üzümün zengin tatlarını sunar.', price: 1600, category_id: 'sarap', is_active: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'sr2', title: 'Öküzgözü 1970 (70 Cl)', description: 'Büyük şişede sunulan bu Öküzgözü, uzun yıllandırma sonucu kompleksleşmiş bir tat profili sunar.', price: 1600, category_id: 'sarap', is_active: true, image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80' },
    { id: 'sr3', title: 'Öküzgözü 1970 (Kadeh)', description: 'Şık bir kadeh olarak sunulan bu kırmızı şarap, Öküzgözü üzümünün yoğun gövdesini yansıtır.', price: 400, category_id: 'sarap', is_active: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'sr4', title: 'Phokaia Blend', description: 'Farklı üzüm çeşitlerinin özenle harmanlandığı bu kırmızı şarap, meyvemsi ve baharatlı notalara sahiptir.', price: 1600, category_id: 'sarap', is_active: true, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80' },
    { id: 'sr5', title: 'Phokaia Chardonnay (Beyaz)', description: 'Bu beyaz şarap, Chardonnay üzümünün yumuşak ve meyvemsi karakterini taşır.', price: 1600, category_id: 'sarap', is_active: true, image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80' },
    { id: 'sr6', title: 'Phokaia Foca Karasi-Merlot', description: 'Bu kırmızı şarap Merlot ve Foca karası üzümlerinin harmanını yansıtır.', price: 1600, category_id: 'sarap', is_active: true, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe4?auto=format&fit=crop&q=80' },
    { id: 'ck1', title: 'Kuzu Kulağı', description: 'Bu tazeleyici kokteyl, ekşimsi notalara sahip bitkisel tatlar içerir.', price: 500, category_id: 'kokteyl', is_active: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'ck2', title: 'Wild Berry', description: 'Meyveli bir kokteyl, tatlı ve hafif ekşi meyve özlerini bir araya getirir.', price: 500, category_id: 'kokteyl', is_active: true, image: 'https://images.unsplash.com/photo-1536935338788-843bb6303475?auto=format&fit=crop&q=80' },
    { id: 'br1', title: 'Blanc', description: 'Bu ferahlatıcı bira narenciye ve hafif baharat notalarına sahiptir.', price: 250, category_id: 'bira', is_active: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'br2', title: 'Carlsberg', description: 'Bu klasik bira hafif içimli ve tatmin edici bir malt tadına sahiptir.', price: 200, category_id: 'bira', is_active: true, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80' },
    { id: 'br3', title: 'Tuborg Gold', description: 'Orta gövdeli ve hafif tatlımsı bir lezzete sahip olan bu bira.', price: 200, category_id: 'bira', is_active: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'v1', title: 'Chivas Regal (35 Cl)', description: 'Orta boy şişede sunulan bu harman viski, meşe fıçılarında yıllandırılarak yumuşak bir tadım elde eder.', price: 2300, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v2', title: 'Chivas Regal (70 Cl)', description: 'Büyük şişede sunulan Chivas Regal, klasik İskoç harman viskilerinden biridir.', price: 3400, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v3', title: 'Chivas Regal (Duble)', description: 'Duble servis edilen bu İskoç viski, zengin tahıl ve meyve tonlarıyla katmanlı bir lezzet sunar.', price: 900, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v4', title: 'Chivas Regal (Tek)', description: 'Bu İskoç harman viskisi, yumuşak içimiyle tanınır.', price: 500, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v5', title: 'Jack Daniels (35 Cl)', description: 'Orta boy şişede sunulan bu Tennessee viski, hafif tatlımsı karakteriyle tanınır.', price: 2000, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v6', title: 'Jack Daniels (70 Cl)', description: 'Büyük şişe formatında sunulan Jack Daniels, meşe fıçılarında yıllandırılan klasik bir Amerikan viskidir.', price: 3000, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v7', title: 'Jack Daniels (Duble)', description: 'Duble servis edilen bu Tennessee viski, odun kömüründe filtrelenen yumuşak tadıyla bilinir.', price: 800, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v8', title: 'Jack Daniels (Tek)', description: 'Bu klasik Amerikan viski, Tennessee bölgesine özgü kömür filtrasyonundan geçer.', price: 450, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v9', title: 'Woodford Reserve (70 Cl)', description: 'Büyük şişede sunulan bu özel burbon, özenli üretim süreci sayesinde yumuşak ve yoğun bir karakter kazanır.', price: 5000, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v10', title: 'Woodford Reserve (Duble)', description: 'Duble servis edilen bu burbon, meşe fıçılarında yıllandırılmasının getirdiği kompleks tat profiline sahiptir.', price: 1200, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v11', title: 'Woodford Reserve (Tek)', description: 'Bu Amerikan burbonu karamel, vanilya ve hafif meşe tonlarına sahip özel bir harmandır.', price: 800, category_id: 'viski', is_active: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'r1', title: 'Yeni Rakı (35 Cl)', description: 'Klasik Türk rakısı.', price: 900, category_id: 'raki', is_active: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'r2', title: 'Yeni Rakı (70 Cl)', description: 'Klasik Türk rakısı, 70lik.', price: 1700, category_id: 'raki', is_active: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' }
];

async function seed() {
    console.log('🌱 Starting database seed...');

    // 1. Insert Categories
    console.log('📦 Seeding categories...');
    const { error: catError } = await supabase
        .from('categories')
        .upsert(CATEGORIES, { onConflict: 'id' });

    if (catError) {
        console.error('❌ Error seeding categories:', catError);
    } else {
        console.log('✅ Categories seeded successfully.');
    }

    // 2. Insert Products
    console.log('🍔 Seeding products...');
    const { error: prodError } = await supabase
        .from('products')
        .upsert(PRODUCTS, { onConflict: 'id' });

    if (prodError) {
        console.error('❌ Error seeding products:', prodError);
    } else {
        console.log('✅ Products seeded successfully.');
    }
}

seed().catch(err => console.error('Unexpected error:', err));
