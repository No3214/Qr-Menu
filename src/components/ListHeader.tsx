
import React from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';
import { CategoryNav } from './CategoryNav';
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
}

/**
 * ListHeader - Extracted from DigitalMenu for performance and modularity.
 * Handles the sticky search and category navigation in LIST view.
 */
export const ListHeader: React.FC<ListHeaderProps> = ({
    categories,
    activeCategory,
    isSearchOpen,
    searchQuery,
    setIsSearchOpen,
    setSearchQuery,
    setViewState,
    setActiveCategory
}) => {
    const { t } = useLanguage();
    const activeCategoryTitle = categories.find(c => c.id === activeCategory)?.title || t('menu');

    return (
        <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 p-4">
                <button
                    onClick={() => setViewState('GRID')}
                    className="p-2 -ml-2 text-text hover:bg-primary/5 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {isSearchOpen ? (
                    <div className="flex-1 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('menu.search')}
                            className="flex-1 h-10 px-4 bg-primary/5 rounded-xl text-sm outline-none ring-accent/20 focus:ring-2 transition-all"
                        />
                        <button
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-text tracking-tight animate-in fade-in duration-500 uppercase">
                                {activeCategoryTitle}
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2.5 rounded-xl transition-all ${searchQuery
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-text-muted bg-primary/5 hover:bg-primary/10'
                                }`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {!isSearchOpen && (
                <div className="border-t border-primary/5">
                    <CategoryNav
                        categories={categories}
                        activeCategoryId={activeCategory}
                        onCategoryClick={(id) => setActiveCategory(id)}
                    />
                </div>
            )}
        </div>
    );
};
