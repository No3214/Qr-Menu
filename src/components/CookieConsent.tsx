import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 inset-x-6 z-50 animate-premium-fade">
            <div className="max-w-xl mx-auto bg-stone-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl flex flex-col sm:flex-row items-center gap-6">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <p className="text-white/90 text-[13px] font-medium leading-relaxed">
                        {t('cookie.text')}
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none bg-white text-stone-900 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                        {t('cookie.accept')}
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-3 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
