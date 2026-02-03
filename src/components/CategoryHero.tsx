import React from 'react';
import { Category } from '../services/MenuService';

interface CategoryHeroProps {
    category: Category;
    productCount: number;
}

/**
 * CategoryHero - FOOST style hero image banner for each category
 */
export const CategoryHero: React.FC<CategoryHeroProps> = ({ category, productCount }) => {
    return (
        <div className="relative h-40 sm:h-48 overflow-hidden">
            {/* Background Image */}
            {category.image ? (
                <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {category.title}
                </h2>
                {category.description && (
                    <p className="text-sm text-white/80 line-clamp-1">
                        {category.description}
                    </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/60">
                        {productCount} ürün
                    </span>
                </div>
            </div>
        </div>
    );
};
