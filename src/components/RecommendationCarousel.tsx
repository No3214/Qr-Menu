import React, { useState, useEffect } from 'react';
import { Product, MenuService } from '../services/MenuService';
import { getProductPairing } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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
                // Get all products first
                const allProducts = await MenuService.getProducts();

                // Filter products from different categories for variety
                const otherCategoryProducts = allProducts.filter(
                    p => p.id !== seedProduct.id && p.category !== seedProduct.category && p.is_active
                );
                const sameCategoryProducts = allProducts.filter(
                    p => p.id !== seedProduct.id && p.category === seedProduct.category && p.is_active
                );

                let fallbackRecs: { product: Product, reason: string }[] = [];

                // Create fallback recommendations from different categories
                if (otherCategoryProducts.length >= 2) {
                    // Shuffle and pick 2 random products from other categories
                    const shuffled = [...otherCategoryProducts].sort(() => Math.random() - 0.5);
                    fallbackRecs = shuffled.slice(0, 2).map(p => ({
                        product: p,
                        reason: getDefaultReason(seedProduct, p)
                    }));
                } else if (sameCategoryProducts.length >= 1) {
                    fallbackRecs = sameCategoryProducts.slice(0, 2).map(p => ({
                        product: p,
                        reason: t('product.pairingText')
                    }));
                }

                // Try AI pairing if available
                try {
                    const aiData = await getProductPairing(seedProduct.title, seedProduct.category);

                    if (aiData && aiData.pairing) {
                        // Try to find matching product
                        const searchStr = aiData.pairing.toLowerCase();
                        const aiMatch = allProducts.find(p =>
                            p.id !== seedProduct.id &&
                            (p.title.toLowerCase().includes(searchStr) ||
                                searchStr.includes(p.title.toLowerCase()))
                        );

                        if (aiMatch) {
                            // Put AI match first, then add fallbacks
                            const aiRec = { product: aiMatch, reason: aiData.reason };
                            const otherRecs = fallbackRecs.filter(r => r.product.id !== aiMatch.id);
                            setRecommendations([aiRec, ...otherRecs.slice(0, 1)]);
                            return;
                        }
                    }
                } catch {
                    // AI failed, use fallbacks
                }

                // Use fallback recommendations
                setRecommendations(fallbackRecs);
            } catch (error) {
                console.error("Failed to load recommendations", error);
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, [seedProduct, t]);

    // Generate a default reason based on category pairing
    const getDefaultReason = (seed: Product, rec: Product): string => {
        const pairings: Record<string, Record<string, string>> = {
            'kahvalti': {
                'sicak-icecekler': 'Kahvaltı ile sıcak içecek mükemmel bir ikili.',
                'tatlilar': 'Kahvaltının ardından tatlı bir dokunuş.',
                'default': 'Kahvaltınızı tamamlayacak harika bir seçim.'
            },
            'ana-yemekler': {
                'icecekler': 'Ana yemeğinizle ferahlatıcı bir içecek.',
                'mezeler': 'Ana yemek öncesi lezzetli bir başlangıç.',
                'default': 'Ana yemeğinizi tamamlayacak önerimiz.'
            },
            'mezeler': {
                'ana-yemekler': 'Mezenin ardından doyurucu bir ana yemek.',
                'icecekler': 'Mezelerinizle serinletici bir içecek.',
                'default': 'Mezelerinizi zenginleştirecek bir lezzet.'
            },
            'tatlilar': {
                'sicak-icecekler': 'Tatlınızla birlikte sıcak bir içecek.',
                'default': 'Tatlı keyfinizi artıracak bir seçim.'
            },
            'default': {
                'default': 'Bu lezzeti tamamlayan mükemmel bir seçenek.'
            }
        };

        const seedCategory = pairings[seed.category] || pairings['default'];
        return seedCategory[rec.category] || seedCategory['default'] || pairings['default']['default'];
    };

    // Show skeleton while loading
    if (loading) {
        return (
            <div className="py-6 px-4 overflow-hidden bg-gradient-to-r from-amber-50/80 to-orange-50/60 rounded-2xl my-4 mx-4 border border-amber-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-amber-200/50 rounded-lg animate-pulse" />
                    <div className="h-4 w-28 bg-amber-200/50 rounded animate-pulse" />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {[1, 2].map(i => (
                        <div key={i} className="flex-shrink-0 w-[260px] bg-white rounded-xl p-3 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-16 h-16 rounded-xl bg-stone-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-20 bg-stone-100 rounded" />
                                    <div className="h-3 w-12 bg-stone-100 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <div className="py-5 px-4 overflow-hidden bg-gradient-to-r from-amber-50/80 to-orange-50/60 rounded-2xl my-4 mx-4 border border-amber-100/50">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    {t('menu.recommendations')}
                </h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {recommendations.map((rec, idx) => (
                    <motion.div
                        key={rec.product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-shrink-0 w-[260px] bg-white rounded-xl p-3 shadow-sm border border-stone-100 snap-start cursor-pointer hover:shadow-md hover:border-amber-200 transition-all active:scale-[0.98]"
                        onClick={() => {
                            const event = new CustomEvent('selectProduct', { detail: rec.product });
                            window.dispatchEvent(event);
                        }}
                    >
                        <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-50">
                                {rec.product.image ? (
                                    <img
                                        src={rec.product.image}
                                        alt={rec.product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-stone-800 truncate">{rec.product.title}</h4>
                                <p className="text-xs font-bold text-amber-600 mt-0.5">₺{rec.product.price}</p>
                                <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                                    {rec.reason}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-stone-50 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">
                                {t('menu.pairingReason')}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                                <Plus className="w-3 h-3" />
                                <span>{t('menu.addToOrderShort')}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
