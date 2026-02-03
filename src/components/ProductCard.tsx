import React, { memo, useState } from 'react';
import { Product, DietaryTag } from '../services/MenuService';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

// Dietary tag icons and labels
const DIETARY_ICONS: Record<DietaryTag, { icon: string; label: string; color: string }> = {
    'vegetarian': { icon: '🌱', label: 'Vejetaryen', color: 'bg-green-100 text-green-700' },
    'vegan': { icon: '🥬', label: 'Vegan', color: 'bg-emerald-100 text-emerald-700' },
    'gluten-free': { icon: '🌾', label: 'Glutensiz', color: 'bg-amber-100 text-amber-700' },
    'spicy': { icon: '🌶️', label: 'Acılı', color: 'bg-red-100 text-red-700' },
    'lactose-free': { icon: '🥛', label: 'Laktozsuz', color: 'bg-blue-100 text-blue-700' },
    'organic': { icon: '🍃', label: 'Organik', color: 'bg-lime-100 text-lime-700' },
    'chef-special': { icon: '👨‍🍳', label: 'Şef Önerisi', color: 'bg-primary/10 text-primary' },
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

    return (
        <div className={`group bg-white border-b border-stone-100 last:border-b-0 ${!product.is_active ? 'opacity-60' : ''}`}>
            <div className="flex gap-3 p-4">
                {/* Content Area - Left */}
                <div className="flex-1 min-w-0">
                    {/* Title Row with Expand Button */}
                    <div className="flex items-start gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-left flex-1 min-w-0"
                        >
                            <h3 className="text-[15px] font-semibold text-stone-900 leading-tight">
                                {product.title}
                            </h3>
                            {shouldTruncate && (
                                <span className="flex-shrink-0 text-stone-400">
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Dietary Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {product.tags.map((tag) => {
                                const tagInfo = DIETARY_ICONS[tag];
                                return (
                                    <span
                                        key={tag}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tagInfo.color}`}
                                        title={tagInfo.label}
                                    >
                                        <span>{tagInfo.icon}</span>
                                        <span className="hidden sm:inline">{tagInfo.label}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-[13px] text-stone-500 leading-relaxed mt-2">
                        {displayDescription}
                        {shouldTruncate && !isExpanded && (
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="text-primary font-medium ml-1 hover:underline"
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
                            <span className="text-[15px] font-bold text-stone-900">
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
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl">
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
                    {/* Additional info could go here */}
                </div>
            )}
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
