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
        <div className="p-3 grid grid-cols-2 gap-3 pb-24">
            {categories.map((category, index) => {
                // Target Pattern: Full (0), Half (1), Half (2), Half (3), Half (4), Full (5)...
                // This means index % 5 === 0 is Full width
                const isLarge = index % 5 === 0;

                return (
                    <div
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={`relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer active:scale-[0.98] transition-all
              ${isLarge ? 'col-span-2 h-52' : 'col-span-1 h-44'}
            `}
                    >
                        {/* Background Image */}
                        <img
                            src={`https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop&random=${index}`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={category.title}
                        />

                        {/* Fallback gradient if image fails or just as overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent`} />

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-start">
                            <h3 className={`font-bold text-white leading-tight ${isLarge ? 'text-2xl' : 'text-xl'} drop-shadow-md`}>
                                {category.title}
                            </h3>
                            {category.description && (
                                <p className="text-white/90 text-xs mt-1 line-clamp-2 font-medium drop-shadow-sm">
                                    {category.description}
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
