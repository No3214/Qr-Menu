# QR Menu - Foost-like Digital Menu System

Modern, 4K video destekli dijital QR menü sistemi. Restoranlar için kapsamlı yönetim paneli ve müşteriler için mobil-öncelikli menü deneyimi sunar.

## Özellikler

### Müşteri Tarafı (Public Menu)
- 4K video arka plan desteği
- Mobil-öncelikli tasarım
- Çoklu dil desteği
- Kategori ve ürün görüntüleme
- Ürün detay modalı (kalori, alerjen, diyet bilgileri)
- Hızlı geri bildirim butonu
- Misafir bilgileri popup'ı

### Admin Dashboard
- **Menü Yönetimi**: Kategoriler, ürünler, alt kategoriler, seçenekler
- **Etkinlik Tanıtımı**: Etkinlik oluşturma, rezervasyon yönetimi
- **Analitik**: Görüntüleme, tıklama, QR tarama istatistikleri
- **Yorumlar**: Müşteri geri bildirimleri
- **Çeviri**: Çoklu dil desteği ve çeviri yönetimi
- **Ayarlar**: Profil, şifre, restoran bilgileri, QR kod, AI Chat, PDF export

## Teknoloji Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Kiti**: shadcn/ui, Radix UI
- **Form**: React Hook Form, Zod
- **Data Fetching**: TanStack Query
- **Backend**: Next.js Route Handlers
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Deploy**: Vercel + Supabase

## Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### 1. Projeyi klonlayın
```bash
git clone <repo-url>
cd Qr-Menu
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment değişkenlerini ayarlayın
`.env.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Supabase veritabanını kurun
Supabase dashboard'unda SQL Editor'a gidin ve aşağıdaki migration dosyalarını sırasıyla çalıştırın:
1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_rls.sql`

### 5. Demo verilerini yükleyin (opsiyonel)
```bash
npm run db:seed
```

### 6. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
Qr-Menu/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth sayfaları (login, register)
│   │   ├── api/              # API Route Handlers
│   │   ├── dashboard/        # Admin dashboard sayfaları
│   │   ├── r/[slug]/         # Public menü sayfası
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard/        # Dashboard bileşenleri
│   │   ├── providers/        # Context providers
│   │   └── ui/               # shadcn/ui bileşenleri
│   ├── hooks/                # Custom React hooks
│   ├── lib/
│   │   ├── supabase/         # Supabase client helpers
│   │   └── utils.ts          # Utility fonksiyonlar
│   └── types/                # TypeScript tipleri
├── supabase/
│   └── migrations/           # SQL migration dosyaları
├── scripts/
│   └── seed.ts               # Demo veri seed script
├── public/                   # Static assets
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## API Endpoints

### Public
- `GET /api/menu/public?slug=&lang=` - Menü verilerini getir
- `POST /api/analytics/track` - Analytics event kaydet
- `POST /api/reviews/public` - Yorum gönder

### Protected (Auth Required)
- Menü CRUD operasyonları
- Etkinlik CRUD operasyonları
- Ayarlar CRUD operasyonları
- QR kod generator
- PDF export

## Demo

Demo menüyü görmek için: `/r/kozbeyli-konagi`

## Multi-tenant Yapı

- Her restoran kendi `restaurant_id` ile izole edilmiştir
- RLS (Row Level Security) ile veritabanı seviyesinde güvenlik
- Kullanıcılar sadece kendi restoranlarının verilerine erişebilir

## Deployment

### Vercel
1. Vercel'de yeni proje oluşturun
2. GitHub repo'yu bağlayın
3. Environment değişkenlerini ekleyin
4. Deploy edin

### Supabase
1. Yeni Supabase projesi oluşturun
2. Migration dosyalarını çalıştırın
3. RLS politikalarını etkinleştirin
4. Storage bucket'ları oluşturun (opsiyonel)

## Lisans

MIT
