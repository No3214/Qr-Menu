import React from 'react';
import { ChevronDown, Search, Menu } from 'lucide-react';

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
                        <span className="font-bold text-white text-xl">F</span>
                    </div>
                    <span className="text-xs font-medium tracking-widest uppercase opacity-90">Kozbeyli Konağı</span>
                </div>

                <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                    <Search className="w-5 h-5" />
                </button>
            </header>

            {/* Content & CTA */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-12 px-6 text-center">
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
