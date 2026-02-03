import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, PRODUCTS, PRODUCT_PAIRINGS } from '../services/MenuData';
import { ChevronUp, ChevronDown, ArrowRight, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fadeInUp } from '../lib/animations';
import { OptimizedImage } from './OptimizedImage';
import { getProductPairings } from '../services/aiPairingService';

interface ProductCardProps {
    product: Product;
    onExplore?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onExplore }) => {
    const { t, language } = useLanguage();
    const formattedPrice = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(product.price);
    const [isExpanded, setIsExpanded] = useState(true);

    // Get pairings - prefer AI-generated, fallback to hardcoded
    const aiPairings = getProductPairings(product.id);
    const pairings = aiPairings.length > 0 ? aiPairings : PRODUCT_PAIRINGS[product.id];

    const pairedProducts = pairings
        ?.map(p => {
            const pairedProduct = PRODUCTS.find(pr => pr.id === p.productId);
            if (!pairedProduct) return null;
            return {
                product: pairedProduct,
                reason: language === 'tr' ? p.reason_tr : p.reason_en,
            };
        })
        .filter(Boolean) as { product: Product; reason: string }[] | undefined;

    const hasPairings = pairedProducts && pairedProducts.length > 0;

    return (
        <motion.div
            variants={fadeInUp}
            className="bg-white mb-6"
            style={{ willChange: 'transform, opacity' }}
        >
            {/* Main Product Image - Full Width */}
            {product.image && (
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                    <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        wrapperClassName="w-full h-full"
                        className="object-cover"
                    />
                </div>
            )}

            {/* Product Info */}
            <div className="px-1">
                {/* Title Row with Toggle */}
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 group"
                    >
                        <h3 className="text-xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                            {product.name}
                        </h3>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-stone-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-stone-400" />
                        )}
                    </button>

                    {/* Category emoji */}
                    <span className="text-lg">🍽️</span>

                    {/* Info icon */}
                    <button
                        className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center"
                        aria-label={t('product.info')}
                    >
                        <Info className="w-3 h-3 text-stone-400" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    {product.description}
                </p>

                {/* Price and Explore Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-sm text-stone-400">₺</span>
                        <span className="text-2xl font-bold text-stone-900">{formattedPrice}</span>
                    </div>

                    <button
                        onClick={() => onExplore?.(product)}
                        className="flex items-center gap-1 px-4 py-2 border border-stone-300 rounded-full text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                        {t('product.explore')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Öneriler Section */}
                <AnimatePresence>
                    {isExpanded && hasPairings && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h4 className="text-lg font-bold text-stone-900 mb-4">
                                {t('product.suggestions')}
                            </h4>

                            {/* Horizontal Scrolling Cards */}
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide">
                                {pairedProducts.map(({ product: pairedProduct, reason }) => (
                                    <RecommendationCard
                                        key={pairedProduct.id}
                                        product={pairedProduct}
                                        reason={reason}
                                        language={language}
                                        onExplore={onExplore}
                                        t={t}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
});

ProductCard.displayName = 'ProductCard';

// Recommendation Card Component
interface RecommendationCardProps {
    product: Product;
    reason: string;
    language: string;
    onExplore?: (product: Product) => void;
    t: (key: string) => string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = memo(({ product, reason, language, onExplore, t }) => {
    const [showFullReason, setShowFullReason] = useState(false);
    const formattedPrice = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(product.price);

    const maxLength = 80;
    const isLongReason = reason.length > maxLength;
    const displayReason = showFullReason ? reason : reason.slice(0, maxLength);

    return (
        <div
            className="flex-shrink-0 w-44 bg-white border border-stone-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onExplore?.(product)}
        >
            {/* Image */}
            {product.image && (
                <div className="relative w-full h-28">
                    <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        wrapperClassName="w-full h-full"
                        className="object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-3">
                <h5 className="text-sm font-bold text-stone-900 mb-2 leading-tight">
                    {product.name}
                </h5>

                {/* Neden? Section */}
                <div className="mb-3">
                    <span className="text-xs font-bold text-stone-700">{t('product.why')}</span>
                    <p className="text-xs text-stone-500 leading-relaxed mt-0.5">
                        {displayReason}
                        {isLongReason && !showFullReason && '...'}
                    </p>
                    {isLongReason && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFullReason(!showFullReason);
                            }}
                            className="text-xs text-primary font-medium underline mt-1"
                        >
                            {showFullReason ? t('product.showLess') : t('product.showMore')}
                        </button>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-stone-400">₺</span>
                    <span className="text-base font-bold text-stone-900">{formattedPrice}</span>
                </div>
            </div>
        </div>
    );
});

RecommendationCard.displayName = 'RecommendationCard';
