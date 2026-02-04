import React from 'react';
import { Category } from '../services/MenuService';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';

interface CategoryHeroProps {
    category: Category;
    productCount: number;
}

/**
 * CategoryHero - Premium hero image banner for each category
 */
export const CategoryHero: React.FC<CategoryHeroProps> = ({ category, productCount }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-44 sm:h-56 overflow-hidden rounded-b-[2rem]"
        >
            {/* Background Image with Ken Burns effect */}
            {category.image ? (
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: "linear" }}
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <ChefHat className="w-32 h-32 text-stone-400" />
                    </div>
                </div>
            )}

            {/* Premium Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

            {/* Decorative Elements */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="space-y-2"
                >
                    {/* Category Title */}
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-lg">
                        {category.title}
                    </h2>

                    {/* Description */}
                    {category.description && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm text-white/80 line-clamp-2 max-w-md font-medium"
                        >
                            {category.description}
                        </motion.p>
                    )}

                    {/* Product Count Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 mt-2"
                    >
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/10">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span className="text-xs font-bold text-white">
                                {productCount} ürün
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Fade Edge */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent" />
        </motion.div>
    );
};
