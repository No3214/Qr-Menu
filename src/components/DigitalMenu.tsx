import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, MenuService } from '../services/MenuService';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { VideoLanding } from './VideoLanding';
import { CategoryGrid } from './CategoryGrid';
import { Search, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ReviewModal } from './ReviewModal';
import { MenuAssistant } from './MenuAssistant';
import { ListHeader } from './ListHeader';
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
        startTransition(() => {
            setViewState('LIST');
            setActiveCategory(id);
        });
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    // Filter Products
    const filteredProducts = useMemo(() => {
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
        <div className="min-h-screen bg-bg overflow-x-hidden selection:bg-accent/20">
            <AnimatePresence mode="wait">
                {viewState === 'LANDING' ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <VideoLanding onEnter={() => {
                            startTransition(() => {
                                setViewState('GRID');
                            });
                        }} />
                    </motion.div>
                ) : viewState === 'GRID' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <header className="px-6 pt-10 pb-6 glass sticky top-0 z-20 shadow-sm transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-primary tracking-tight uppercase leading-none">{t('menu.welcome')}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="h-0.5 w-6 bg-accent" />
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.25em]">{t('menu.restaurant')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            startTransition(() => {
                                                setLanguage(language === 'tr' ? 'en' : 'tr');
                                            });
                                        }}
                                        className="h-10 px-3 bg-white/50 border border-primary/5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white"
                                    >
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{language}</span>
                                    </button>
                                    <div
                                        onClick={() => setShowReviewModal(true)}
                                        className="w-10 h-10 bg-white shadow-lg shadow-black/5 border border-white/40 rounded-xl flex items-center justify-center p-1 overflow-hidden active:scale-95 transition-all hover:border-accent/40 cursor-pointer"
                                    >
                                        <img
                                            src="/assets/logo-dark.jpg"
                                            alt="Kozbeyli Konağı"
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="relative group perspective-1000">
                                <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 rounded-full" />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-accent transition-colors z-10" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('menu.search')}
                                    className="relative z-0 w-full h-12 pl-11 pr-4 bg-white/60 border border-primary/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white focus:border-accent/30 transition-all font-medium placeholder:text-primary/30 shadow-inner"
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
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-bg"
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
                        <div className="p-4 space-y-4 pb-32 min-h-screen">
                            {filteredProducts.map((product, idx) => (
                                <React.Fragment key={product.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setSelectedProduct(product)}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>

                                    {/* Smart Recommendation Break: Insert after 2nd product if we have enough items */}
                                    {idx === 1 && filteredProducts.length > 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="py-4 -mx-4 px-4 bg-white/50 backdrop-blur-sm border-y border-white/20 my-6"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-4 h-4 text-accent" />
                                                <span className="text-xs font-bold text-accent uppercase tracking-widest">Şefin Önerisi</span>
                                            </div>
                                            <RecommendationCarousel seedProduct={filteredProducts[0]} />
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                        🔍
                                    </div>
                                    <p className="text-stone-500 font-medium">{t('product.notFound')}</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 text-accent text-sm font-bold underline underline-offset-4"
                                    >
                                        Tüm Menüyü Göster
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>

            {showReviewModal && (
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                />
            )}

            <MenuAssistant />
            <CookieConsent />
        </div>
    );
};
