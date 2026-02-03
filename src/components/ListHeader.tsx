import React, { useRef, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Category } from '../services/MenuService';

interface ListHeaderProps {
    categories: Category[];
    activeCategory: string;
    isSearchOpen: boolean;
    searchQuery: string;
    setIsSearchOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
    setViewState: (view: 'GRID' | 'LIST') => void;
    setActiveCategory: (id: string) => void;
    onMenuClick?: () => void;
}

/**
 * ListHeader - FOOST style header with centered logo and horizontal category tabs
 */
export const ListHeader: React.FC<ListHeaderProps> = ({
    categories,
    activeCategory,
    isSearchOpen,
    searchQuery,
    setIsSearchOpen,
    setSearchQuery,
    setViewState,
    setActiveCategory,
    onMenuClick
}) => {
    const categoryContainerRef = useRef<HTMLDivElement>(null);
    const activeCategoryRef = useRef<HTMLButtonElement>(null);

    // Auto-scroll to active category
    useEffect(() => {
        if (activeCategoryRef.current && categoryContainerRef.current) {
            const container = categoryContainerRef.current;
            const activeEl = activeCategoryRef.current;
            const containerWidth = container.offsetWidth;
            const activeLeft = activeEl.offsetLeft;
            const activeWidth = activeEl.offsetWidth;

            container.scrollTo({
                left: activeLeft - (containerWidth / 2) + (activeWidth / 2),
                behavior: 'smooth'
            });
        }
    }, [activeCategory]);

    return (
        <div className="sticky top-0 z-30 bg-white shadow-sm">
            {/* Top Header Row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                {/* Menu Button */}
                <button
                    onClick={onMenuClick || (() => setViewState('GRID'))}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Centered Logo */}
                <div
                    onClick={() => setViewState('GRID')}
                    className="cursor-pointer"
                >
                    <img
                        src="/assets/logo-dark.jpg"
                        alt="Logo"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                        isSearchOpen || searchQuery
                            ? 'bg-stone-900 text-white'
                            : 'text-stone-600 hover:bg-stone-100'
                    }`}
                >
                    {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
            </div>

            {/* Search Input (Expandable) */}
            {isSearchOpen && (
                <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Menüde ara..."
                            className="w-full h-11 pl-10 pr-4 bg-white border border-stone-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Category Tabs - Horizontal Scroll */}
            {!isSearchOpen && (
                <div
                    ref={categoryContainerRef}
                    className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-1 bg-white"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            ref={category.id === activeCategory ? activeCategoryRef : null}
                            onClick={() => setActiveCategory(category.id)}
                            className={`
                                flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap
                                ${category.id === activeCategory
                                    ? 'text-stone-900 bg-stone-100'
                                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                                }
                            `}
                        >
                            {category.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
