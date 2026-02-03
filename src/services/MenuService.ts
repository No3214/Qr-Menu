import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type DietaryTag =
    | 'vegetarian' | 'vegan' | 'gluten-free' | 'spicy' | 'lactose-free'
    | 'organic' | 'chef-special' | 'egg' | 'cheese' | 'mint' | 'meat'
    | 'fish' | 'bread' | 'dairy' | 'new' | 'popular';

// Price variant for products with multiple sizes/volumes
export interface PriceVariant {
    id: string;
    label: string;       // "35cl", "50cl", "Şişe", "Tek", "Duble"
    price: number;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;  // Alt kategori desteği
    isAvailable: boolean;
    image?: string;
    category_id?: string;
    is_active?: boolean;
    tags?: DietaryTag[];
    variants?: PriceVariant[];  // Hacim/porsiyon seçenekleri
}

export interface Category {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
    parent_id?: string;  // Alt kategori için üst kategori ID'si
}

// Alt kategoriler
export const SUBCATEGORIES: Category[] = [
    // Kahvaltı alt kategorileri
    { id: 'kahvalti-ekstralar', title: 'Ekstralar', slug: 'ekstralar', parent_id: 'kahvalti' },
    { id: 'kahvalti-oneriler', title: 'Öneriler', slug: 'oneriler', parent_id: 'kahvalti' },
    // Alkollü içecek alt kategorileri
    { id: 'alkol-bira', title: 'Bira', slug: 'bira', parent_id: 'alkollu-icecek' },
    { id: 'alkol-sarap', title: 'Şarap', slug: 'sarap', parent_id: 'alkollu-icecek' },
    { id: 'alkol-raki', title: 'Rakı', slug: 'raki', parent_id: 'alkollu-icecek' },
    { id: 'alkol-viski', title: 'Viski', slug: 'viski', parent_id: 'alkollu-icecek' },
    { id: 'alkol-kokteyl', title: 'Kokteyl', slug: 'kokteyl', parent_id: 'alkollu-icecek' },
    // Alkolsüz içecek alt kategorileri
    { id: 'alkolsuz-sicak', title: 'Sıcak İçecekler', slug: 'sicak', parent_id: 'alkolsuz-icecek' },
    { id: 'alkolsuz-soguk', title: 'Soğuk İçecekler', slug: 'soguk', parent_id: 'alkolsuz-icecek' },
];

export const CATEGORIES: Category[] = [
    { id: 'kahvalti', title: 'Kahvaltı', slug: 'kahvalti', description: 'Güne lezzetli bir başlangıç.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'ekstralar', title: 'Ekstralar', slug: 'ekstralar', description: 'Kahvaltı yanı lezzetler.', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'baslangic', title: 'Başlangıç & Paylaşımlıklar', slug: 'baslangic', description: 'İştah açan dokunuşlar.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'pizza-sandvic', title: 'Taş Fırın Pizza ve Sandviç', slug: 'pizza-sandvic', description: 'İnce hamur, bol lezzet.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80' },
    { id: 'peynir-tabagi', title: 'Peynir Tabağı', slug: 'peynir-tabagi', description: 'Şık ve keyifli eşlikçi.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80' },
    { id: 'tatli', title: 'Tatlı', slug: 'tatli', description: 'Mutluluğun son dokunuşu.', image: 'https://images.unsplash.com/photo-1563729768-b6363c4df969?auto=format&fit=crop&q=80' },
    { id: 'ana-yemek', title: 'Ana Yemek', slug: 'ana-yemek', description: 'Sofranın başrolü.', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'ara-sicaklar', title: 'Ara Sıcaklar', slug: 'ara-sicaklar', description: 'Lezzete sıcak bir ara.', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80' },
    { id: 'meze', title: 'Meze', slug: 'meze', description: 'Paylaşmanın en güzel hali.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'soguk-icecek', title: 'Soğuk İçecekler', slug: 'soguk-icecek', description: 'Serin ve ferahlatıcı.', image: 'https://images.unsplash.com/photo-1499638473338-25013094406a?auto=format&fit=crop&q=80' },
    { id: 'sicak-icecek', title: 'Sıcak İçecekler', slug: 'sicak-icecek', description: 'Isıtan keyif.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80' },
    { id: 'sarap', title: 'Şarap', slug: 'sarap', description: 'Şık bir yudum keyif.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'kokteyl', title: 'Kokteyl', slug: 'kokteyl', description: 'Yaratıcı karışımlar.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'bira', title: 'Bira', slug: 'bira', description: 'Ferahlatıcı seçenekler.', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'viski', title: 'Viski', slug: 'viski', description: 'Özenle seçilmiş damıtımlar.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'raki', title: 'Rakı', slug: 'raki', description: 'Geleneksel lezzet.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' }
];

export const PRODUCTS: Product[] = [
    // === KAHVALTI ===
    { id: 'k1', title: 'Gurme Serpme Kahvaltı', description: 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu. 2 kişiliktir.', price: 850, category: 'kahvalti', isAvailable: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80', tags: ['new', 'chef-special', 'egg', 'cheese', 'mint'] },
    { id: 'k2', title: 'Kozbeyli Kahvaltı Tabağı', description: 'Organik köy yumurtası, ev yapımı reçeller, taze kaymak, süzme bal, ezine peyniri, taze simit ve mevsim sebzeleri. 1 kişiliktir.', price: 450, category: 'kahvalti', isAvailable: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80', tags: ['egg', 'cheese', 'bread'] },
    { id: 'k3', title: 'Eggs Benedict', description: 'Poşe yumurta, füme somon, İngiliz muffin ve ev yapımı hollandaise sos. Hash brown patates ile servis edilir.', price: 380, category: 'kahvalti', isAvailable: true, image: 'https://images.unsplash.com/photo-1608039829572-9b5d44b4b034?auto=format&fit=crop&q=80', tags: ['egg', 'fish'] },
    { id: 'k4', title: 'Avokado Toast', description: 'Ekşi maya ekmeği üzerine ezilmiş avokado, cherry domates, feta peyniri, çeri biber ve zeytinyağı. Poşe yumurta ile taçlandırılır.', price: 320, category: 'kahvalti', isAvailable: true, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&q=80', tags: ['vegetarian'] },

    // === EKSTRALAR ===
    { id: 'e1', title: 'Fransız Tereyağlı Kruvasan', description: 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan. 2 adet.', price: 180, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
    { id: 'e2', title: 'Bal Kaymak', description: 'Afyon kaymağı ve organik çam balı. Taze ekmek ile servis edilir.', price: 150, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80' },
    { id: 'e3', title: 'Sahanda Yumurta', description: 'Köy yumurtası tereyağında kızartılır. Sucuklu veya peynirli olarak tercih edilebilir.', price: 120, category: 'ekstralar', isAvailable: true, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80', tags: ['egg'] },

    // === BAŞLANGIÇ ===
    { id: 'b1', title: 'Humus', description: 'Geleneksel tarif ile hazırlanan nohut ezmesi, tahin, limon ve zeytinyağı. Pide eşliğinde.', price: 180, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80', tags: ['vegan', 'gluten-free'] },
    { id: 'b2', title: 'Çıtır Karides', description: 'Tempura hamuruyla kaplanmış karides, tatlı acı sos ile. 6 adet.', price: 380, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80' },
    { id: 'b3', title: 'Köy Salatası', description: 'Domates, salatalık, soğan, biber, maydanoz ve taze otlar. Narince dökme zeytinyağı ile.', price: 160, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80', tags: ['vegan', 'gluten-free'] },
    { id: 'b4', title: 'Sigara Böreği', description: 'Çıtır yufka içinde beyaz peynir ve maydanoz. Yoğurt ile servis edilir. 4 adet.', price: 180, category: 'baslangic', isAvailable: true, image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80' },

    // === PIZZA & SANDVİÇ ===
    { id: 'p1', title: 'Margherita Pizza', description: 'San Marzano domates sosu, taze mozzarella, fesleğen ve zeytinyağı. Taş fırında pişirilir.', price: 320, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80', tags: ['vegetarian'] },
    { id: 'p2', title: 'Kozbeyli Special Pizza', description: 'Sucuk, pastırma, kaşar peyniri, mozzarella, domates ve biber. Şefin özel sosu ile.', price: 420, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80', tags: ['chef-special', 'spicy'] },
    { id: 'p3', title: 'Funghi Pizza', description: 'Karışık mantar (shiitake, portobello, kestane mantarı), trüf yağı, mozzarella ve parmesan.', price: 380, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80' },
    { id: 'p4', title: 'Gurme Rustik Sandviç', description: 'Taze rustik baget, beyaz peynir, domates, roka, pesto sos. Patates kızartması ile.', price: 280, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80' },
    { id: 'p5', title: 'Tavuklu Wrap', description: 'Izgara tavuk, avokado, marul, domates ve ranch sos. Patates ile servis edilir.', price: 260, category: 'pizza-sandvic', isAvailable: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80' },

    // === ANA YEMEK ===
    { id: 'ay1', title: 'Izgara Pirzola', description: 'Özenle marine edilmiş kuzu pirzola, odun ateşinde pişirilir. Patates püresi ve kavrulmuş sebzeler ile.', price: 680, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80', tags: ['popular', 'meat', 'gluten-free'] },
    { id: 'ay2', title: 'Kozbeyli Kebabı', description: 'Şefin özel tarifi ile hazırlanan dana kebap. Közlenmiş biber, domates ve piyaz ile servis edilir.', price: 520, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80', tags: ['chef-special', 'gluten-free'] },
    { id: 'ay3', title: 'Levrek Fileto', description: 'Taze Ege levreği, fırında pişirilir. Limon tereyağı sos, kuşkonmaz ve bebek patates ile.', price: 480, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&q=80', tags: ['fish', 'gluten-free'] },
    { id: 'ay4', title: 'Bonfile', description: '200gr dana bonfile, tercih edilen pişirme derecesinde. Trüflü patates püresi ve mantar sos ile.', price: 750, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&q=80', tags: ['meat', 'chef-special'] },
    { id: 'ay5', title: 'Tavuk Şiş', description: 'Marine edilmiş tavuk göğsü, sebzeler ile şişe dizilip ızgarada pişirilir. Pilav ve cacık ile.', price: 320, category: 'ana-yemek', isAvailable: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80' },

    // === TATLI ===
    { id: 't1', title: 'Künefe', description: 'Geleneksel Antep künefesi, ince kadayıf ve özel peynir ile. Sıcak servis edilir.', price: 220, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1563729784-0666a17fc10f?auto=format&fit=crop&q=80' },
    { id: 't2', title: 'Sufle', description: 'Sıcak çikolatalı sufle, vanilyalı dondurma ile. Taze meyveler eşliğinde.', price: 200, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80' },
    { id: 't3', title: 'Tiramisu', description: 'Klasik İtalyan tatlısı. Mascarpone, espresso ve kakaolu lady finger bisküvi.', price: 180, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80' },
    { id: 't4', title: 'San Sebastian Cheesecake', description: 'Yoğun krem peynirli, karamelize üstü. Mevsim meyveleri ile servis edilir.', price: 190, category: 'tatli', isAvailable: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80' },

    // === SOĞUK İÇECEK ===
    { id: 'si1', title: 'Taze Sıkılmış Portakal Suyu', description: '250ml taze sıkılmış portakal suyu.', price: 90, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&q=80' },
    { id: 'si2', title: 'Ev Yapımı Limonata', description: 'Taze limon, nane ve hafif şeker ile hazırlanan serinletici limonata.', price: 80, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&q=80' },
    { id: 'si3', title: 'Ayran', description: 'Ev yapımı yoğurttan hazırlanan geleneksel ayran.', price: 50, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1583064313642-a7c149480c7e?auto=format&fit=crop&q=80' },
    { id: 'si4', title: 'Ice Tea', description: 'Şeftali veya limon aromalı buzlu çay.', price: 60, category: 'soguk-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80' },

    // === SICAK İÇECEK ===
    { id: 'sc1', title: 'Türk Kahvesi', description: 'Geleneksel Türk kahvesi. Orta, sade veya şekerli tercih edilebilir.', price: 70, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&q=80' },
    { id: 'sc2', title: 'Espresso', description: 'Tek veya çift shot olarak hazırlanan İtalyan espresso.', price: 60, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80' },
    { id: 'sc3', title: 'Latte', description: 'Espresso ve buharda ısıtılmış süt. Soya veya badem sütü seçeneği mevcut.', price: 90, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80' },
    { id: 'sc4', title: 'Cappuccino', description: 'Espresso, sıcak süt ve süt köpüğü. Tarçın veya kakao serpme isteğe bağlı.', price: 90, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80' },
    { id: 'sc5', title: 'Çay', description: 'Demlik çay veya bardak çay. Taze demlenmiş Rize çayı.', price: 40, category: 'sicak-icecek', isAvailable: true, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80' },

    // === ŞARAP ===
    { id: 's1', title: 'Karma (Kırmızı)', description: 'Urla Şarapçılık. Cabernet Sauvignon, Merlot harmanı.', price: 180, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80', variants: [{ id: 's1-kadeh', label: 'Kadeh', price: 180 }, { id: 's1-sise', label: 'Şişe', price: 850 }] },
    { id: 's2', title: 'Mozaik (Beyaz)', description: 'Urla Şarapçılık. Chardonnay ve yerli üzüm harmanı. Meyvemsi ve taze.', price: 160, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&q=80', variants: [{ id: 's2-kadeh', label: 'Kadeh', price: 160 }, { id: 's2-sise', label: 'Şişe', price: 780 }] },
    { id: 's3', title: 'Vinkara Rosé', description: 'Hafif ve ferahlatıcı rosé şarap. Yaz akşamları için ideal.', price: 150, category: 'sarap', isAvailable: true, image: 'https://images.unsplash.com/photo-1560148218-1a83060f7b32?auto=format&fit=crop&q=80', variants: [{ id: 's3-kadeh', label: 'Kadeh', price: 150 }, { id: 's3-sise', label: 'Şişe', price: 720 }] },

    // === RAKI ===
    { id: 'r1', title: 'Beylerbeyi Göbek', description: 'Premium Türk rakısı. Üzüm ve anason aroması.', price: 250, category: 'raki', isAvailable: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80', variants: [{ id: 'r1-tek', label: 'Tek', price: 120 }, { id: 'r1-duble', label: 'Duble', price: 220 }, { id: 'r1-35', label: '35cl', price: 650 }, { id: 'r1-50', label: '50cl', price: 850 }, { id: 'r1-70', label: '70cl', price: 1100 }] },
    { id: 'r2', title: 'Yeni Rakı', description: 'Türkiye\'nin klasik rakısı. Geleneksel tarif.', price: 200, category: 'raki', isAvailable: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80', variants: [{ id: 'r2-tek', label: 'Tek', price: 100 }, { id: 'r2-duble', label: 'Duble', price: 180 }, { id: 'r2-35', label: '35cl', price: 550 }, { id: 'r2-50', label: '50cl', price: 720 }, { id: 'r2-70', label: '70cl', price: 950 }] },

    // === VİSKİ ===
    { id: 'v1', title: 'Chivas Regal 12', description: 'Premium blended Scotch whisky. Bal ve vanilya notaları.', price: 180, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80', variants: [{ id: 'v1-tek', label: 'Tek', price: 180 }, { id: 'v1-duble', label: 'Duble', price: 340 }] },
    { id: 'v2', title: 'Jack Daniels', description: 'Tennessee whiskey. Meşe fıçısında olgunlaştırılmış.', price: 150, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80', variants: [{ id: 'v2-tek', label: 'Tek', price: 150 }, { id: 'v2-duble', label: 'Duble', price: 280 }] },
    { id: 'v3', title: 'Woodford Reserve', description: 'Kentucky bourbon. Karamel ve meşe aroması.', price: 220, category: 'viski', isAvailable: true, image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80', variants: [{ id: 'v3-tek', label: 'Tek', price: 220 }, { id: 'v3-duble', label: 'Duble', price: 420 }] },

    // === KOKTEYL ===
    { id: 'c1', title: 'Mojito', description: 'Beyaz rom, taze nane, lime, şeker ve soda. Klasik Küba kokteyli.', price: 220, category: 'kokteyl', isAvailable: true, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80' },
    { id: 'c2', title: 'Aperol Spritz', description: 'Aperol, prosecco ve soda. Portakal dilimi ile servis edilir.', price: 240, category: 'kokteyl', isAvailable: true, image: 'https://images.unsplash.com/photo-1560508180-03f285f67ded?auto=format&fit=crop&q=80' },
    { id: 'c3', title: 'Margarita', description: 'Tekila, triple sec ve taze lime suyu. Tuzlu kadeh kenarı ile.', price: 230, category: 'kokteyl', isAvailable: true, image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?auto=format&fit=crop&q=80' },

    // === BİRA ===
    { id: 'bi1', title: 'Efes Pilsen', description: 'Türkiye\'nin en sevilen birası. 50cl şişe.', price: 120, category: 'bira', isAvailable: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'bi2', title: 'Gara Guzu IPA', description: 'Türk craft birası. Narenciye ve tropikal meyve notaları.', price: 150, category: 'bira', isAvailable: true, image: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&q=80' },
    { id: 'bi3', title: 'Corona', description: 'Meksika birası. Lime dilimi ile servis edilir.', price: 140, category: 'bira', isAvailable: true, image: 'https://images.unsplash.com/photo-1613950801673-c608577baf9b?auto=format&fit=crop&q=80' }
];

export const MenuService = {
    /**
     * Fetch all categories
     */
    getCategories: async (): Promise<Category[]> => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, using mock data');
            return CATEGORIES;
        }

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return CATEGORIES;
        }

        // If DB has data but it's the "old skeleton" (e.g. only 3 items), 
        // fallback to mock for the "Premium" experience until the user runs setup_complete.sql
        if (!data || data.length < 5) {
            console.warn('Database seems skeletal or empty, showing premium fallback data');
            return CATEGORIES;
        }

        return data as Category[];
    },

    /**
     * Fetch all products
     */
    // Fetch products
    getProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured()) return PRODUCTS;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true);

        if (error || !data || data.length === 0) {
            if (error) console.error('Error fetching products:', error);
            else console.warn('Products table is empty, showing fallback data');
            return PRODUCTS;
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category_id,
            isAvailable: item.is_active,
            image: item.image
        })) as Product[];
    },

    // Fetch products by category
    getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
        if (!isSupabaseConfigured()) {
            return PRODUCTS.filter(p => p.category === categoryId);
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true);

        if (error || !data) {
            console.error('Error fetching products by category:', error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category_id,
            isAvailable: item.is_active,
            image: item.image
        })) as Product[];
    },

    /**
     * Bulk insert categories and products (AI Importer)
     */
    bulkInsertMenuData: async (extractedData: { categories: string[], products: any[] }) => {
        if (!isSupabaseConfigured()) return;

        try {
            // 1. Create categories first
            const categoryMappings: Record<string, string> = {};

            for (const catName of extractedData.categories) {
                const slug = catName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
                const { data: catData, error: catErr } = await supabase
                    .from('categories')
                    .insert([{ title: catName, slug: slug, is_active: true }])
                    .select()
                    .single();

                if (!catErr && catData) {
                    categoryMappings[catName] = catData.id;
                }
            }

            // 2. Insert products with mapped category IDs
            const productInserts = extractedData.products.map(p => ({
                title: p.name,
                description: p.description,
                price: parseFloat(p.price) || 0,
                category_id: categoryMappings[p.category] || null,
                is_active: true
            }));

            const { error: prodErr } = await supabase
                .from('products')
                .insert(productInserts);

            if (prodErr) throw prodErr;
            return { success: true };
        } catch (error) {
            console.error('Bulk Insert Error:', error);
            throw error;
        }
    },

    /**
     * Product Management
     */
    addProduct: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
        if (!isSupabaseConfigured()) return null;
        const { data, error } = await supabase
            .from('products')
            .insert([{
                title: product.title,
                description: product.description,
                price: product.price,
                category_id: product.category,
                is_active: product.isAvailable,
                image: product.image
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding product:', error);
            return null;
        }
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category_id,
            isAvailable: data.is_active,
            image: data.image
        };
    },

    updateProduct: async (id: string, product: Partial<Product>): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const updates: any = {};
        if (product.title !== undefined) updates.title = product.title;
        if (product.description !== undefined) updates.description = product.description;
        if (product.price !== undefined) updates.price = product.price;
        if (product.category !== undefined) updates.category_id = product.category;
        if (product.isAvailable !== undefined) updates.is_active = product.isAvailable;
        if (product.image !== undefined) updates.image = product.image;

        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            return false;
        }
        return true;
    },

    deleteProduct: async (id: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return false;
        }
        return true;
    },

    /**
     * Category Management
     */
    addCategory: async (category: Omit<Category, 'id'>): Promise<Category | null> => {
        if (!isSupabaseConfigured()) return null;
        const { data, error } = await supabase
            .from('categories')
            .insert([{
                title: category.title,
                slug: category.slug,
                description: category.description,
                image: category.image,
                is_active: true
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding category:', error);
            return null;
        }
        return data as Category;
    },

    updateCategory: async (id: string, category: Partial<Category>): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const { error } = await supabase
            .from('categories')
            .update(category)
            .eq('id', id);

        if (error) {
            console.error('Error updating category:', error);
            return false;
        }
        return true;
    },

    deleteCategory: async (id: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return false;
        }
        return true;
    }
};
