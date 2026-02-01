
import React, { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CallWaiter: React.FC = () => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'IDLE' | 'CALLING' | 'SUCCESS'>('IDLE');

    const handleCall = () => {
        setStatus('CALLING');
        // Simulate network request
        setTimeout(() => {
            setStatus('SUCCESS');
            setTimeout(() => setStatus('IDLE'), 5000);
        }, 1500);
    };

    if (status === 'SUCCESS') {
        return (
            <div className="fixed bottom-24 right-6 z-40 animate-premium-fade">
                <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500/50 backdrop-blur-md">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">{t('waiter.notified')}</span>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleCall}
            disabled={status === 'CALLING'}
            className={`fixed bottom-24 right-6 z-40 group flex items-center gap-3 p-4 rounded-2xl shadow-2xl transition-all duration-500 active:scale-90 ${
                status === 'CALLING'
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-900 hover:bg-primary hover:text-white'
            }`}
        >
            <div className="relative">
                {status === 'CALLING' ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Bell className="w-6 h-6 group-hover:animate-bounce" />
                )}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
                {t('waiter.call')}
            </span>
        </button>
    );
};
