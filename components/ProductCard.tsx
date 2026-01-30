import React, { memo } from 'react';
import { Product } from '../services/MenuData';
import { Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    return (
        <div className={`group relative bg-white rounded-2xl p-3 sm:p-4 mb-4 border border-stone-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all hover:shadow-lg active:scale-[0.99] ${!product.isAvailable ? 'opacity-60 grayscale' : ''}`}>

            <div className="flex gap-4">
                {/* Image Area */}
                {product.image ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-xl shadow-sm"
                        />
                        {!product.isAvailable && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider border border-white/30 px-2 py-1 rounded-md backdrop-blur-sm">Tükendi</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-stone-50 flex items-center justify-center text-2xl border border-stone-100">
                        🍽️
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div>
                        <h3 className="text-base font-bold text-stone-900 leading-tight mb-1 group-hover:text-stone-700 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-medium">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-stone-900">{formattedPrice}</span>
                            <span className="text-xs font-semibold text-stone-400">₺</span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 shadow-sm border border-stone-100 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
