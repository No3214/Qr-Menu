import React, { useRef, useEffect, memo } from 'react';
import { Category } from '../services/MenuData';

interface CategoryNavProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryClick: (id: string) => void;
}

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
        <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm transition-all">
            <div
                ref={scrollRef}
                className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    return (
                        <button
                            key={category.id}
                            data-id={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ease-out flex-shrink-0
                                ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105'
                                    : 'text-text-muted bg-gray-100 hover:bg-gray-200 border border-transparent'
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
