import React, { useRef, useEffect, memo } from 'react';
import { Category } from '../services/MenuData';

interface CategoryNavProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryClick: (id: string) => void;
}

/**
 * CategoryNav - Mobile-first yatay kategori navigasyonu
 */
export const CategoryNav: React.FC<CategoryNavProps> = memo(({
    categories,
    activeCategoryId,
    onCategoryClick,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const activeElement = scrollRef.current?.querySelector(`[data-id="${activeCategoryId}"]`) as HTMLElement | null;
        if (activeElement && scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [activeCategoryId]);

    return (
        <nav className="sticky top-14 z-40 bg-white border-b border-gray-100">
            <div
                ref={scrollRef}
                className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    return (
                        <button
                            key={category.id}
                            data-id={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${isActive
                                    ? 'bg-[#C5A059] text-white shadow-sm'
                                    : 'text-gray-600 bg-gray-100 active:bg-gray-200'
                                }`}
                        >
                            {category.title}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
});

CategoryNav.displayName = 'CategoryNav';
