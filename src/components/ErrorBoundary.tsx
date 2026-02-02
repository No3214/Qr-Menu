
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * ErrorBoundary - Catch-all component for React rendering errors.
 * Provides a professional "Premium" fallback UI instead of a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <LanguageContext.Consumer>
                    {(context) => {
                        const t = context?.t || ((key: string) => key);

                        return (
                            <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
                                <div className="max-w-md w-full bg-surface rounded-[2rem] shadow-2xl p-10 border border-primary/10 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <AlertTriangle className="w-10 h-10 text-accent" />
                                    </div>

                                    <h1 className="text-2xl font-black text-text mb-2 uppercase tracking-tight">
                                        {t('error.title')}
                                    </h1>
                                    <p className="text-text-muted text-sm mb-8 leading-relaxed font-medium">
                                        {t('error.subtitle')}
                                    </p>

                                    <button
                                        onClick={this.handleReset}
                                        className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        {t('error.reset')}
                                    </button>

                                    <p className="mt-8 text-[10px] text-text/30 uppercase tracking-[0.3em] font-black">
                                        Kozbeyli Konağı • Premium Support
                                    </p>
                                </div>
                            </div>
                        );
                    }}
                </LanguageContext.Consumer>
            );
        }

        return this.props.children;
    }
}
