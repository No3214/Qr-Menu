import React, { memo } from 'react';
import { Category } from '../services/MenuService';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryGridProps {
    categories: Category[];
    onCategorySelect: (id: string) => void;
}

/**
 * CategoryGrid - Premium mosaic layout with animations
 */
export const CategoryGrid: React.FC<CategoryGridProps> = memo(({ categories, onCategorySelect }) => {
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <motion.div
            className="p-4 pb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6 px-1">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-stone-900">{t('menu.categories')}</h2>
                    <p className="text-xs text-stone-500">{categories.length} kategori</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {categories.map((category, index) => {
                    // Pattern: Full width for first item and every 5th, half width for others
                    const isLarge = index === 0 || index % 5 === 0;

                    return (
                        <motion.div
                            key={category.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onCategorySelect(category.id)}
                            className={`relative overflow-hidden rounded-2xl cursor-pointer group
                                ${isLarge ? 'col-span-2 h-48 sm:h-56' : 'col-span-1 h-36 sm:h-44'}
                            `}
                        >
                            {/* Background Image with Parallax Effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={category.image}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={category.title}
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 transition-all duration-500 ${
                                isLarge
                                    ? 'bg-gradient-to-t from-black/90 via-black/50 to-black/10'
                                    : 'bg-gradient-to-t from-black/85 via-black/40 to-black/5'
                            } group-hover:from-black/95`} />

                            {/* Accent Border Effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500" />

                            {/* Content */}
                            <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                                <div className="transform transition-all duration-500 group-hover:-translate-y-1">
                                    {/* Category Title */}
                                    <h3 className={`font-bold text-white leading-tight ${
                                        isLarge ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
                                    }`}>
                                        {category.title}
                                    </h3>

                                    {/* Description */}
                                    {category.description && (
                                        <p className={`text-white/70 font-medium mt-1.5 line-clamp-1 ${
                                            isLarge ? 'text-sm' : 'text-xs'
                                        }`}>
                                            {category.description}
                                        </p>
                                    )}
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Hover Badge */}
                            <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 shadow-lg
                                opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${
                                isLarge ? '' : 'scale-90'
                            }`}>
                                <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wide">
                                    {t('landing.discover')}
                                </span>
                                <ArrowRight className="w-3 h-3 text-primary" />
                            </div>

                            {/* Item Count Badge for Large Cards */}
                            {isLarge && (
                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                                    <span className="text-[10px] font-bold text-white/90 uppercase tracking-wide">
                                        ✨ Öne Çıkan
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center justify-center gap-3 pt-12 pb-4"
            >
                <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-stone-300" />
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">
                        {t('menu.restaurant')}
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-stone-300" />
                </div>
                <span className="text-[9px] font-medium tracking-widest text-stone-300 uppercase">
                    {t('landing.foundedText')}
                </span>
            </motion.div>
        </motion.div>
    );
});

CategoryGrid.displayName = 'CategoryGrid';
