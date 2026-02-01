
import React from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';
import { CategoryNav } from './CategoryNav';
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
    const activeCategoryTitle = categories.find(c => c.id === activeCategory)?.title || 'Menü';

    return (
        <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
            <div className="flex items-center gap-3 p-4">
                <button
                    onClick={() => setViewState('GRID')}
                    className="p-2 -ml-2 text-text hover:bg-gray-100 rounded-full transition-colors"
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
                            placeholder="Lezzet ara..."
                            className="flex-1 h-10 px-4 bg-gray-100 rounded-xl text-sm outline-none ring-primary/20 focus:ring-2 transition-all"
                        />
                        <button
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-text tracking-tight animate-in fade-in duration-500">
                                {activeCategoryTitle}
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2.5 rounded-xl transition-all ${searchQuery
                                ? 'bg-stone-900 text-white shadow-lg'
                                : 'text-stone-500 bg-stone-100 hover:bg-stone-200'
                                }`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {!isSearchOpen && (
                <div className="border-t border-gray-50/50">
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
