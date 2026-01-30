import React, { useEffect } from 'react';
import { Product } from '../services/MenuData';
import { X, Share2, Info, Sparkles } from 'lucide-react';
import { getProductPairing } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

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

                        {/* AI Product Pairing */}
                        <AIPairing productName={product.name} category={product.category} />

                        <div className="mt-10 pt-6 border-t border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full">
                                <Info className="w-4 h-4" />
                                <span>{product.category}</span>
                            </div>

                            <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <button className="w-full mt-6 bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-stone-900/20 active:scale-[0.98] transition-all">
                            {t('product.addToOrder')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIPairing: React.FC<{ productName: string, category: string }> = ({ productName, category }) => {
    const { t } = useLanguage();
    const [pairing, setPairing] = React.useState<{ pairing: string, reason: string } | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const loadPairing = async () => {
            setLoading(true);
            try {
                const data = await getProductPairing(productName, category);
                setPairing(data);
            } catch (error) {
                console.error("Failed to load pairing", error);
            } finally {
                setLoading(false);
            }
        };
        loadPairing();
    }, [productName, category]);

    if (loading) return (
        <div className="mt-8 p-4 bg-stone-50 border border-stone-100 rounded-2xl animate-pulse">
            <div className="h-4 w-24 bg-stone-200 rounded mb-2"></div>
            <div className="h-3 w-full bg-stone-100 rounded"></div>
        </div>
    );

    if (!pairing) return null;

    return (
        <div className="mt-8 p-4 bg-stone-50 border border-stone-100 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-primary/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">{t('product.pairingTitle')}</h4>
            </div>
            <p className="text-sm font-bold text-stone-800 mb-1">{pairing.pairing}</p>
            <p className="text-[11px] text-stone-500 leading-relaxed italic">"{pairing.reason}"</p>
        </div>
    );
};
