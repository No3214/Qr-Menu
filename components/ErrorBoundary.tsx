import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

// Detect user's preferred language
const getUserLanguage = (): 'tr' | 'en' => {
    const stored = localStorage.getItem('language');
    if (stored === 'tr' || stored === 'en') return stored;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('tr') ? 'tr' : 'en';
};

const errorMessages = {
    tr: {
        title: 'Bir hata oluştu',
        description: 'Sayfa yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.',
        button: 'Sayfayı Yenile',
    },
    en: {
        title: 'Something went wrong',
        description: 'An error occurred while loading the page. Please refresh.',
        button: 'Refresh Page',
    },
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            const lang = getUserLanguage();
            const msg = errorMessages[lang];

            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="text-center max-w-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl" role="img" aria-label="warning">⚠️</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">{msg.title}</h2>
                        <p className="text-sm text-gray-500 mb-6">{msg.description}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
                        >
                            {msg.button}
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
