
import React, { memo } from 'react';
import { Product } from '../services/MenuService';
import { Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    const { t } = useLanguage();
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    return (
        <div className={`group relative bg-white rounded-2xl p-3 sm:p-3.5 mb-4 border-2 border-transparent shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_8px_24px_-4px_rgba(139,115,91,0.12)] hover:border-primary/10 hover:-translate-y-0.5 active:scale-[0.98] ${!product.is_active ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex gap-4 sm:gap-5">
                {/* Image Area */}
                {product.image ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl">
                        <img
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-xl shadow-sm transition-transform duration-700 group-hover:scale-110"
                        />
                        {!product.is_active && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider border border-white/30 px-2 py-1 rounded-md backdrop-blur-sm">
                                    {t('product.outOfStock')}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-primary/5 flex items-center justify-center text-2xl border border-primary/10">
                        <span className="opacity-40">🍽️</span>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div>
                        <h3 className="text-[17px] font-bold text-text leading-tight mb-1 group-hover:text-primary transition-colors duration-300">
                            {product.title}
                        </h3>
                        <p className="text-[13px] text-text-muted line-clamp-2 leading-relaxed font-medium opacity-85">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[19px] font-extrabold text-text tracking-tight">{formattedPrice}</span>
                            <span className="text-[11px] font-bold text-primary/60 uppercase ml-0.5">₺</span>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                            <Plus className="w-4.5 h-4.5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
