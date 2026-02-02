import React, { useEffect } from 'react';
import { Product, PRODUCTS, PRODUCT_PAIRINGS } from '../services/MenuData';
import { X, Share2, Info, Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSelectProduct?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSelectProduct }) => {
    const { t, language } = useLanguage();

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

    const formattedPrice = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(product.price);

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
                style={{ maxHeight: '92vh' }}
            >
                <div className="overflow-y-auto" style={{ maxHeight: '92vh' }}>
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
                    <div className="relative h-80 bg-stone-100 flex-shrink-0">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                                <span className="text-6xl">&#127869;</span>
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content Body */}
                    <div className="px-6 py-8 -mt-6 relative bg-white rounded-t-[32px]">
                        <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-6" />

                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h2 className="text-3xl font-bold text-stone-900 leading-tight font-serif tracking-tight">
                                {product.name}
                            </h2>
                        </div>

                        {!product.isAvailable && (
                            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase bg-stone-100 text-stone-500 rounded-full tracking-wider border border-stone-200">
                                {t('product.outOfStock')}
                            </span>
                        )}

                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-bold text-stone-900">{formattedPrice}</span>
                            <span className="text-xl text-stone-400 font-medium">&#8378;</span>
                        </div>

                        <div className="prose prose-stone prose-sm">
                            <p className="text-stone-600 text-base leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        {/* Notes */}
                        {product.notes && product.notes.length > 0 && (
                            <div className="mt-6 space-y-2.5">
                                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                    {t('product.notes')}
                                </h4>
                                <div className="space-y-2">
                                    {product.notes.map((note, i) => (
                                        <div key={i} className="flex items-start gap-2.5 bg-primary/5 border border-primary/10 rounded-xl px-3.5 py-2.5">
                                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                            <p className="text-sm text-stone-600 leading-relaxed font-medium">{note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Öneriler - Cross-sell Pairing Cards */}
                        <PairingRecommendations
                            productId={product.id}
                            onSelectProduct={onSelectProduct}
                        />

                        <div className="mt-10 pt-6 border-t border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full">
                                <Info className="w-4 h-4" />
                                <span>{product.category}</span>
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        if (navigator.share) {
                                            await navigator.share({
                                                title: product.name,
                                                text: `${product.name} - ${formattedPrice}₺`,
                                                url: window.location.href,
                                            });
                                        } else {
                                            await navigator.clipboard.writeText(`${product.name} - ${formattedPrice}₺ | ${window.location.href}`);
                                            toast.success(t('product.shared'));
                                        }
                                    } catch { /* user cancelled share */ }
                                }}
                                className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                                aria-label="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                toast.success(t('product.addedToOrder'));
                                onClose();
                            }}
                            disabled={!product.isAvailable}
                            className="w-full mt-6 bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-stone-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {product.isAvailable ? t('product.addToOrder') : t('product.outOfStock')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PairingRecommendations: React.FC<{
    productId: string;
    onSelectProduct?: (product: Product) => void;
}> = ({ productId, onSelectProduct }) => {
    const { t, language } = useLanguage();
    const pairings = PRODUCT_PAIRINGS[productId];

    if (!pairings || pairings.length === 0) return null;

    const pairedProducts = pairings
        .map(p => {
            const product = PRODUCTS.find(pr => pr.id === p.productId);
            if (!product) return null;
            return {
                product,
                reason: language === 'tr' ? p.reason_tr : p.reason_en,
            };
        })
        .filter(Boolean) as { product: Product; reason: string }[];

    if (pairedProducts.length === 0) return null;

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-stone-900">{t('product.suggestions')}</h4>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {pairedProducts.map(({ product: pairedProduct, reason }) => {
                    const pPrice = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(pairedProduct.price);

                    return (
                        <button
                            key={pairedProduct.id}
                            onClick={() => onSelectProduct?.(pairedProduct)}
                            className="flex-shrink-0 w-48 bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden text-left hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.98] group"
                        >
                            {/* Image */}
                            <div className="relative h-28 bg-stone-100">
                                {pairedProduct.image ? (
                                    <img
                                        src={pairedProduct.image}
                                        alt={pairedProduct.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3">
                                <h5 className="text-sm font-bold text-stone-900 leading-tight mb-1.5 line-clamp-2">
                                    {pairedProduct.name}
                                </h5>
                                <p className="text-[11px] text-stone-500 leading-snug mb-3 line-clamp-3">
                                    <span className="font-bold text-primary">{t('product.why')}</span>{' '}
                                    {reason}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-stone-400">₺</span>
                                    <span className="text-base font-bold text-stone-900">{pPrice}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
