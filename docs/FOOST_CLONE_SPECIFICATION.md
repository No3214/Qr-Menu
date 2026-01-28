# FOOST CLONE - Detayli Teknik Spesifikasyon

> Bu dokuman, thefoost.com sisteminin tam kopyasini olusturmak icin gerekli tum teknik detaylari icerir.
> Kaynak: Ekran goruntuleri + Web arastirmasi

---

## 1. GENEL BAKIS

### 1.1 Foost Nedir?
Foost, restoranlar icin "Complete Dining Platform" olarak pazarlanan dijital menu ve etkinlik yonetim platformudur.

**Slogan:** "Digital menus that sell more"

**Ana Ozellikler:**
- QR kod ile temassiz menu erisimi
- Video destekli menu ogerleri (4K)
- Coklu dil destegi
- Analitik ve raporlama
- Etkinlik yonetimi
- Musteri geri bildirimi

---

## 2. UI/UX TASARIM SPESIFIKASYONU

### 2.1 Renk Paleti
```css
/* Ana Renkler */
--background: #F9FAFB;        /* Acik gri arka plan */
--card-bg: #FFFFFF;           /* Beyaz kart arka plan */
--text-primary: #111827;      /* Koyu siyah metin */
--text-secondary: #6B7280;    /* Gri metin */
--text-muted: #9CA3AF;        /* Soluk gri */
--border: #E5E7EB;            /* Sinir rengi */

/* Aksan Renkler */
--accent-teal: #0D9488;       /* Teal - linkler */
--accent-red: #DC2626;        /* Kirmizi - 4K badge */
--overlay-dark: rgba(0,0,0,0.5);  /* Modal overlay */

/* Gradyanlar */
--gradient-dark: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
```

### 2.2 Tipografi
```css
/* Font Ailesi */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Boyutlari */
--text-xs: 10px;      /* Badge'ler */
--text-sm: 14px;      /* Aciklamalar */
--text-base: 15px;    /* Normal metin */
--text-lg: 18px;      /* Basliklar */
--text-xl: 20px;      /* Sayfa basliklari */

/* Font Agirliklari */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Harf Araligi */
--tracking-wide: 0.3em;  /* Marka ismi icin */
```

### 2.3 Aralama Sistemi
```css
/* Padding/Margin */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## 3. SAYFA YAPILARI

### 3.1 Ana Sayfa (Home View)

```
+------------------------------------------+
|              GRAIN (Marka)               |  <- tracking-wide, semibold
+------------------------------------------+
|  [=]     [LOGO/İSİM]        [GLOBE]      |  <- Nav bar
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |     HERO VIDEO/IMAGE               |  |  <- aspect-ratio: 16/10
|  |     [4K Badge]                     |  |
|  |                                    |  |
|  |     [Menuyu Goruntule]             |  |  <- CTA button
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  KATEGORI 1 (Tam genislik)         |  |  <- aspect-ratio: 16/9
|  |  Baslik + Aciklama                 |  |
|  +------------------------------------+  |
|                                          |
|  +----------------+ +----------------+   |
|  | KATEGORI 2     | | KATEGORI 3     |   |  <- 2 sutunlu grid
|  +----------------+ +----------------+   |
|  | KATEGORI 4     | | KATEGORI 5     |   |
|  +----------------+ +----------------+   |
|                                          |
+------------------------------------------+
|  [FAST FEEDBACK]                         |  <- Fixed bottom-left
+------------------------------------------+
|  ⚡ Powered by Grain                     |  <- Footer
+------------------------------------------+
```

### 3.2 Kategori Sayfasi (Category View)

```
+------------------------------------------+
|              GRAIN                        |
+------------------------------------------+
|  [=]     [LOGO]        [GLOBE]           |
+------------------------------------------+
| Cold | Hot | Pizza | Sweet | Brunch |... |  <- Yatay scroll tabs
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  |  FEATURED ITEM BANNER              |  |  <- Video/Image, 16:9
|  |  [Tam Ekran Butonu]                |  |
|  |  Urun Adi                          |  |
|  |  ₺ 150                             |  |
|  +------------------------------------+  |
|                                          |
|  ## Kategori Basligi                     |
|                                          |
|  +------------------------------------+  |
|  | Urun Adi            [v]   [IMAGE] |   |  <- Expandable item
|  | Aciklama (2 satir)                |   |
|  | Devamini Gor                       |   |
|  | ₺ 120                              |   |
|  +------------------------------------+  |
|                                          |
|  +-- EXPANDED ITEM -------------------+  |
|  | Urun Adi            [^]   [IMAGE] |   |
|  | Tam aciklama metni...              |   |
|  | ₺ 120                              |   |
|  | [Kesfet ->]                        |   |
|  |                                    |   |
|  | ## Oneriler                        |   |
|  | +--------+ +--------+ +--------+   |   |  <- Yatay scroll
|  | | Oneri1 | | Oneri2 | | Oneri3 |   |   |
|  | +--------+ +--------+ +--------+   |   |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### 3.3 Sidebar Menu

```
+------------------+
| Restoran Adi [X] |
+------------------+
| Ana Sayfa        |  <- Bold
+------------------+
| Cold             |
| Hot              |
| Pizzaaa          |
| Main Course      |
| Brunch           |
| Sweet            |
| Cocktails        |
| Spirit Free      |
| Wine             |
+------------------+
```

### 3.4 Dil Secimi Sidebar

```
                   +------------------+
                   | Dil Secimi   [X] |
                   +------------------+
                   | 🇹🇷 Turkce [*]   |  <- Selected: dark bg
                   | 🇬🇧 English      |
                   | 🇩🇪 Deutsch      |
                   | 🇷🇺 Русский      |
                   | 🇸🇦 العربية      |
                   +------------------+
```

### 3.5 Geri Bildirim Modal (Bottom Sheet)

```
+------------------------------------------+
|              [---]                        |  <- Drag indicator
+------------------------------------------+
|  Geri Bildirim                           |
+------------------------------------------+
|  Puaniniz                                |
|  [★] [★] [★] [★] [★]                     |
+------------------------------------------+
|  Adiniz (Opsiyonel)                      |
|  +------------------------------------+  |
|  | Placeholder...                     |  |
|  +------------------------------------+  |
+------------------------------------------+
|  Yorumunuz                               |
|  +------------------------------------+  |
|  |                                    |  |
|  |                                    |  |
|  +------------------------------------+  |
+------------------------------------------+
|  [        Gonder        ]                |
+------------------------------------------+
```

### 3.6 Video Modal (Fullscreen)

```
+------------------------------------------+
| Urun Adi                          [X]    |  <- Beyaz metin
+------------------------------------------+
|                                          |
|                                          |
|           VIDEO PLAYER                   |
|        (Native Controls)                 |
|                                          |
|                                          |
+------------------------------------------+
|                                    [4K]  |  <- Kirmizi badge
+------------------------------------------+
```

---

## 4. KOMPONENT SPESIFIKASYONLARI

### 4.1 Brand Header
```tsx
<div className="bg-white text-center py-2 border-b border-gray-100">
  <span className="text-sm font-semibold tracking-[0.3em] text-gray-800">
    GRAIN
  </span>
</div>
```

### 4.2 Navigation Bar
```tsx
<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
  {/* Sol: Hamburger Menu */}
  <button className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
    <Menu className="w-5 h-5 text-gray-700" />
  </button>

  {/* Orta: Logo veya Isim */}
  {logo ? (
    <Image src={logo} className="w-12 h-12 rounded-full" />
  ) : (
    <span className="text-xs text-gray-500 font-medium">{name}</span>
  )}

  {/* Sag: Dil Secimi */}
  <button className="p-2 -mr-2 hover:bg-gray-100 rounded-lg">
    <Globe className="w-5 h-5 text-gray-700" />
  </button>
</div>
```

### 4.3 Category Tab
```tsx
<button className={cn(
  'text-sm whitespace-nowrap transition-colors pb-1',
  isSelected
    ? 'text-gray-900 font-semibold border-b-2 border-gray-900'
    : 'text-gray-500 hover:text-gray-700'
)}>
  {categoryName}
</button>
```

### 4.4 Hero Video/Image
```tsx
<div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
  {videoUrl ? (
    <>
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={videoUrl} type="video/mp4" />
      </video>
      {/* Kontroller */}
      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        <button className="w-8 h-8 bg-black/40 rounded-full">
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
        <button className="w-8 h-8 bg-black/40 rounded-full">
          <Maximize2 />
        </button>
      </div>
      {/* 4K Badge */}
      <div className="absolute top-3 right-3 z-20">
        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
          4K
        </span>
      </div>
    </>
  ) : (
    <Image src={coverImage} fill className="object-cover" />
  )}

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/20" />

  {/* CTA Button */}
  <button className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 py-3 rounded-lg font-medium text-sm">
    Menuyu Goruntule
  </button>
</div>
```

### 4.5 Category Card
```tsx
<button className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
  <Image src={imageUrl} fill className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  <div className="absolute bottom-0 left-0 p-4">
    <h3 className="text-white font-bold text-lg">{name}</h3>
    <p className="text-white/70 text-sm mt-0.5">{description}</p>
  </div>
</button>
```

### 4.6 Menu Item (Expandable)
```tsx
<div className="border-b border-gray-100 last:border-0">
  <div className="flex gap-3 py-4 cursor-pointer" onClick={toggle}>
    {/* Content */}
    <div className="flex-1 min-w-0">
      {/* Title Row */}
      <div className="flex items-center gap-1">
        <h3 className="font-semibold text-gray-900 text-[15px]">{name}</h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
        <DietaryIcons />
      </div>

      {/* Description */}
      <p className={cn('text-gray-500 text-sm mt-1.5', !isExpanded && 'line-clamp-2')}>
        {description}
      </p>

      {/* See More */}
      {!isExpanded && description.length > 100 && (
        <button className="text-teal-600 text-sm mt-1">Devamini Gor</button>
      )}

      {/* Price */}
      <p className="text-gray-900 font-semibold mt-2">₺ {price}</p>

      {/* Explore Button (expanded) */}
      {isExpanded && (
        <button className="mt-3 px-4 py-2 border border-gray-300 rounded-full text-sm">
          Kesfet <ArrowRight />
        </button>
      )}
    </div>

    {/* Image/Video */}
    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
      {videoUrl && (
        <button className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-5 h-5" />
          </div>
        </button>
      )}
      <Image src={imageUrl} fill className="object-cover" />
    </div>
  </div>

  {/* Recommendations (expanded) */}
  {isExpanded && (
    <div className="pb-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Oneriler</h4>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {recommendations.map(item => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )}
</div>
```

### 4.7 Recommendation Card
```tsx
<div className="flex-shrink-0 w-40 bg-gray-50 rounded-xl p-3">
  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2">
    <Image src={imageUrl} fill className="object-cover" />
  </div>
  <h5 className="font-medium text-gray-900 text-sm">{name}</h5>
  <p className="text-gray-500 text-xs mt-1">
    <span className="font-semibold text-gray-700">Neden?</span> {reason}
  </p>
  <p className="text-gray-900 font-semibold text-sm mt-2">₺ {price}</p>
</div>
```

### 4.8 Fast Feedback Button
```tsx
<button className="fixed bottom-20 left-4 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-40">
  FAST FEEDBACK
</button>
```

### 4.9 Footer
```tsx
<div className="text-center py-6 text-gray-400 text-sm">
  <Zap className="w-4 h-4 inline mr-1" />
  Powered by Grain
</div>
```

---

## 5. ANIMASYONLAR

### 5.1 Slide Up (Bottom Sheet)
```css
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

### 5.2 Slide In Right (Language Menu)
```css
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
```

### 5.3 Slide In Left (Sidebar)
```css
@keyframes slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out;
}
```

### 5.4 Pulse (Loading)
```css
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 6. VERITABANI SEMASI

### 6.1 Tablolar

```sql
-- Restoranlar
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  video_url TEXT,                    -- 4K Hero video
  phone TEXT,
  address TEXT,
  default_currency TEXT DEFAULT 'TRY',
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Restoran Ayarlari
CREATE TABLE restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  supported_languages TEXT[] DEFAULT ARRAY['tr'],
  primary_color TEXT DEFAULT '#111827',
  enable_feedback BOOLEAN DEFAULT true,
  enable_video BOOLEAN DEFAULT true,
  enable_recommendations BOOLEAN DEFAULT true,
  UNIQUE(restaurant_id)
);

-- Menu Kategorileri
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,                    -- Kategori tanitim videosu
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Menu Ogeleri
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  video_url TEXT,                    -- 4K urun videosu
  dietary_restrictions TEXT[],       -- ['vegan', 'gluten-free', 'spicy']
  prep_minutes INTEGER,
  calories INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Oneriler (Cross-sell)
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  recommended_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  reason TEXT,                       -- "Bu urunle mukemmel uyum"
  sort_order INTEGER DEFAULT 0,
  UNIQUE(item_id, recommended_item_id)
);

-- Ceviriler
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,         -- 'category', 'item'
  entity_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  field_name TEXT NOT NULL,          -- 'name', 'description'
  translated_text TEXT NOT NULL,
  UNIQUE(restaurant_id, entity_type, entity_id, language_code, field_name)
);

-- Muesteri Yorumlari
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  full_name TEXT,
  email TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analitik Olaylari
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,          -- 'menu_view', 'qr_scan', 'item_click', 'video_view', 'category_view'
  entity_type TEXT,
  entity_id UUID,
  qr_entrypoint TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indeksler
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_analytics_restaurant ON analytics_events(restaurant_id);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_translations_entity ON translations(entity_type, entity_id);
```

---

## 7. API ENDPOINTLERI

### 7.1 Public API (No Auth Required)

```
GET  /api/menu/public?slug={slug}&lang={lang}
     -> { restaurant, settings, categories, translations }

POST /api/reviews/public
     -> { restaurant_id, rating, comment, full_name, email }

POST /api/analytics/track
     -> { restaurant_id, event_type, entity_type, entity_id, session_id }
```

### 7.2 Dashboard API (Auth Required)

```
# Restaurant
GET    /api/restaurant
PUT    /api/restaurant
POST   /api/restaurant/upload  (logo, cover, video)

# Categories
GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}

# Items
GET    /api/items
POST   /api/items
PUT    /api/items/{id}
DELETE /api/items/{id}

# Translations
GET    /api/translations?entity_type={type}&entity_id={id}
POST   /api/translations
PUT    /api/translations/{id}

# Reviews
GET    /api/reviews
PUT    /api/reviews/{id}/approve
DELETE /api/reviews/{id}

# Analytics
GET    /api/analytics?from={date}&to={date}
GET    /api/analytics/summary
```

---

## 8. OZELLIK LISTESI

### 8.1 Muesteri Tarafı (Public Menu)

| Ozellik | Aciklama | Oncelik |
|---------|----------|---------|
| QR Kod ile Erisim | /r/{slug} URL'si ile menu erisimi | Kritik |
| Hero Video | 4K restoran tanitim videosu | Yuksek |
| Kategori Grid | Gorsel kategori secimi | Kritik |
| Yatay Kategori Tabs | Hizli kategori degisimi | Yuksek |
| Genisleyen Menu Ogeleri | Detay goster/gizle | Yuksek |
| Urun Videolari | 4K urun tanitim videolari | Orta |
| Tam Ekran Video Modal | Video buyutme | Orta |
| Oneriler Sistemi | "Bununla birlikte..." | Orta |
| Coklu Dil | TR, EN, DE, RU, AR | Yuksek |
| Geri Bildirim | 5 yildiz + yorum | Orta |
| Diyet Ikonlari | Vegan, GF, Spicy | Dusuk |
| Loading Skeleton | Animasyonlu yukleme | Dusuk |

### 8.2 Dashboard (Admin Panel)

| Ozellik | Aciklama | Oncelik |
|---------|----------|---------|
| Menu Yonetimi | Kategori/Urun CRUD | Kritik |
| Video Yukleme | 4K video upload | Yuksek |
| Ceviri Yonetimi | Coklu dil desteği | Yuksek |
| Yorum Moderasyonu | Onay/Red | Orta |
| Analitik Dashboard | Goruntulenme, QR tiklama | Orta |
| QR Kod Olusturma | Ozel QR kod tasarimi | Orta |
| Ayarlar | Dil, renk, ozellik toggle | Dusuk |

---

## 9. MOBIL OPTIMIZASYON

### 9.1 Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```

### 9.2 Touch Hedefleri
- Minimum 44x44px touch hedef boyutu
- Yeterli buton/link araligi (8px+)

### 9.3 Scroll Davranisi
```css
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### 9.4 Video Optimizasyonu
- autoPlay + muted + playsInline (iOS uyumluluk)
- preload="metadata" (thumbnail icin)
- 4K icin: max-width: 3840px, codec: H.264

---

## 10. PERFORMANS

### 10.1 Image Optimization
- Next.js Image component kullan
- WebP format
- Lazy loading
- Placeholder blur

### 10.2 Video Optimization
- Compressed MP4 (H.264)
- Adaptive bitrate (mumkunse)
- Poster image

### 10.3 Caching
- Static assets: Cache-Control: public, max-age=31536000
- API responses: Cache-Control: public, max-age=3600

---

## 11. ANALITIK OLAYLARI

| Olay | Tetikleyici | Veri |
|------|-------------|------|
| qr_scan | QR ile giris | qr_entrypoint |
| menu_view | Sayfa acilisi | - |
| category_view | Kategori tiklama | category_id |
| item_click | Urun tiklama | item_id |
| video_view | Video oynatma | item_id |
| feedback_submit | Form gonderimi | rating |

---

## 12. GUVENLIK

### 12.1 Row Level Security (RLS)
```sql
-- Public read for published menus
CREATE POLICY "Public menu access" ON menu_items
  FOR SELECT USING (is_available = true);

-- Owner-only write access
CREATE POLICY "Owner can manage" ON menu_items
  FOR ALL USING (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_users
      WHERE auth_user_id = auth.uid()
    )
  );
```

### 12.2 API Guvenlik
- Rate limiting: 100 req/min (public), 1000 req/min (dashboard)
- Input validation: Zod schemas
- CORS: Sadece izinli domainler

---

## 13. DEPLOYMENT

### 13.1 Stack
- Frontend: Next.js 14+ (App Router)
- Database: Supabase (PostgreSQL)
- Storage: Supabase Storage / Cloudinary
- Hosting: Vercel
- CDN: Vercel Edge Network

### 13.2 Ortam Degiskenleri
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## 14. SONRAKI ADIMLAR

1. [ ] Bu spesifikasyona gore eksik ozellikleri tamamla
2. [ ] Video upload sistemi ekle (Supabase Storage)
3. [ ] Oneriler sistemini gercek veritabanindan cek
4. [ ] Dashboard analytics sayfasini tamamla
5. [ ] QR kod olusturma ozelligi ekle
6. [ ] PDF menu export ozelligi
7. [ ] Email bildirim sistemi
8. [ ] Coklu dil dashboard'u

---

*Bu dokuman, Foost sisteminin tam kopyasini olusturmak icin gerekli tum teknik detaylari icerir.*
*Son guncelleme: 2025*
