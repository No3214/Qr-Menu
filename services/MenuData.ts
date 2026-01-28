export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    image?: string;
}

export interface Category {
    id: string;
    title: string;
    slug: string;
    description?: string;
}

export const CATEGORIES: Category[] = [
    { id: 'kahvalti', title: 'Kahvaltı', slug: 'kahvalti', description: 'Güne lezzetli bir başlangıç.' },
    { id: 'ekstralar', title: 'Ekstralar', slug: 'ekstralar', description: 'Kahvaltı yanı lezzetler.' },
    { id: 'baslangic', title: 'Başlangıç & Paylaşımlıklar', slug: 'baslangic', description: 'İştah açan dokunuşlar.' },
    { id: 'pizza-sandvic', title: 'Taş Fırın Pizza ve Sandviç', slug: 'pizza-sandvic', description: 'İnce hamur, bol lezzet.' },
    { id: 'peynir-tabagi', title: 'Peynir Tabağı', slug: 'peynir-tabagi', description: 'Şık ve keyifli eşlikçi.' },
    { id: 'tatli', title: 'Tatlı', slug: 'tatli', description: 'Mutluluğun son dokunuşu.' },
    { id: 'ana-yemek', title: 'Ana Yemek', slug: 'ana-yemek', description: 'Sofranın başrolü.' },
    { id: 'ara-sicaklar', title: 'Ara Sıcaklar', slug: 'ara-sicaklar', description: 'Lezzete sıcak bir ara.' },
    { id: 'meze', title: 'Meze', slug: 'meze', description: 'Paylaşmanın en güzel hali.' },
    { id: 'soguk-icecek', title: 'Soğuk İçecekler', slug: 'soguk-icecek', description: 'Serin ve ferahlatıcı.' },
    { id: 'sicak-icecek', title: 'Sıcak İçecekler', slug: 'sicak-icecek', description: 'Isıtan keyif.' },
    { id: 'sarap', title: 'Şarap', slug: 'sarap', description: 'Şık bir yudum keyif.' },
    { id: 'kokteyl', title: 'Kokteyl', slug: 'kokteyl', description: 'Yaratıcı karışımlar.' },
    { id: 'bira', title: 'Bira', slug: 'bira', description: 'Ferahlatıcı seçenekler.' },
    { id: 'viski', title: 'Viski', slug: 'viski', description: 'Özenle seçilmiş damıtımlar.' },
    { id: 'raki', title: 'Rakı', slug: 'raki', description: 'Geleneksel lezzet.' },
];

export const PRODUCTS: Product[] = [
    // KAHVALTI
    { id: 'k1', name: 'Gurme Serpme Kahvaltı', description: 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu.', price: 650, category: 'kahvalti', isAvailable: true },

    // EKSTRALAR
    { id: 'e1', name: '2 Adet Fransız Tereyağlı Kruvasan', description: 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan.', price: 300, category: 'ekstralar', isAvailable: true },
    { id: 'e2', name: 'Çikolata Kreması', description: 'Ünlü fındık ve kakao bazlı kremalı bir sürülebilir tatlı.', price: 80, category: 'ekstralar', isAvailable: true },
    { id: 'e3', name: 'Dulce De Leche', description: 'Tatlı ve yoğun kremamsı bir sos, karamelize süt tadıyla öne çıkar.', price: 100, category: 'ekstralar', isAvailable: true },
    { id: 'e4', name: 'Fesleğenli Domatesli Ciabatta', description: 'İtalya kökenli ciabatta ekmeği fesleğen ve domatesle aromalandırılarak sunulur. 4 Adet servis edilir.', price: 300, category: 'ekstralar', isAvailable: true },
    { id: 'e5', name: 'Kare Rustik Ekmek', description: 'Kare şeklinde hazırlanmış rustik ekmek. Geleneksel yöntemle mayalanıp fırında pişirilir.', price: 300, category: 'ekstralar', isAvailable: true },
    { id: 'e6', name: 'Mıhlama', description: 'Karadeniz mutfağının ünlü mısır unu ve peynirle hazırlanan sıcak yemeği.', price: 400, category: 'ekstralar', isAvailable: true },
    { id: 'e7', name: 'Omlet (Sade/Peynirli)', description: 'Yumurta bazlı ve tercihe göre peynir eklenen kahvaltı klasiği.', price: 300, category: 'ekstralar', isAvailable: true },
    { id: 'e8', name: 'Patates Kızartması', description: 'Taze patates dilimleri kızartılarak hazırlanır, isteğe göre baharatlı veya sade.', price: 300, category: 'ekstralar', isAvailable: true },
    { id: 'e9', name: 'Pişi (Adet)', description: 'Kızarmış hamur olarak servis edilen lezzetli bir hamur işi.', price: 100, category: 'ekstralar', isAvailable: true },
    { id: 'e10', name: 'Sahanda Menemen', description: 'Domates, biber ve yumurta ile hazırlanan geleneksel bir Türk kahvaltı lezzeti.', price: 300, category: 'ekstralar', isAvailable: true },
    { id: 'e11', name: 'Sahanda Peynirli Yumurta', description: 'Yumurta ve peynirin tavada birleştiği lezzetli bir kahvaltı.', price: 250, category: 'ekstralar', isAvailable: true },
    { id: 'e12', name: 'Sahanda Sucuklu Yumurta', description: 'Sucuk dilimleri ve yumurta ile hazırlanan, tavada tereyağı ile pişirilerek servis edilen doyurucu bir kahvaltı yemeği.', price: 350, category: 'ekstralar', isAvailable: true },
    { id: 'e13', name: 'Sigara Böreği (4 Adet)', description: 'İnce yufkaya sarılan ve kızartılmış içi genellikle peynirli hafif bir atıştırmalık.', price: 300, category: 'ekstralar', isAvailable: true },

    // BAŞLANGIÇ & PAYLAŞIMLIKLAR
    { id: 'b1', name: 'Başlangıç Tabağı', description: 'Zeytin, zahter, zeytinyağı ve fesleğenli domatesli ciabatta ekmeği içeren lezzetli bir atıştırmalık tabağı.', price: 350, category: 'baslangic', isAvailable: true },
    { id: 'b2', name: 'Kızarmış Tavuk Ve Baharatlı Patates Kızartması', description: 'Tavuk parçaları kızartılıp baharatlanır ve yanında patates kızartması sunulur.', price: 500, category: 'baslangic', isAvailable: true },
    { id: 'b3', name: 'Patates Kızartması', description: 'Taze patateslerden kızartılmış lezzetli bir garnitür. Baharatlı veya sade tercih edilebilir.', price: 300, category: 'baslangic', isAvailable: true },
    { id: 'b4', name: 'Roka Salatası', description: 'Roka Beyaz Peynir Tarla Domates ve Ceviz üzeri Balsamik Glaze ile Servis Edilir.', price: 350, category: 'baslangic', isAvailable: true },
    { id: 'b5', name: 'Rustik Ekmek Üstü Füme Somon', description: 'Füme somon parçaları, rustik ekmek üzerinde sunulur ve taze aromalarla zenginleştirilir.', price: 450, category: 'baslangic', isAvailable: true },

    // TAŞ FIRIN PIZZA VE SANDVİÇ
    { id: 'p1', name: 'Gurme Rustik Sandviç', description: 'Taze pişirilen rustik baget, beyaz peynir, domates, roka, pesto sos ve zeytinyağı ile hazırlanır patates kızartması ile sıcak servis edilir.', price: 450, category: 'pizza-sandvic', isAvailable: true },
    { id: 'p2', name: 'Taş Fırın Karışık Pizza', description: 'Taş fırında pişirilmiş, farklı malzemelerle zenginleştirilmiş roka, parmesan ve acılı zeytinyağı ile sunulan doyurucu bir karışık pizza.', price: 500, category: 'pizza-sandvic', isAvailable: true },
    { id: 'p3', name: 'Taş Fırın Margarita Pizza', description: 'Taş fırında pişirilmiş, taze roka, parmesan peyniri ve acılı zeytinyağı ile sunulan geleneksel bir Margarita Pizza.', price: 500, category: 'pizza-sandvic', isAvailable: true },

    // PEYNİR TABAĞI
    { id: 'pt1', name: 'Rakı Eşlikçisi Peynir Tabağı', description: 'Rakı ile uyum sağlayan çeşitli peynir türlerinden oluşan bir tabaktır.', price: 850, category: 'peynir-tabagi', isAvailable: true },
    { id: 'pt2', name: 'Türk Yerli Peynir Şarap Tabağı', description: 'Çeşitli yerli peynirlerin bir araya geldiği, şarapla uyumlu zengin bir tabağa sahiptir.', price: 1000, category: 'peynir-tabagi', isAvailable: true },

    // TATLI
    { id: 't1', name: '2\'Li Çikolatalı Mini Berliner', description: 'İki adet mini çikolatalı berliner tatlı hamur topudur.', price: 200, category: 'tatli', isAvailable: true },
    { id: 't2', name: 'Antakya Künefe', description: 'Geleneksel bir Türk tatlısı. İncecik tel kadayıf arasında eriyen peynir ve şerbetiyle sıcak servis edilir.', price: 350, category: 'tatli', isAvailable: true },
    { id: 't3', name: 'Churros', description: 'Klasik İspanyol tatlısı olarak kızartılmış hamur çubukları. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', price: 400, category: 'tatli', isAvailable: true },
    { id: 't4', name: 'Fransız Tereyağlı Kruvasan (Sade)', description: 'Çıtır kruvasan, file bademlerle zenginleştirilmiştir. Çilek Reçeli, Vişne Reçeli veya Nutella ile servis edilir.', price: 300, category: 'tatli', isAvailable: true },
    { id: 't5', name: 'Vanilyalı Dondurma (2 Top)', description: 'Klasik vanilya lezzetiyle iki top dondurma sunumu.', price: 200, category: 'tatli', isAvailable: true },

    // ANA YEMEK
    { id: 'ay1', name: 'Izgara Pirzola', description: 'Izgarada pişirilen kemikli et dilimleri. Patates püresi tabanı ve kavrulmuş file badem ile servis edilir.', price: 1000, category: 'ana-yemek', isAvailable: true },
    { id: 'ay2', name: 'Konak Köfte', description: 'Geleneksel tarifle hazırlanan nefis köfteler. Patates püresi tabanı, kavrulmuş file badem ile tatlandırılır.', price: 800, category: 'ana-yemek', isAvailable: true },
    { id: 'ay3', name: 'Konak Sac Kavurma', description: 'Sacda pişirilen lezzetli et parçaları. Patates püresi tabanı, kavrulmuş file badem ile servis edilir.', price: 850, category: 'ana-yemek', isAvailable: true },
    { id: 'ay4', name: 'Lokum Bonfile', description: 'Yumuşacık bir biftek olarak patates püresi tabanı üzerinde sunulur. Kavrulmuş file badem ile lezzeti tamamlar.', price: 1200, category: 'ana-yemek', isAvailable: true },

    // ARA SICAKLAR
    { id: 'as1', name: 'İçli Köfte', description: 'Dış hamuru bulgurdan hazırlanan, içi kıymayla doldurulan geleneksel bir köfte çeşidi.', price: 200, category: 'ara-sicaklar', isAvailable: true },
    { id: 'as2', name: 'Kaşarlı Mantar', description: 'Taze mantarlar üzerine kaşar peyniri serpilerek fırınlanır.', price: 300, category: 'ara-sicaklar', isAvailable: true },
    { id: 'as3', name: 'Paçanga Böreği', description: 'Pastırma ve peynirle doldurulmuş, ince yufkayla sarılı lezzetli bir börek türü.', price: 200, category: 'ara-sicaklar', isAvailable: true },

    // MEZE
    { id: 'm1', name: 'Acılı Atom', description: 'Yoğurt ve acı biberle hazırlanan bir meze. Baharatlı tadıyla sofraya canlılık katar.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm2', name: 'Avokadolu Kapya Biber', description: 'Avokado ve kapya biberin taze birleşimiyle sunulan bu meze, hafif ve renkli bir lezzet sunar.', price: 300, category: 'meze', isAvailable: true },
    { id: 'm3', name: 'Başlangıç Tabağı', description: 'Zeytin, zeytinyağı ve zahter ile sunulan, rustik ekmek eşliğinde hafif bir başlangıç mezesi.', price: 350, category: 'meze', isAvailable: true },
    { id: 'm4', name: 'Deniz Börülcesi', description: 'Ege mutfağının sevilen mezelerinden, zeytinyağı ve limonla tatlandırılır.', price: 300, category: 'meze', isAvailable: true },
    { id: 'm5', name: 'Fesleğenli Girit Ezme', description: 'Taze fesleğen ve peynir bazlı karışımla hazırlanan geleneksel bir Girit ezmesi.', price: 300, category: 'meze', isAvailable: true },
    { id: 'm6', name: 'Haydari', description: 'Klasik Türk mezesi, süzme yoğurt ve taze otlar kullanılarak hazırlanır.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm7', name: 'Kuru Cacık', description: 'Yoğurt ve salatalık esaslı koyu kıvamlı bir meze.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm8', name: 'La Pena (Acılı)', description: 'Baharatlı ve acı sevenlere hitap eden özel bir meze.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm9', name: 'Tereyağlı Pastırmalı Antakya Humus', description: 'Ezilmiş nohut, tahin, zeytinyağı ve baharatlarla yapılan geleneksel bir meze. Üzerinde dilimlenmiş tereyağlı pastırma.', price: 400, category: 'meze', isAvailable: true },
    { id: 'm10', name: 'Yoğurtlu Havuç Tarator', description: 'Rendelenmiş havuç ve yoğurtun lezzetli birleşimi.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm11', name: 'Yoğurtlu Patlıcan', description: 'Közlenmiş patlıcan ile yoğurdun uyumlu birleşimi.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm12', name: 'Zeytinyağlı & Domatesli Antakya Humus', description: 'Nohut ve tahin temelli klasik humusun domates ve zeytinyağıyla zenginleştirilmiş hali.', price: 250, category: 'meze', isAvailable: true },
    { id: 'm13', name: 'Zeytinyağlı Vişneli Yaprak Sarma', description: 'Asma yapraklarıyla sarılmış pirinç içini vişnenin ekşi tadıyla buluşturan bir meze.', price: 300, category: 'meze', isAvailable: true },

    // SOĞUK İÇECEKLER
    { id: 'si1', name: 'Fanta', description: 'Gazlı ve meyveli aromalı bir soğuk içecek.', price: 150, category: 'soguk-icecek', isAvailable: true },
    { id: 'si2', name: 'Ice Americano', description: 'Buzla soğutulmuş espresso bazlı kahve.', price: 160, category: 'soguk-icecek', isAvailable: true },
    { id: 'si3', name: 'Ice Latte', description: 'Buzlu ve sütlü espresso karışımı.', price: 180, category: 'soguk-icecek', isAvailable: true },
    { id: 'si4', name: 'Ice Tea', description: 'Serinletici, buzlu çay bazlı içecek.', price: 150, category: 'soguk-icecek', isAvailable: true },
    { id: 'si5', name: 'Kola', description: 'Gazlı ve şekerli bir soğuk içecek.', price: 150, category: 'soguk-icecek', isAvailable: true },
    { id: 'si6', name: 'Niğde Gazozu', description: 'Geleneksel, meyve aromalı gazoz.', price: 100, category: 'soguk-icecek', isAvailable: true },
    { id: 'si7', name: 'Soda', description: 'Ferahlatıcı, gazlı bir madensuy.', price: 100, category: 'soguk-icecek', isAvailable: true },
    { id: 'si8', name: 'Taze Sıkılmış Portakal Suyu', description: 'Taze portakalların sıkılmasıyla elde edilen doğal bir meyve suyu.', price: 250, category: 'soguk-icecek', isAvailable: true },

    // SICAK İÇECEKLER
    { id: 'sc1', name: 'Americano', description: 'Espresso ve sıcak suyun birleşiminden oluşan sade kahve.', price: 150, category: 'sicak-icecek', isAvailable: true },
    { id: 'sc2', name: 'Bitki Çayları', description: 'Bitkisel karışımlardan oluşan sıcak çay.', price: 150, category: 'sicak-icecek', isAvailable: true },
    { id: 'sc3', name: 'Çay', description: 'Kırmızıya çalan rengi ve buharıyla her yudumda huzur veren bir keyif.', price: 40, category: 'sicak-icecek', isAvailable: true },
    { id: 'sc4', name: 'Espresso', description: 'Yoğun ve sert kahve çeşidi.', price: 120, category: 'sicak-icecek', isAvailable: true },
    { id: 'sc5', name: 'Filtre Kahve', description: 'Klasik yöntemle demlenen kahve.', price: 150, category: 'sicak-icecek', isAvailable: true },
    { id: 'sc6', name: 'Nescafe', description: 'Hazır kahve granüllerinden sıcak su ile hazırlanan pratik kahve.', price: 150, category: 'sicak-icecek', isAvailable: true },
    { id: 'sc7', name: 'Türk Kahvesi', description: 'Eşsiz telvesi, köpüğü ve kadifemsi lezzetiyle bir ritüeldir.', price: 100, category: 'sicak-icecek', isAvailable: true },

    // ŞARAP
    { id: 'sr1', name: 'Kırmızı Phokaia Karasi', description: 'Bu aromatik kırmızı şarap üzümün zengin tatlarını sunar.', price: 1600, category: 'sarap', isAvailable: true },
    { id: 'sr2', name: 'Öküzgözü 1970 (70 Cl)', description: 'Büyük şişede sunulan bu Öküzgözü, uzun yıllandırma sonucu kompleksleşmiş bir tat profili sunar.', price: 1600, category: 'sarap', isAvailable: true },
    { id: 'sr3', name: 'Öküzgözü 1970 (Kadeh)', description: 'Şık bir kadeh olarak sunulan bu kırmızı şarap, Öküzgözü üzümünün yoğun gövdesini yansıtır.', price: 400, category: 'sarap', isAvailable: true },
    { id: 'sr4', name: 'Phokaia Blend', description: 'Farklı üzüm çeşitlerinin özenle harmanlandığı bu kırmızı şarap, meyvemsi ve baharatlı notalara sahiptir.', price: 1600, category: 'sarap', isAvailable: true },
    { id: 'sr5', name: 'Phokaia Chardonnay (Beyaz)', description: 'Bu beyaz şarap, Chardonnay üzümünün yumuşak ve meyvemsi karakterini taşır.', price: 1600, category: 'sarap', isAvailable: true },
    { id: 'sr6', name: 'Phokaia Foca Karasi-Merlot', description: 'Bu kırmızı şarap Merlot ve Foca karası üzümlerinin harmanını yansıtır.', price: 1600, category: 'sarap', isAvailable: true },

    // KOKTEYL
    { id: 'ck1', name: 'Kuzu Kulağı', description: 'Bu tazeleyici kokteyl, ekşimsi notalara sahip bitkisel tatlar içerir.', price: 500, category: 'kokteyl', isAvailable: true },
    { id: 'ck2', name: 'Wild Berry', description: 'Meyveli bir kokteyl, tatlı ve hafif ekşi meyve özlerini bir araya getirir.', price: 500, category: 'kokteyl', isAvailable: true },

    // BİRA
    { id: 'br1', name: 'Blanc', description: 'Bu ferahlatıcı bira narenciye ve hafif baharat notalarına sahiptir.', price: 250, category: 'bira', isAvailable: true },
    { id: 'br2', name: 'Carlsberg', description: 'Bu klasik bira hafif içimli ve tatmin edici bir malt tadına sahiptir.', price: 200, category: 'bira', isAvailable: true },
    { id: 'br3', name: 'Tuborg Gold', description: 'Orta gövdeli ve hafif tatlımsı bir lezzete sahip olan bu bira.', price: 200, category: 'bira', isAvailable: true },

    // VİSKİ
    { id: 'v1', name: 'Chivas Regal (35 Cl)', description: 'Orta boy şişede sunulan bu harman viski, meşe fıçılarında yıllandırılarak yumuşak bir tadım elde eder.', price: 2300, category: 'viski', isAvailable: true },
    { id: 'v2', name: 'Chivas Regal (70 Cl)', description: 'Büyük şişede sunulan Chivas Regal, klasik İskoç harman viskilerinden biridir.', price: 3400, category: 'viski', isAvailable: true },
    { id: 'v3', name: 'Chivas Regal (Duble)', description: 'Duble servis edilen bu İskoç viski, zengin tahıl ve meyve tonlarıyla katmanlı bir lezzet sunar.', price: 900, category: 'viski', isAvailable: true },
    { id: 'v4', name: 'Chivas Regal (Tek)', description: 'Bu İskoç harman viskisi, yumuşak içimiyle tanınır.', price: 500, category: 'viski', isAvailable: true },
    { id: 'v5', name: 'Jack Daniels (35 Cl)', description: 'Orta boy şişede sunulan bu Tennessee viski, hafif tatlımsı karakteriyle tanınır.', price: 2000, category: 'viski', isAvailable: true },
    { id: 'v6', name: 'Jack Daniels (70 Cl)', description: 'Büyük şişe formatında sunulan Jack Daniels, meşe fıçılarında yıllandırılan klasik bir Amerikan viskidir.', price: 3000, category: 'viski', isAvailable: true },
    { id: 'v7', name: 'Jack Daniels (Duble)', description: 'Duble servis edilen bu Tennessee viski, odun kömüründe filtrelenen yumuşak tadıyla bilinir.', price: 800, category: 'viski', isAvailable: true },
    { id: 'v8', name: 'Jack Daniels (Tek)', description: 'Bu klasik Amerikan viski, Tennessee bölgesine özgü kömür filtrasyonundan geçer.', price: 450, category: 'viski', isAvailable: true },
    { id: 'v9', name: 'Woodford Reserve (70 Cl)', description: 'Büyük şişede sunulan bu özel burbon, özenli üretim süreci sayesinde yumuşak ve yoğun bir karakter kazanır.', price: 5000, category: 'viski', isAvailable: true },
    { id: 'v10', name: 'Woodford Reserve (Duble)', description: 'Duble servis edilen bu burbon, meşe fıçılarında yıllandırılmasının getirdiği kompleks tat profiline sahiptir.', price: 1200, category: 'viski', isAvailable: true },
    { id: 'v11', name: 'Woodford Reserve (Tek)', description: 'Bu Amerikan burbonu karamel, vanilya ve hafif meşe tonlarına sahip özel bir harmandır.', price: 800, category: 'viski', isAvailable: true },

    // RAKI
    { id: 'r1', name: 'Beylerbeyi Göbek (35 Cl)', description: 'Orta boy şişede sunulan bu rakı, geleneksel içim kültürünün vazgeçilmez bir parçasıdır.', price: 1650, category: 'raki', isAvailable: true },
    { id: 'r2', name: 'Beylerbeyi Göbek (70 Cl)', description: 'Büyük şişede sunulan Beylerbeyi Göbek, masalarda paylaşım için idealdir.', price: 2700, category: 'raki', isAvailable: true },
    { id: 'r3', name: 'Beylerbeyi Göbek (Duble)', description: 'Duble ölçüde sunulan bu rakı, tatlılık ve anason dengesini iyi yansıtır.', price: 400, category: 'raki', isAvailable: true },
    { id: 'r4', name: 'Beylerbeyi Göbek (Tek)', description: 'Bu rakı, geleneksel yöntemlerle üretilen anason aromasıyla öne çıkar.', price: 300, category: 'raki', isAvailable: true },
];
