import React, { memo } from 'react';
import { Product } from '../services/MenuData';

interface ProductCardProps {
    product: Product;
}

/**
 * ProductCard - Ürün kartı bileşeni
 * Profesyonel özellikler: Hover efektleri, fiyat formatı, availability badge
 */
export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <article
            className={`
        group flex items-start gap-4 py-4 px-3 -mx-3 rounded-xl
        transition-all duration-200 cursor-pointer
        hover:bg-slate-50/80 active:bg-slate-100
        ${!product.isAvailable ? 'opacity-50' : ''}
      `}
            role="button"
            tabIndex={0}
            aria-label={`${product.name}, ${formattedPrice} TL`}
        >
            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Product Name */}
                <div className="flex items-start gap-2">
                    <h3 className="text-base font-semibold text-slate-900 leading-tight group-hover:text-[#B08D22] transition-colors">
                        {product.name}
                    </h3>
                    {!product.isAvailable && (
                        <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 rounded-full">
                            Tükendi
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {product.description}
                </p>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#C5A059] tabular-nums">
                        {formattedPrice}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">TL</span>
                </div>
            </div>

            {/* Image (if exists) */}
            {product.image && (
                <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
        </article>
    );
});

ProductCard.displayName = 'ProductCard';
