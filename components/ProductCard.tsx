import React, { memo } from 'react';
import { Product } from '../services/MenuData';

interface ProductCardProps {
    product: Product;
}

/**
 * ProductCard - Mobile-first ürün kartı (Foost tarzı)
 */
export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    return (
        <div className={`flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 active:bg-gray-50 ${!product.isAvailable ? 'opacity-50' : ''}`}>
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1.5">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</h3>
                    {!product.isAvailable && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-red-100 text-red-600 rounded">
                            Tükendi
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{product.description}</p>
                <div className="mt-1.5">
                    <span className="text-sm font-bold text-[#C5A059]">{formattedPrice}</span>
                    <span className="text-xs text-gray-400 ml-0.5">₺</span>
                </div>
            </div>

            {/* Image */}
            {product.image && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
