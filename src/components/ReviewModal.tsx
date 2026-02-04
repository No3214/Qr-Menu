
import React, { useState } from 'react';
import { Star, X, CheckCircle2, Heart, Award, Sparkles, MessageSquare } from 'lucide-react';
import { ReviewService } from '../services/ReviewService';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
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

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 50,
            transition: { duration: 0.2 }
        }
    };

    const starVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.3, rotate: 15 },
        tap: { scale: 0.9 },
        selected: { scale: 1.1 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="p-12 text-center py-20"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                                        className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-primary" />
                                        </motion.div>
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl font-bold text-stone-900 mb-4 tracking-tight"
                                    >
                                        {t('review.thanks')}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-stone-500 font-bold max-w-[240px] mx-auto text-sm leading-relaxed"
                                    >
                                        {t('review.thanksText')}
                                    </motion.p>
                                </motion.div>
                            ) : (
                                <motion.div key="form">
                                    {/* Header Decoration */}
                                    <div className="h-32 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
                                        {/* Decorative circles */}
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                            className="absolute w-40 h-40 border border-white/10 rounded-full"
                                        />
                                        <motion.div
                                            initial={{ scale: 0, rotate: -12 }}
                                            animate={{ scale: 1, rotate: -12 }}
                                            transition={{ type: "spring", delay: 0.2 }}
                                            className="w-20 h-20 bg-white shadow-2xl rounded-3xl flex items-center justify-center border-4 border-primary/20"
                                        >
                                            <Award className="w-10 h-10 text-primary" />
                                        </motion.div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={onClose}
                                            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.button>
                                    </div>

                                    <div className="px-10 py-10">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-center mb-8"
                                        >
                                            <h2 className="text-3xl font-bold text-stone-900 mb-2">{t('review.title')}</h2>
                                            <p className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.2em]">{t('review.subtitle')}</p>
                                        </motion.div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            {/* Stars */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex justify-center gap-2"
                                            >
                                                {[1, 2, 3, 4, 5].map((star, index) => (
                                                    <motion.button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        variants={starVariants}
                                                        initial="initial"
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        animate={rating >= star ? "selected" : "initial"}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`p-1 ${rating >= star ? 'text-primary' : 'text-stone-200'}`}
                                                    >
                                                        <Star className={`w-10 h-10 ${rating >= star ? 'fill-primary drop-shadow-lg' : ''}`} />
                                                    </motion.button>
                                                ))}
                                            </motion.div>

                                            {/* Quick Tags */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="grid grid-cols-2 gap-2"
                                            >
                                                {[
                                                    { label: t('review.tag1'), icon: Sparkles, color: 'amber' },
                                                    { label: t('review.tag2'), icon: Heart, color: 'red' },
                                                    { label: t('review.tag3'), icon: Award, color: 'primary' },
                                                    { label: t('review.tag4'), icon: MessageSquare, color: 'blue' }
                                                ].map((tag, index) => (
                                                    <motion.button
                                                        key={tag.label}
                                                        type="button"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.4 + index * 0.1 }}
                                                        whileHover={{ scale: 1.03, y: -2 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setComment(prev => prev + (prev ? ', ' : '') + tag.label)}
                                                        className="px-4 py-3 bg-stone-50 hover:bg-stone-100 border border-stone-100 rounded-2xl text-[10px] font-bold text-stone-600 flex items-center gap-2 transition-colors"
                                                    >
                                                        <tag.icon className="w-3.5 h-3.5 text-primary" />
                                                        {tag.label}
                                                    </motion.button>
                                                ))}
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                                className="space-y-3"
                                            >
                                                <input
                                                    type="text"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder={t('review.name')}
                                                    className="w-full bg-stone-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/20 focus:bg-white outline-none transition-all"
                                                />
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder={t('review.comment')}
                                                    className="w-full bg-stone-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/20 focus:bg-white outline-none min-h-[100px] transition-all resize-none"
                                                />
                                            </motion.div>

                                            <motion.button
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 }}
                                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white py-5 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                ) : (
                                                    <>
                                                        {t('review.submit')}
                                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
