import React, { useState, useEffect } from 'react';
import { Category, Product } from '../services/MenuData';
import { MenuService } from '../services/MenuService';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { VideoLanding } from './VideoLanding';
import { CategoryGrid } from './CategoryGrid';
import { Search, ChevronLeft, X } from 'lucide-react';

type ViewState = 'LANDING' | 'GRID' | 'LIST';

export const DigitalMenu: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>('LANDING');
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [loading, setLoading] = useState(true);

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
    const filteredProducts = products.filter((p) => {
        const matchesCategory = viewState === 'LIST' ? p.category === activeCategory : true;
        const q = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

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
                            placeholder="Ara..."
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
                                {categories.find(c => c.id === activeCategory)?.title || 'Menü'}
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
            {/* Sticky Category Pills */}
            {!isSearchOpen && (
                <CategoryNav
                    categories={categories}
                    activeCategoryId={activeCategory}
                    onCategoryClick={(id) => setActiveCategory(id)}
                />
            )}
        </div>
    );

    // RENDER
    if (loading) return <div className="h-screen flex items-center justify-center bg-bg"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (viewState === 'LANDING') {
        return <VideoLanding onEnter={() => setViewState('GRID')} />;
    }

    return (
        <div className="min-h-screen bg-bg">

            {viewState === 'GRID' && (
                <>
                    {/* Grid Header */}
                    <header className="px-6 pt-8 pb-4 bg-surface sticky top-0 z-20 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-text">Hoş Geldiniz</h1>
                                <p className="text-sm text-text-muted">Kozbeyli Konağı</p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                K
                            </div>
                        </div>
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ne yemek istersiniz?"
                                className="w-full h-11 pl-10 pr-4 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </header>

                    {/* Category Mosaic */}
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
                                <p>Ürün bulunamadı.</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};
