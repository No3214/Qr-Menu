
import React, { useState, useRef } from 'react';
import { Download, Share2, Sparkles, Wand2, QrCode, Palette, RefreshCw } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { generateTaglines } from '../services/geminiService';

interface QRConfig {
  vibe: string;
  primaryColor: string;
  bgColor: string;
  logoUrl: string;
  includeText: boolean;
  tagline: string;
}

export const QRCodeEditor: React.FC = () => {
  const [config, setConfig] = useState<QRConfig>({
    vibe: 'Premium & Modern',
    primaryColor: '#C5A059',
    bgColor: '#ffffff',
    logoUrl: '',
    includeText: true,
    tagline: 'Scan to View Our Menu'
  });

  const [taglines, setTaglines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerateTaglines = async () => {
    setIsGenerating(true);
    try {
      const results = await generateTaglines("Kozbeyli Konağı", config.vibe);
      setTaglines(results);
      if (results.length > 0) setConfig(prev => ({ ...prev, tagline: results[0] }));
    } catch (error) {
      console.error("Tagline error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `GrainQR-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#fafafa] min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Preview */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-[32px] p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] border border-stone-100 sticky top-8 flex flex-col items-center justify-center min-h-[600px]">
            <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <QrCode className="w-3 h-3" /> Digital Preview
            </div>

            {/* The Actual QR Layout */}
            <div ref={canvasRef} className="p-8 bg-white rounded-40px] shadow-sm flex flex-col items-center gap-8 border border-stone-50">
              <div className="relative p-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                <QRCodeCanvas
                  value="https://grainqr.com/kozbeyli-konagi"
                  size={280}
                  fgColor={config.primaryColor}
                  bgColor={config.bgColor}
                  level="H"
                  imageSettings={config.logoUrl ? {
                    src: config.logoUrl,
                    x: undefined,
                    y: undefined,
                    height: 60,
                    width: 60,
                    excavate: true,
                  } : undefined}
                />
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-bottom-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-bottom-4 border-r-4 border-primary rounded-br-xl" />
              </div>

              {config.includeText && (
                <div className="text-center max-w-[300px] animate-fade-in">
                  <h3 className="text-2xl font-bold text-stone-900 leading-tight mb-2 tracking-tight">
                    {config.tagline}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-primary opacity-80">
                    Powered by GrainQR
                  </p>
                </div>
              )}
            </div>

            <div className="mt-12 flex gap-4 w-full max-w-md">
              <button
                onClick={downloadQR}
                className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-stone-200"
              >
                <Download className="w-5 h-5" /> Download
              </button>
              <button className="p-4 bg-white border border-stone-200 text-stone-900 rounded-2xl hover:bg-stone-50 transition-all active:scale-95 shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-stone-200/40 border border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 mb-8 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" /> Design Studio
            </h2>

            {/* AI Tags Section */}
            <div className="mb-10">
              <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-4 block">AI Tagline Generator ✨</label>
              <div className="flex gap-2 mb-4">
                <select
                  value={config.vibe}
                  onChange={(e) => setConfig({ ...config, vibe: e.target.value })}
                  className="flex-1 bg-stone-50 border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-stone-700 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Premium & Elegant</option>
                  <option>Rustic & Cozy</option>
                  <option>Modern Fusion</option>
                  <option>Traditional Ottoman</option>
                </select>
                <button
                  onClick={handleGenerateTaglines}
                  disabled={isGenerating}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-2">
                {taglines.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setConfig({ ...config, tagline: t })}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all border ${config.tagline === t ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-stone-100 text-stone-500 hover:border-primary/20'}`}
                  >
                    "{t}"
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {/* Color Picker */}
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-4 block flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Primary Color
                </label>
                <div className="flex gap-3">
                  {['#C5A059', '#1C1C1C', '#2D5A27', '#8B2121', '#4A6FA5', '#6B4E3D'].map(c => (
                    <button
                      key={c}
                      onClick={() => setConfig({ ...config, primaryColor: c })}
                      className={`w-10 h-10 rounded-full transition-all transform hover:scale-110 active:scale-90 ${config.primaryColor === c ? 'ring-4 ring-primary/20 ring-offset-2' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="relative group">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-xs">
                      +
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-4 block">Center Logo URL</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={config.logoUrl}
                    onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  {config.logoUrl && (
                    <button
                      onClick={() => setConfig({ ...config, logoUrl: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-500"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-[9px] text-stone-400 mt-2 font-medium">✨ Use a square PNG/SVG for best results</p>
              </div>

              {/* Options */}
              <div className="pt-6 border-t border-stone-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={config.includeText}
                    onChange={(e) => setConfig({ ...config, includeText: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-bold text-stone-700 group-hover:text-stone-900 transition-colors">Include Menu Tagline</span>
                </label>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-stone-900 rounded-[32px] p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-white/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">PRO</span>
            </div>
            <h4 className="text-lg font-bold mb-2">QR Analytics</h4>
            <p className="text-xs text-stone-400 mb-6 font-medium">Generate dynamic QR codes that track customer engagement.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xl font-bold mb-1">0</div>
                <div className="text-[10px] text-stone-500 uppercase font-black">Scans</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xl font-bold mb-1">0%</div>
                <div className="text-[10px] text-stone-500 uppercase font-black">CTR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
