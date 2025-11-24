import React from 'react';
import { QrCode, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-luxury-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg shadow-lg shadow-gold-500/20">
            <QrCode className="w-6 h-6 text-luxury-900" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">GrainQR</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Hotel & Dining Solutions</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-gold-400 text-sm font-medium px-3 py-1 bg-gold-400/10 rounded-full border border-gold-400/20">
          <Sparkles className="w-4 h-4" />
          <span>AI Enhanced</span>
        </div>
      </div>
    </header>
  );
};