
import React, { useEffect } from 'react';
import { Product, MenuService } from '../services/MenuService';
import { X, Share2, Info, Sparkles, Plus } from 'lucide-react';
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

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl transform transition-transform animate-slide-up"
                style={{ maxHeight: '92vh', height: 'auto' }}
            >
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Image Header */}
                <div className="relative h-80 bg-stone-100">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                            <span className="text-6xl">🍽️</span>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content Body */}
                <div className="px-8 py-10 -mt-6 relative bg-white rounded-t-[32px]">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />

                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h2 className="text-3xl font-bold text-text leading-tight tracking-tight">
                            {product.title}
                        </h2>
                    </div>

                    {!product.is_active && (
                        <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase bg-stone-100 text-stone-500 rounded-full tracking-wider border border-stone-200">
                            {t('product.outOfStock')}
                        </span>
                    )}

                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-bold text-stone-900">{formattedPrice}</span>
                        <span className="text-xl text-stone-400 font-medium">₺</span>
                    </div>

                    <div className="prose prose-stone prose-sm">
                        <p className="text-stone-600 text-base leading-relaxed font-medium">
                            {product.description}
                        </p>
                    </div>

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

                    <div className="mt-10 pt-6 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{t('menu.categories')}</span>
                        </div>

                        <button
                            onClick={handleShare}
                            className="p-3 bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-primary rounded-xl transition-all active:scale-95"
                            title={t('product.share')}
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 bg-primary text-white py-4.5 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-[13px]"
                    >
                        {t('product.addToOrder')}
                    </button>
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
