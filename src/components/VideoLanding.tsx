import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Globe, MapPin, Award } from 'lucide-react';

interface VideoLandingProps {
    onEnter: () => void;
}

export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter }) => {
    const { t, language, setLanguage } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#F4F1EA] overflow-hidden font-sans text-[#1A1A1A]">
            {/* Minimalist Texture Over Video */}
            <div className={`absolute inset-0 transition-transform duration-[2s] ease-out ${isLoaded ? 'scale-100' : 'scale-110'}`}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-[0.08] mix-blend-multiply grayscale"
                >
                    <source src="https://cdn.pixabay.com/vimeo/328243394/food-22534.mp4?width=1280&hash=d8a4d4a8e2e2a1e1" type="video/mp4" />
                </video>
                {/* Subtle Brand Overlay */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#d6d3cb]/60" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Minimal Header */}
                <header className={`fixed top-0 inset-x-0 p-6 flex justify-between items-center transition-all duration-500 z-50 ${scrolled ? 'bg-[#F4F1EA]/90 backdrop-blur-md py-4 shadow-sm border-b border-[#1A1A1A]/5' : ''}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 border-2 border-[#1A1A1A]/20 rounded-xl flex items-center justify-center bg-white/20 overflow-hidden p-1">
                            <img src="/assets/logo-main.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6 font-sans">
                        <span className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-[0.3em] font-bold hidden sm:block">{t('landing.founded')}</span>
                        <div className="h-4 w-[1px] bg-[#1A1A1A]/10 hidden sm:block" />
                        <button
                            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                            className="h-9 px-3 bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Globe className="w-3.5 h-3.5 text-[#1A1A1A]/60" />
                            <span className="text-[10px] text-[#1A1A1A] uppercase tracking-[0.2em] font-bold">{language}</span>
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-16 md:pt-24">
                    <div className={`space-y-8 md:space-y-12 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                        {/* Hero Logo Display */}
                        <div className="relative inline-block">
                            <div className="absolute inset-0 blur-2xl bg-[#434b45]/5 rounded-full scale-150" />
                            <div className="relative w-40 h-40 md:w-56 md:h-56 animate-premium-fade bg-white/10 rounded-3xl p-4 backdrop-blur-sm border border-white/20 shadow-2xl">
                                <img src="/assets/logo-main.jpg" alt="Kozbeyli Konağı" className="w-full h-full object-contain shadow-2xl" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#1A1A1A] leading-[1.1] uppercase tracking-tight font-serif">
                                {t('landing.title')}<br />
                                <span className="text-[#C5A059] italic lowercase block mt-2 opacity-90">{t('landing.titleAccent')}</span>
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-[#1A1A1A]/50 font-serif italic text-sm sm:text-lg tracking-widest max-w-2xl mx-auto">
                                <div className="h-px flex-1 bg-[#1A1A1A]/10" />
                                <span className="px-4">{t('landing.subtitle')}</span>
                                <div className="h-px flex-1 bg-[#1A1A1A]/10" />
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto w-full pt-4 font-sans">
                            <button
                                onClick={onEnter}
                                className="group relative w-full sm:w-auto bg-[#1A1A1A] text-white px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-[#2A2A2A] hover:shadow-2xl hover:scale-105 active:scale-95"
                            >
                                <span>{t('landing.cta')}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button className="w-full sm:w-auto bg-white/30 backdrop-blur-md text-[#1A1A1A] border border-[#1A1A1A]/10 px-12 py-5 rounded-2xl font-bold text-xs tracking-[0.2em] hover:bg-white/50 transition-all uppercase">
                                {t('landing.reservation')}
                            </button>
                        </div>

                        {/* Location & Reviews */}
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 border-t border-[#1A1A1A]/5 max-w-lg mx-auto font-sans">
                            <a
                                href="https://maps.google.com/?q=Kozbeyli+Konağı"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all group"
                            >
                                <MapPin className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{t('landing.location')}</span>
                            </a>
                            <div className="w-1 h-1 bg-[#1A1A1A]/10 rounded-full hidden xs:block" />
                            <a
                                href="https://g.page/r/CUHDLHRfWTPMEBM/review"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-all group"
                            >
                                <Award className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{t('landing.googleReview')}</span>
                            </a>
                        </div>
                    </div>
                </main>

                {/* Scroll Indicator */}
                <div className="pb-12 flex flex-col items-center gap-4 text-[#434b45]/20">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#434b45] to-transparent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-inter">Scroll</span>
                </div>
            </div>
        </div>
    );
};
