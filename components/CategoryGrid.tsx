import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../services/MenuData';
import { useLanguage } from '../context/LanguageContext';
import { staggerContainer, gridTile } from '../lib/animations';
import { OptimizedImage } from './OptimizedImage';

interface CategoryGridProps {
    categories: Category[];
    onCategorySelect: (id: string) => void;
}

/**
 * CategoryGrid - Mosaic Layout specified in Blueprint
 * Displays categories in a grid pattern:
 * - Large tiles (Full width)
 * - Small tiles (2 columns)
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onCategorySelect }) => {
    const { t } = useLanguage();
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="p-4 grid grid-cols-2 gap-3 pb-24"
        >
            {categories.map((category, index) => {
                const isLarge = index % 3 === 0;

                return (
                    <motion.button
                        key={category.id}
                        variants={gridTile}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onCategorySelect(category.id)}
                        className={`relative overflow-hidden rounded-xl shadow-card group cursor-pointer text-left
              ${isLarge ? 'col-span-2 h-40' : 'col-span-1 h-32'}
            `}
                    >
                        {/* Background Image with blur-up */}
                        <OptimizedImage
                            src={category.image || ''}
                            alt={category.title}
                            wrapperClassName="absolute inset-0"
                            className="transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${isLarge ? 'from-black/80 via-black/20 to-transparent' : 'from-black/70 to-black/10'
                            }`} />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h3 className={`font-bold text-white leading-tight ${isLarge ? 'text-xl' : 'text-sm'}`}>
                                {category.title}
                            </h3>
                            {isLarge && category.description && (
                                <p className="text-white/80 text-xs mt-1 line-clamp-1">
                                    {category.description}
                                </p>
                            )}
                        </div>

                        {/* Arrow Icon */}
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </motion.button>
                );
            })}


            {/* Footer */}
            <div className="col-span-2 text-center py-6">
                <div className="flex items-center justify-center gap-2 opacity-50">
                    <span className="text-[10px] font-medium tracking-widest uppercase">{t('menu.poweredBy')}</span>
                </div>
            </div>
        </motion.div>
    );
};
