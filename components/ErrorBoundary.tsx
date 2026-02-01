
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
                <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-stone-100 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-amber-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-stone-900 mb-2">Beklenmedik Bir Hata</h1>
                        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                            Üzgünüz, bir şeyler yanlış gitti. Menüyü tekrar yüklemeyi deneyebilir misiniz?
                        </p>

                        <button
                            onClick={this.handleReset}
                            className="w-full h-14 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-stone-200"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Yeniden Başlat
                        </button>

                        <p className="mt-8 text-[10px] text-stone-300 uppercase tracking-widest font-bold">
                            Kozbeyli Konağı • Premium Support
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
