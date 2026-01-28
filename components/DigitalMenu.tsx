import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORIES, PRODUCTS, Category, Product } from '../services/MenuData';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { Search, X, ChevronUp } from 'lucide-react';

/**
 * DigitalMenu - Ana menü bileşeni
 * Profesyonel özellkler: ScrollSpy, debounced search, back-to-top, animasyonlar
 */
export const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ScrollSpy - Intersection Observer ile aktif kategori takibi
    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const categoryId = entry.target.getAttribute('data-category-id');
                    if (categoryId) {
                        setActiveCategory(categoryId);
                    }
                }
            });
        }, options);

        // Tüm kategori bölümlerini gözlemle
        Object.values(categoryRefs.current).forEach((ref) => {
            if (ref) observerRef.current?.observe(ref);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    // Back to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCategoryClick = useCallback((id: string) => {
        setActiveCategory(id);
        const element = categoryRefs.current[id];
        if (element) {
            const offset = 140;
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementTop - offset,
                behavior: 'smooth',
            });
        }
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    // Filtreleme
    const filteredProducts = PRODUCTS.filter((p: Product) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    });

    // Kategoriye göre gruplandırma
    const getProductsForCategory = (categoryId: string): Product[] => {
        return filteredProducts.filter((p) => p.category === categoryId);
    };

    const hasResults = filteredProducts.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50/50">
            {/* Search Bar - Profesyonel ve animasyonlu */}
            <div className="px-4 py-3 sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100/50">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                    <Search
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200
              ${isSearchFocused ? 'text-[#C5A059]' : 'text-slate-400'}`}
                    />
                    <input
                        type="text"
                        placeholder="Menüde ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        aria-label="Menüde ara"
                        className={`w-full pl-12 pr-12 py-3 bg-slate-100/80 rounded-2xl text-sm font-medium
              placeholder:text-slate-400 transition-all duration-300 outline-none
              ${isSearchFocused
                                ? 'bg-white ring-2 ring-[#C5A059]/30 shadow-lg shadow-[#C5A059]/10'
                                : 'hover:bg-slate-100'}`}
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            aria-label="Aramayı temizle"
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-xs text-slate-500 mt-2 px-1">
                        <span className="font-semibold text-slate-700">{filteredProducts.length}</span> ürün bulundu
                    </p>
                )}
            </div>

            {/* Category Navigation */}
            <CategoryNav
                categories={CATEGORIES}
                activeCategoryId={activeCategory}
                onCategoryClick={handleCategoryClick}
            />

            {/* Menu Content */}
            <div className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
                {CATEGORIES.map((category: Category) => {
                    const categoryProducts = getProductsForCategory(category.id);
                    if (categoryProducts.length === 0) return null;

                    return (
                        <section
                            key={category.id}
                            id={`category-${category.id}`}
                            data-category-id={category.id}
                            ref={(el) => (categoryRefs.current[category.id] = el)}
                            className="mb-10 scroll-mt-36 animate-fadeIn"
                        >
                            {/* Category Header */}
                            <div className="mb-5 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="w-1 h-7 bg-gradient-to-b from-[#C5A059] to-[#B08D22] rounded-full" />
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                            {category.title}
                                        </h2>
                                        {category.description && (
                                            <p className="text-sm text-slate-500 mt-0.5">{category.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className="space-y-1">
                                {categoryProducts.map((product: Product, index: number) => (
                                    <div
                                        key={product.id}
                                        className="animate-slideUp"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {/* Category item count */}
                            <p className="text-xs text-slate-400 mt-4 text-right">
                                {categoryProducts.length} ürün
                            </p>
                        </section>
                    );
                })}

                {/* No Results */}
                {!hasResults && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Sonuç bulunamadı</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs">
                            "{searchQuery}" için sonuç bulunamadı. Farklı bir anahtar kelime deneyin.
                        </p>
                        <button
                            onClick={clearSearch}
                            className="mt-4 px-5 py-2 bg-[#C5A059] text-white text-sm font-medium rounded-full hover:bg-[#B08D22] transition-colors"
                        >
                            Aramayı Temizle
                        </button>
                    </div>
                )}
            </div>

            {/* Footer - Profesyonel ve detaylı */}
            <footer className="py-16 bg-slate-900 text-white mt-auto">
                <div className="container mx-auto px-4 max-w-xl">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#C5A059] to-[#B08D22] rounded-2xl shadow-lg shadow-[#C5A059]/30 mb-6">
                            <span className="text-white font-serif font-bold text-2xl">K</span>
                        </div>

                        <h3 className="text-xl font-bold tracking-tight">Kozbeyli Konağı</h3>
                        <p className="text-slate-400 text-sm mt-1">Ege'nin Eşsiz Lezzet Durağı</p>

                        {/* Contact Info */}
                        <div className="mt-8 space-y-2 text-sm text-slate-400">
                            <p className="flex items-center justify-center gap-2">
                                <span>📍</span> Kozbeyli Köyü, Kozbeyli Küme Evleri No:188
                            </p>
                            <p className="flex items-center justify-center gap-2">
                                <span>📞</span>
                                <a href="tel:+905322342686" className="hover:text-white transition-colors">
                                    +90 532 234 26 86
                                </a>
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="mt-10 pt-8 border-t border-slate-800">
                            <p className="text-[11px] text-slate-500 uppercase tracking-widest">
                                Powered by <span className="text-[#C5A059] font-semibold">GrainQR</span> Digital Menu System
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                aria-label="Yukarı çık"
                className={`fixed bottom-6 right-6 w-12 h-12 bg-[#C5A059] text-white rounded-full shadow-lg
          flex items-center justify-center transition-all duration-300 hover:bg-[#B08D22] hover:scale-110
          ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ChevronUp className="w-6 h-6" />
            </button>
        </div>
    );
};
