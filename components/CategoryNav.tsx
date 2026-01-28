import React, { useRef, useEffect, memo } from 'react';
import { Category } from '../services/MenuData';

interface CategoryNavProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryClick: (id: string) => void;
}

/**
 * CategoryNav - Yatay kaydırmalı kategori navigasyonu
 * Profesyonel özellikler: Otomatik scroll, gradient edge indicators, touch-friendly
 */
export const CategoryNav: React.FC<CategoryNavProps> = memo(({
    categories,
    activeCategoryId,
    onCategoryClick,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Aktif kategori değiştiğinde otomatik scroll
    useEffect(() => {
        const activeElement = scrollRef.current?.querySelector(
            `[data-category-id="${activeCategoryId}"]`
        ) as HTMLElement | null;

        if (activeElement && scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth',
            });
        }
    }, [activeCategoryId]);

    return (
        <nav className="sticky top-[4rem] z-40 bg-white border-b border-slate-100" role="navigation" aria-label="Kategori menüsü">
            {/* Left gradient fade */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

            {/* Right gradient fade */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
                ref={scrollRef}
                className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;

                    return (
                        <button
                            key={category.id}
                            data-category-id={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            aria-pressed={isActive}
                            aria-label={`${category.title} kategorisine git`}
                            className={`
                relative whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium 
                transition-all duration-300 ease-out transform
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] focus-visible:ring-offset-2
                ${isActive
                                    ? 'bg-gradient-to-r from-[#C5A059] to-[#B08D22] text-white shadow-md shadow-[#C5A059]/25 scale-105'
                                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:scale-95'
                                }
              `}
                        >
                            {category.title}

                            {/* Active indicator dot */}
                            {isActive && (
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
});

CategoryNav.displayName = 'CategoryNav';
