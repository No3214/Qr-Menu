
import React, { useEffect } from 'react';
import { Product, MenuService } from '../services/MenuService';
import { X, Share2, Info, Sparkles, Plus } from 'lucide-react';
import { getProductPairing } from '../services/geminiService';
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
                className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-all duration-300"
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

                    {/* AI Product Pairing */}
                    <AIPairing
                        productName={product.title}
                        category={product.category}
                        onProductSelect={(p) => {
                            // If we have a selection callback from parent, use it
                            // This allows "jumping" to the next product
                            onClose();
                            setTimeout(() => {
                                // We'll need to update DigitalMenu to handle this jump
                                // For now, we'll trigger the select in the next tick
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

const AIPairing: React.FC<{ productName: string, category: string, onProductSelect?: (product: Product) => void }> = ({ productName, category, onProductSelect }) => {
    const { t } = useLanguage();
    const [pairing, setPairing] = React.useState<{ pairing: string, reason: string } | null>(null);
    const [matchedProduct, setMatchedProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const loadPairingAndMatch = async () => {
            setLoading(true);
            try {
                // 1. Get AI Suggestion
                const data = await getProductPairing(productName, category);
                setPairing(data);

                // 2. Try to find a match in real products
                if (data.pairing) {
                    const allProducts = await MenuService.getProducts();
                    const searchStr = data.pairing.toLowerCase();

                    // Simple exact or fuzzy match (start with exact/contains)
                    const match = allProducts.find((p: Product) =>
                        p.title.toLowerCase().includes(searchStr) ||
                        searchStr.includes(p.title.toLowerCase())
                    );

                    if (match) setMatchedProduct(match);
                }
            } catch (error) {
                console.error("Failed to load pairing match", error);
            } finally {
                setLoading(false);
            }
        };
        loadPairingAndMatch();
    }, [productName, category]);

    if (loading) return (
        <div className="mt-10 p-5 bg-stone-50 border border-stone-100 rounded-[24px] animate-pulse">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-stone-200 rounded-full"></div>
                <div className="h-3 w-32 bg-stone-200 rounded"></div>
            </div>
            <div className="flex gap-4">
                <div className="w-16 h-16 bg-stone-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-stone-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-stone-100 rounded"></div>
                </div>
            </div>
        </div>
    );

    if (!pairing) return null;

    return (
        <div className="mt-10 animate-premium-fade">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="p-1.5 bg-accent/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <h4 className="text-[11px] font-extrabold text-text/40 uppercase tracking-[0.2em]">{t('product.smartPairing')}</h4>
            </div>

            {matchedProduct ? (
                <div
                    onClick={() => onProductSelect?.(matchedProduct)}
                    className="group flex gap-4 p-4 bg-white border border-border/50 rounded-[24px] shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer active:scale-[0.98]"
                >
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-50">
                        {matchedProduct.image ? (
                            <img src={matchedProduct.image} alt={matchedProduct.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                        )}
                    </div>
                    <div className="flex-1 py-0.5 space-y-1">
                        <div className="flex items-center justify-between">
                            <h5 className="font-bold text-text text-sm group-hover:text-primary transition-colors">{matchedProduct.title}</h5>
                            <span className="text-xs font-bold text-primary">{matchedProduct.price}₺</span>
                        </div>
                        <p className="text-[12px] text-text-muted leading-snug line-clamp-2 italic font-medium opacity-80">
                            "{pairing.reason}"
                        </p>
                        <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-wider">
                            <span>{t('product.pairingText')}</span>
                            <Plus className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5 bg-stone-50/50 border border-stone-100/50 rounded-[24px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Sparkles className="w-12 h-12" />
                    </div>
                    <p className="text-sm font-bold text-text mb-1.5">{pairing.pairing}</p>
                    <p className="text-[12px] text-text-muted leading-relaxed italic opacity-85">
                        "{pairing.reason}"
                    </p>
                </div>
            )}
        </div>
    );
};
