import React, { useState, useEffect } from 'react';
import { Product, MenuService } from '../services/MenuService';
import { getProductPairing } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { OptimizedImage } from './ui/OptimizedImage';

interface RecommendationCarouselProps {
    seedProduct: Product;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({ seedProduct }) => {
    const { t } = useLanguage();
    const [recommendations, setRecommendations] = useState<{ product: Product, reason: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecommendations = async () => {
            setLoading(true);
            try {
                // 1. Get AI Suggestion for the seed product
                const aiData = await getProductPairing(seedProduct.title, seedProduct.category);

                // 2. Find matching products in the database
                const allProducts = await MenuService.getProducts();
                const matched = allProducts.find(p =>
                    p.id !== seedProduct.id &&
                    (p.title.toLowerCase().includes(aiData.pairing.toLowerCase()) ||
                        aiData.pairing.toLowerCase().includes(p.title.toLowerCase()))
                );

                if (matched) {
                    setRecommendations([{ product: matched, reason: aiData.reason }]);
                } else {
                    // Fallback: Pick 2 random products from a different category
                    const fallbacks = allProducts
                        .filter(p => p.id !== seedProduct.id && p.category !== seedProduct.category)
                        .slice(0, 2)
                        .map(p => ({ product: p, reason: t('product.pairingText') }));
                    setRecommendations(fallbacks);
                }
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, [seedProduct, t]);

    if (loading || recommendations.length === 0) return null;

    return (
        <div className="py-6 px-2 overflow-hidden bg-primary/5 rounded-3xl my-6 border border-primary/10">
            <div className="px-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-black text-text uppercase tracking-widest">{t('dash.menu.tab.recommendations')}</h3>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x">
                {recommendations.map((rec, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0 w-[280px] bg-white rounded-2xl p-4 shadow-sm snap-start border border-primary/5"
                        onClick={() => {
                            const event = new CustomEvent('selectProduct', { detail: rec.product });
                            window.dispatchEvent(event);
                        }}
                    >
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-50">
                                <OptimizedImage
                                    src={rec.product.image || ''}
                                    alt={rec.product.title}
                                    containerClassName="w-full h-full"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-text truncate">{rec.product.title}</h4>
                                <p className="text-[10px] text-accent font-black mt-0.5">₺{rec.product.price}</p>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-stone-50 rounded-xl relative">
                            <p className="text-[11px] text-text-muted leading-relaxed italic">
                                <span className="font-black text-text not-italic uppercase mr-1">Neden?</span>
                                {rec.reason}
                            </p>
                        </div>
                        <div className="mt-3 flex items-center justify-end text-[10px] font-black text-primary uppercase tracking-widest gap-1 group">
                            <span>Ekle</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
