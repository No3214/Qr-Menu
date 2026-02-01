
import React from 'react';
import { Category } from '../services/MenuService';

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
        <div className="p-4 grid grid-cols-2 gap-4 pb-24">
            {categories.map((category, index) => {
                // Pattern: 1 Full-width followed by 4 Half-width items (repeating every 5)
                const isLarge = index % 5 === 0;

                return (
                    <div
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={`relative overflow-hidden rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] group cursor-pointer active:scale-[0.98] transition-all duration-500 border border-black/5
              ${isLarge ? 'col-span-2 h-52' : 'col-span-1 h-40'}
            `}
                    >
                        {/* Background Image */}
                        <img
                            src={category.image}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            alt={category.title}
                        />

                        {/* Sophisticated Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${isLarge
                            ? 'from-black/90 via-black/40 to-transparent'
                            : 'from-black/85 via-black/20 to-transparent'
                            } transition-opacity duration-500 group-hover:opacity-90`} />

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                                <h3 className={`font-extrabold text-white leading-tight tracking-tight ${isLarge ? 'text-2xl' : 'text-base'}`}>
                                    {category.title}
                                </h3>
                                {isLarge && (
                                    <p className="text-white/70 text-[13px] mt-1.5 font-medium line-clamp-1 max-w-[80%]">
                                        Mansion heritage: {category.title.toLowerCase()} Collection
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Heritage Accent Line */}
                        <div className="absolute bottom-0 left-0 h-1 bg-accent w-0 group-hover:w-full transition-all duration-700" />

                        {/* View Menu Indicator */}
                        <div className="absolute top-4 right-4 h-8 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">Keşfet</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                );
            })}

            {/* Footer */}
            <div className="col-span-2 text-center py-10">
                <div className="flex flex-col items-center justify-center gap-3 opacity-30">
                    <div className="h-px w-12 bg-primary" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Kozbeyli Konağı</span>
                    </div>
                    <span className="text-[9px] font-medium tracking-widest uppercase italic">Est. 1904</span>
                </div>
            </div>
        </div>
    );
};
