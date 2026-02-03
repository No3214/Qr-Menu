import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Globe, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, revealMask } from '../utils/animations';

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
        <div className="relative min-h-screen bg-bg overflow-hidden font-sans text-text">
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
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-bg/60" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Minimal Header */}
                <header className={`fixed top-0 inset-x-0 p-6 flex justify-between items-center transition-all duration-500 z-50 ${scrolled ? 'bg-bg/90 backdrop-blur-md py-4 shadow-sm border-b border-primary/5' : ''}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 border-2 border-primary/20 rounded-xl flex items-center justify-center bg-white/20 overflow-hidden p-1">
                            <img src="/assets/logo-main.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] text-text-muted/60 uppercase tracking-[0.3em] font-bold hidden sm:block">{t('landing.founded')}</span>
                        <div className="h-4 w-[1px] bg-primary/10 hidden sm:block" />
                        <button
                            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                            className="h-9 px-3 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Globe className="w-3.5 h-3.5 text-text-muted/60" />
                            <span className="text-[10px] text-text uppercase tracking-[0.2em] font-black">{language}</span>
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-16 md:pt-24">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isLoaded ? "show" : "hidden"}
                        className="space-y-8 md:space-y-12"
                    >
                        {/* Hero Logo Display */}
                        <motion.div variants={revealMask} className="relative inline-block">
                            <div className="absolute inset-0 blur-2xl bg-primary/5 rounded-full scale-150" />
                            <div className="relative w-40 h-40 md:w-56 md:h-56 bg-white/10 rounded-3xl p-4 backdrop-blur-sm border border-white/20 shadow-2xl">
                                <img src="/assets/logo-main.jpg" alt="Kozbeyli Konağı" className="w-full h-full object-contain shadow-2xl" />
                            </div>
                        </motion.div>

                        {/* Text Content */}
                        <div className="space-y-4">
                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-text leading-[1.1] uppercase tracking-tighter"
                            >
                                {t('landing.title')}<br />
                                <span className="text-accent italic lowercase block mt-2 opacity-90">{t('landing.titleAccent')}</span>
                            </motion.h1>
                            <motion.div
                                variants={fadeInUp}
                                className="flex items-center justify-center gap-4 text-text-muted font-serif italic text-sm sm:text-lg tracking-widest max-w-2xl mx-auto"
                            >
                                <div className="h-px flex-1 bg-primary/10" />
                                <span className="px-4">{t('landing.subtitle')}</span>
                                <div className="h-px flex-1 bg-primary/10" />
                            </motion.div>
                        </div>

                        {/* CTAs */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto w-full pt-4"
                        >
                            <button
                                onClick={onEnter}
                                className="group relative w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-primary-hover hover:shadow-2xl hover:scale-105 active:scale-95"
                            >
                                <span>{t('landing.cta')}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button className="w-full sm:w-auto bg-white/30 backdrop-blur-md text-text border border-primary/10 px-12 py-5 rounded-2xl font-bold text-xs tracking-[0.2em] hover:bg-white/50 transition-all uppercase">
                                {t('landing.reservation')}
                            </button>
                        </motion.div>

                        {/* Location & Reviews */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 border-t border-primary/5 max-w-lg mx-auto"
                        >
                            <a
                                href="https://maps.google.com/?q=Kozbeyli+Konağı"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-text-muted hover:text-text transition-all group"
                            >
                                <MapPin className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t('landing.location')}</span>
                            </a>
                            <div className="w-1 h-1 bg-primary/10 rounded-full hidden xs:block" />
                            <a
                                href="https://g.page/r/CUHDLHRfWTPMEBM/review"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-text-muted hover:text-text transition-all group"
                            >
                                <Award className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t('landing.googleReview')}</span>
                            </a>
                        </motion.div>
                    </motion.div>
                </main>

                {/* Scroll Indicator */}
                <div className="pb-12 flex flex-col items-center gap-4 text-text/20">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-sans">Scroll</span>
                </div>
            </div>
        </div>
    );
};
