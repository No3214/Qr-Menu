
import React, { useEffect } from 'react';
import { Product, MenuService, DietaryTag } from '../services/MenuService';
import { X, Share2, Sparkles, Plus, ChevronRight, Heart } from 'lucide-react';
import { getProductPairing } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

const TAG_INFO: Record<DietaryTag, { icon: string; label: string; color: string }> = {
    'vegetarian': { icon: '🌱', label: 'Vejetaryen', color: 'bg-green-100 text-green-700' },
    'vegan': { icon: '🥬', label: 'Vegan', color: 'bg-emerald-100 text-emerald-700' },
    'gluten-free': { icon: '🌾', label: 'Glutensiz', color: 'bg-amber-100 text-amber-700' },
    'spicy': { icon: '🌶️', label: 'Acılı', color: 'bg-red-100 text-red-700' },
    'lactose-free': { icon: '🥛', label: 'Laktozsuz', color: 'bg-blue-100 text-blue-700' },
    'organic': { icon: '🍃', label: 'Organik', color: 'bg-lime-100 text-lime-700' },
    'chef-special': { icon: '⭐', label: 'Şef Önerisi', color: 'bg-amber-100 text-amber-700' },
    'egg': { icon: '🥚', label: 'Yumurta', color: 'bg-stone-100 text-stone-600' },
    'cheese': { icon: '🧀', label: 'Peynir', color: 'bg-yellow-100 text-yellow-700' },
    'mint': { icon: '🌿', label: 'Taze', color: 'bg-green-100 text-green-600' },
    'meat': { icon: '🥩', label: 'Et', color: 'bg-red-100 text-red-700' },
    'fish': { icon: '🐟', label: 'Balık', color: 'bg-blue-100 text-blue-600' },
    'bread': { icon: '🍞', label: 'Tahıl', color: 'bg-amber-100 text-amber-700' },
    'dairy': { icon: '🥛', label: 'Süt', color: 'bg-sky-100 text-sky-600' },
    'new': { icon: '✨', label: 'Yeni', color: 'bg-blue-100 text-blue-600' },
    'popular': { icon: '🔥', label: 'Popüler', color: 'bg-orange-100 text-orange-600' },
};

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

    const handleShare = async () => {
        if (!product) return;
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
                toast.success('Link kopyalandı!', { icon: '🔗' });
            }
        } catch (err) {
            console.error('Share failed', err);
        }
    };

    if (!product) return null;

    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);
    const hasVariants = product.variants && product.variants.length > 0;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl"
                    style={{ maxHeight: '92vh' }}
                >
                    {/* Header Actions */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
                        <button
                            onClick={handleShare}
                            className="p-2.5 bg-white/90 hover:bg-white text-stone-600 rounded-full shadow-lg backdrop-blur-sm transition-all active:scale-95"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-white/90 hover:bg-white text-stone-600 rounded-full shadow-lg backdrop-blur-sm transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto" style={{ maxHeight: '92vh' }}>
                        {/* Image Header */}
                        <div className="relative h-72 sm:h-80 bg-stone-100">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                                    <span className="text-7xl">🍽️</span>
                                </div>
                            )}
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            {/* Favorite button */}
                            <button className="absolute bottom-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all active:scale-95">
                                <Heart className="w-5 h-5 text-stone-400 hover:text-red-500 transition-colors" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="px-6 sm:px-8 py-6 -mt-6 relative bg-white rounded-t-[28px]">
                            {/* Drag Handle */}
                            <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-6" />

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.tags.map((tag) => {
                                        const info = TAG_INFO[tag];
                                        return (
                                            <span
                                                key={tag}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${info.color}`}
                                            >
                                                {info.icon} {info.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-2">
                                {product.title}
                            </h2>

                            {/* Out of Stock Badge */}
                            {!product.is_active && (
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase bg-red-100 text-red-600 rounded-full">
                                    {t('product.outOfStock')}
                                </span>
                            )}

                            {/* Price Section */}
                            <div className="mb-6">
                                {hasVariants ? (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Fiyat Seçenekleri</p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.variants!.map((variant, idx) => (
                                                <button
                                                    key={variant.id}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                        idx === 0
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                                    }`}
                                                >
                                                    <span className="block text-xs opacity-80">{variant.label}</span>
                                                    <span className="block text-lg font-bold">₺{new Intl.NumberFormat('tr-TR').format(variant.price)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-stone-900">{formattedPrice}</span>
                                        <span className="text-xl text-stone-400 font-medium">₺</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <p className="text-stone-600 text-base leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* AI Product Pairing */}
                            <AIPairing
                                productName={product.title}
                                category={product.category}
                                onProductSelect={(p) => {
                                    onClose();
                                    setTimeout(() => {
                                        const event = new CustomEvent('selectProduct', { detail: p });
                                        window.dispatchEvent(event);
                                    }, 300);
                                }}
                            />

                            {/* Add to Order Button */}
                            <button
                                onClick={onClose}
                                disabled={!product.is_active}
                                className={`w-full mt-6 py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                                    product.is_active
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                            >
                                <Plus className="w-5 h-5" />
                                {t('product.addToOrder')}
                            </button>

                            {/* Bottom spacing for mobile */}
                            <div className="h-4" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
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
                const data = await getProductPairing(productName, category);
                setPairing(data);

                if (data.pairing) {
                    const allProducts = await MenuService.getProducts();
                    const searchStr = data.pairing.toLowerCase();
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
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl animate-pulse">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-amber-200/50 rounded-lg"></div>
                <div className="h-4 w-28 bg-amber-200/50 rounded"></div>
            </div>
            <div className="flex gap-3">
                <div className="w-16 h-16 bg-amber-200/30 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-amber-200/30 rounded"></div>
                    <div className="h-3 w-1/2 bg-amber-200/20 rounded"></div>
                </div>
            </div>
        </div>
    );

    if (!pairing) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">{t('product.smartPairing')}</h4>
            </div>

            {matchedProduct ? (
                <div
                    onClick={() => onProductSelect?.(matchedProduct)}
                    className="flex gap-3 p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
                >
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {matchedProduct.image ? (
                            <img src={matchedProduct.image} alt={matchedProduct.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h5 className="font-bold text-stone-800 text-sm truncate group-hover:text-primary transition-colors">{matchedProduct.title}</h5>
                            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-amber-600 font-bold mb-1">₺{matchedProduct.price}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed italic">
                            {pairing.reason}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="p-3 bg-white/50 rounded-xl">
                    <p className="text-sm font-semibold text-stone-800 mb-1">{pairing.pairing}</p>
                    <p className="text-xs text-stone-500 italic">{pairing.reason}</p>
                </div>
            )}
        </motion.div>
    );
};
