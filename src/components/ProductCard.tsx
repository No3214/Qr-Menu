import React, { memo, useState } from 'react';
import { Product, DietaryTag } from '../services/MenuService';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

// Dietary icons - small gray icons inline with title
const DIETARY_ICONS: Record<DietaryTag, { icon: string; label: string; color: string }> = {
    'vegetarian': { icon: '🌱', label: 'Vejetaryen', color: 'text-green-600' },
    'vegan': { icon: '🥬', label: 'Vegan', color: 'text-emerald-600' },
    'gluten-free': { icon: '🌾', label: 'Glutensiz', color: 'text-amber-600' },
    'spicy': { icon: '🌶️', label: 'Acılı', color: 'text-red-500' },
    'lactose-free': { icon: '🥛', label: 'Laktozsuz', color: 'text-blue-500' },
    'organic': { icon: '🍃', label: 'Organik', color: 'text-lime-600' },
    'chef-special': { icon: '👨‍🍳', label: 'Şef Önerisi', color: 'text-primary' },
    'egg': { icon: '🥚', label: 'Yumurta', color: 'text-stone-500' },
    'cheese': { icon: '🧀', label: 'Peynir', color: 'text-stone-500' },
    'mint': { icon: '🌿', label: 'Nane/Taze', color: 'text-stone-500' },
    'meat': { icon: '🥩', label: 'Et', color: 'text-stone-500' },
    'fish': { icon: '🐟', label: 'Balık', color: 'text-stone-500' },
    'bread': { icon: '🍞', label: 'Ekmek/Tahıl', color: 'text-stone-500' },
    'dairy': { icon: '🥛', label: 'Süt Ürünü', color: 'text-stone-500' },
    'new': { icon: '✨', label: 'Yeni', color: 'text-blue-500' },
    'popular': { icon: '🔥', label: 'Popüler', color: 'text-orange-500' },
};

const DESCRIPTION_LIMIT = 80;

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    const shouldTruncate = product.description.length > DESCRIPTION_LIMIT;
    const displayDescription = isExpanded || !shouldTruncate
        ? product.description
        : product.description.slice(0, DESCRIPTION_LIMIT) + '...';

    // Separate badge tags (new, popular) from inline icons
    const badgeTags = product.tags?.filter(t => t === 'new' || t === 'popular') || [];
    const inlineTags = product.tags?.filter(t => t !== 'new' && t !== 'popular') || [];

    return (
        <div className={`group bg-white border-b border-stone-100 last:border-b-0 ${!product.is_active ? 'opacity-60' : ''}`}>
            <div className="flex gap-3 p-4">
                {/* Content Area - Left */}
                <div className="flex-1 min-w-0">
                    {/* Badge Tags (New, Popular) */}
                    {badgeTags.length > 0 && (
                        <div className="flex gap-1.5 mb-1.5">
                            {badgeTags.map((tag) => {
                                const tagInfo = DIETARY_ICONS[tag];
                                return (
                                    <span
                                        key={tag}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                            tag === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}
                                    >
                                        {tagInfo.icon} {tagInfo.label}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Title Row with Inline Icons and Chevron */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 text-left flex-1 min-w-0"
                        >
                            <h3 className="text-[15px] font-semibold text-stone-900 leading-tight">
                                {product.title}
                            </h3>

                            {/* Inline dietary icons */}
                            {inlineTags.length > 0 && (
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                    {inlineTags.slice(0, 4).map((tag) => {
                                        const tagInfo = DIETARY_ICONS[tag];
                                        return (
                                            <span
                                                key={tag}
                                                className="text-stone-400 text-sm"
                                                title={tagInfo.label}
                                            >
                                                {tagInfo.icon}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Chevron - always show for expandable feel */}
                            <span className="flex-shrink-0 text-stone-400 ml-auto">
                                {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-stone-500 leading-relaxed mt-2">
                        {displayDescription}
                        {shouldTruncate && !isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(true);
                                }}
                                className="text-stone-400 underline text-xs ml-1 hover:text-primary"
                            >
                                Devamını Gör
                            </button>
                        )}
                    </p>

                    {/* Price / Variants */}
                    <div className="mt-3">
                        {product.variants && product.variants.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => (
                                    <span
                                        key={variant.id}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-stone-50 rounded-lg text-xs"
                                    >
                                        <span className="text-stone-500">{variant.label}</span>
                                        <span className="font-bold text-stone-900">₺{new Intl.NumberFormat('tr-TR').format(variant.price)}</span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-stone-900">
                                ₺{formattedPrice}
                            </span>
                        )}
                    </div>

                    {/* Out of Stock Badge */}
                    {!product.is_active && (
                        <span className="inline-block mt-2 text-[10px] font-semibold text-red-600 uppercase tracking-wide">
                            {t('product.outOfStock')}
                        </span>
                    )}
                </div>

                {/* Image Area - Right (Thumbnail) */}
                {product.image && (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                        <img
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-xl"
                        />
                        {!product.is_active && (
                            <div className="absolute inset-0 bg-black/40 rounded-xl" />
                        )}
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Full description and additional info */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                            {product.tags.map((tag) => {
                                const tagInfo = DIETARY_ICONS[tag];
                                return (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-stone-50 rounded-full text-[11px] text-stone-600"
                                    >
                                        <span>{tagInfo.icon}</span>
                                        <span>{tagInfo.label}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
