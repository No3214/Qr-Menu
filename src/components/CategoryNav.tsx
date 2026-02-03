import React, { useRef, useEffect, memo, startTransition } from 'react';
import { Category } from '../services/MenuService';

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
                            onClick={() => {
                                startTransition(() => {
                                    onCategoryClick(category.id);
                                });
                            }}
                            className={`whitespace-nowrap px-2 py-3 text-[13px] font-bold tracking-tight transition-all duration-200 flex-shrink-0 border-b-2
                                ${isActive
                                    ? 'text-stone-900 border-stone-900 scale-100'
                                    : 'text-stone-400 border-transparent hover:text-stone-600'
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
