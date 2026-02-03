import React, { useState } from 'react';
import { Sparkles, X, MessageCircle, Star, HelpCircle } from 'lucide-react';

interface FloatingActionButtonProps {
    onFeedback?: () => void;
    onHelp?: () => void;
}

/**
 * FloatingActionButton - FOOST style floating button
 * Shows sparkle icon, expands to show quick actions
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onFeedback,
    onHelp
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-20 right-4 z-40 flex flex-col-reverse items-end gap-3">
            {/* Action buttons - shown when open */}
            {isOpen && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-200">
                    {onFeedback && (
                        <button
                            onClick={() => {
                                onFeedback();
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-stone-100 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                            <Star className="w-4 h-4 text-amber-500" />
                            Değerlendir
                        </button>
                    )}
                    {onHelp && (
                        <button
                            onClick={() => {
                                onHelp();
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-stone-100 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            Yardım
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-stone-100 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        Garson Çağır
                    </button>
                </div>
            )}

            {/* Main FAB button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-12 rounded-xl shadow-lg flex items-center justify-center
                    transition-all duration-300 transform
                    ${isOpen
                        ? 'bg-stone-800 rotate-45'
                        : 'bg-stone-700 hover:bg-stone-800 hover:scale-105'
                    }
                `}
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
            >
                {isOpen ? (
                    <X className="w-5 h-5 text-white" />
                ) : (
                    <Sparkles className="w-5 h-5 text-amber-400" />
                )}
            </button>
        </div>
    );
};

export default FloatingActionButton;
