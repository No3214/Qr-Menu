
import React, { useEffect } from 'react';
import { Product, MenuService } from '../services/MenuService';
import { X, Share2, Info, Sparkles, Plus, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const { t } = useLanguage();

    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [product]);

    if (!product) return null;

    const handleShare = async () => {
        const shareData = {
            title: product.title,
            text: product.description,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t('review.success'), { icon: '🔗' });
            }
        } catch (err) {
            console.error('Share failed', err);
        }
    };

    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    // Mock Ingredients (In a real app, this would come from DB products table if added)
    // For now, we generate generic ones based on category or show "Chef's Special Blend" if unknown.
    const ingredients = product.description.split(',').map(i => i.trim()).filter(i => i.length > 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 perspective-1000">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg bg-[#FAF9F6] sm:rounded-[40px] rounded-t-[40px] overflow-hidden shadow-2xl transform transition-all duration-500 animate-slide-up flex flex-col max-h-[92vh]"
            >
                {/* Close Button - Floating */}
                <div className="absolute top-5 right-5 z-30">
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sticky Image Header */}
                <div className="relative w-full h-80 flex-shrink-0">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className={`w-full h-full object-cover ${!product.is_active ? 'grayscale opacity-80' : ''}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                            <span className="text-6xl">🍽️</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-black/30" />

                    {!product.is_active && (
                        <div className="absolute bottom-6 left-8 bg-stone-900/90 backdrop-blur text-white px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                            <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                {t('product.outOfStock')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden -mt-6 rounded-t-[40px] bg-[#FAF9F6] relative z-10">
                    <div className="px-8 pt-8 pb-28">
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-8" />

                        {/* Title & Header */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h2 className="text-3xl font-black text-stone-900 leading-tight tracking-tight text-balance">
                                {product.title}
                            </h2>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-3xl font-black text-primary">{formattedPrice}</span>
                            <span className="text-xl text-stone-400 font-bold">₺</span>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {product.prepTime && (
                                <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                        ⏱️
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Hazırlık</p>
                                        <p className="text-sm font-bold text-stone-800">{product.prepTime} dk</p>
                                    </div>
                                </div>
                            )}
                            {product.calories && (
                                <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                        🔥
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Kalori</p>
                                        <p className="text-sm font-bold text-stone-800">{product.calories} kcal</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <Info className="w-4 h-4 text-accent" />
                                Detaylar
                            </h3>
                            <p className="text-stone-600 text-base leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        {/* Ingredients */}
                        {ingredients.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Leaf className="w-4 h-4 text-green-600" />
                                    İçindekiler
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {ingredients.map((ing, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-white border border-stone-100 rounded-lg text-xs font-semibold text-stone-600 shadow-sm">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Products Carousel */}
                        <RelatedProducts
                            categoryId={product.category}
                            currentProductId={product.id}
                            onProductSelect={(p) => {
                                onClose();
                                setTimeout(() => {
                                    const event = new CustomEvent('selectProduct', { detail: p });
                                    window.dispatchEvent(event);
                                }, 300);
                            }}
                        />
                    </div>
                </div>

                {/* Floating Bottom Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#FAF9F6]/80 backdrop-blur-lg border-t border-stone-100 z-20">
                    <div className="flex gap-3 max-w-lg mx-auto">
                        <button
                            onClick={handleShare}
                            className="w-14 h-14 bg-white border border-stone-200 text-stone-400 rounded-2xl flex items-center justify-center hover:bg-stone-50 hover:text-stone-900 active:scale-95 transition-all shadow-sm"
                            title={t('product.share')}
                        >
                            <Share2 className="w-6 h-6" />
                        </button>

                        {product.is_active ? (
                            <button
                                onClick={onClose}
                                className="flex-1 bg-primary text-white h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <Plus className="w-6 h-6" />
                                <span className="uppercase tracking-wider text-sm">{t('product.addToOrder')}</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => toast('Stoklar yenilendiğinde haber vereceğiz!', { icon: '🔔' })}
                                className="flex-1 bg-stone-200 text-stone-500 h-14 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-stone-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse" />
                                Gelince Haber Ver
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface RelatedProductsProps {
    categoryId: string;
    currentProductId: string;
    onProductSelect: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId, currentProductId, onProductSelect }) => {
    const { t } = useLanguage();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const loadRelated = async () => {
            setLoading(true);
            try {
                // Fetch related products from the same category
                const related = await MenuService.getRelatedProducts(categoryId, currentProductId);
                setProducts(related);
            } catch (err) {
                console.error("Failed to load related products", err);
            } finally {
                setLoading(false);
            }
        };
        loadRelated();
    }, [categoryId, currentProductId]);

    if (loading) return (
        <div className="mt-8 space-y-3">
            <div className="h-4 w-32 bg-stone-100 rounded animate-pulse" />
            <div className="flex gap-3 overflow-hidden">
                {[1, 2].map(i => (
                    <div key={i} className="w-40 h-32 bg-stone-50 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );

    if (products.length === 0) return null;

    return (
        <div className="mt-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <h4 className="text-[11px] font-extrabold text-stone-400 uppercase tracking-widest">
                    {t('menu.recommendations')}
                </h4>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                {products.map(product => (
                    <div
                        key={product.id}
                        onClick={() => onProductSelect(product)}
                        className="flex-shrink-0 w-36 bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all snap-start cursor-pointer active:scale-95"
                    >
                        <div className="h-24 bg-stone-100 relative">
                            {product.image ? (
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                            )}
                        </div>
                        <div className="p-2.5">
                            <h5 className="text-[12px] font-bold text-stone-800 line-clamp-1 mb-1">{product.title}</h5>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-primary">{product.price}₺</span>
                                <div className="w-5 h-5 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
                                    <Plus className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
