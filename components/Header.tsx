import React, { useState } from 'react';
import { Languages, Menu, X, Phone, MapPin, Clock } from 'lucide-react';

/**
 * Header - Profesyonel site başlığı
 * Özellikler: Mobile sidebar, dil seçici, iletişim bilgileri
 */
export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 h-16 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-4xl">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#B08D22] rounded-xl shadow-md shadow-[#C5A059]/20">
              <span className="text-white font-serif font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                Kozbeyli Konağı
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">
                Dijital Menü
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Language Selector */}
            <button
              className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Dil seçimi"
              title="Dil Seçimi"
            >
              <Languages className="w-5 h-5" />
            </button>

            {/* Menu Button (Mobile) */}
            <button
              onClick={toggleSidebar}
              className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all md:hidden"
              aria-label="Menüyü aç"
              aria-expanded={isSidebarOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl 
          transform transition-transform duration-300 ease-out md:hidden
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Bilgi paneli"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Bilgiler</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 space-y-6">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Adres</p>
                <p className="text-slate-500 mt-0.5">Kozbeyli Köyü, Kozbeyli Küme Evleri No:188</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Phone className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Telefon</p>
                <a href="tel:+905322342686" className="text-[#C5A059] hover:underline mt-0.5 block">
                  +90 532 234 26 86
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Clock className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Çalışma Saatleri</p>
                <p className="text-slate-500 mt-0.5">Her gün 09:00 - 22:00</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Info Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm font-medium text-amber-800">☕ Kahvaltı</p>
              <p className="text-xs text-amber-700 mt-1">Kişi başı servis ve fiyatlandırma</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm font-medium text-slate-800">🍽️ Akşam Yemeği</p>
              <p className="text-xs text-slate-600 mt-1">Her masaya 350 TL başlangıç tabağı. Kuver ücretsiz.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50">
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
            Powered by <span className="text-[#C5A059] font-semibold">GrainQR</span>
          </p>
        </div>
      </aside>
    </>
  );
};