import React, { useState, useEffect } from 'react';
import { Category } from '../services/MenuData';
import { ChevronDown, Menu, Globe, X, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ReviewModal } from './ReviewModal';

interface VideoLandingProps {
    onEnter: () => void;
    categories: Category[];
    onCategorySelect: (categoryId: string) => void;
}

/**
 * VideoLanding - The entry screen with multi-language support and sidebar
 */
export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter, categories, onCategorySelect }) => {
    const { language, setLanguage, t } = useLanguage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showCookies, setShowCookies] = useState(false);

    // Cookie consent check
    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) setShowCookies(true);
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowCookies(false);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'tr' ? 'en' : 'tr');
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Media */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2574&auto=format&fit=crop"
                    alt="Atmosphere"
                    className="w-full h-full object-cover scale-105 animate-[pulse_8s_ease-in-out_infinite] opacity-80"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`
                fixed top-0 left-0 h-full w-72 bg-white z-50
                transform transition-transform duration-300 ease-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-5">
                    <div className="flex items-center justify-between mb-8">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                                <img src="/assets/logo-white.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl p-0.5" />
                            </div>
                            <div className="flex flex-col items-start -space-y-0.5">
                                <span className="text-sm font-bold text-white tracking-tight drop-shadow-md">KOZBEYLİ KONAĞI</span>
                                <span className="text-[10px] text-white/80 font-medium tracking-widest uppercase drop-shadow-sm">Taş Otel</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <div className="space-y-1 mb-6">
                            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {language === 'tr' ? 'Menü' : 'Menu'}
                            </p>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        onCategorySelect(cat.id);
                                        setSidebarOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors text-left"
                                >
                                    <span className="font-medium text-sm">{cat.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="h-px bg-gray-100 my-2 mx-4" />

                        <a
                            href="https://maps.google.com/?q=Kozbeyli+Konağı+Foça"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                            <MapPin size={20} />
                            <span className="font-medium">{language === 'tr' ? 'Konum' : 'Location'}</span>
                        </a>

                        <a
                            href="tel:+905322342686"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                            <Phone size={20} />
                            <span className="font-medium">{language === 'tr' ? 'Ara' : 'Call'}</span>
                        </a>

                        <button
                            onClick={() => {
                                setSidebarOpen(false);
                                setShowReviewModal(true);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors text-left"
                        >
                            <MessageSquare size={20} />
                            <span className="font-medium">{language === 'tr' ? 'Değerlendir' : 'Rate Us'}</span>
                        </button>
                    </nav>

                    <div className="absolute bottom-6 left-5 right-5">
                        <button
                            onClick={() => {
                                toggleLanguage();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-700 font-medium"
                        >
                            <Globe size={18} />
                            {language === 'tr' ? 'English' : 'Türkçe'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 text-white">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center group cursor-pointer" onClick={onEnter}>
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-1.5 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3">
                        <span className="font-bold text-white text-2xl drop-shadow-md">K</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-90 text-primary">Kozbeyli Konağı</span>
                </div>

                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-xl flex items-center gap-1.5 hover:bg-white/20 transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">{language}</span>
                </button>
            </header>

            {/* Content & CTA */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-12 px-6 text-center">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{t('landing.title')}</h1>
                <p className="text-white/80 text-sm mb-8 max-w-[280px] leading-relaxed">
                    {t('landing.subtitle')}
                </p>

                <button
                    onClick={() => {
                        // Defer state change to next frame to improve INP
                        requestAnimationFrame(() => {
                            onEnter();
                        });
                    }}
                    className="group flex flex-col items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                    <span className="text-sm font-medium tracking-widest uppercase border border-white/30 px-6 py-3 rounded-full backdrop-blur-md bg-white/10 group-hover:bg-white/20 transition-all">
                        {t('landing.cta')}
                    </span>
                    <ChevronDown className="w-6 h-6 animate-bounce mt-2 opacity-70" />
                </button>
            </div>
            {/* Review Modal */}
            {showReviewModal && <ReviewModal onClose={() => setShowReviewModal(false)} />}

            {/* Cookie Consent Banner */}
            {showCookies && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
                    <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-700 text-center sm:text-left">
                            {language === 'tr'
                                ? 'Bu site deneyiminizi iyileştirmek için çerezler kullanır.'
                                : 'This site uses cookies to improve your experience.'}
                        </p>
                        <button
                            onClick={handleAcceptCookies}
                            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover transition-colors whitespace-nowrap"
                        >
                            {language === 'tr' ? 'Kabul Et' : 'Accept'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
