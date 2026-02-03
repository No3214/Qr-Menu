import React, { useState, useEffect } from 'react';
import { Category, Product, MenuService } from '../services/MenuService';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { VideoLanding } from './VideoLanding';
import { CategoryGrid } from './CategoryGrid';
import { Search, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ReviewModal } from './ReviewModal';
import { MenuAssistant } from './MenuAssistant';
import { ListHeader } from './ListHeader';
import { CategoryHero } from './CategoryHero';
import { MenuFooter } from './MenuFooter';
import { FloatingActionButton } from './FloatingActionButton';
import { CookieConsent } from './CookieConsent';
import { motion, AnimatePresence } from 'framer-motion';
import { RecommendationCarousel } from './RecommendationCarousel';

type ViewState = 'LANDING' | 'GRID' | 'LIST';

export const DigitalMenu: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const [_, startTransition] = React.useTransition();
    const [viewState, setViewState] = useState<ViewState>('LANDING');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Initial Data Fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                const [cats, prods] = await Promise.all([
                    MenuService.getCategories(),
                    MenuService.getProducts()
                ]);
                setCategories(cats);
                setProducts(prods);
                if (cats.length > 0) {
                    setActiveCategory(cats[0].id);
                }
            } catch (error) {
                console.error("Failed to load menu data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();

        // Listen for internal product selections (from pairings)
        const handleInternalSelect = (e: any) => {
            if (e.detail) {
                setSelectedProduct(e.detail);
            }
        };
        window.addEventListener('selectProduct', handleInternalSelect);
        return () => window.removeEventListener('selectProduct', handleInternalSelect);
    }, []);

    // Handle Category Selection from Grid
    const handleCategorySelect = (id: string) => {
        setViewState('LIST');
        startTransition(() => {
            setActiveCategory(id);
        });
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    // Filter Products
    const filteredProducts = React.useMemo(() => {
        return products.filter((p) => {
            const q = debouncedQuery.toLowerCase();
            const matchesCategory = (viewState === 'LIST' && !debouncedQuery) ? p.category === activeCategory : true;
            const matchesSearch = p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [products, debouncedQuery, viewState, activeCategory]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-bg"><div className="animate-spin rounded-full h-10 w-10 border-[3px] border-primary/20 border-b-accent"></div></div>;

    return (
        <div className="min-h-screen bg-bg overflow-x-hidden">
            <AnimatePresence>
                {viewState === 'LANDING' ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <VideoLanding onEnter={() => setViewState('GRID')} />
                    </motion.div>
                ) : viewState === 'GRID' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <header className="px-6 pt-10 pb-6 bg-surface/90 backdrop-blur-xl sticky top-0 z-20 border-b border-primary/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-text tracking-tight uppercase">{t('menu.welcome')}</h1>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="h-px w-4 bg-accent" />
                                        <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">{t('menu.restaurant')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                                        className="h-11 px-3 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                    >
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{language}</span>
                                    </button>
                                    <div
                                        onClick={() => setShowReviewModal(true)}
                                        className="w-11 h-11 bg-white shadow-card border border-primary/10 rounded-xl flex items-center justify-center p-1.5 overflow-hidden active:scale-95 transition-all hover:border-accent/40"
                                    >
                                        <img
                                            src="/assets/logo-dark.jpg"
                                            alt="Kozbeyli Konağı"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('menu.search')}
                                    className="w-full h-12 pl-11 pr-4 bg-primary/[0.03] border border-primary/[0.05] rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/10 focus:bg-white focus:border-accent/30 transition-all font-medium"
                                />
                            </div>
                        </header>
                        <CategoryGrid
                            categories={categories}
                            onCategorySelect={handleCategorySelect}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <ListHeader
                            categories={categories}
                            activeCategory={activeCategory}
                            isSearchOpen={isSearchOpen}
                            searchQuery={searchQuery}
                            setIsSearchOpen={setIsSearchOpen}
                            setSearchQuery={setSearchQuery}
                            setViewState={setViewState}
                            setActiveCategory={setActiveCategory}
                        />

                        {/* Category Hero Banner */}
                        {!isSearchOpen && !debouncedQuery && categories.find(c => c.id === activeCategory) && (
                            <CategoryHero
                                category={categories.find(c => c.id === activeCategory)!}
                                productCount={products.filter(p => p.category === activeCategory).length}
                            />
                        )}

                        <div className="bg-white rounded-t-2xl -mt-4 relative z-10">
                            {filteredProducts.map((product, idx) => (
                                <React.Fragment key={product.id}>
                                    <motion.div
                                        onClick={() => setSelectedProduct(product)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>

                                    {/* Smart Recommendation Break: Show after 2nd product */}
                                    {idx === 1 && filteredProducts.length >= 2 && (
                                        <RecommendationCarousel seedProduct={filteredProducts[0]} />
                                    )}
                                </React.Fragment>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    <p>{t('product.notFound')}</p>
                                </div>
                            )}

                            {/* Spacer for bottom navigation */}
                            <div className="h-24" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            {showReviewModal && (
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                />
            )}

            <MenuAssistant />
            <CookieConsent />

            {/* Floating Action Button */}
            {viewState !== 'LANDING' && (
                <FloatingActionButton
                    onFeedback={() => setShowReviewModal(true)}
                />
            )}

            {/* Powered by Footer */}
            {viewState !== 'LANDING' && <MenuFooter />}
        </div>
    );
};
