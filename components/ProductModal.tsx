import React, { useEffect } from 'react';
import { Product } from '../services/MenuData';
import { X } from 'lucide-react';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

/**
 * ProductModal - Modern bottom sheet style product details
 * Shows larger image, full description, and price
 */
export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    // Lock body scroll when modal is open
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
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl transform transition-transform animate-slideUp"
                style={{ maxHeight: '90vh' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Header */}
                <div className="relative h-64 sm:h-72 bg-slate-100">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                            <span className="text-4xl">🍽️</span>
                        </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content Body */}
                <div className="p-6 pb-8 overflow-y-auto">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                            {product.name}
                        </h2>
                    </div>

                    {!product.isAvailable && (
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase bg-red-100 text-red-600 rounded-full">
                            Tükendi
                        </span>
                    )}

                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-[#C5A059]">{formattedPrice}</span>
                        <span className="text-lg text-slate-400 font-medium">TL</span>
                    </div>

                    <p className="text-slate-600 text-base leading-relaxed">
                        {product.description}
                    </p>

                    {/* Additional visual elements can go here (allergens, tags, etc.) */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-400">
                        <span>Kategori: <span className="text-slate-900 font-medium capitalize">{product.category}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};
