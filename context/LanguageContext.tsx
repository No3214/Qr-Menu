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
        'landing.title': 'Lezzeti Keşfet',
        'landing.subtitle': "Ege'nin en özel lezzetleri ve eşsiz sunumları sizi bekliyor.",
        'landing.cta': 'Menüyü Görüntüle',
        'landing.brandName': 'Kozbeyli Konağı',
        'landing.brandSub': 'Taş Otel',
        'landing.switchLang': 'English',

        // CategoryGrid
        'menu.welcome': 'Hoş Geldiniz',
        'menu.restaurant': 'Kozbeyli Konağı',
        'menu.search': 'Ne yemek istersiniz?',
        'menu.categories': 'Kategoriler',
        'menu.poweredBy': 'Kozbeyli Konağı',

        // ProductModal
        'product.addToOrder': 'Siparişe Ekle',
        'product.addedToOrder': 'Siparişe eklendi!',
        'product.shared': 'Kopyalandı!',
        'product.outOfStock': 'Tükendi',
        'product.notFound': 'Ürün bulunamadı.',
        'product.pairingTitle': 'Gurme Eşleşme',
        'product.category': 'Kategori',

        // Review
        'review.title': 'Değerlendir',
        'review.rateExperience': 'Deneyiminizi puanlayın',
        'review.nameLabel': 'İsim (Opsiyonel)',
        'review.namePlaceholder': 'İsminiz...',
        'review.commentLabel': 'Yorumunuz',
        'review.commentPlaceholder': 'Görüşlerinizi yazın...',
        'review.submit': 'Gönder',
        'review.thankYou': 'Teşekkürler!',
        'review.thankYouMessage': 'Yorumunuz bizim için çok değerli.',
        'review.ratingRequired': 'Lütfen puan verin.',
        'review.error': 'Bir hata oluştu.',
        'review.rating5': 'Muhteşem!',
        'review.rating4': 'Çok İyi',
        'review.rating3': 'İdare Eder',
        'review.rating2': 'Kötü',
        'review.rating1': 'Çok Kötü',

        // AI Assistant
        'assistant.welcome': 'Merhaba! Ben Kozbeyli Konağı yapay zeka asistanıyım. Size menümüz hakkında nasıl yardımcı olabilirim?',
        'assistant.error': 'Üzgünüm, şu an yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        'assistant.placeholder': 'Sorunuzu buraya yazın...',
        'assistant.tooltip': 'AI Garsona Sor',
        'assistant.title': 'Gurme AI',
        'assistant.subtitle': 'Kozbeyli Konağı Asistanı',
        'assistant.prompt1': 'Ne yemeliyim?',
        'assistant.prompt2': 'Tatlı önerisi',
        'assistant.prompt3': 'Sıcak içecekler',
        'assistant.prompt4': 'Et yemekleri',

        // Sidebar
        'sidebar.adminPanel': 'Yönetim Paneli',
        'sidebar.location': 'Konum',
        'sidebar.call': 'Ara',
        'sidebar.rateUs': 'Değerlendir',

        // Cookie
        'cookie.message': 'Bu site deneyiminizi iyileştirmek için çerezler kullanır.',
        'cookie.accept': 'Kabul Et',

        // Dashboard - Sidebar Nav
        'dash.home': 'Ana Sayfa',
        'dash.menuManagement': 'Menü Yönetimi',
        'dash.events': 'Etkinlik Tanıtımı',
        'dash.analytics': 'Analitik',
        'dash.reviews': 'Yorumlar',
        'dash.translations': 'Çeviri',
        'dash.settings': 'Ayarlar',
        'dash.closeSidebar': 'Menü kapat',
        'dash.language': 'Dil',
        'dash.logout': 'Çıkış Yap',
        'dash.dbActive': 'Veritabanı: Aktif',
        'dash.dbDemo': 'Veritabanı: Demo',
        'dash.backToMenu': 'Menüye Dön',

        // Dashboard - Reviews Page
        'dash.reviews.title': 'Değerlendirmeler',
        'dash.reviews.subtitle': 'Müşteri yorumları ve puanları.',
        'dash.reviews.avgRating': 'Ortalama Puan',
        'dash.reviews.totalReviews': 'Toplam Yorum',
        'dash.reviews.recent': 'Son Yorumlar',
        'dash.reviews.loading': 'Yükleniyor...',
        'dash.reviews.empty': 'Henüz hiç yorum yapılmamış.',
        'dash.reviews.guest': 'Misafir',
        'dash.reviews.loadError': 'Yorumlar yüklenemedi.',

        // General
        'back': 'Geri',
        'search': 'Ara...',
        'loading': 'Yükleniyor...',
        'menu': 'Menü',
    },
    en: {
        // VideoLanding
        'landing.title': 'Discover Taste',
        'landing.subtitle': "The finest flavors and unique presentations of the Aegean await you.",
        'landing.cta': 'View Menu',
        'landing.brandName': 'Kozbeyli Konağı',
        'landing.brandSub': 'Stone Hotel',
        'landing.switchLang': 'Türkçe',

        // CategoryGrid
        'menu.welcome': 'Welcome',
        'menu.restaurant': 'Kozbeyli Konağı',
        'menu.search': 'What would you like to eat?',
        'menu.categories': 'Categories',
        'menu.poweredBy': 'Kozbeyli Konağı',

        // ProductModal
        'product.addToOrder': 'Add to Order',
        'product.addedToOrder': 'Added to order!',
        'product.shared': 'Copied!',
        'product.outOfStock': 'Out of Stock',
        'product.notFound': 'Product not found.',
        'product.pairingTitle': 'Gourmet Pairing',
        'product.category': 'Category',

        // Review
        'review.title': 'Rate Us',
        'review.rateExperience': 'Rate your experience',
        'review.nameLabel': 'Name (Optional)',
        'review.namePlaceholder': 'Your name...',
        'review.commentLabel': 'Your Review',
        'review.commentPlaceholder': 'Share your thoughts...',
        'review.submit': 'Submit',
        'review.thankYou': 'Thank You!',
        'review.thankYouMessage': 'Your feedback is very valuable to us.',
        'review.ratingRequired': 'Please give a rating.',
        'review.error': 'An error occurred.',
        'review.rating5': 'Amazing!',
        'review.rating4': 'Very Good',
        'review.rating3': 'Average',
        'review.rating2': 'Poor',
        'review.rating1': 'Very Poor',

        // AI Assistant
        'assistant.welcome': 'Hello! I am the AI assistant of Kozbeyli Konagi. How can I help you with our menu?',
        'assistant.error': 'Sorry, I cannot respond right now. Please try again later.',
        'assistant.placeholder': 'Type your question here...',
        'assistant.tooltip': 'Ask AI Waiter',
        'assistant.title': 'Gourmet AI',
        'assistant.subtitle': 'Kozbeyli Konagi Assistant',
        'assistant.prompt1': 'What should I eat?',
        'assistant.prompt2': 'Dessert suggestion',
        'assistant.prompt3': 'Hot drinks',
        'assistant.prompt4': 'Meat dishes',

        // Sidebar
        'sidebar.adminPanel': 'Admin Panel',
        'sidebar.location': 'Location',
        'sidebar.call': 'Call',
        'sidebar.rateUs': 'Rate Us',

        // Cookie
        'cookie.message': 'This site uses cookies to improve your experience.',
        'cookie.accept': 'Accept',

        // Dashboard - Sidebar Nav
        'dash.home': 'Home',
        'dash.menuManagement': 'Menu Management',
        'dash.events': 'Events',
        'dash.analytics': 'Analytics',
        'dash.reviews': 'Reviews',
        'dash.translations': 'Translations',
        'dash.settings': 'Settings',
        'dash.closeSidebar': 'Close menu',
        'dash.language': 'Language',
        'dash.logout': 'Logout',
        'dash.dbActive': 'Database: Active',
        'dash.dbDemo': 'Database: Demo',
        'dash.backToMenu': 'Back to Menu',

        // Dashboard - Reviews Page
        'dash.reviews.title': 'Reviews',
        'dash.reviews.subtitle': 'Customer reviews and ratings.',
        'dash.reviews.avgRating': 'Average Rating',
        'dash.reviews.totalReviews': 'Total Reviews',
        'dash.reviews.recent': 'Recent Reviews',
        'dash.reviews.loading': 'Loading...',
        'dash.reviews.empty': 'No reviews yet.',
        'dash.reviews.guest': 'Guest',
        'dash.reviews.loadError': 'Could not load reviews.',

        // General
        'back': 'Back',
        'search': 'Search...',
        'loading': 'Loading...',
        'menu': 'Menu',
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
