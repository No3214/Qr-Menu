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

        // CategoryGrid
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
        'product.pairingText': 'Bununla iyi gider',

        // General
        'back': 'Geri',
        'search': 'Ara...',
        'loading': 'Yükleniyor...',
        'menu': 'Menü',
        'close': 'Kapat',

        // Review Modal
        'review.title': 'Deneyiminizi Değerlendirin',
        'review.name': 'İsminiz',
        'review.comment': 'Yorumunuz',
        'review.submit': 'Gönder',
        'review.success': 'Yorumunuz alındı, teşekkürler!',
        'review.rating': 'Puanınız',

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

        // CategoryGrid
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

        // General
        'back': 'Back',
        'search': 'Search...',
        'loading': 'Loading...',
        'menu': 'Menu',
        'close': 'Close',

        // Review Modal
        'review.title': 'Rate Your Experience',
        'review.name': 'Your Name',
        'review.comment': 'Your Comment',
        'review.submit': 'Submit',
        'review.success': 'Review submitted, thank you!',
        'review.rating': 'Your Rating',

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
