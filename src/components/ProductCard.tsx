
import React, { memo, useState } from 'react';
import { Product } from '../services/MenuService';
import { Plus, Flame, Wheat, Milk, Leaf, Info, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    // Allergens Mapping
    const getAllergenIcon = (allergen: string) => {
        switch (allergen) {
            case 'gluten': return <Wheat className="w-3 h-3 text-amber-600" />;
            case 'dairy': return <Milk className="w-3 h-3 text-blue-400" />;
            case 'spicy': return <Flame className="w-3 h-3 text-red-500" />;
            case 'vegan': return <Leaf className="w-3 h-3 text-green-500" />;
            case 'vegetarian': return <Leaf className="w-3 h-3 text-green-600" />;
            default: return <Info className="w-3 h-3 text-gray-400" />;
        }
    };

    // Labels Mapping
    const getLabelIcon = (label: string) => {
        switch (label) {
            case 'new': return <Sparkles className="w-3 h-3 text-purple-500" />;
            case 'popular': return <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />;
            default: return null;
        }
    };

    return (
        <div className={`group relative bg-white rounded-2xl p-4 mb-4 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-md ${!product.is_active ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex gap-4">
                {/* Content Area (Left) */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[16px] font-bold text-stone-900 leading-tight">
                            {product.title}
                        </h3>
                        {/* Icons Row */}
                        <div className="flex items-center gap-1">
                            {product.labels?.map((label, i) => (
                                <div key={`label-${i}`} title={label}>{getLabelIcon(label)}</div>
                            ))}
                            {product.allergens?.map((allergen, i) => (
                                <div key={`allergen-${i}`} title={allergen} className="bg-stone-50 p-0.5 rounded-full">
                                    {getAllergenIcon(allergen)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <p
                            className={`text-[13px] text-stone-500 leading-relaxed font-medium transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {product.description}
                        </p>
                        {product.description && product.description.length > 80 && !isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(true);
                                }}
                                className="text-[11px] font-bold text-stone-400 underline decoration-stone-300 underline-offset-2 mt-1 hover:text-primary transition-colors"
                            >
                                {t('product.seeMore') || 'Devamını Gör'}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[11px] font-bold text-stone-400 mr-0.5">₺</span>
                            <span className="text-[18px] font-black text-stone-900 tracking-tight">{formattedPrice}</span>
                        </div>

                        {product.is_active && (
                            <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 shadow-sm hover:bg-primary hover:text-white transition-all duration-300">
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Image Area (Right) */}
                {/* Image Area (Right) - Only render if image exists */}
                {product.image && (
                    <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl border border-stone-100">
                        <img
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {!product.is_active && (
                            <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                                <span className="text-[9px] font-black text-white uppercase tracking-wider border border-white/20 px-2 py-1 rounded-md backdrop-blur-md">
                                    Tükendi
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
