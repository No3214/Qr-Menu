
import React, { useState, useEffect } from 'react';
import { Utensils, Award, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VideoLandingProps {
    onEnter: () => void;
}

export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter }) => {
    const { t, language, setLanguage } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showCookies, setShowCookies] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            const timer = setTimeout(() => setShowCookies(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-stone-950 overflow-hidden font-inter">
            {/* Cinematic Video Background */}
            <div className={`absolute inset-0 transition-transform duration-[2s] ease-out ${isLoaded ? 'scale-100' : 'scale-110'}`}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-60 grayscale-[20%]"
                >
                    <source src="https://cdn.pixabay.com/vimeo/328243394/food-22534.mp4?width=1280&hash=d8a4d4a8e2e2a1e1" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950" />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-stone-950/40" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Minimal Header */}
                <header className={`fixed top-0 inset-x-0 p-6 flex justify-between items-center transition-all duration-500 z-50 ${scrolled ? 'bg-stone-950/80 backdrop-blur-md py-4' : ''}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border-2 border-primary rounded-xl flex items-center justify-center">
                            <span className="text-xl font-black text-white italic">K</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold hidden sm:block">{t('landing.founded')}</span>
                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                        <button
                            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                            className="text-[10px] text-primary uppercase tracking-[0.3em] font-black border-b border-primary pb-1 active:scale-95 transition-transform"
                        >
                            {language === 'tr' ? 'EN' : 'TR'}
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-20">
                    <div className={`space-y-8 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {/* Status Label */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] text-white font-black uppercase tracking-[0.4em]">{t('landing.welcome')}</span>
                        </div>

                        {/* Title Section */}
                        <div className="relative">
                            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-4">
                                KOZBEYLİ<br />
                                <span className="text-primary italic">KONAĞI</span>
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-white/30 mb-8 font-serif italic text-lg sm:text-2xl">
                                <span>{t('landing.fineDining')}</span>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>{t('landing.authentic')}</span>
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>{t('landing.legacy')}</span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto w-full">
                            <button
                                onClick={onEnter}
                                className="group relative w-full sm:w-auto bg-primary text-stone-950 px-10 py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)] overflow-hidden"
                            >
                                <span>{t('landing.cta')}</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                            </button>

                            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-6 rounded-[24px] font-bold text-sm tracking-[0.2em] hover:bg-white/10 transition-all">
                                {t('landing.reservation')}
                            </button>
                        </div>
                    </div>

                    {/* Features Scroll Reveal */}
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        {[
                            { label: t('landing.michelin'), icon: Award },
                            { label: t('landing.fresh'), icon: Utensils },
                            { label: t('landing.wine'), icon: Sparkles },
                            { label: t('landing.venue'), icon: MapPin },
                        ].map((feature, idx) => (
                            <div key={idx} className="group cursor-default">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:bg-primary transition-all duration-500">
                                    <feature.icon className="w-5 h-5 text-white transition-colors group-hover:text-stone-950" />
                                </div>
                                <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black group-hover:text-white transition-colors">{feature.label}</p>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Scroll Indicator */}
                <div className="pb-12 flex flex-col items-center gap-4 text-white/20">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('landing.scroll')}</span>
                </div>
            </div>

            {/* Cookie Notice Modal */}
            {showCookies && (
                <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100] animate-premium-fade">
                    <div className="bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-sm mb-1">{t('landing.cookies.title')}</h3>
                                <p className="text-white/60 text-[11px] leading-relaxed mb-4">
                                    {t('landing.cookies.desc')}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('cookiesAccepted', 'true');
                                            setShowCookies(false);
                                        }}
                                        className="flex-1 bg-primary text-stone-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                                    >
                                        {t('landing.cookies.accept')}
                                    </button>
                                    <button
                                        onClick={() => setShowCookies(false)}
                                        className="px-4 py-3 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                                    >
                                        {t('landing.cookies.close')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
