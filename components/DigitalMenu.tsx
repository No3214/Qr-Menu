import React, { useState, useEffect } from 'react';
import { Category, Product } from '../services/MenuData';
import { MenuService } from '../services/MenuService';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { VideoLanding } from './VideoLanding';
import { CategoryGrid } from './CategoryGrid';
import { Search, ChevronLeft, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ReviewModal } from './ReviewModal';
import { MenuAssistant } from './MenuAssistant';

type ViewState = 'LANDING' | 'GRID' | 'LIST';

export const DigitalMenu: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
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
    }, []);

    // Handle Category Selection from Grid
    const handleCategorySelect = (id: string) => {
        setActiveCategory(id);
        setViewState('LIST');
        window.scrollTo(0, 0);
    };

    // Filter Products
    const filteredProducts = React.useMemo(() => {
        return products.filter((p) => {
            const q = debouncedQuery.toLowerCase();
            const matchesCategory = (viewState === 'LIST' && !debouncedQuery) ? p.category === activeCategory : true;
            const matchesSearch = p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [products, debouncedQuery, viewState, activeCategory]);

    // LIST VIEW: Header Component
    const ListHeader = () => (
        <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
            <div className="flex items-center gap-3 p-4">
                <button
                    onClick={() => setViewState('GRID')}
                    className="p-2 -ml-2 text-text hover:bg-gray-100 rounded-full"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {isSearchOpen ? (
                    <div className="flex-1 flex items-center gap-2 animate-fade-in">
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('search')}
                            className="flex-1 h-9 px-3 bg-gray-100 rounded-lg text-sm outline-none"
                        />
                        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-text">
                                {categories.find(c => c.id === activeCategory)?.title || t('menu')}
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2 rounded-full ${searchQuery ? 'bg-primary text-white' : 'text-primary bg-primary/10'}`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
            {!isSearchOpen && (
                <CategoryNav
                    categories={categories}
                    activeCategoryId={activeCategory}
                    onCategoryClick={(id) => setActiveCategory(id)}
                />
            )}
        </div>
    );

    if (loading) return <div className="h-screen flex items-center justify-center bg-bg"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (viewState === 'LANDING') {
        return <VideoLanding onEnter={() => setViewState('GRID')} />;
    }

    return (
        <div className="min-h-screen bg-bg">
            {viewState === 'GRID' && (
                <>
                    <header className="px-6 pt-8 pb-4 bg-surface sticky top-0 z-20 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-text">{t('menu.welcome')}</h1>
                                <p className="text-sm text-text-muted">{t('menu.restaurant')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                                    className="h-12 px-3 bg-white/50 border border-border/50 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <Globe className="w-5 h-5 text-text-muted" />
                                    <span className="text-sm font-semibold text-text uppercase">{language}</span>
                                </button>
                                <div
                                    onClick={() => setShowReviewModal(true)}
                                    className="w-12 h-12 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center p-0.5 overflow-hidden active:scale-95 transition-transform"
                                >
                                    <img
                                        src="/assets/logo-dark.jpg"
                                        alt="Kozbeyli Konağı"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerHTML = '<span class="text-primary font-bold text-xl">K</span>';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('menu.search')}
                                className="w-full h-11 pl-10 pr-4 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </header>
                    <CategoryGrid
                        categories={categories}
                        onCategorySelect={handleCategorySelect}
                    />
                </>
            )}

            {viewState === 'LIST' && (
                <>
                    <ListHeader />
                    <div className="p-4 space-y-4 pb-24">
                        {filteredProducts.map(product => (
                            <div key={product.id} onClick={() => setSelectedProduct(product)}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                <p>{t('product.notFound')}</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            {showReviewModal && <ReviewModal onClose={() => setShowReviewModal(false)} />}

            <MenuAssistant />
        </div>
    );
};
