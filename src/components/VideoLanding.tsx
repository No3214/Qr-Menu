import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Globe, MapPin, Award, Sparkles, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoLandingProps {
    onEnter: () => void;
}

export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter }) => {
    const { t, language, setLanguage } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    const floatingAnimation = {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#d6d3cb] via-[#e0ddd5] to-[#d6d3cb] overflow-hidden font-inter text-[#434b45]">
            {/* Animated Background Patterns */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full"
                >
                    <div className="w-full h-full bg-gradient-conic from-[#8b735b]/5 via-transparent to-[#8b735b]/5 blur-3xl" />
                </motion.div>
            </div>

            {/* Video Background with Enhanced Overlay */}
            <div className={`absolute inset-0 transition-all duration-[2s] ease-out ${isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-[0.06] mix-blend-multiply grayscale"
                >
                    <source src="https://cdn.pixabay.com/vimeo/328243394/food-22534.mp4?width=1280&hash=d8a4d4a8e2e2a1e1" type="video/mp4" />
                </video>
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d6d3cb]/30 to-[#d6d3cb]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#d6d3cb_70%)]" />
            </div>

            {/* Decorative Elements */}
            <motion.div
                animate={floatingAnimation}
                className="absolute top-20 left-10 w-20 h-20 bg-[#8b735b]/10 rounded-full blur-2xl"
            />
            <motion.div
                animate={{
                    y: [10, -10, 10],
                    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const }
                }}
                className="absolute bottom-40 right-10 w-32 h-32 bg-[#434b45]/10 rounded-full blur-3xl"
            />

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Premium Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`fixed top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-center transition-all duration-500 z-50 ${scrolled ? 'bg-[#d6d3cb]/95 backdrop-blur-xl py-3 shadow-lg border-b border-[#434b45]/10' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-[#8b735b]/30 rounded-2xl flex items-center justify-center bg-white/40 backdrop-blur-sm overflow-hidden p-1.5 shadow-lg"
                        >
                            <img src="/assets/logo-main.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold text-[#434b45]">{t('menu.restaurant')}</p>
                            <p className="text-[10px] text-[#434b45]/50">{t('landing.founded')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl border border-[#434b45]/10"
                        >
                            <Clock className="w-3.5 h-3.5 text-[#8b735b]" />
                            <span className="text-[10px] font-semibold text-[#434b45]">09:00 - 23:00</span>
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                            className="h-10 sm:h-11 px-4 bg-white/40 backdrop-blur-sm hover:bg-white/60 border border-[#434b45]/10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            <Globe className="w-4 h-4 text-[#8b735b]" />
                            <span className="text-xs text-[#434b45] uppercase tracking-wider font-bold">{language}</span>
                        </motion.button>
                    </div>
                </motion.header>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-20 md:pt-28">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8 md:space-y-10"
                    >
                        {/* Hero Logo Display */}
                        <motion.div variants={itemVariants} className="relative inline-block">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 blur-3xl bg-[#8b735b]/20 rounded-full scale-150 animate-pulse" />
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 bg-white/30 backdrop-blur-md rounded-[2rem] p-4 sm:p-5 border-2 border-white/40 shadow-2xl"
                            >
                                <img src="/assets/logo-main.jpg" alt="Kozbeyli Konağı" className="w-full h-full object-contain drop-shadow-xl" />
                                {/* Premium Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1, type: "spring" }}
                                    className="absolute -top-2 -right-2 px-3 py-1.5 bg-[#8b735b] rounded-full shadow-lg"
                                >
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-white" />
                                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">Premium</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#434b45] leading-[1.1] uppercase tracking-tight">
                                {t('landing.title')}
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-[#8b735b] italic lowercase block mt-2"
                                >
                                    {t('landing.titleAccent')}
                                </motion.span>
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-[#434b45]/50 font-serif italic text-sm sm:text-base tracking-widest max-w-xl mx-auto">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8b735b]/30"
                                />
                                <span className="px-4">{t('landing.subtitle')}</span>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8b735b]/30"
                                />
                            </div>
                        </motion.div>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto w-full pt-2">
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(67, 75, 69, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onEnter}
                                className="group relative w-full sm:w-auto bg-gradient-to-r from-[#434b45] to-[#3d443e] text-white px-10 sm:px-14 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all shadow-xl overflow-hidden"
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative">{t('landing.cta')}</span>
                                <ArrowRight className="w-4 h-4 relative transition-transform group-hover:translate-x-1" />
                            </motion.button>

                            <motion.a
                                href="tel:+905551234567"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto bg-white/40 backdrop-blur-md text-[#434b45] border-2 border-[#434b45]/10 px-10 sm:px-12 py-5 rounded-2xl font-bold text-xs tracking-[0.2em] hover:bg-white/60 hover:border-[#8b735b]/30 transition-all uppercase flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Phone className="w-4 h-4 text-[#8b735b]" />
                                <span>{t('landing.reservation')}</span>
                            </motion.a>
                        </motion.div>

                        {/* Location & Reviews */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 max-w-lg mx-auto"
                        >
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href="https://maps.google.com/?q=Kozbeyli+Konağı"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-4 py-2.5 bg-white/30 backdrop-blur-sm rounded-xl border border-[#434b45]/10 text-[#434b45]/70 hover:text-[#434b45] hover:bg-white/50 transition-all group"
                            >
                                <MapPin className="w-4 h-4 text-[#8b735b]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t('landing.location')}</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, y: -2 }}
                                href="https://g.page/r/CUHDLHRfWTPMEBM/review"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-4 py-2.5 bg-white/30 backdrop-blur-sm rounded-xl border border-[#434b45]/10 text-[#434b45]/70 hover:text-[#434b45] hover:bg-white/50 transition-all group"
                            >
                                <Award className="w-4 h-4 text-[#8b735b]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t('landing.googleReview')}</span>
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </main>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="pb-10 flex flex-col items-center gap-3 text-[#434b45]/30"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-[#434b45]/20 rounded-full flex items-start justify-center p-1.5"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-3 bg-[#8b735b]/60 rounded-full"
                        />
                    </motion.div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll</span>
                </motion.div>
            </div>
        </div>
    );
};
