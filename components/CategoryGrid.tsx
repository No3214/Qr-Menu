import React from 'react';
import { Category } from '../services/MenuData';

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
    return (
        <div className="p-4 grid grid-cols-2 gap-3 pb-24">
            {categories.map((category, index) => {
                // Pattern: 1 full-width followed by 4 half-width (repeating every 5)
                const isLarge = index % 5 === 0;

                return (
                    <div
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={`relative overflow-hidden rounded-xl shadow-card group cursor-pointer active:scale-[0.98] transition-all
              ${isLarge ? 'col-span-2 h-40' : 'col-span-1 h-32'}
            `}
                    >
                        {/* Background Image */}
                        <img // Use a placeholder if no specific category image
                            src={`https://source.unsplash.com/random/400x400/?food,${category.title}`}
                            // Note: In production we would use category.image if available
                            // For now using a reliable placeholder source or solid color fallback
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'; // Hide if fails
                            }}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={category.title}
                        />

                        {/* Fallback gradient if image fails or just as overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${isLarge ? 'from-black/80 via-black/20 to-transparent' : 'from-black/70 to-black/10'
                            }`} />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h3 className={`font-bold text-white leading-tight ${isLarge ? 'text-xl' : 'text-sm'}`}>
                                {category.title}
                            </h3>
                            {isLarge && (
                                <p className="text-white/80 text-xs mt-1 line-clamp-1">
                                    En lezzetli {category.title.toLowerCase()} çeşitlerimiz
                                </p>
                            )}
                        </div>

                        {/* Arrow Icon (Optional) */}
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
