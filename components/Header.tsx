import React, { useState, useEffect } from 'react';
import { Languages, Menu, X, Phone, MapPin, Clock, Instagram } from 'lucide-react';

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header - Glassmorphic & Modern */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'h-16 glass shadow-sm' : 'h-20 bg-transparent'
          }`}
      >
        <div className="px-5 h-full flex items-center justify-between max-w-md mx-auto">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className={`transition-all duration-300 flex items-center justify-center rounded-xl bg-primary text-white ${scrolled ? 'w-9 h-9' : 'w-10 h-10 shadow-lg'
              }`}>
              <span className="font-serif font-bold text-xl">K</span>
            </div>
            <div className="transition-all duration-300">
              <h1 className="text-base font-bold text-stone-900 leading-none tracking-tight">Kozbeyli Konağı</h1>
              <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-0.5">EST. 2024</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button aria-label="Dil değiştir" className="p-2.5 text-stone-600 hover:bg-stone-100 active:scale-95 transition-all rounded-full">
              <Languages className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Menü aç"
              className="p-2.5 text-stone-900 bg-stone-50 hover:bg-stone-100 active:scale-95 transition-all rounded-full shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <span className="text-lg font-serif font-bold text-stone-900">Menü</span>
          <button onClick={() => setIsSidebarOpen(false)} aria-label="Menü kapat" className="p-2 text-stone-400 hover:text-stone-900 bg-stone-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Info Section */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">Adres</p>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">Kozbeyli Köyü, Kozbeyli Küme Evleri No:188</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">Rezervasyon</p>
                <a href="tel:+905322342686" className="text-sm text-stone-500 mt-1 block hover:text-stone-900 underline decoration-stone-300 underline-offset-4">0532 234 26 86</a>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-stone-900">Çalışma Saatleri</p>
                <p className="text-sm text-stone-500 mt-1">Her gün 09:00 - 22:00</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <h4 className="font-medium text-stone-900 mb-2">Bizi Takip Edin</h4>
            <a href="#" className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900">
              <Instagram className="w-4 h-4" />
              <span>@kozbeylikonagi</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-stone-50 bg-opacity-50 border-t border-stone-100">
          <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-medium">
            Designed by GrainQR
          </p>
        </div>
      </aside>
    </>
  );
};