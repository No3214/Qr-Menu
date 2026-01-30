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
        const q = searchQuery.toLowerCase();
        // If searching in LIST view, we can decide if we filter by category or not.
        // Target site usually does global search.
        const matchesCategory = (viewState === 'LIST' && !searchQuery) ? p.category === activeCategory : true;
        const matchesSearch = p.name.toLowerCase().includes(q) ||
                             p.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    // LIST VIEW: Header Component
    const ListHeader = () => (
        <div className="sticky top-0 z-30 bg-white border-b border-border shadow-md">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={() => setViewState('GRID')}
                    className="p-2 -ml-2 text-text hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Geri Dön"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {isSearchOpen ? (
                    <div className="flex-1 flex items-center gap-2 mx-2 animate-fade-in">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ara..."
                                className="w-full h-10 pl-9 pr-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="p-2 text-gray-500 hover:text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 text-center">
                            <h2 className="text-lg font-bold text-text truncate px-4">
                                {categories.find(c => c.id === activeCategory)?.title || 'Menü'}
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2 rounded-full transition-all ${searchQuery ? 'bg-primary text-white shadow-lg' : 'text-primary hover:bg-primary/10'}`}
                            aria-label="Ara"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>
            {/* Sticky Category Pills */}
            {!isSearchOpen && (
                <div className="pb-1">
                    <CategoryNav
                        categories={categories}
                        activeCategoryId={activeCategory}
                        onCategoryClick={(id) => setActiveCategory(id)}
                    />
                </div>
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
                <div className="flex flex-col min-h-screen">
                    {/* Grid Header */}
                    <header className={`px-6 pt-8 pb-4 bg-white sticky top-0 z-20 transition-all duration-300 ${searchQuery ? 'shadow-md' : 'shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Hoş Geldiniz</h1>
                                <p className="text-sm font-medium text-primary">Kozbeyli Konağı</p>
                            </div>
                            <div className="w-12 h-12 bg-white shadow-md border border-gray-50 rounded-2xl flex items-center justify-center p-2">
                                <img
                                    src="https://thefoost.com/kozbeyli-konagi/wp-content/uploads/2023/12/logo-dark.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<span class="text-primary font-bold text-xl">K</span>';
                                    }}
                                />
                            </div>
                        </div>
                        {/* Search Input */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ne yemek istersiniz?"
                                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </header>

                    {/* Category Mosaic or Search Results */}
                    {searchQuery ? (
                        <div className="p-4 space-y-4 pb-24 animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Arama Sonuçları</h3>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-xs text-primary font-bold"
                                >
                                    Temizle
                                </button>
                            </div>
                            {filteredProducts.map(product => (
                                <div key={product.id} onClick={() => setSelectedProduct(product)}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">"{searchQuery}" için sonuç bulunamadı.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <CategoryGrid
                            categories={categories}
                            onCategorySelect={handleCategorySelect}
                        />
                    )}
                </div>
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
