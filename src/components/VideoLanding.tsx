
import React, { useState, useEffect } from 'react';
import { Utensils, Award, Sparkles, MapPin, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VideoLandingProps {
    onEnter: () => void;
}

export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter }) => {
    const { language, setLanguage, t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

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
                            className="h-9 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <Globe className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] text-white uppercase tracking-[0.2em] font-black">{language}</span>
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
                            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-4 uppercase">
                                {t('landing.title')}<br />
                                <span className="text-primary italic lowercase">{t('landing.titleAccent')}</span>
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-white/30 mb-8 font-serif italic text-lg sm:text-2xl">
                                <span>{t('landing.subtitle')}</span>
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

                            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-6 rounded-[24px] font-bold text-sm tracking-[0.2em] hover:bg-white/10 transition-all uppercase">
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
                            { label: t('landing.history'), icon: MapPin },
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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
                </div>
            </div>
        </div>
    );
};
