import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORIES, PRODUCTS, Category, Product } from '../services/MenuData';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { Search, X, ChevronUp, ChefHat } from 'lucide-react';

/**
 * DigitalMenu - Modern Container
 */
export const DigitalMenu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
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
            const offset = 140; // Adjusted for taller header + nav
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
        }
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const clearSearch = useCallback(() => setSearchQuery(''), []);

    // Filter
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
        <div className="flex flex-col min-h-screen bg-stone-50 pb-20">
            {/* Search Bar Container */}
            <div className="px-4 py-4 w-full max-w-md mx-auto">
                <div className={`relative group transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isSearchFocused ? 'text-stone-900' : 'text-stone-400'}`} />
                    <input
                        type="text"
                        placeholder="Menüde lezzet ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl text-stone-900 text-sm font-medium
                        placeholder:text-stone-400 shadow-sm border border-transparent transition-all outline-none
                        ${isSearchFocused ? 'shadow-lg border-stone-200 ring-2 ring-stone-900/5' : 'hover:shadow-md hover:border-stone-100'}`}
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
                            <X className="w-3 h-3 text-stone-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Navigation */}
            <CategoryNav categories={CATEGORIES} activeCategoryId={activeCategory} onCategoryClick={handleCategoryClick} />

            {/* Menu Content */}
            <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
                {CATEGORIES.map((category: Category) => {
                    const categoryProducts = getProductsForCategory(category.id);
                    if (categoryProducts.length === 0) return null;

                    return (
                        <section
                            key={category.id}
                            id={`category-${category.id}`}
                            data-category-id={category.id}
                            ref={(el) => (categoryRefs.current[category.id] = el)}
                            className="mb-10 scroll-mt-36"
                        >
                            <div className="flex items-end justify-between mb-5 px-1">
                                <div>
                                    <h2 className="text-xl font-bold text-stone-900 font-serif tracking-tight">{category.title}</h2>
                                    <div className="h-1 w-12 bg-stone-900 rounded-full mt-2" />
                                </div>
                                <span className="text-xs font-semibold text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
                                    {categoryProducts.length} Ürün
                                </span>
                            </div>

                            <div className="space-y-4">
                                {categoryProducts.map((product: Product) => (
                                    <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {!hasResults && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm rotate-3">
                            <ChefHat className="w-10 h-10 text-stone-400" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900">Sonuç bulunamadı</h3>
                        <p className="text-stone-500 mt-2 text-sm max-w-[200px]">"{searchQuery}" aramasıyla eşleşen bir lezzet bulamadık.</p>
                        <button onClick={clearSearch} className="mt-6 px-6 py-2.5 bg-stone-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-stone-900/20 active:scale-95 transition-all">
                            Aramayı Temizle
                        </button>
                    </div>
                )}
            </div>

            {/* Back to Top */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 w-12 h-12 bg-stone-900 text-white rounded-2xl shadow-xl shadow-stone-900/30
                flex items-center justify-center transition-all duration-500 active:scale-90 z-40
                ${showBackToTop ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-45 pointer-events-none'}`}
            >
                <ChevronUp className="w-6 h-6" />
            </button>

            {/* Product Details Modal */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
