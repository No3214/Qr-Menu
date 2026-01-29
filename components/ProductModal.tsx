import React, { useEffect } from 'react';
import { Product } from '../services/MenuData';
import { X, Share2, Info } from 'lucide-react';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [product]);

    if (!product) return null;

    const formattedPrice = new Intl.NumberFormat('tr-TR').format(product.price);

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl transform transition-transform animate-slide-up"
                style={{ maxHeight: '92vh', height: 'auto' }}
            >
                {/* Close Button / Actions */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Image Header */}
                <div className="relative h-80 bg-stone-100">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                            <span className="text-6xl">🍽️</span>
                        </div>
                    )}
                    {/* Subtle gradient for text readability if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content Body */}
                <div className="px-6 py-8 -mt-6 relative bg-white rounded-t-[32px]">
                    {/* Drag Handle (Visual cue) */}
                    <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-6" />

                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-3xl font-bold text-stone-900 leading-tight font-serif tracking-tight">
                            {product.name}
                        </h2>
                    </div>

                    {!product.isAvailable && (
                        <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase bg-stone-100 text-stone-500 rounded-full tracking-wider border border-stone-200">
                            Tükendi
                        </span>
                    )}

                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-bold text-stone-900">{formattedPrice}</span>
                        <span className="text-xl text-stone-400 font-medium">₺</span>
                    </div>

                    <div className="prose prose-stone prose-sm">
                        <p className="text-stone-600 text-base leading-relaxed font-medium">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-10 pt-6 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full">
                            <Info className="w-4 h-4" />
                            <span>{product.category}</span>
                        </div>

                        {/* Share or Action Button */}
                        <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Add to Order Button (Visual only for now) */}
                    <button className="w-full mt-6 bg-stone-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-stone-900/20 active:scale-[0.98] transition-all">
                        Siparişe Ekle
                    </button>
                </div>
            </div>
        </div>
    );
};
