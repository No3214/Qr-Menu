export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    image?: string;
    notes?: string[];
}

export interface Category {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
}

export const CATEGORIES: Category[] = [
    { id: 'kahvalti', title: 'Kahvaltı', slug: 'kahvalti', description: 'Güne lezzetli bir başlangıç.', image: 'https://images.unsplash.com/photo-1533089862017-ec32e737c541?auto=format&fit=crop&q=80' },
    { id: 'ekstralar', title: 'Ekstralar', slug: 'ekstralar', description: 'Kahvaltı yanı lezzetler.', image: 'https://images.unsplash.com/photo-1483695028939-5bb13f86d780?auto=format&fit=crop&q=80' },
    { id: 'baslangic', title: 'Başlangıç & Paylaşımlıklar', slug: 'baslangic', description: 'İştah açan dokunuşlar.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'pizza-sandvic', title: 'Taş Fırın Pizza ve Sandviç', slug: 'pizza-sandvic', description: 'İnce hamur, bol lezzet.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80' },
    { id: 'peynir-tabagi', title: 'Peynir Tabağı', slug: 'peynir-tabagi', description: 'Şık ve keyifli eşlikçi.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80' },
    { id: 'tatli', title: 'Tatlı', slug: 'tatli', description: 'Mutluluğun son dokunuşu.', image: 'https://images.unsplash.com/photo-1563729768647-d638e415fb8c?auto=format&fit=crop&q=80' },
    { id: 'ana-yemek', title: 'Ana Yemek', slug: 'ana-yemek', description: 'Sofranın başrolü.', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'ara-sicaklar', title: 'Ara Sıcaklar', slug: 'ara-sicaklar', description: 'Lezzete sıcak bir ara.', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80' },
    { id: 'meze', title: 'Meze', slug: 'meze', description: 'Paylaşmanın en güzel hali.', image: 'https://images.unsplash.com/photo-1643444218059-e1e3b6801905?auto=format&fit=crop&q=80' },
    { id: 'soguk-icecek', title: 'Soğuk İçecekler', slug: 'soguk-icecek', description: 'Serin ve ferahlatıcı.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80' },
    { id: 'sicak-icecek', title: 'Sıcak İçecekler', slug: 'sicak-icecek', description: 'Isıtan keyif.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80' },
    { id: 'sarap', title: 'Şarap', slug: 'sarap', description: 'Şık bir yudum keyif.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'kokteyl', title: 'Kokteyl', slug: 'kokteyl', description: 'Yaratıcı karışımlar.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'bira', title: 'Bira', slug: 'bira', description: 'Ferahlatıcı seçenekler.', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'viski', title: 'Viski', slug: 'viski', description: 'Özenle seçilmiş damıtımlar.', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'raki', title: 'Rakı', slug: 'raki', description: 'Geleneksel lezzet.', image: 'https://images.unsplash.com/photo-1598155523122-38423cfabfab?auto=format&fit=crop&q=80' },
];

export const PRODUCTS: Product[] = [
    // KAHVALTI
    { id: 'k1', name: 'Gurme Serpme Kahvaltı', description: 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu.', price: 650, category: 'kahvalti', isAvailable: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80', notes: ['2 kişilik servis edilir', 'Taze sıkılmış portakal suyu dahildir', 'Glutensiz ekmek talep edilebilir'] },

    // EKSTRALAR
    { id: 'e1', name: '2 Adet Fransız Tereyağlı Kruvasan', description: 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
    { id: 'e2', name: 'Çikolata Kreması', description: 'Ünlü fındık ve kakao bazlı kremalı bir sürülebilir tatlı.', price: 80, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&q=80' },
    { id: 'e3', name: 'Dulce De Leche', description: 'Tatlı ve yoğun kremamsı bir sos, karamelize süt tadıyla öne çıkar.', price: 100, category: 'ekstralar', isAvailable: true, image: 'https://plus.unsplash.com/premium_photo-1675279435422-77291a13e551?auto=format&fit=crop&q=80' },
    { id: 'e4', name: 'Fesleğenli Domatesli Ciabatta', description: 'İtalya kökenli ciabatta ekmeği fesleğen ve domatesle aromalandırılarak sunulur. 4 Adet servis edilir.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?auto=format&fit=crop&q=80' },
    { id: 'e5', name: 'Kare Rustik Ekmek', description: 'Kare şeklinde hazırlanmış rustik ekmek. Geleneksel yöntemle mayalanıp fırında pişirilir.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088b7280?auto=format&fit=crop&q=80' },
    { id: 'e6', name: 'Mıhlama', description: 'Karadeniz mutfağının ünlü mısır unu ve peynirle hazırlanan sıcak yemeği.', price: 400, category: 'ekstralar', isAvailable: true, image: 'https://images.cookieandkate.com/images/2020/10/creamy-polenta-recipe-1.jpg' },
    { id: 'e7', name: 'Omlet (Sade/Peynirli)', description: 'Yumurta bazlı ve tercihe göre peynir eklenen kahvaltı klasiği.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80' },
    { id: 'e8', name: 'Patates Kızartması', description: 'Taze patates dilimleri kızartılarak hazırlanır, isteğe göre baharatlı veya sade.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80' },
    { id: 'e9', name: 'Pişi (Adet)', description: 'Kızarmış hamur olarak servis edilen lezzetli bir hamur işi.', price: 100, category: 'ekstralar', isAvailable: true, image: 'https://i.nefisyemektarifleri.com/2021/04/16/yag-cekmeyen-mayasiz-pisi-tarifi.jpg' },
    { id: 'e10', name: 'Sahanda Menemen', description: 'Domates, biber ve yumurta ile hazırlanan geleneksel bir Türk kahvaltı lezzeti.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1634509122392-1259e8e6047e?auto=format&fit=crop&q=80' },
    { id: 'e11', name: 'Sahanda Peynirli Yumurta', description: 'Yumurta ve peynirin tavada birleştiği lezzetli bir kahvaltı.', price: 250, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80' },
    { id: 'e12', name: 'Sahanda Sucuklu Yumurta', description: 'Sucuk dilimleri ve yumurta ile hazırlanan, tavada tereyağı ile pişirilerek servis edilen doyurucu bir kahvaltı yemeği.', price: 350, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80' },
    { id: 'e13', name: 'Sigara Böreği (4 Adet)', description: 'İnce yufkaya sarılan ve kızartılmış içi genellikle peynirli hafif bir atıştırmalık.', price: 300, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1616429402636-2f08514a37a8?auto=format&fit=crop&q=80' },

    // BAŞLANGIÇ & PAYLAŞIMLIKLAR
    { id: 'b1', name: 'Başlangıç Tabağı', description: 'Zeytin, zahter, zeytinyağı ve fesleğenli domatesli ciabatta ekmeği içeren lezzetli bir atıştırmalık tabağı.', price: 350, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'b2', name: 'Kızarmış Tavuk Ve Baharatlı Patates Kızartması', description: 'Tavuk parçaları kızartılıp baharatlanır ve yanında patates kızartması sunulur.', price: 500, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80' },
    { id: 'b3', name: 'Patates Kızartması', description: 'Taze patateslerden kızartılmış lezzetli bir garnitür. Baharatlı veya sade tercih edilebilir.', price: 300, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80' },
    { id: 'b4', name: 'Roka Salatası', description: 'Roka Beyaz Peynir Tarla Domates ve Ceviz üzeri Balsamik Glaze ile Servis Edilir.', price: 350, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80' },
    { id: 'b5', name: 'Rustik Ekmek Üstü Füme Somon', description: 'Füme somon parçaları, rustik ekmek üzerinde sunulur ve taze aromalarla zenginleştirilir.', price: 450, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80' },

    // TAŞ FIRIN PIZZA VE SANDVİÇ
    { id: 'p1', name: 'Gurme Rustik Sandviç', description: 'Taze pişirilen rustik baget, beyaz peynir, domates, roka, pesto sos ve zeytinyağı ile hazırlanır patates kızartması ile sıcak servis edilir.', price: 450, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80' },
    { id: 'p2', name: 'Taş Fırın Karışık Pizza', description: 'Taş fırında pişirilmiş, farklı malzemelerle zenginleştirilmiş roka, parmesan ve acılı zeytinyağı ile sunulan doyurucu bir karışık pizza.', price: 500, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80' },
    { id: 'p3', name: 'Taş Fırın Margarita Pizza', description: 'Taş fırında pişirilmiş, taze roka, parmesan peyniri ve acılı zeytinyağı ile sunulan geleneksel bir Margarita Pizza.', price: 500, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80' },

    // PEYNİR TABAĞI
    { id: 'pt1', name: 'Rakı Eşlikçisi Peynir Tabağı', description: 'Rakı ile uyum sağlayan çeşitli peynir türlerinden oluşan bir tabaktır.', price: 850, category: 'peynir-tabagi', isAvailable: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80' },
    { id: 'pt2', name: 'Türk Yerli Peynir Şarap Tabağı', description: 'Çeşitli yerli peynirlerin bir araya geldiği, şarapla uyumlu zengin bir tabağa sahiptir.', price: 1000, category: 'peynir-tabagi', isAvailable: true, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe4?auto=format&fit=crop&q=80' },

    // TATLI
    { id: 't1', name: '2\'Li Çikolatalı Mini Berliner', description: 'İki adet mini çikolatalı berliner tatlı hamur topudur.', price: 200, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1601614769062-859187399945?auto=format&fit=crop&q=80' },
    { id: 't2', name: 'Antakya Künefe', description: 'Geleneksel bir Türk tatlısı. İncecik tel kadayıf arasında eriyen peynir ve şerbetiyle sıcak servis edilir.', price: 350, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1594520771801-b552b96c8c4c?auto=format&fit=crop&q=80' },
    { id: 't3', name: 'Churros', description: 'Klasik İspanyol tatlısı olarak kızartılmış hamur çubukları. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', price: 400, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1624300626442-164a696de23a?auto=format&fit=crop&q=80' },
    { id: 't4', name: 'Fransız Tereyağlı Kruvasan (Sade)', description: 'Çıtır kruvasan, file bademlerle zenginleştirilmiştir. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', price: 300, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
    { id: 't5', name: 'Vanilyalı Dondurma (2 Top)', description: 'Klasik vanilya lezzetiyle iki top dondurma sunumu.', price: 200, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&q=80' },

    // ANA YEMEK
    { id: 'ay1', name: 'Izgara Pirzola', description: 'Izgarada pişirilen kemikli et dilimleri. Patates püresi tabanı ve kavrulmuş file badem ile servis edilir.', price: 1000, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80', notes: ['Şefin önerisi', 'Yanında mevsim sebzeleri ile servis edilir'] },
    { id: 'ay2', name: 'Konak Köfte', description: 'Geleneksel tarifle hazırlanan nefis köfteler. Patates püresi tabanı, kavrulmuş file badem ile tatlandırılır.', price: 800, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80' },
    { id: 'ay3', name: 'Konak Sac Kavurma', description: 'Sacda pişirilen lezzetli et parçaları. Patates püresi tabanı, kavrulmuş file badem ile servis edilir.', price: 850, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80' },
    { id: 'ay4', name: 'Lokum Bonfile', description: 'Yumuşacık bir biftek olarak patates püresi tabanı üzerinde sunulur. Kavrulmuş file badem ile lezzeti tamamlar.', price: 1200, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80', notes: ['En çok tercih edilen ana yemek', 'Pişirme derecesi seçilebilir'] },

    // ARA SICAKLAR
    { id: 'as1', name: 'İçli Köfte', description: 'Dış hamuru bulgurdan hazırlanan, içi kıymayla doldurulan geleneksel bir köfte çeşidi.', price: 200, category: 'ara-sicaklar', isAvailable: true, image: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2021/03/icli-kofte-tarifi-yeni.jpg' },
    { id: 'as2', name: 'Kaşarlı Mantar', description: 'Taze mantarlar üzerine kaşar peyniri serpilerek fırınlanır.', price: 300, category: 'ara-sicaklar', isAvailable: true, image: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?auto=format&fit=crop&q=80' },
    { id: 'as3', name: 'Paçanga Böreği', description: 'Pastırma ve peynirle doldurulmuş, ince yufkayla sarılı lezzetli bir börek türü.', price: 200, category: 'ara-sicaklar', isAvailable: true, image: 'https://cdn.yemek.com/mnresize/940/940/uploads/2016/06/pacanga-boregi-rece.jpg' },

    // MEZE
    { id: 'm1', name: 'Acılı Atom', description: 'Yoğurt ve acı biberle hazırlanan bir meze. Baharatlı tadıyla sofraya canlılık katar.', price: 250, category: 'meze', isAvailable: true, image: 'https://cdn.yemek.com/mnresize/1250/833/uploads/2021/10/ev-yapimi-atom-mezesi.jpg' },
    { id: 'm2', name: 'Avokadolu Kapya Biber', description: 'Avokado ve kapya biberin taze birleşimiyle sunulan bu meze, hafif ve renkli bir lezzet sunar.', price: 300, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm3', name: 'Başlangıç Tabağı', description: 'Zeytin, zeytinyağı ve zahter ile sunulan, rustik ekmek eşliğinde hafif bir başlangıç mezesi.', price: 350, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&q=80' },
    { id: 'm4', name: 'Deniz Börülcesi', description: 'Ege mutfağının sevilen mezelerinden, zeytinyağı ve limonla tatlandırılır.', price: 300, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm5', name: 'Fesleğenli Girit Ezme', description: 'Taze fesleğen ve peynir bazlı karışımla hazırlanan geleneksel bir Girit ezmesi.', price: 300, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm6', name: 'Haydari', description: 'Klasik Türk mezesi, süzme yoğurt ve taze otlar kullanılarak hazırlanır.', price: 250, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm7', name: 'Kuru Cacık', description: 'Yoğurt ve salatalık esaslı koyu kıvamlı bir meze.', price: 250, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm8', name: 'La Pena (Acılı)', description: 'Baharatlı ve acı sevenlere hitap eden özel bir meze.', price: 250, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm9', name: 'Tereyağlı Pastırmalı Antakya Humus', description: 'Ezilmiş nohut, tahin, zeytinyağı ve baharatlarla yapılan geleneksel bir meze. Üzerinde dilimlenmiş tereyağlı pastırma.', price: 400, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm10', name: 'Yoğurtlu Havuç Tarator', description: 'Rendelenmiş havuç ve yoğurtun lezzetli birleşimi.', price: 250, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm11', name: 'Yoğurtlu Patlıcan', description: 'Közlenmiş patlıcan ile yoğurdun uyumlu birleşimi.', price: 250, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm12', name: 'Zeytinyağlı & Domatesli Antakya Humus', description: 'Nohut ve tahin temelli klasik humusun domates ve zeytinyağıyla zenginleştirilmiş hali.', price: 250, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'm13', name: 'Zeytinyağlı Vişneli Yaprak Sarma', description: 'Asma yapraklarıyla sarılmış pirinç içini vişnenin ekşi tadıyla buluşturan bir meze.', price: 300, category: 'meze', isAvailable: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },

    // SOĞUK İÇECEKLER
    { id: 'si1', name: 'Fanta', description: 'Gazlı ve meyveli aromalı bir soğuk içecek.', price: 150, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80' },
    { id: 'si2', name: 'Ice Americano', description: 'Buzla soğutulmuş espresso bazlı kahve.', price: 160, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1517701604599-bb602c3ae94f?auto=format&fit=crop&q=80' },
    { id: 'si3', name: 'Ice Latte', description: 'Buzlu ve sütlü espresso karışımı.', price: 180, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80' },
    { id: 'si4', name: 'Ice Tea', description: 'Serinletici, buzlu çay bazlı içecek.', price: 150, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80' },
    { id: 'si5', name: 'Kola', description: 'Gazlı ve şekerli bir soğuk içecek.', price: 150, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80' },
    { id: 'si6', name: 'Niğde Gazozu', description: 'Geleneksel, meyve aromalı gazoz.', price: 100, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80' },
    { id: 'si7', name: 'Soda', description: 'Ferahlatıcı, gazlı bir madensuy.', price: 100, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80' },
    { id: 'si8', name: 'Taze Sıkılmış Portakal Suyu', description: 'Taze portakalların sıkılmasıyla elde edilen doğal bir meyve suyu.', price: 250, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80' },

    // SICAK İÇECEKLER
    { id: 'sc1', name: 'Americano', description: 'Espresso ve sıcak suyun birleşiminden oluşan sade kahve.', price: 150, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },
    { id: 'sc2', name: 'Bitki Çayları', description: 'Bitkisel karışımlardan oluşan sıcak çay.', price: 150, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80' },
    { id: 'sc3', name: 'Çay', description: 'Kırmızıya çalan rengi ve buharıyla her yudumda huzur veren bir keyif.', price: 40, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80' },
    { id: 'sc4', name: 'Espresso', description: 'Yoğun ve sert kahve çeşidi.', price: 120, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80' },
    { id: 'sc5', name: 'Filtre Kahve', description: 'Klasik yöntemle demlenen kahve.', price: 150, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80' },
    { id: 'sc6', name: 'Nescafe', description: 'Hazır kahve granüllerinden sıcak su ile hazırlanan pratik kahve.', price: 150, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },
    { id: 'sc7', name: 'Türk Kahvesi', description: 'Eşsiz telvesi, köpüğü ve kadifemsi lezzetiyle bir ritüeldir.', price: 100, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80' },

    // ŞARAP
    { id: 'sr1', name: 'Kırmızı Phokaia Karasi', description: 'Bu aromatik kırmızı şarap üzümün zengin tatlarını sunar.', price: 1600, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'sr2', name: 'Öküzgözü 1970 (70 Cl)', description: 'Büyük şişede sunulan bu Öküzgözü, uzun yıllandırma sonucu kompleksleşmiş bir tat profili sunar.', price: 1600, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80' },
    { id: 'sr3', name: 'Öküzgözü 1970 (Kadeh)', description: 'Şık bir kadeh olarak sunulan bu kırmızı şarap, Öküzgözü üzümünün yoğun gövdesini yansıtır.', price: 400, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'sr4', name: 'Phokaia Blend', description: 'Farklı üzüm çeşitlerinin özenle harmanlandığı bu kırmızı şarap, meyvemsi ve baharatlı notalara sahiptir.', price: 1600, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80' },
    { id: 'sr5', name: 'Phokaia Chardonnay (Beyaz)', description: 'Bu beyaz şarap, Chardonnay üzümünün yumuşak ve meyvemsi karakterini taşır.', price: 1600, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&q=80' },
    { id: 'sr6', name: 'Phokaia Foca Karasi-Merlot', description: 'Bu kırmızı şarap Merlot ve Foca karası üzümlerinin harmanını yansıtır.', price: 1600, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe4?auto=format&fit=crop&q=80' },

    // KOKTEYL
    { id: 'ck1', name: 'Kuzu Kulağı', description: 'Bu tazeleyici kokteyl, ekşimsi notalara sahip bitkisel tatlar içerir.', price: 500, category: 'kokteyl', isAvailable: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'ck2', name: 'Wild Berry', description: 'Meyveli bir kokteyl, tatlı ve hafif ekşi meyve özlerini bir araya getirir.', price: 500, category: 'kokteyl', isAvailable: true, image: 'https://images.unsplash.com/photo-1536935338788-843bb6303475?auto=format&fit=crop&q=80' },

    // BİRA
    { id: 'br1', name: 'Blanc', description: 'Bu ferahlatıcı bira narenciye ve hafif baharat notalarına sahiptir.', price: 250, category: 'bira', isAvailable: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'br2', name: 'Carlsberg', description: 'Bu klasik bira hafif içimli ve tatmin edici bir malt tadına sahiptir.', price: 200, category: 'bira', isAvailable: true, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80' },
    { id: 'br3', name: 'Tuborg Gold', description: 'Orta gövdeli ve hafif tatlımsı bir lezzete sahip olan bu bira.', price: 200, category: 'bira', isAvailable: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },

    // VİSKİ
    { id: 'v1', name: 'Chivas Regal (35 Cl)', description: 'Orta boy şişede sunulan bu harman viski, meşe fıçılarında yıllandırılarak yumuşak bir tadım elde eder.', price: 2300, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v2', name: 'Chivas Regal (70 Cl)', description: 'Büyük şişede sunulan Chivas Regal, klasik İskoç harman viskilerinden biridir.', price: 3400, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v3', name: 'Chivas Regal (Duble)', description: 'Duble servis edilen bu İskoç viski, zengin tahıl ve meyve tonlarıyla katmanlı bir lezzet sunar.', price: 900, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v4', name: 'Chivas Regal (Tek)', description: 'Bu İskoç harman viskisi, yumuşak içimiyle tanınır.', price: 500, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v5', name: 'Jack Daniels (35 Cl)', description: 'Orta boy şişede sunulan bu Tennessee viski, hafif tatlımsı karakteriyle tanınır.', price: 2000, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v6', name: 'Jack Daniels (70 Cl)', description: 'Büyük şişe formatında sunulan Jack Daniels, meşe fıçılarında yıllandırılan klasik bir Amerikan viskidir.', price: 3000, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v7', name: 'Jack Daniels (Duble)', description: 'Duble servis edilen bu Tennessee viski, odun kömüründe filtrelenen yumuşak tadıyla bilinir.', price: 800, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v8', name: 'Jack Daniels (Tek)', description: 'Bu klasik Amerikan viski, Tennessee bölgesine özgü kömür filtrasyonundan geçer.', price: 450, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v9', name: 'Woodford Reserve (70 Cl)', description: 'Büyük şişede sunulan bu özel burbon, özenli üretim süreci sayesinde yumuşak ve yoğun bir karakter kazanır.', price: 5000, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v10', name: 'Woodford Reserve (Duble)', description: 'Duble servis edilen bu burbon, meşe fıçılarında yıllandırılmasının getirdiği kompleks tat profiline sahiptir.', price: 1200, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },
    { id: 'v11', name: 'Woodford Reserve (Tek)', description: 'Bu Amerikan burbonu karamel, vanilya ve hafif meşe tonlarına sahip özel bir harmandır.', price: 800, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80' },

    // RAKI (Görseli eksik kalmasın)
    { id: 'r1', name: 'Yeni Rakı (35 Cl)', description: 'Klasik Türk rakısı.', price: 900, category: 'raki', isAvailable: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'r2', name: 'Yeni Rakı (70 Cl)', description: 'Klasik Türk rakısı, 70lik.', price: 1700, category: 'raki', isAvailable: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
];

/**
 * Product pairing recommendations (cross-sell).
 * Maps product ID to recommended product IDs with "why" reasons (TR/EN).
 */
export interface ProductPairingRec {
    productId: string;
    reason_tr: string;
    reason_en: string;
}

export const PRODUCT_PAIRINGS: Record<string, ProductPairingRec[]> = {
    // Gurme Serpme Kahvaltı
    'k1': [
        { productId: 'sc7', reason_tr: 'Türk kahvesi, serpme kahvaltının geleneksel tamamlayıcısıdır.', reason_en: 'Turkish coffee is the traditional complement to a full breakfast.' },
        { productId: 'si8', reason_tr: 'Taze portakal suyu, kahvaltının ferahlatıcı başlangıcıdır.', reason_en: 'Fresh orange juice is a refreshing start to breakfast.' },
    ],
    // Izgara Pirzola
    'ay1': [
        { productId: 'sr4', reason_tr: 'Tanenleri ızgara etin yağlı dokusunu dengeler, meyvemsi notaları baharatlı ızgaraya eşlik eder.', reason_en: 'Tannins balance the rich texture of grilled meat, fruity notes complement the spiced char.' },
        { productId: 'b4', reason_tr: 'Biberli roka ve ceviz, taze asidiyle etin ağırlığını güzel dengeler.', reason_en: 'Peppery arugula and walnut, with fresh acidity, beautifully balance the richness of the meat.' },
    ],
    // Konak Köfte
    'ay2': [
        { productId: 'sr1', reason_tr: 'Karasi üzümünün yoğun taneni, köftenin baharat yoğunluğuyla uyum sağlar.', reason_en: 'The intense tannins of Karasi grape harmonize with the spice intensity of the meatballs.' },
        { productId: 'm6', reason_tr: 'Haydari\'nin serin yoğurt tadı, köftenin ağır lezzetini hafifletir.', reason_en: 'The cool yogurt flavor of Haydari lightens the rich taste of meatballs.' },
    ],
    // Konak Sac Kavurma
    'ay3': [
        { productId: 'sr2', reason_tr: 'Öküzgözü, sacda pişen etin derin aromalarıyla mükemmel bir ikili oluşturur.', reason_en: 'Öküzgözü pairs perfectly with the deep aromas of sautéed meat.' },
        { productId: 'm1', reason_tr: 'Atom mezesinin acı biberi, sac kavurmanın yoğun etli lezzetini canlandırır.', reason_en: 'Atom\'s chili pepper enlivens the intense meaty flavor of the sautéed dish.' },
    ],
    // Lokum Bonfile
    'ay4': [
        { productId: 'sr4', reason_tr: 'Phokaia Blend\'in meyvemsi notaları, bonfilenin tereyağımsı yumuşaklığıyla uyum sağlar.', reason_en: 'Phokaia Blend\'s fruity notes pair perfectly with the buttery tenderness of the fillet.' },
        { productId: 'as2', reason_tr: 'Kaşarlı mantarın kremalı dokusu, bonfileye zengin bir yan lezzet katar.', reason_en: 'The creamy texture of cheesy mushrooms adds a rich side flavor to the fillet.' },
    ],
    // Taş Fırın Karışık Pizza
    'p2': [
        { productId: 'br1', reason_tr: 'Blanc biranın narenciye notaları, pizzanın zengin peynir lezzetini tazelir.', reason_en: 'Blanc beer\'s citrus notes refresh the rich cheese flavors of pizza.' },
        { productId: 'b4', reason_tr: 'Roka salatasının hafifliği, pizzanın yoğunluğunu dengeler.', reason_en: 'The lightness of arugula salad balances the richness of pizza.' },
    ],
    // Taş Fırın Margarita Pizza
    'p3': [
        { productId: 'sr5', reason_tr: 'Chardonnay\'ın meyvemsi tonu, margaritanın domates ve fesleğen tazeliğiyle örtüşür.', reason_en: 'Chardonnay\'s fruity tone matches the tomato and basil freshness of margherita.' },
        { productId: 'br2', reason_tr: 'Carlsberg\'ın hafif malt tadı, margarita pizzayla mükemmel uyum sağlar.', reason_en: 'Carlsberg\'s light malt flavor pairs perfectly with margherita pizza.' },
    ],
    // Gurme Rustik Sandviç
    'p1': [
        { productId: 'si2', reason_tr: 'Ice Americano\'nun keskin kahve aroması, sandviçin zengin pesto ve peynir lezzetiyle dengelenir.', reason_en: 'Ice Americano\'s sharp coffee aroma balances the rich pesto and cheese of the sandwich.' },
        { productId: 'b3', reason_tr: 'Patates kızartması, sandviçin klasik yol arkadaşıdır.', reason_en: 'French fries are the classic companion to a sandwich.' },
    ],
    // Rakı Eşlikçisi Peynir Tabağı
    'pt1': [
        { productId: 'r1', reason_tr: 'Peynir tabağı, rakının geleneksel sofra arkadaşıdır. Anason ve peynir uyumu eşsizdir.', reason_en: 'The cheese platter is rakı\'s traditional table companion. Anise and cheese pairing is unmatched.' },
        { productId: 'm13', reason_tr: 'Vişneli yaprak sarmanın ekşi tatlı dengesi, peynir tabağına rafine bir lezzet katar.', reason_en: 'The sweet-sour balance of cherry stuffed vine leaves adds a refined flavor to the cheese platter.' },
    ],
    // Türk Yerli Peynir Şarap Tabağı
    'pt2': [
        { productId: 'sr6', reason_tr: 'Foça Karası-Merlot harmanı, yerli peynirlerin farklı tatlarını kucaklar.', reason_en: 'The Foça Karası-Merlot blend embraces the diverse flavors of local cheeses.' },
        { productId: 'm5', reason_tr: 'Girit ezmesinin fesleğen aroması, peynir çeşitliliğine taze bir boyut ekler.', reason_en: 'The basil aroma of Cretan spread adds a fresh dimension to cheese variety.' },
    ],
    // Antakya Künefe
    't2': [
        { productId: 'sc7', reason_tr: 'Türk kahvesinin acı telvesi, künefenin yoğun şerbetli tatlılığını dengeler.', reason_en: 'Turkish coffee\'s bitter grounds balance the intense syrupy sweetness of künefe.' },
        { productId: 't5', reason_tr: 'Vanilyalı dondurma, sıcak künefenin üzerinde eriyerek müthiş bir kontrast yaratır.', reason_en: 'Vanilla ice cream melts on hot künefe creating an incredible contrast.' },
    ],
    // Churros
    't3': [
        { productId: 'sc4', reason_tr: 'Espresso\'nun yoğun aroması, churrosun çıtır tatlılığıyla mükemmel bir ikili oluşturur.', reason_en: 'Espresso\'s intense aroma creates a perfect duo with the crispy sweetness of churros.' },
        { productId: 'si3', reason_tr: 'Ice Latte\'nin sütlü serinliği, churrosla tatlı bir uyum yaratır.', reason_en: 'Ice Latte\'s milky coolness creates a sweet harmony with churros.' },
    ],
    // Füme Somon
    'b5': [
        { productId: 'sr5', reason_tr: 'Chardonnay\'ın tereyağımsı dokusu, füme somonun tütsülenmiş aromasıyla mükemmel eşleşir.', reason_en: 'Chardonnay\'s buttery texture pairs perfectly with smoked salmon\'s cured aroma.' },
        { productId: 'si8', reason_tr: 'Portakal suyunun asidik tazeliği, somonun yağlı dokusunu keser.', reason_en: 'Orange juice\'s acidic freshness cuts through salmon\'s oily texture.' },
    ],
};
