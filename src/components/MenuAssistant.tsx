
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const MenuAssistant: React.FC = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: t('assistant.welcome') }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await getChatResponse(userMessage, "User is viewing the digital menu of Kozbeyli Konağı.");
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
                    className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group"
                >
                    <Bot className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 px-3 py-1 bg-surface text-text text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/10 italic">
                        {t('assistant.tooltip')}
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 w-full sm:w-[400px] sm:bottom-6 sm:right-6 bg-white sm:rounded-[24px] shadow-2xl flex flex-col z-[100] border border-primary/10 overflow-hidden animate-slide-up" style={{ height: 'min(600px, 80vh)' }}>
                    {/* Header */}
                    <div className="p-4 bg-primary text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">{t('assistant.name')}</h3>
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{t('assistant.role')}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg/30">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] font-medium leading-relaxed ${m.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none shadow-md'
                                    : 'bg-white text-text shadow-sm border border-primary/5 rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-primary/5">
                                    <div className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Prompts */}
                    <div className="px-4 py-2 bg-white border-t border-primary/5 overflow-x-auto flex gap-2 no-scrollbar">
                        {[
                            t('assistant.prompt1'),
                            t('assistant.prompt2'),
                            t('assistant.prompt3'),
                            t('assistant.prompt4')
                        ].map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => { setInput(prompt); }}
                                className="px-3.5 py-2 bg-surface border border-primary/10 rounded-full text-[10px] font-extrabold text-text-muted hover:border-accent hover:text-accent transition-all whitespace-nowrap active:scale-95"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-primary/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('assistant.placeholder')}
                            className="flex-1 bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none text-text placeholder:text-text-muted/50 font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-all hover:bg-primary-hover active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
