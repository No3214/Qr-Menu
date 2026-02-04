import React, { useRef, useEffect } from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';
import { Category } from '../services/MenuService';
import { useLanguage } from '../context/LanguageContext';

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
 * ListHeader - Premium header with smooth animations
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
    const { t } = useLanguage();
    const categoryContainerRef = useRef<HTMLDivElement>(null);
    const activeCategoryRef = useRef<HTMLButtonElement>(null);

    // Auto-scroll to active category with smooth centering
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

    const activeCategoryData = categories.find(c => c.id === activeCategory);

    return (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-stone-100">
            {/* Top Header Row */}
            <div className="flex items-center justify-between px-4 py-3">
                {/* Back Button */}
                <button
                    onClick={onMenuClick || (() => setViewState('GRID'))}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95"
                    aria-label={t('back')}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Centered Logo & Title */}
                <div
                    onClick={() => setViewState('GRID')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="relative">
                        <img
                            src="/assets/logo-dark.jpg"
                            alt={t('menu.restaurant')}
                            className="h-9 w-9 object-contain rounded-lg shadow-sm group-hover:shadow transition-shadow"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-stone-900 leading-tight">{t('menu.restaurant')}</p>
                        <p className="text-[10px] text-stone-400 font-medium">Dijital Menü</p>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 ${
                        isSearchOpen || searchQuery
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-stone-600 hover:text-primary hover:bg-primary/5'
                    }`}
                    aria-label={t('search')}
                >
                    {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
            </div>

            {/* Search Input (Expandable) */}
            {isSearchOpen && (
                <div className="px-4 py-3 bg-stone-50/80 border-t border-stone-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('menu.search')}
                            className="w-full h-12 pl-11 pr-10 bg-white border border-stone-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="mt-2 text-xs text-stone-500 px-1">
                            "{searchQuery}" için arama yapılıyor...
                        </p>
                    )}
                </div>
            )}

            {/* Category Tabs - Horizontal Scroll */}
            {!isSearchOpen && (
                <div className="relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                    <div
                        ref={categoryContainerRef}
                        className="flex overflow-x-auto scrollbar-hide px-4 py-2.5 gap-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category) => {
                            const isActive = category.id === activeCategory;
                            return (
                                <button
                                    key={category.id}
                                    ref={isActive ? activeCategoryRef : null}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`
                                        relative flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap
                                        ${isActive
                                            ? 'text-white bg-primary shadow-lg shadow-primary/20'
                                            : 'text-stone-600 hover:text-primary hover:bg-primary/5'
                                        }
                                    `}
                                >
                                    {category.title}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Active Category Info Bar */}
            {!isSearchOpen && activeCategoryData?.description && (
                <div className="px-4 py-2 bg-stone-50/50 border-t border-stone-100">
                    <p className="text-xs text-stone-500 text-center italic">
                        {activeCategoryData.description}
                    </p>
                </div>
            )}
        </div>
    );
};
