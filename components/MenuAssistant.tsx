import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const MenuAssistant: React.FC = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Set initial message based on language
    useEffect(() => {
        setMessages([
            { role: 'assistant', content: t('assistant.welcome') }
        ]);
    }, [language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const suggestedPrompts = useMemo(
        () => [t('assistant.prompt1'), t('assistant.prompt2'), t('assistant.prompt3'), t('assistant.prompt4')],
        [t]
    );

    const handleSend = async (directMessage?: string) => {
        const userMessage = (directMessage || input).trim();
        if (!userMessage || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const langContext = language === 'tr'
                ? "Kullanici Kozbeyli Konagi dijital menusune bakiyor. Turkce yanit ver."
                : "User is viewing the digital menu of Kozbeyli Konagi. Reply in English.";
            const response = await getChatResponse(userMessage, langContext);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: t('assistant.error') }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group"
                    aria-label={t('assistant.title')}
                >
                    <Bot className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 px-3 py-1 bg-white text-stone-900 text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-stone-100 italic">
                        {t('assistant.tooltip')}
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 w-full sm:w-[400px] sm:bottom-6 sm:right-6 bg-white sm:rounded-[24px] shadow-2xl flex flex-col z-[100] border border-stone-100 overflow-hidden animate-slide-up" style={{ height: 'min(600px, 80vh)' }}>
                    {/* Header */}
                    <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{t('assistant.title')}</h3>
                                <p className="text-[10px] text-stone-400">{t('assistant.subtitle')}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label={t('close')}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                        ? 'bg-stone-900 text-white rounded-tr-none'
                                        : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-stone-100">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Prompts */}
                    <div className="px-4 py-2 bg-stone-50 overflow-x-auto flex gap-2 scrollbar-hide">
                        {suggestedPrompts.map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => { handleSend(prompt); }}
                                className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-[10px] font-bold text-stone-600 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-stone-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('assistant.placeholder')}
                            className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className="w-11 h-11 bg-stone-900 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                            aria-label={t('assistant.send')}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
