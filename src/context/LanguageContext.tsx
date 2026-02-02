import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    tr: {
        // VideoLanding
        'landing.title': 'KOZBEYLİ',
        'landing.titleAccent': 'KONAĞI',
        'landing.subtitle': "İnce Lezzetler • Otantik Tatlar • Miras",
        'landing.cta': 'Menüyü Keşfedin',
        'landing.reservation': 'REZERVASYON',
        'landing.founded': 'Kuruluş 1994',
        'landing.welcome': 'Mükemmelliğe Hoş Geldiniz',
        'landing.michelin': 'Michelin Standartı',
        'landing.fresh': 'Günlük Tazelik',
        'landing.wine': 'Şarap Mahzeni',
        'landing.history': 'Tarihi Mekan',
        'landing.foundedText': 'Est. 1904',
        'landing.discover': 'Keşfet',

        // CategoryGrid
        'category.heritagePrefix': 'Mansion mirası:',
        'category.heritageSuffix': 'Koleksiyonu',
        'menu.welcome': 'Hoş Geldiniz',
        'menu.restaurant': 'Kozbeyli Konağı',
        'menu.search': 'Ne yemek istersiniz?',
        'menu.categories': 'Kategoriler',

        // ProductModal
        'product.addToOrder': 'Siparişe Ekle',
        'product.share': 'Paylaş',
        'product.shareHeading': 'Bu Lezzeti Paylaş',
        'product.outOfStock': 'Tükendi',
        'product.notFound': 'Ürün bulunamadı.',
        'product.smartPairing': 'Smart Pairing',
        'product.pairingText': 'Bu lezzeti tamamlayan mükemmel bir seçenek.',
        'menu.recommendations': 'Sizin İçin Seçtiklerimiz',
        'menu.pairingReason': 'Neden?',
        'menu.addToOrderShort': 'Ekle',

        // MenuAssistant
        'assistant.welcome': 'Merhaba! Ben Kozbeyli Konağı yapay zeka asistanıyım. Size menümüz hakkında nasıl yardımcı olabilirim?',
        'assistant.error': 'Üzgünüm, şu an yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        'assistant.tooltip': 'AI Garsona Sor ✨',
        'assistant.name': 'Gurme AI',
        'assistant.role': 'Kozbeyli Konağı Asistanı',
        'assistant.placeholder': 'Sorunuzu buraya yazın...',
        'assistant.prompt1': 'Konağın Hikayesi',
        'assistant.prompt2': 'Ne yemeliyim?',
        'assistant.prompt3': 'Tatlı önerisi',
        'assistant.prompt4': 'Sıcak içecekler',

        // General
        'back': 'Geri',
        'search': 'Ara...',
        'loading': 'Yükleniyor...',
        'menu': 'Menü',
        'close': 'Kapat',

        // Review Modal
        'review.title': 'Deneyiminiz Nasıldı?',
        'review.subtitle': 'Fikriniz Bizim İçin Çok Değerli',
        'review.name': 'Adınız (Opsiyonel)',
        'review.comment': 'Eklemek istediğiniz bir not var mı? (Opsiyonel)',
        'review.submit': 'Değerlendirmeyi Gönder',
        'review.submitting': 'Gönderiliyor...',
        'review.success': 'Değerlendirmeniz iletildi!',
        'review.error': 'Değerlendirme gönderilemedi.',
        'review.thanks': 'Teşekkürler!',
        'review.thanksText': "Değerli geri bildiriminizle Kozbeyli Konağı'nı daha da geliştireceğiz. ✨",
        'review.tag1': 'Harika Lezzet',
        'review.tag2': 'Güleryüzlü Hizmet',
        'review.tag3': 'Şık Atmosfer',
        'review.tag4': 'Hızlı Sunum',

        // Dashboard
        'dash.nav.panel': 'Panel',
        'dash.nav.menu': 'Menü Yönetimi',
        'dash.nav.analytics': 'Analizler',
        'dash.nav.events': 'Etkinlikler',
        'dash.nav.reviews': 'Değerlendirmeler',
        'dash.nav.translations': 'Çeviriler',
        'dash.nav.qr': 'QR Tasarımı',
        'dash.nav.settings': 'Ayarlar',
        'dash.nav.logout': 'Çıkış Yap',
        'dash.header.workspace': 'Çalışma Alanı',
        'dash.header.branch': 'Ana Şube',

        // Dashboard Reviews
        'dash.reviews.title': 'Değerlendirmeler',
        'dash.reviews.subtitle': 'Müşteri yorumları ve puanları.',
        'dash.reviews.avg': 'Ortalama Puan',
        'dash.reviews.total': 'Toplam Yorum',
        'dash.reviews.recent': 'Son Yorumlar',
        'dash.reviews.loading': 'Yükleniyor...',
        'dash.reviews.empty': 'Henüz hiç yorum yapılmamış.',
        'dash.reviews.guest': 'Misafir',
        'dash.reviews.deleteConfirm': 'Bu yorumu silmek istediğinize emin misiniz?',
        'dash.reviews.deleteSuccess': 'Yorum silindi.',
        'dash.reviews.deleteError': 'Yorum silinemedi.',
        'dash.reviews.approveSuccess': 'Yorum onaylandı.',
        'dash.reviews.approveRevoke': 'Onay kaldırıldı.',

        // Dashboard Events
        'dash.events.title': 'Etkinlik Yönetimi',
        'dash.events.subtitle': 'Restoran etkinlikleri ve özel duyuruları buradan yönetebilirsiniz.',
        'dash.events.create': 'Yeni Etkinlik Oluştur',
        'dash.events.monthly': 'Bu Ayki Etkinlikler',
        'dash.events.attendees': 'Toplam Katılımcı',
        'dash.events.satisfaction': 'Memnuniyet Oranı',
        'dash.events.filterAll': 'Tümü',
        'dash.events.filterUpcoming': 'Gelecek',
        'dash.events.filterPast': 'Geçmiş',
        'dash.events.search': 'Etkinlik ara...',

        // Dashboard Menu
        'dash.menu.title': 'Menü Yönetimi',
        'dash.menu.tab.products': 'Kategoriler & Ürünler',
        'dash.menu.tab.recommendations': 'Öneriler',
        'dash.menu.tab.display': 'Görüntüleme Tercihleri',
        'dash.menu.allCategories': 'Tüm Kategoriler',
        'dash.menu.addCategory': 'Kategori Ekle',
        'dash.menu.addProduct': 'Ürün Ekle',
        'dash.menu.searchProduct': 'Ürün ara...',
        'dash.menu.aiImporter': 'AI İçe Aktar',
        'dash.menu.aiProcessing': 'AI Menüyü Analiz Ediyor...',
        'dash.menu.aiSuccess': 'Menü başarıyla aktarıldı!',
        'dash.menu.aiError': 'Menü analiz edilemedi. Lütfen tekrar deneyin.',
        'dash.menu.table.product': 'Ürün',
        'dash.menu.table.price': 'Fiyat',
        'dash.menu.table.status': 'Durum',
        'dash.menu.table.actions': 'İşlemler',
        'dash.menu.status.active': 'Aktif',
        'dash.menu.status.inactive': 'Pasif',
        'dash.menu.empty': 'Bu kategoride ürün bulunamadı.',
        'dash.menu.total': 'Toplam {count} ürün gösteriliyor',
        'dash.menu.edit.title': 'Ürünü Düzenle',
        'dash.menu.edit.name': 'Ürün Adı',
        'dash.menu.edit.price': 'Fiyat (₺)',
        'dash.menu.edit.currency': 'Para Birimi',
        'dash.menu.edit.category': 'Kategori',
        'dash.menu.edit.desc': 'Açıklama',
        'dash.menu.edit.image': 'Ürün Görseli',
        'dash.menu.edit.imageHint': 'Görsel yüklemek için tıklayın veya sürükleyin',
        'dash.menu.edit.calories': 'Kalori (kcal)',
        'dash.menu.edit.grams': 'Gram (g)',
        'dash.menu.edit.weight': 'Ağırlık (gr)',
        'dash.menu.edit.servingTime': 'Hazırlık Süresi (dk)',
        'dash.menu.edit.dietary': 'Diyet Bilgileri',
        'dash.menu.edit.allergens': 'Alerjenler',
        'dash.menu.edit.availability': 'Stok Durumu',
        'dash.menu.edit.availabilityHint': 'Ürünü menüde göster veya gizle',
        'dash.menu.edit.save': 'Değişiklikleri Kaydet',
        'dash.menu.edit.cancel': 'İptal',
        'dash.menu.edit.success': 'Ürün başarıyla kaydedildi',
        'dash.menu.add.success': 'Ürün başarıyla eklendi',
        'dash.menu.delete.confirm': 'Bu ürünü silmek istediğinize emin misiniz?',
        'dash.menu.delete.success': 'Ürün başarıyla silindi',
        'dash.menu.error.load': 'Veriler yüklenirken hata oluştu',
        'dash.menu.error.save': 'Kaydedilirken hata oluştu',

        // Dietary Tags
        'dietary.vegan': 'Vegan',
        'dietary.vegetarian': 'Vejeteryan',
        'dietary.glutenfree': 'Glutensiz',
        'dietary.lactosefree': 'Laktoz İçermez',
        'dietary.organic': 'Organik',
        'dietary.halal': 'Helal',

        // Allergens
        'allergen.gluten': 'Gluten',
        'allergen.dairy': 'Süt',
        'allergen.egg': 'Yumurta',
        'allergen.peanut': 'Fıstık',
        'allergen.soy': 'Soya',
        'allergen.fish': 'Balık',
        'allergen.shellfish': 'Kabuklu Deniz',
        'allergen.celery': 'Kereviz',
        'allergen.mustard': 'Hardal',
        'allergen.sesame': 'Susam',

        // Display Preferences
        'dash.display.title': 'Görüntüleme Tercihleri',
        'dash.display.restInfo': 'Restoran Bilgileri',
        'dash.display.restName': 'Restoran Adı',
        'dash.display.logo': 'Logo',
        'dash.display.logoUpload': 'Logo yükleyin',
        'dash.display.videoUrl': 'Tanıtım Videosu URL',
        'dash.display.themeSettings': 'Tema Ayarları',
        'dash.display.colorTheme': 'Renk Teması',
        'dash.display.categoryView': 'Kategori Görünümü',
        'dash.display.view.grid': 'Izgara',
        'dash.display.view.list': 'Liste',
        'dash.display.save': 'Değişiklikleri Kaydet',

        // Dashboard Settings
        'dash.settings.title': 'Ayarlar',
        'dash.settings.save': 'Kaydedildi',
        'dash.settings.saveBtn': 'Kaydet',

        // Sections
        'dash.settings.sections.profile': 'Profil',
        'dash.settings.sections.password': 'Şifre',
        'dash.settings.sections.restaurant': 'Restoran Bilgileri',
        'dash.settings.sections.guest': 'Misafir Bilgileri',
        'dash.settings.sections.qr': 'QR Kod Oluşturucu',
        'dash.settings.sections.ai': 'AI Sohbet Botu',
        'dash.settings.sections.pdf': 'PDF Menü',
        'dash.settings.sections.language': 'Dil',
        'dash.settings.sections.billing': 'Plan & Faturalandırma',

        // Profile
        'dash.settings.profile.title': 'Profil Bilgileri',
        'dash.settings.profile.changePhoto': 'Fotoğraf Değiştir',
        'dash.settings.profile.firstName': 'Ad',
        'dash.settings.profile.lastName': 'Soyad',
        'dash.settings.profile.email': 'E-posta',
        'dash.settings.profile.phone': 'Telefon',

        // Password
        'dash.settings.password.title': 'Şifre Değiştir',
        'dash.settings.password.current': 'Mevcut Şifre',
        'dash.settings.password.new': 'Yeni Şifre',
        'dash.settings.password.confirm': 'Yeni Şifre (Tekrar)',
        'dash.settings.password.hint': 'Şifreniz en az 8 karakter, büyük harf, küçük harf ve rakam içermelidir.',

        // Restaurant
        'dash.settings.rest.title': 'Restoran Bilgileri',
        'dash.settings.rest.name': 'Restoran Adı',
        'dash.settings.rest.desc': 'Açıklama',
        'dash.settings.rest.phone': 'Telefon',
        'dash.settings.rest.email': 'E-posta',
        'dash.settings.rest.address': 'Adres',
        'dash.settings.rest.city': 'Şehir',
        'dash.settings.rest.country': 'Ülke',
        'dash.settings.rest.logo': 'Logo',
        'dash.settings.rest.logoUpload': 'Logo yükleyin',

        // Guest Data
        'dash.settings.guest.title': 'Misafir Bilgi Toplama',
        'dash.settings.guest.desc': 'Menüye erişmeden önce müşterilerden hangi bilgilerin toplanacağını ayarlayın.',
        'dash.settings.guest.required': 'Zorunlu',
        'dash.settings.guest.collect': '{field} topla',

        // QR
        'dash.settings.qr.title': 'QR Kod Oluşturucu',
        'dash.settings.qr.desc': 'Restoranınız için özel QR kodlar oluşturun ve indirin.',
        'dash.settings.qr.copy': 'URL kopyala',
        'dash.settings.qr.open': 'Linki aç',
        'dash.settings.qr.fg': 'Ön Plan Rengi',
        'dash.settings.qr.bg': 'Arka Plan Rengi',
        'dash.settings.qr.png': 'PNG İndir',
        'dash.settings.qr.svg': 'SVG İndir',
        'dash.settings.qr.downloaded': '{format} indirildi!',

        // AI Settings
        'dash.settings.ai.title': 'AI Sohbet Botu Ayarları',
        'dash.settings.ai.desc': 'Müşterileriniz için AI destekli sohbet botunu yapılandırın.',
        'dash.settings.ai.toggle': 'Sohbet Botu',
        'dash.settings.ai.toggleHint': 'Menüde AI sohbet botunu etkinleştirin',
        'dash.settings.ai.welcome': 'Karşılama Mesajı',
        'dash.settings.ai.persona': 'Bot Karakteri',
        'dash.settings.ai.model': 'AI Modeli',

        // PDF
        'dash.settings.pdf.title': 'PDF Menü İndirme',
        'dash.settings.pdf.desc': 'Menünüzün PDF versiyonunu oluşturun ve indirin.',
        'dash.settings.pdf.lastUpdate': 'Son güncelleme: {date}',
        'dash.settings.pdf.download': 'İndir',
        'dash.settings.pdf.regenerate': 'PDF Yeniden Oluştur',

        // Language
        'dash.settings.lang.title': 'Dil Ayarları',
        'dash.settings.lang.panel': 'Panel Dili',
        'dash.settings.lang.menu': 'Menü Varsayılan Dili',

        // Billing
        'dash.settings.bill.title': 'Plan & Faturalandırma',
        'dash.settings.bill.premium': 'Premium Plan',
        'dash.settings.bill.next': 'Aylık faturalandırma • Sonraki ödeme: {date}',
        'dash.settings.bill.features': 'Plan Özellikleri',
        'dash.settings.bill.change': 'Planı Değiştir',
        'dash.settings.bill.method': 'Ödeme Yöntemi',

        // Dashboard Analytics
        'dash.analytics.title': 'Performans Analizi',
        'dash.analytics.subtitle': 'İşletmenizin dijital etkileşim verilerini buradan takip edebilirsiniz.',
        'dash.analytics.filter': 'Filtrele',
        'dash.analytics.export': 'Dışa Aktar',
        'dash.analytics.metric.views': 'Toplam Görüntülenme',
        'dash.analytics.metric.scans': 'QR Tarama Sayısı',
        'dash.analytics.metric.users': 'Tekil Kullanıcı',
        'dash.analytics.metric.duration': 'Ort. Oturum Süresi',
        'dash.analytics.chart.weekly': 'Haftalık Etkileşim',
        'dash.analytics.chart.weeklySub': 'Görüntülenme & Tarama Karşılaştırması',
        'dash.analytics.chart.categories': 'En Çok İncelenen Kategoriler',
        'dash.analytics.chart.productPerformance': 'Ürün Bazlı Performans',
        'dash.analytics.chart.comingSoon': 'Yakında: Derinlemesine Raporlar',

        // Dashboard Translations
        'dash.trans.title': 'Çeviri Yönetimi',
        'dash.trans.auto': 'Otomatik Çevir',
        'dash.trans.completed': '{progress}% tamamlandı',
        'dash.trans.search': 'Ürün veya kategori ara...',
        'dash.trans.table.type': 'Tür',
        'dash.trans.table.original': 'Orijinal (Türkçe)',
        'dash.trans.table.translation': 'Çeviri',
        'dash.trans.table.status': 'Durum',
        'dash.trans.type.category': 'Kategori',
        'dash.trans.type.product': 'Ürün',
        'dash.trans.status.done': 'Tamamlandı',
        'dash.trans.status.pending': 'Bekliyor',
        'dash.trans.noTranslation': 'Çeviri yok',
        'dash.trans.noResults': 'Sonuç bulunamadı.',

        // Dashboard Home
        'dash.home.welcome': 'Hoşgeldiniz,',
        'dash.home.operational': 'Sistem Çalışıyor',
        'dash.home.summary': 'Dijital menü yönetim paneliniz hazır. Bugün için toplam {views} menü görüntülenmesi gerçekleşti.',
        'dash.home.quickReport': 'Hızlı Rapor',
        'dash.home.support': 'Destek',
        'dash.home.stat.daily': 'Günlük İzlenme',
        'dash.home.stat.carts': 'Aktif Sepetler',
        'dash.home.stat.avgTime': 'Ort. Süre',
        'dash.home.stat.conversion': 'Geri Dönüş',
        'dash.home.events.title': 'Yaklaşan Etkinlikler',
        'dash.home.events.all': 'Tümünü Gör',
        'dash.home.activity.title': 'Sistem Hareketleri',
        'dash.home.activity.update': 'Güncelleme',
        'dash.home.activity.review': 'Yorum',
        'dash.home.activity.system': 'Sistem',

        // Cookies
        'cookie.text': 'Size daha iyi hizmet sunabilmek için çerezleri kullanıyoruz.',
        'cookie.accept': 'Kabul Et',
    },
    en: {
        // VideoLanding
        'landing.title': 'KOZBEYLİ',
        'landing.titleAccent': 'KONAĞI',
        'landing.subtitle': 'Fine Dining • Authentic Flavors • Legacy',
        'landing.cta': 'Explore Menu',
        'landing.reservation': 'RESERVATION',
        'landing.founded': 'Founded 1994',
        'landing.welcome': 'Welcome to Excellence',
        'landing.michelin': 'Michelin Standard',
        'landing.fresh': 'Fresh Daily',
        'landing.wine': 'Wine Cellar',
        'landing.history': 'Historical Venue',
        'landing.foundedText': 'Est. 1904',
        'landing.discover': 'Discover',
        'landing.location': 'KONUM',
        'landing.googleReview': 'GOOGLE YORUMLAR',

        // CategoryGrid
        'category.heritagePrefix': 'Mansion heritage:',
        'category.heritageSuffix': 'Collection',
        'menu.welcome': 'Welcome',
        'menu.restaurant': 'Kozbeyli Konağı',
        'menu.search': 'What would you like to eat?',
        'menu.categories': 'Categories',

        // ProductModal
        'product.addToOrder': 'Add to Order',
        'product.share': 'Share',
        'product.shareHeading': 'Share the Taste',
        'product.outOfStock': 'Out of Stock',
        'product.notFound': 'Product not found.',
        'product.smartPairing': 'Smart Pairing',
        'product.pairingText': 'Pairs well with',

        // MenuAssistant
        'assistant.welcome': 'Hello! I am the Kozbeyli Konağı AI assistant. How can I help you with our menu?',
        'assistant.error': "Sorry, I can't respond right now. Please try again later.",
        'assistant.tooltip': 'Ask AI Waiter ✨',
        'assistant.name': 'Gourmet AI',
        'assistant.role': 'Kozbeyli Konağı Assistant',
        'assistant.placeholder': 'Type your question here...',
        'assistant.prompt1': 'Story of the Mansion',
        'assistant.prompt2': 'What should I eat?',
        'assistant.prompt3': 'Dessert suggestion',
        'assistant.prompt4': 'Hot drinks',

        // General
        'back': 'Back',
        'search': 'Search...',
        'loading': 'Loading...',
        'menu': 'Menu',
        'close': 'Close',

        // Review Modal
        'review.title': 'How Was Your Experience?',
        'review.subtitle': 'Your Opinion is Very Valuable to Us',
        'review.name': 'Your Name (Optional)',
        'review.comment': 'Any notes you want to add? (Optional)',
        'review.submit': 'Submit Review',
        'review.submitting': 'Sending...',
        'review.success': 'Your review has been delivered!',
        'review.error': 'Review could not be sent.',
        'review.thanks': 'Thank You!',
        'review.thanksText': "We will further improve Kozbeyli Konağı with your valuable feedback. ✨",
        'review.tag1': 'Great Taste',
        'review.tag2': 'Friendly Service',
        'review.tag3': 'Elegant Atmosphere',
        'review.tag4': 'Fast Presentation',

        // Dashboard
        'dash.nav.panel': 'Dashboard',
        'dash.nav.menu': 'Menu Management',
        'dash.nav.analytics': 'Analytics',
        'dash.nav.events': 'Events',
        'dash.nav.reviews': 'Reviews',
        'dash.nav.translations': 'Translations',
        'dash.nav.qr': 'QR Design',
        'dash.nav.settings': 'Settings',
        'dash.nav.logout': 'Logout',
        'dash.header.workspace': 'Workspace',
        'dash.header.branch': 'Main Branch',

        // Dashboard Reviews
        'dash.reviews.title': 'Reviews',
        'dash.reviews.subtitle': 'Customer feedback and ratings.',
        'dash.reviews.avg': 'Average Rating',
        'dash.reviews.total': 'Total Reviews',
        'dash.reviews.recent': 'Recent Reviews',
        'dash.reviews.loading': 'Loading...',
        'dash.reviews.empty': 'No reviews yet.',
        'dash.reviews.guest': 'Guest',
        'dash.reviews.deleteConfirm': 'Are you sure you want to delete this review?',
        'dash.reviews.deleteSuccess': 'Review deleted.',
        'dash.reviews.deleteError': 'Could not delete review.',
        'dash.reviews.approveSuccess': 'Review approved.',
        'dash.reviews.approveRevoke': 'Approval revoked.',

        // Dashboard Events
        'dash.events.title': 'Event Management',
        'dash.events.subtitle': 'Manage restaurant events and special announcements here.',
        'dash.events.create': 'Create New Event',
        'dash.events.monthly': 'Monthly Events',
        'dash.events.attendees': 'Total Attendees',
        'dash.events.satisfaction': 'Satisfaction Rate',
        'dash.events.filterAll': 'All',
        'dash.events.filterUpcoming': 'Upcoming',
        'dash.events.filterPast': 'Past',
        'dash.events.search': 'Search events...',

        // Dashboard Menu
        'dash.menu.title': 'Menu Management',
        'dash.menu.tab.products': 'Categories & Products',
        'dash.menu.tab.recommendations': 'Recommendations',
        'dash.menu.tab.display': 'Display Preferences',
        'dash.menu.allCategories': 'All Categories',
        'dash.menu.addCategory': 'Add Category',
        'dash.menu.addProduct': 'Add Product',
        'dash.menu.searchProduct': 'Search products...',
        'dash.menu.aiImporter': 'AI Import',
        'dash.menu.aiProcessing': 'AI Analyzing Menu...',
        'dash.menu.aiSuccess': 'Menu imported successfully!',
        'dash.menu.aiError': 'Failed to analyze menu. Please try again.',
        'dash.menu.table.product': 'Product',
        'dash.menu.table.price': 'Price',
        'dash.menu.table.status': 'Status',
        'dash.menu.table.actions': 'Actions',
        'dash.menu.status.active': 'Active',
        'dash.menu.status.inactive': 'Inactive',
        'dash.menu.empty': 'No products found in this category.',
        'dash.menu.total': 'Showing total {count} products',
        'dash.menu.edit.title': 'Edit Product',
        'dash.menu.edit.name': 'Product Name',
        'dash.menu.edit.price': 'Price',
        'dash.menu.edit.currency': 'Currency',
        'dash.menu.edit.desc': 'Description',
        'dash.menu.edit.image': 'Product Image',
        'dash.menu.edit.imageHint': 'Click or drag to upload image',
        'dash.menu.edit.calories': 'Calories (kcal)',
        'dash.menu.edit.grams': 'Grams (g)',
        'dash.menu.edit.servingTime': 'Serving Time (min)',
        'dash.menu.edit.dietary': 'Dietary Restrictions',
        'dash.menu.edit.allergens': 'Allergens',
        'dash.menu.edit.availability': 'Product Status',
        'dash.menu.edit.availabilityHint': 'Show/hide product in menu',
        'dash.menu.edit.save': 'Save',
        'dash.menu.edit.cancel': 'Cancel',
        'dash.menu.edit.success': 'Product saved successfully',
        'dash.menu.add.success': 'Product added successfully',
        'dash.menu.delete.confirm': 'Are you sure you want to delete this product?',
        'dash.menu.delete.success': 'Product deleted successfully',
        'dash.menu.error.load': 'Error loading data',
        'dash.menu.error.save': 'Error saving changes',
        'menu.recommendations': 'Chef\'s Recommendations',
        'menu.pairingReason': 'Why?',
        'menu.addToOrderShort': 'Add',

        // Dashboard Settings
        'dash.settings.title': 'Settings',
        'dash.settings.save': 'Saved',
        'dash.settings.saveBtn': 'Save',

        // Sections
        'dash.settings.sections.profile': 'Profile',
        'dash.settings.sections.password': 'Password',
        'dash.settings.sections.restaurant': 'Restaurant Info',
        'dash.settings.sections.guest': 'Guest Info',
        'dash.settings.sections.qr': 'QR Code Generator',
        'dash.settings.sections.ai': 'AI Chatbot',
        'dash.settings.sections.pdf': 'PDF Menu',
        'dash.settings.sections.language': 'Language',
        'dash.settings.sections.billing': 'Plan & Billing',

        // Profile
        'dash.settings.profile.title': 'Profile Information',
        'dash.settings.profile.changePhoto': 'Change Photo',
        'dash.settings.profile.firstName': 'First Name',
        'dash.settings.profile.lastName': 'Last Name',
        'dash.settings.profile.email': 'Email',
        'dash.settings.profile.phone': 'Phone',

        // Password
        'dash.settings.password.title': 'Change Password',
        'dash.settings.password.current': 'Current Password',
        'dash.settings.password.new': 'New Password',
        'dash.settings.password.confirm': 'Confirm New Password',
        'dash.settings.password.hint': 'Your password must be at least 8 characters long and include uppercase, lowercase letters and numbers.',

        // Restaurant
        'dash.settings.rest.title': 'Restaurant Information',
        'dash.settings.rest.name': 'Restaurant Name',
        'dash.settings.rest.desc': 'Description',
        'dash.settings.rest.phone': 'Phone',
        'dash.settings.rest.email': 'Email',
        'dash.settings.rest.address': 'Address',
        'dash.settings.rest.city': 'City',
        'dash.settings.rest.country': 'Country',
        'dash.settings.rest.logo': 'Logo',
        'dash.settings.rest.logoUpload': 'Upload logo',

        // Guest Data
        'dash.settings.guest.title': 'Guest Information Collection',
        'dash.settings.guest.desc': 'Set which information will be collected from customers before accessing the menu.',
        'dash.settings.guest.required': 'Required',
        'dash.settings.guest.collect': 'Collect {field}',

        // QR
        'dash.settings.qr.title': 'QR Code Generator',
        'dash.settings.qr.desc': 'Create and download custom QR codes for your restaurant.',
        'dash.settings.qr.copy': 'Copy URL',
        'dash.settings.qr.open': 'Open link',
        'dash.settings.qr.fg': 'Foreground Color',
        'dash.settings.qr.bg': 'Background Color',
        'dash.settings.qr.png': 'Download PNG',
        'dash.settings.qr.svg': 'Download SVG',
        'dash.settings.qr.downloaded': '{format} downloaded!',

        // AI Settings
        'dash.settings.ai.title': 'AI Chatbot Settings',
        'dash.settings.ai.desc': 'Configure the AI-powered chatbot for your customers.',
        'dash.settings.ai.toggle': 'Chatbot',
        'dash.settings.ai.toggleHint': 'Enable AI chatbot in menu',
        'dash.settings.ai.welcome': 'Welcome Message',
        'dash.settings.ai.persona': 'Bot Persona',
        'dash.settings.ai.model': 'AI Model',

        // PDF
        'dash.settings.pdf.title': 'PDF Menu Download',
        'dash.settings.pdf.desc': 'Create and download a PDF version of your menu.',
        'dash.settings.pdf.lastUpdate': 'Last update: {date}',
        'dash.settings.pdf.download': 'Download',
        'dash.settings.pdf.regenerate': 'Regenerate PDF',

        // Language
        'dash.settings.lang.title': 'Language Settings',
        'dash.settings.lang.panel': 'Panel Language',
        'dash.settings.lang.menu': 'Menu Default Language',

        // Billing
        'dash.settings.bill.title': 'Plan & Billing',
        'dash.settings.bill.premium': 'Premium Plan',
        'dash.settings.bill.next': 'Monthly billing • Next payment: {date}',
        'dash.settings.bill.features': 'Plan Features',
        'dash.settings.bill.change': 'Change Plan',
        'dash.settings.bill.method': 'Payment Method',

        // Dashboard Analytics
        'dash.analytics.title': 'Performance Analytics',
        'dash.analytics.subtitle': 'Track your business digital engagement data here.',
        'dash.analytics.filter': 'Filter',
        'dash.analytics.export': 'Export',
        'dash.analytics.metric.views': 'Total Views',
        'dash.analytics.metric.scans': 'QR Scan Count',
        'dash.analytics.metric.users': 'Unique Users',
        'dash.analytics.metric.duration': 'Avg. Session Duration',
        'dash.analytics.chart.weekly': 'Weekly Interaction',
        'dash.analytics.chart.weeklySub': 'Views & Scans Comparison',
        'dash.analytics.chart.categories': 'Most Viewed Categories',
        'dash.analytics.chart.productPerformance': 'Product Based Performance',
        'dash.analytics.chart.comingSoon': 'Coming Soon: Detailed Reports',

        // Dashboard Translations
        'dash.trans.title': 'Translation Management',
        'dash.trans.auto': 'Auto Translate',
        'dash.trans.completed': '{progress}% completed',
        'dash.trans.search': 'Search product or category...',
        'dash.trans.table.type': 'Type',
        'dash.trans.table.original': 'Original (Turkish)',
        'dash.trans.table.translation': 'Translation',
        'dash.trans.table.status': 'Status',
        'dash.trans.type.category': 'Category',
        'dash.trans.type.product': 'Product',
        'dash.trans.status.done': 'Completed',
        'dash.trans.status.pending': 'Pending',
        'dash.trans.noTranslation': 'No translation',
        'dash.trans.noResults': 'No results found.',

        // Dashboard Home
        'dash.home.welcome': 'Welcome,',
        'dash.home.operational': 'System Operational',
        'dash.home.summary': 'Your digital menu management panel is ready. A total of {views} menu views have occurred today.',
        'dash.home.quickReport': 'Quick Report',
        'dash.home.support': 'Support',
        'dash.home.stat.daily': 'Daily Views',
        'dash.home.stat.carts': 'Active Carts',
        'dash.home.stat.avgTime': 'Avg. Time',
        'dash.home.stat.conversion': 'Conversion',
        'dash.home.events.title': 'Upcoming Events',
        'dash.home.events.all': 'See All',
        'dash.home.activity.title': 'System Activity',
        'dash.home.activity.update': 'Update',
        'dash.home.activity.review': 'Review',
        'dash.home.activity.system': 'System',

        // Cookies
        'cookie.text': 'We use cookies to provide you with a better service.',
        'cookie.accept': 'Accept',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'tr';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
