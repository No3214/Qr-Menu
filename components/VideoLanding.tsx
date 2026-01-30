import React from 'react';
import { ChevronDown, Search, Menu, X } from 'lucide-react';

interface VideoLandingProps {
    onEnter: () => void;
}

/**
 * VideoLanding - The entry screen specified in Foost Blueprint
 * Features:
 * - Fullscreen video/image background
 * - Scrim overlay
 * - Header (Hamburger, Logo, Search)
 * - Bottom CTA "Menüyü Görüntüle"
 */
export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter }) => {
    const [showCookies, setShowCookies] = React.useState(true);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Media (Video Fallback to Image) */}
            <div className="absolute inset-0 z-0">
                {/* Placeholder for video - using high quality food shot */}
                <img
                    src="https://images.unsplash.com/photo-1496044530019-f36a6c91604d?q=80&w=2672&auto=format&fit=crop"
                    alt="Atmosphere"
                    className="w-full h-full object-cover opacity-90"
                />
                {/* Scrim Overlay: Gradient from transparent to dark at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
            </div>

            {/* Header (Overlay) */}
            <header className="absolute top-0 left-0 right-0 z-20 bg-white shadow-md flex items-center justify-between px-4 py-2">
                <button className="p-2 text-gray-800">
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <span className="font-serif font-bold text-white text-lg">K</span>
                        </div>
                        <div className="flex flex-col items-center -space-y-1">
                            <span className="text-xs font-bold text-stone-800 tracking-tight">KOZBEYLİ KONAĞI</span>
                            <span className="text-[8px] text-stone-400 font-medium">Taş Otel</span>
                        </div>
                    </div>
                </div>

                <button className="p-2 text-gray-800">
                    <Search className="w-6 h-6" />
                </button>
            </header>

            {/* Content & CTA */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-24 px-6 text-center">
                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">Lezzeti Keşfet</h1>
                <p className="text-white/90 text-base mb-10 max-w-[280px] leading-relaxed drop-shadow-md">
                    Ege'nin en özel lezzetleri ve eşsiz sunumları sizi bekliyor.
                </p>

                <button
                    onClick={onEnter}
                    className="group flex flex-col items-center gap-2 text-white transition-colors"
                >
                    <span className="text-base font-bold tracking-widest uppercase border-2 border-white/40 px-8 py-4 rounded-full backdrop-blur-md bg-white/10 group-hover:bg-white/20 transition-all shadow-xl">
                        Menüyü Görüntüle
                    </span>
                    <ChevronDown className="w-8 h-8 animate-bounce mt-4 opacity-80" />
                </button>
            </div>

            {/* Cookie Notice */}
            {showCookies && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-[340px] bg-stone-50/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white animate-slide-up">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                            🍪
                        </div>
                        <p className="text-[11px] text-stone-600 leading-normal">
                            Menü deneyiminizi iyileştirmek için çerezler kullanıyoruz. Gezinmeye devam ederek kabul edersiniz.
                        </p>
                        <button onClick={() => setShowCookies(false)} className="text-stone-400">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setShowCookies(false)} className="w-full py-2.5 bg-stone-800 text-white text-xs font-bold rounded-xl active:scale-95 transition-all">
                            Kabul Et
                        </button>
                        <button onClick={() => setShowCookies(false)} className="w-full py-1 text-[10px] text-stone-400 font-medium">
                            Daha Fazla Bilgi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
