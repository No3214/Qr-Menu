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
        'menu.poweredBy': 'Powered by',

        // ProductModal
        'product.addToOrder': 'Siparişe Ekle',
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

        // Sidebar
        'sidebar.adminPanel': 'Yönetim Paneli',
        'sidebar.location': 'Konum',
        'sidebar.call': 'Ara',
        'sidebar.rateUs': 'Değerlendir',

        // Cookie
        'cookie.message': 'Bu site deneyiminizi iyileştirmek için çerezler kullanır.',
        'cookie.accept': 'Kabul Et',

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
        'menu.poweredBy': 'Powered by',

        // ProductModal
        'product.addToOrder': 'Add to Order',
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

        // Sidebar
        'sidebar.adminPanel': 'Admin Panel',
        'sidebar.location': 'Location',
        'sidebar.call': 'Call',
        'sidebar.rateUs': 'Rate Us',

        // Cookie
        'cookie.message': 'This site uses cookies to improve your experience.',
        'cookie.accept': 'Accept',

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
