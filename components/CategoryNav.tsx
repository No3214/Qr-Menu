import React, { useRef, useEffect, memo } from 'react';
import { Category } from '../services/MenuData';

interface CategoryNavProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryClick: (id: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
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
        <nav className="bg-white">
            <div
                ref={scrollRef}
                className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    return (
                        <button
                            key={category.id}
                            data-id={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            className={`whitespace-nowrap px-5 py-2 rounded-xl text-[11px] font-bold tracking-tight uppercase transition-all duration-300 flex-shrink-0
                                ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 ring-2 ring-primary ring-offset-1'
                                    : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            {category.title}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

CategoryNav.displayName = 'CategoryNav';
