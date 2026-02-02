import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { ReviewService } from '../services/ReviewService';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

interface ReviewModalProps {
    onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getRatingLabel = (r: number) => {
        const labels: Record<number, string> = {
            5: t('review.rating5'),
            4: t('review.rating4'),
            3: t('review.rating3'),
            2: t('review.rating2'),
            1: t('review.rating1'),
        };
        return labels[r] || '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error(t('review.ratingRequired'));
            return;
        }

        setIsSubmitting(true);
        try {
            await ReviewService.submitReview(rating, comment, name);
            toast.custom((toastData) => (
                <div className={`${toastData.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-xl" role="img" aria-label="celebration">&#127881;</span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {t('review.thankYou')}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {t('review.thankYouMessage')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ), { duration: 3000 });
            onClose();
        } catch {
            toast.error(t('review.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in">
                {/* Header */}
                <div className="bg-primary/5 p-4 flex items-center justify-between border-b border-primary/10">
                    <h2 className="font-bold text-lg text-gray-800">{t('review.title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">{t('review.rateExperience')}</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        className={`transition-colors duration-200 ${(hoverRating || rating) >= star
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-transparent text-gray-200'
                                            }`}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <span className="text-sm font-medium text-primary animate-fade-in">
                                {getRatingLabel(rating)}
                            </span>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">{t('review.nameLabel')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('review.namePlaceholder')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">{t('review.commentLabel')}</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('review.commentPlaceholder')}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-stone-900/20"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{t('review.submit')}</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
