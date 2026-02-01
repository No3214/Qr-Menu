import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, variables?: Record<string, string>) => string;
}

const translations: Record<Language, Record<string, string>> = {
    tr: {
        // VideoLanding
        'landing.title': 'Lezzeti Keşfet',
        'landing.subtitle': "Ege'nin en özel lezzetleri ve eşsiz sunumları sizi bekliyor.",
        'landing.cta': 'Menüyü Keşfedin',
        'landing.welcome': 'Mükemmelliğe Hoş Geldiniz',
        'landing.fineDining': 'Fine Dining',
        'landing.authentic': 'Otantik Lezzetler',
        'landing.legacy': 'Miras',
        'landing.reservation': 'REZERVASYON',
        'landing.michelin': 'Michelin Standardı',
        'landing.fresh': 'Günlük Taze',
        'landing.wine': 'Şarap Mahzeni',
        'landing.venue': 'Tarihi Mekan',
        'landing.scroll': 'Kaydır',
        'landing.founded': 'Kuruluş 1994',
        'landing.cookies.title': 'Çerez Politikası',
        'landing.cookies.desc': 'Size daha iyi bir deneyim sunabilmek için sitemizde çerezler kullanılmaktadır. Devam ederek çerez kullanımını kabul etmiş sayılırsınız.',
        'landing.cookies.accept': 'Kabul Et',
        'landing.cookies.close': 'Kapat',

        // CategoryGrid
        'menu.welcome': 'Hoş Geldiniz',
        'menu.restaurant': 'Kozbeyli Konağı',
        'menu.search': 'Ne yemek istersiniz?',
        'menu.categories': 'Kategoriler',

        // ProductModal
        'product.addToOrder': 'Siparişe Ekle',
        'product.outOfStock': 'Tükendi',
        'product.notFound': 'Ürün bulunamadı.',

        // General
        'back': 'Geri',
        'search': 'Ara...',
        'loading': 'Yükleniyor...',
        'menu': 'Menü',

        // Review Modal
        'review.title': 'Deneyiminizi Değerlendirin',
        'review.name': 'İsminiz',
        'review.comment': 'Yorumunuz',
        'review.submit': 'Gönder',
        'review.success': 'Yorumunuz alındı, teşekkürler!',
        'review.rating': 'Puanınız',
        'product.aiPairing': 'Gurme Eşleşme ✨',
        'waiter.call': 'Garsonu Çağır',
        'waiter.notified': 'Garson Bilgilendirildi',
        'menu.categoryDesc': 'En lezzetli {category} çeşitlerimiz',
    },
    en: {
        // VideoLanding
        'landing.title': 'Discover Taste',
        'landing.subtitle': "The finest flavors and unique presentations of the Aegean await you.",
        'landing.cta': 'Explore Menu',
        'landing.welcome': 'Welcome to Excellence',
        'landing.fineDining': 'Fine Dining',
        'landing.authentic': 'Authentic Flavors',
        'landing.legacy': 'Legacy',
        'landing.reservation': 'RESERVATION',
        'landing.michelin': 'Michelin Standard',
        'landing.fresh': 'Fresh Daily',
        'landing.wine': 'Wine Cellar',
        'landing.venue': 'Historical Venue',
        'landing.scroll': 'Scroll',
        'landing.founded': 'Founded 1994',
        'landing.cookies.title': 'Cookie Policy',
        'landing.cookies.desc': 'Cookies are used on our site to provide you with a better experience. By continuing, you agree to the use of cookies.',
        'landing.cookies.accept': 'Accept',
        'landing.cookies.close': 'Close',

        // CategoryGrid
        'menu.welcome': 'Welcome',
        'menu.restaurant': 'Kozbeyli Konağı',
        'menu.search': 'What would you like to eat?',
        'menu.categories': 'Categories',

        // ProductModal
        'product.addToOrder': 'Add to Order',
        'product.outOfStock': 'Out of Stock',
        'product.notFound': 'Product not found.',

        // General
        'back': 'Back',
        'search': 'Search...',
        'loading': 'Loading...',
        'menu': 'Menu',

        // Review Modal
        'review.title': 'Rate Your Experience',
        'review.name': 'Your Name',
        'review.comment': 'Your Comment',
        'review.submit': 'Submit',
        'review.success': 'Review submitted, thank you!',
        'review.rating': 'Your Rating',
        'product.aiPairing': 'Gourmet Pairing ✨',
        'waiter.call': 'Call Waiter',
        'waiter.notified': 'Waiter Notified',
        'menu.categoryDesc': 'Our most delicious {category} selections',
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

    const t = (key: string, variables?: Record<string, string>): string => {
        let text = translations[language][key] || key;
        if (variables) {
            Object.entries(variables).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        return text;
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
