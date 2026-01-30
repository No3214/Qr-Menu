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
    },
    en: {
        // VideoLanding
        'landing.title': 'Discover Taste',
        'landing.subtitle': "The finest flavors and unique presentations of the Aegean await you.",
        'landing.cta': 'View Menu',

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
