import React from 'react';
import { useBrand } from '../context/BrandContext';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * MenuFooter - Premium branding footer with elegant design
 */
export const MenuFooter: React.FC = () => {
    const { brand, canUseFeature } = useBrand();

    // Premium users can remove branding
    if (canUseFeature('removeBranding')) {
        return null;
    }

    return (
        <div className="relative z-20 pb-safe">
            <div className="max-w-[480px] mx-auto">
                {/* Gradient Fade Top */}
                <div className="h-12 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />

                {/* Footer Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-stone-50 px-6 py-6 border-t border-stone-100"
                >
                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-stone-200" />
                        <Sparkles className="w-4 h-4 text-stone-300" />
                        <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-stone-200" />
                    </div>

                    {/* Brand Info */}
                    <div className="text-center space-y-2">
                        <motion.a
                            href="https://kozbeylikonagi.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-stone-100 hover:border-primary/20 hover:shadow-md transition-all group"
                        >
                            <img
                                src="/assets/logo-dark.jpg"
                                alt={brand.name || 'Kozbeyli Konağı'}
                                className="w-6 h-6 rounded-md object-contain"
                            />
                            <span className="text-sm font-bold text-stone-700 group-hover:text-primary transition-colors">
                                {brand.name || 'Kozbeyli Konağı'}
                            </span>
                        </motion.a>

                        <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium">
                            Dijital Menü Deneyimi
                        </p>

                        {/* Made with love */}
                        <div className="flex items-center justify-center gap-1.5 pt-2 text-stone-300">
                            <span className="text-[10px]">Made with</span>
                            <Heart className="w-3 h-3 text-red-400 fill-red-400 animate-pulse" />
                            <span className="text-[10px]">in Türkiye</span>
                        </div>
                    </div>

                    {/* Bottom Safe Area Spacer */}
                    <div className="h-2" />
                </motion.div>
            </div>
        </div>
    );
};
