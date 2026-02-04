import React, { memo, useState } from 'react';
import { Product, DietaryTag } from '../services/MenuService';
import { ChevronRight, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

// Dietary icons with premium styling
const DIETARY_ICONS: Record<DietaryTag, { icon: string; label: string; color: string; bg: string }> = {
    'vegetarian': { icon: '🌱', label: 'Vejetaryen', color: 'text-green-700', bg: 'bg-green-50' },
    'vegan': { icon: '🥬', label: 'Vegan', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    'gluten-free': { icon: '🌾', label: 'Glutensiz', color: 'text-amber-700', bg: 'bg-amber-50' },
    'spicy': { icon: '🌶️', label: 'Acılı', color: 'text-red-600', bg: 'bg-red-50' },
    'lactose-free': { icon: '🥛', label: 'Laktozsuz', color: 'text-blue-700', bg: 'bg-blue-50' },
    'organic': { icon: '🍃', label: 'Organik', color: 'text-lime-700', bg: 'bg-lime-50' },
    'chef-special': { icon: '⭐', label: 'Şef Önerisi', color: 'text-amber-600', bg: 'bg-amber-50' },
    'egg': { icon: '🥚', label: 'Yumurta', color: 'text-stone-600', bg: 'bg-stone-50' },
    'cheese': { icon: '🧀', label: 'Peynir', color: 'text-yellow-700', bg: 'bg-yellow-50' },
    'mint': { icon: '🌿', label: 'Taze', color: 'text-green-600', bg: 'bg-green-50' },
    'meat': { icon: '🥩', label: 'Et', color: 'text-red-700', bg: 'bg-red-50' },
    'fish': { icon: '🐟', label: 'Balık', color: 'text-blue-600', bg: 'bg-blue-50' },
    'bread': { icon: '🍞', label: 'Tahıl', color: 'text-amber-700', bg: 'bg-amber-50' },
    'dairy': { icon: '🥛', label: 'Süt', color: 'text-sky-600', bg: 'bg-sky-50' },
    'new': { icon: '✨', label: 'Yeni', color: 'text-blue-600', bg: 'bg-blue-100' },
    'popular': { icon: '🔥', label: 'Popüler', color: 'text-orange-600', bg: 'bg-orange-100' },
};

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const { t } = useLanguage();
    const [isHovered, setIsHovered] = useState(false);
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    // Separate special tags from regular ones
    const specialTags = product.tags?.filter(t => t === 'new' || t === 'popular' || t === 'chef-special') || [];
    const regularTags = product.tags?.filter(t => t !== 'new' && t !== 'popular' && t !== 'chef-special') || [];

    return (
        <div
            className={`group relative bg-white transition-all duration-300 ${!product.is_active ? 'opacity-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Card Content */}
            <div className="flex gap-4 p-4 sm:p-5">
                {/* Content Area */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Special Tags Row */}
                    {specialTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {specialTags.map((tag) => {
                                const tagInfo = DIETARY_ICONS[tag];
                                return (
                                    <span
                                        key={tag}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${tagInfo.bg} ${tagInfo.color}`}
                                    >
                                        {tagInfo.icon} {tagInfo.label}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Title with Arrow */}
                    <div className="flex items-start gap-2">
                        <h3 className="text-base sm:text-[17px] font-bold text-stone-900 leading-snug group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                        <ChevronRight
                            className={`w-5 h-5 text-stone-300 flex-shrink-0 mt-0.5 transition-all duration-300 ${isHovered ? 'text-primary translate-x-1' : ''}`}
                        />
                    </div>

                    {/* Dietary Icons Row */}
                    {regularTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {regularTags.slice(0, 5).map((tag) => {
                                const tagInfo = DIETARY_ICONS[tag];
                                return (
                                    <span
                                        key={tag}
                                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] ${tagInfo.bg} ${tagInfo.color}`}
                                        title={tagInfo.label}
                                    >
                                        <span className="text-xs">{tagInfo.icon}</span>
                                        <span className="font-medium hidden sm:inline">{tagInfo.label}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-[13px] sm:text-sm text-stone-500 leading-relaxed mt-2 line-clamp-2">
                        {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="mt-auto pt-3">
                        {product.variants && product.variants.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {product.variants.slice(0, 4).map((variant, idx) => (
                                    <div
                                        key={variant.id}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                                            idx === 0
                                                ? 'bg-primary/10 border border-primary/20'
                                                : 'bg-stone-50 border border-stone-100'
                                        }`}
                                    >
                                        <span className={`font-medium ${idx === 0 ? 'text-primary' : 'text-stone-500'}`}>
                                            {variant.label}
                                        </span>
                                        <span className={`font-bold ${idx === 0 ? 'text-primary' : 'text-stone-900'}`}>
                                            ₺{new Intl.NumberFormat('tr-TR').format(variant.price)}
                                        </span>
                                    </div>
                                ))}
                                {product.variants.length > 4 && (
                                    <span className="text-xs text-stone-400 self-center">
                                        +{product.variants.length - 4}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl font-bold text-stone-900">
                                    ₺{formattedPrice}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Area */}
                <div className="relative flex-shrink-0">
                    {product.image ? (
                        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02]' : ''}`}>
                            <img
                                src={product.image}
                                alt={product.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                            {/* Add button on hover */}
                            <div className={`absolute bottom-2 right-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <button className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Out of Stock overlay */}
                            {!product.is_active && (
                                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-red-500 px-2 py-1 rounded">
                                        {t('product.outOfStock')}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-stone-100 rounded-2xl flex items-center justify-center">
                            <span className="text-3xl">🍽️</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom border with hover effect */}
            <div className={`h-px bg-stone-100 mx-4 transition-colors ${isHovered ? 'bg-primary/20' : ''}`} />
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
