import React, { useState } from 'react';
import { Languages, Menu, X, Phone, MapPin, Clock } from 'lucide-react';

/**
 * Header - Mobile-first kompakt başlık
 */
export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Header - Compact for mobile */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 h-14">
        <div className="px-3 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C5A059] rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">Kozbeyli Konağı</h1>
              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Dijital Menü</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 active:bg-gray-100 rounded-lg">
              <Languages className="w-4 h-4" />
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 active:bg-gray-100 rounded-lg">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Bilgiler</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 text-gray-500 active:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-4">
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Adres</p>
              <p className="text-gray-500 mt-0.5">Kozbeyli Köyü, Kozbeyli Küme Evleri No:188</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Telefon</p>
              <a href="tel:+905322342686" className="text-[#C5A059] mt-0.5 block">0532 234 26 86</a>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Çalışma Saatleri</p>
              <p className="text-gray-500 mt-0.5">Her gün 09:00 - 22:00</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs font-medium text-amber-800">☕ Kahvaltı Servisi</p>
            <p className="text-[10px] text-amber-700 mt-0.5">Kişi başı fiyatlandırma</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest">
            Powered by <span className="text-[#C5A059] font-medium">GrainQR</span>
          </p>
        </div>
      </aside>
    </>
  );
};