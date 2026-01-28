import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORIES, PRODUCTS, Category, Product } from '../services/MenuData';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { Search, X, ChevronUp } from 'lucide-react';

/**
 * DigitalMenu - Mobile-first ana menü bileşeni
 */
export const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ScrollSpy
    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '-25% 0px -65% 0px',
            threshold: 0,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const categoryId = entry.target.getAttribute('data-category-id');
                    if (categoryId) setActiveCategory(categoryId);
                }
            });
        }, options);

        Object.values(categoryRefs.current).forEach((ref) => {
            if (ref) observerRef.current?.observe(ref);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    // Back to top visibility
    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCategoryClick = useCallback((id: string) => {
        setActiveCategory(id);
        const element = categoryRefs.current[id];
        if (element) {
            const offset = 120;
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
        }
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const clearSearch = useCallback(() => setSearchQuery(''), []);

    // Filtreleme
    const filteredProducts = PRODUCTS.filter((p: Product) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    });

    const getProductsForCategory = (categoryId: string): Product[] => {
        return filteredProducts.filter((p) => p.category === categoryId);
    };

    const hasResults = filteredProducts.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Search Bar - Compact mobile design */}
            <div className="px-3 py-2 sticky top-14 z-30 bg-white border-b border-gray-100">
                <div className={`relative ${isSearchFocused ? 'scale-[1.01]' : ''} transition-transform`}>
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isSearchFocused ? 'text-[#C5A059]' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Menüde ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`w-full pl-9 pr-9 py-2.5 bg-gray-50 rounded-xl text-sm
              placeholder:text-gray-400 transition-all outline-none
              ${isSearchFocused ? 'bg-white ring-2 ring-[#C5A059]/30' : ''}`}
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5">
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Navigation */}
            <CategoryNav categories={CATEGORIES} activeCategoryId={activeCategory} onCategoryClick={handleCategoryClick} />

            {/* Menu Content - Mobile optimized */}
            <div className="flex-1 px-3 py-4">
                {CATEGORIES.map((category: Category) => {
                    const categoryProducts = getProductsForCategory(category.id);
                    if (categoryProducts.length === 0) return null;

                    return (
                        <section
                            key={category.id}
                            id={`category-${category.id}`}
                            data-category-id={category.id}
                            ref={(el) => (categoryRefs.current[category.id] = el)}
                            className="mb-6 scroll-mt-28"
                        >
                            {/* Category Header - Compact */}
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                <span className="w-1 h-5 bg-[#C5A059] rounded-full" />
                                <h2 className="text-base font-bold text-gray-900">{category.title}</h2>
                                <span className="text-xs text-gray-400 ml-auto">{categoryProducts.length}</span>
                            </div>

                            {/* Products */}
                            <div className="space-y-0">
                                {categoryProducts.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* No Results */}
                {!hasResults && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Sonuç bulunamadı</h3>
                        <p className="text-sm text-gray-500 mt-1">"{searchQuery}" için sonuç yok</p>
                        <button onClick={clearSearch} className="mt-3 px-4 py-2 bg-[#C5A059] text-white text-sm font-medium rounded-full">
                            Temizle
                        </button>
                    </div>
                )}
            </div>

            {/* Footer - Compact mobile */}
            <footer className="py-8 bg-gray-900 text-white mt-auto">
                <div className="px-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C5A059] rounded-xl mb-4">
                        <span className="text-white font-serif font-bold text-xl">K</span>
                    </div>
                    <h3 className="text-lg font-bold">Kozbeyli Konağı</h3>
                    <p className="text-gray-400 text-xs mt-1">Ege'nin Eşsiz Lezzet Durağı</p>

                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                        <p>📍 Kozbeyli Köyü No:188</p>
                        <p><a href="tel:+905322342686" className="text-[#C5A059]">📞 0532 234 26 86</a></p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-800">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            Powered by <span className="text-[#C5A059]">GrainQR</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Back to Top - Mobile friendly */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-4 right-4 w-10 h-10 bg-[#C5A059] text-white rounded-full shadow-lg
          flex items-center justify-center transition-all active:scale-95
          ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
            >
                <ChevronUp className="w-5 h-5" />
            </button>
        </div>
    );
};
