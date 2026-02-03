import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, PRODUCTS, PRODUCT_PAIRINGS, DietaryFlag, Allergen } from '../services/MenuData';
import { ChevronUp, ChevronDown, ArrowRight, Info, Flame, Clock, Scale, Leaf, Wheat, Dumbbell, AlertTriangle, Play, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fadeInUp, hoverScale } from '../lib/animations';
import { OptimizedImage } from './OptimizedImage';
import { getProductPairings } from '../services/aiPairingService';

interface ProductCardProps {
    product: Product;
    onExplore?: (product: Product) => void;
}

// Dietary flag icon mapping
const DIETARY_ICONS: Record<DietaryFlag, { icon: React.ElementType; color: string; bg: string }> = {
    'VEGAN': { icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
    'VEGETARIAN': { icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    'GLUTEN_FREE': { icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50' },
    'HIGH_PROTEIN': { icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50' },
    'CONTAINS_NUTS': { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    'SPICY': { icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
};

// Dietary flag translation key mapping
const DIETARY_KEYS: Record<DietaryFlag, string> = {
    'VEGAN': 'dietary.vegan',
    'VEGETARIAN': 'dietary.vegetarian',
    'GLUTEN_FREE': 'dietary.glutenFree',
    'HIGH_PROTEIN': 'dietary.highProtein',
    'CONTAINS_NUTS': 'dietary.containsNuts',
    'SPICY': 'dietary.spicy',
};

// Allergen translation key mapping
const ALLERGEN_KEYS: Record<Allergen, string> = {
    'GLUTEN': 'allergen.gluten',
    'DAIRY': 'allergen.dairy',
    'EGGS': 'allergen.eggs',
    'NUTS': 'allergen.nuts',
    'PEANUTS': 'allergen.peanuts',
    'SHELLFISH': 'allergen.shellfish',
    'FISH': 'allergen.fish',
    'SOY': 'allergen.soy',
    'SESAME': 'allergen.sesame',
    'CELERY': 'allergen.celery',
    'MUSTARD': 'allergen.mustard',
    'SULPHITES': 'allergen.sulphites',
};

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onExplore }) => {
    const { t, language } = useLanguage();
    const formattedPrice = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(product.price);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

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
    const hasNutritionalInfo = product.calories || product.weight || product.prepTime;
    const hasDietaryFlags = product.dietaryFlags && product.dietaryFlags.length > 0;
    const hasAllergens = product.allergens && product.allergens.length > 0;
    const hasVideo = Boolean(product.videoUrl);

    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            whileHover="hover"
            className="bg-white mb-6 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            style={{ willChange: 'transform, opacity' }}
        >
            {/* Main Product Image/Video - Full Width with Hover-to-Play */}
            {(product.image || hasVideo) && (
                <motion.div
                    className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer"
                    variants={hoverScale}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => onExplore?.(product)}
                >
                    {/* Video plays on hover (Foost style) */}
                    {hasVideo && isHovered ? (
                        <video
                            src={product.videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : (
                        <OptimizedImage
                            src={product.image!}
                            alt={product.name}
                            wrapperClassName="w-full h-full"
                            className="object-cover"
                        />
                    )}

                    {/* Gradient Overlay from Bottom (Foost style) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                    {/* Popular Badge - Top Right */}
                    {product.isPopular && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg z-10">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {t('product.popular')}
                        </div>
                    )}

                    {/* Dietary Badges - Top Left */}
                    {hasDietaryFlags && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[60%] z-10">
                            {product.dietaryFlags!.map((flag) => {
                                const config = DIETARY_ICONS[flag];
                                const Icon = config.icon;
                                return (
                                    <span
                                        key={flag}
                                        className={`${config.bg} ${config.color} px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm`}
                                        title={t(DIETARY_KEYS[flag])}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {t(DIETARY_KEYS[flag])}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Video Indicator - Shows when video available */}
                    {hasVideo && !isHovered && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 text-white px-2.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm z-10">
                            <Play className="w-3.5 h-3.5" fill="currentColor" />
                            {t('product.watchVideo')}
                        </div>
                    )}

                    {/* Price overlay on image (Foost style) */}
                    <div className="absolute bottom-3 right-3 z-10">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-sm text-stone-500">₺</span>
                            <span className="text-lg font-bold text-stone-900">{formattedPrice}</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Product Info */}
            <div className="px-4 py-4">
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

                    {/* Info icon */}
                    <button
                        onClick={() => onExplore?.(product)}
                        className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center"
                        aria-label={t('product.info')}
                    >
                        <Info className="w-3 h-3 text-stone-400" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed mb-3">
                    {product.description}
                </p>

                {/* Nutritional Info Bar */}
                {hasNutritionalInfo && (
                    <div className="flex items-center gap-4 mb-4 text-xs text-stone-500">
                        {product.calories && (
                            <div className="flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                <span className="font-medium">{product.calories}</span>
                                <span>{t('product.calories')}</span>
                            </div>
                        )}
                        {product.prepTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span className="font-medium">{product.prepTime}</span>
                                <span>{t('product.prepTime')}</span>
                            </div>
                        )}
                        {product.weight && (
                            <div className="flex items-center gap-1">
                                <Scale className="w-3.5 h-3.5 text-stone-400" />
                                <span className="font-medium">{product.weight}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Allergen Info */}
                {hasAllergens && (
                    <div className="flex items-start gap-1.5 mb-4 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="font-medium">{t('allergen.contains')}: </span>
                            <span>{product.allergens!.map(a => t(ALLERGEN_KEYS[a])).join(', ')}</span>
                        </div>
                    </div>
                )}

                {/* Explore Button */}
                <div className="flex items-center justify-end mb-4">
                    <button
                        onClick={() => onExplore?.(product)}
                        className="flex items-center gap-1 px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
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
        <motion.div
            className="flex-shrink-0 w-44 bg-white border border-stone-200 rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => onExplore?.(product)}
            whileHover={{ scale: 1.02, boxShadow: "0px 8px 16px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
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
                    {product.isPopular && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full">
                            <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                    )}
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
        </motion.div>
    );
});

RecommendationCard.displayName = 'RecommendationCard';
