import { useState, useEffect } from 'react';
import { ChevronDown, Search, Menu, ShieldCheck } from 'lucide-react';

interface VideoLandingProps {
    onEnter: () => void;
}

/**
 * VideoLanding - The entry screen specified in Kozbeyli Blueprint
 * Features:
 * - Fullscreen video/image background
 * - Scrim overlay
 * - Header (Hamburger, Logo, Search)
 * - Bottom CTA "Menüyü Görüntüle"
 * - Mandatory Cookie Notice
 */
export const VideoLanding: React.FC<VideoLandingProps> = ({ onEnter }) => {
    const [showCookies, setShowCookies] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowCookies(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowCookies(false);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Media (Video Fallback to Image) */}
            <div className="absolute inset-0 z-0">
                {/* Placeholder for video - using high quality food shot */}
                <img
                    src="https://images.unsplash.com/photo-1544025162-d76690b67f14?q=80&w=2574&auto=format&fit=crop"
                    alt="Atmosphere"
                    className="w-full h-full object-cover opacity-90 animate-pulse-slow"
                />
                {/* Scrim Overlay: Gradient from transparent to dark at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
            </div>

            {/* Header (Overlay) */}
            <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 text-white">
                <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                    {/* Logo Area */}
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-1">
                        <span className="font-bold text-white text-xl">K</span>
                    </div>
                    <span className="text-xs font-medium tracking-widest uppercase opacity-90">Kozbeyli Konağı</span>
                </div>

                <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                    <Search className="w-5 h-5" />
                </button>
            </header>

            {/* Content & CTA */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-12 px-6 text-center">
                {/* Cookie Notice Modal */}
                {showCookies && (
                    <div className="mb-8 w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[24px] shadow-2xl animate-slide-up text-left">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-bold text-sm">Çerez Kullanımı</h3>
                        </div>
                        <p className="text-white/70 text-xs mb-4 leading-relaxed">
                            Size en iyi deneyimi sunmak için çerezleri kullanıyoruz. Menüye devam ederek kullanım şartlarını kabul etmiş sayılırsınız.
                        </p>
                        <button
                            onClick={handleAcceptCookies}
                            className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition-colors"
                        >
                            Kabul Et ve Devam Et
                        </button>
                    </div>
                )}
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Lezzeti Keşfet</h1>
                <p className="text-white/80 text-sm mb-8 max-w-[250px] leading-relaxed">
                    Ege'nin en özel lezzetleri ve eşsiz sunumları sizi bekliyor.
                </p>

                <button
                    onClick={onEnter}
                    className="group flex flex-col items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                    <span className="text-sm font-medium tracking-widest uppercase border border-white/30 px-6 py-3 rounded-full backdrop-blur-md bg-white/10 group-hover:bg-white/20 transition-all">
                        Menüyü Görüntüle
                    </span>
                    <ChevronDown className="w-6 h-6 animate-bounce mt-2 opacity-70" />
                </button>
            </div>
        </div>
    );
};
