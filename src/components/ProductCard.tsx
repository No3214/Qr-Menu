
import React, { memo, useState } from 'react';
import { Product } from '../services/MenuService';
import { Plus, Flame, Wheat, Milk, Leaf, Info, Star, Sparkles } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    // Start expanded for longer descriptions on larger screens if desired, but default to collapsed for mobile
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    // Mappings for icons
    const getAllergenIcon = (allergen: string) => {
        switch (allergen) {
            case 'gluten': return <Wheat className="w-3 h-3 text-amber-600" />;
            case 'dairy': return <Milk className="w-3 h-3 text-blue-400" />;
            case 'spicy': return <Flame className="w-3 h-3 text-red-500" />;
            case 'vegan': return <Leaf className="w-3 h-3 text-green-500" />;
            case 'vegetarian': return <Leaf className="w-3 h-3 text-green-600" />;
            default: return <Info className="w-3 h-3 text-stone-400" />;
        }
    };

    const getLabelIcon = (label: string) => {
        switch (label) {
            case 'new': return (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-50 border border-purple-100 rounded-md">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wide">YENİ</span>
                </div>
            );
            case 'popular': return (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-100 rounded-md">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wide">POPÜLER</span>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className={`group relative glass-card rounded-2xl p-4 mb-4 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 overflow-hidden
            ${!product.is_active ? 'bg-stone-50/50' : ''}
        `}>
            {/* Out of Stock Overlay - God Mode: Visible but indicated, NOT disabled */}
            {!product.is_active && (
                <div className="absolute top-0 right-0 z-10 bg-stone-900/10 backdrop-blur-[1px] px-3 py-1 rounded-bl-2xl border-l border-b border-white/20">
                    <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
                        Tükendi
                    </span>
                </div>
            )}

            <div className="flex gap-4">
                {/* Left Content */}
                <div className="flex-1 flex flex-col min-w-0 z-10">
                    {/* Header: Title & Badges */}
                    <div className="flex flex-col gap-1.5 mb-2">
                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2">
                            {product.labels?.map((label, i) => (
                                <div key={`label-${i}`}>{getLabelIcon(label)}</div>
                            ))}
                        </div>
                        <h3 className={`text-[17px] font-bold text-text leading-tight group-hover:text-primary transition-colors ${!product.is_active ? 'text-stone-500' : ''}`}>
                            {product.title}
                        </h3>
                    </div>

                    {/* Description */}
                    <div className="relative mb-3">
                        <p
                            className={`text-[13px] text-stone-500 font-medium leading-relaxed transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        >
                            {product.description}
                        </p>
                    </div>

                    {/* Footer: Stats & Price */}
                    <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col gap-1">
                            {/* Stats Row */}
                            <div className="flex items-center gap-3 text-stone-400">
                                {product.calories && (
                                    <span className="text-[10px] font-bold bg-stone-100/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        🔥 {product.calories}
                                    </span>
                                )}
                                {product.prepTime && (
                                    <span className="text-[10px] font-bold bg-stone-100/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        ⏱️ {product.prepTime}dk
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className={`flex items-baseline gap-0.5 ${!product.is_active ? 'opacity-50' : ''}`}>
                                <span className="text-[12px] font-bold text-accent mr-0.5">₺</span>
                                <span className="text-[20px] font-black text-primary tracking-tight">{formattedPrice}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Allergen Icons */}
                            <div className="flex items-center -space-x-1.5 mr-2">
                                {product.allergens?.map((allergen, i) => (
                                    <div key={`allergen-${i}`}
                                        className="w-6 h-6 rounded-full bg-white border border-stone-100 flex items-center justify-center shadow-sm z-0"
                                        title={allergen}>
                                        {getAllergenIcon(allergen)}
                                    </div>
                                ))}
                            </div>

                            {product.is_active ? (
                                <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all duration-300">
                                    <Plus className="w-5 h-5" />
                                </button>
                            ) : (
                                <button className="px-3 py-2 rounded-xl bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors">
                                    Bilgi Al
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                {product.image ? (
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <div className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/50 shadow-sm ${!product.is_active ? 'grayscale opacity-70' : ''}`}>
                            <img
                                src={product.image}
                                alt={product.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>
                ) : (
                    // Fallback visual if no image
                    <div className="w-32 h-32 flex-shrink-0 bg-stone-50/50 rounded-2xl border border-stone-100/50 flex items-center justify-center">
                        <span className="text-2xl opacity-20">🍽️</span>
                    </div>
                )}
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
