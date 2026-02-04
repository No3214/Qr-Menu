import React, { useState } from 'react';
import { Sparkles, X, Star, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
    onFeedback?: () => void;
    onHelp?: () => void;
}

/**
 * FloatingActionButton - Premium floating action button with quick actions
 * Shows sparkle icon, expands to show quick actions (review, help)
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onFeedback,
    onHelp
}) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 24,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring" as const, stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="fixed bottom-20 right-4 z-40 flex flex-col-reverse items-end gap-3">
            {/* Action buttons - shown when open */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col gap-2"
                    >
                        {onFeedback && (
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    onFeedback();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-5 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-100 text-sm font-bold text-stone-700 hover:bg-white transition-all"
                            >
                                <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Star className="w-4 h-4 text-amber-500" />
                                </div>
                                {t('fab.review')}
                            </motion.button>
                        )}
                        {onHelp && (
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    onHelp();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2.5 px-5 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-100 text-sm font-bold text-stone-700 hover:bg-white transition-all"
                            >
                                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <HelpCircle className="w-4 h-4 text-blue-500" />
                                </div>
                                {t('fab.help')}
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? t('close') : t('menu')}
                aria-expanded={isOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    rotate: isOpen ? 45 : 0,
                    backgroundColor: isOpen ? '#292524' : '#44403c'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                style={{
                    boxShadow: isOpen
                        ? '0 8px 32px rgba(0,0,0,0.3)'
                        : '0 4px 20px rgba(0,0,0,0.2)'
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -45, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 45, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X className="w-5 h-5 text-white" aria-hidden="true" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sparkle"
                            initial={{ rotate: 45, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -45, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse ring effect when closed */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-amber-400/50"
                        animate={{
                            scale: [1, 1.3, 1.3],
                            opacity: [0.5, 0, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                )}
            </motion.button>
        </div>
    );
};

export default FloatingActionButton;
