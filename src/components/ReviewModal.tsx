
import React, { useState } from 'react';
import { Star, X, CheckCircle2, Heart, Award, Sparkles, MessageSquare } from 'lucide-react';
import { ReviewService } from '../services/ReviewService';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);
    const [comment, setComment] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await ReviewService.submitReview(rating, comment, customerName);
            setSubmitted(true);
            toast.success(t('review.success'));
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setRating(5);
                setComment('');
                setCustomerName('');
            }, 3000);
        } catch (error) {
            console.error(error);
            toast.error(t('review.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden transform animate-scale-up">
                {submitted ? (
                    <div className="p-12 text-center py-20">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-4xl font-bold text-stone-900 mb-4 tracking-tight">{t('review.thanks')}</h2>
                        <p className="text-stone-500 font-bold max-w-[240px] mx-auto text-sm leading-relaxed">
                            {t('review.thanksText')}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header Decoration */}
                        <div className="h-32 bg-stone-900 relative flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
                            <div className="w-20 h-20 bg-white shadow-2xl rounded-3xl flex items-center justify-center transform -rotate-12 border-4 border-primary/20">
                                <Award className="w-10 h-10 text-primary" />
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-10 py-12">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-stone-900 mb-2">{t('review.title')}</h2>
                                <p className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">{t('review.subtitle')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Stars */}
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`transform transition-all duration-300 hover:scale-125 ${rating >= star ? 'text-primary' : 'text-stone-200'}`}
                                        >
                                            <Star className={`w-10 h-10 ${rating >= star ? 'fill-primary' : ''}`} />
                                        </button>
                                    ))}
                                </div>

                                {/* Quick Tags */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: t('review.tag1'), icon: Sparkles },
                                        { label: t('review.tag2'), icon: Heart },
                                        { label: t('review.tag3'), icon: Award },
                                        { label: t('review.tag4'), icon: MessageSquare }
                                    ].map(tag => (
                                        <button
                                            key={tag.label}
                                            type="button"
                                            onClick={() => setComment(prev => prev + (prev ? ', ' : '') + tag.label)}
                                            className="px-4 py-3 bg-stone-50 hover:bg-stone-100 border border-stone-100 rounded-2xl text-[10px] font-bold text-stone-600 flex items-center gap-2 transition-all active:scale-95"
                                        >
                                            <tag.icon className="w-3 h-3 text-primary" />
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder={t('review.name')}
                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder={t('review.comment')}
                                        className="w-full bg-stone-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none min-h-[120px] transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-stone-900 text-white py-5 rounded-[20px] font-bold text-lg shadow-xl shadow-stone-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? t('review.submitting') : t('review.submit')} <CheckCircle2 className="w-5 h-5 text-primary" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
