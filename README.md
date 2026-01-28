# Kozbeyli Konağı - Dijital Menü

<p align="center">
  <img src="https://via.placeholder.com/120x120/C5A059/FFFFFF?text=K" alt="Kozbeyli Konağı" width="80" height="80" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>Ege'nin Eşsiz Lezzet Durağı</strong><br/>
  GrainQR Dijital Menü Sistemi ile geliştirilmiştir.
</p>

---

## 🍽️ Özellikler

- **📱 Mobil Öncelikli Tasarım** - Telefonlar için optimize edilmiş arayüz
- **🔍 Anlık Arama** - Ürünleri hızlıca bulun
- **📂 Kategori Navigasyonu** - Yatay kaydırmalı kategori menüsü
- **⚡ Yüksek Performans** - Hızlı yükleme ve akıcı geçişler
- **♿ Erişilebilirlik** - WCAG 2.1 uyumlu

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretim build'i oluştur
npm run build

# Üretim build'ini önizle
npm run preview
```

## 📁 Proje Yapısı

```
├── components/
│   ├── Header.tsx         # Site başlığı ve mobil menü
│   ├── CategoryNav.tsx    # Kategori navigasyonu
│   ├── DigitalMenu.tsx    # Ana menü bileşeni
│   └── ProductCard.tsx    # Ürün kartı
├── services/
│   └── MenuData.ts        # Menü verileri ve tipler
├── App.tsx                # Ana uygulama
├── index.html             # HTML şablonu
└── vite.config.ts         # Vite yapılandırması
```

## 🎨 Marka Renkleri

| Renk | Hex | Kullanım |
|------|-----|----------|
| Altın | `#C5A059` | Ana vurgu rengi |
| Koyu Altın | `#B08D22` | Hover durumları |
| Slate 900 | `#0F172A` | Metin rengi |

## 🌐 Deployment

Bu proje Vercel üzerinde deploy edilmek üzere yapılandırılmıştır:

1. GitHub repo'nuzu Vercel'e bağlayın
2. Build komutu: `npm run build`
3. Output dizini: `dist`

## 📞 İletişim

**Kozbeyli Konağı**
- 📍 Kozbeyli Köyü, Kozbeyli Küme Evleri No:188
- 📞 +90 532 234 26 86

---

<p align="center">
  <sub>Powered by <strong>GrainQR</strong> Digital Menu System</sub>
</p>
