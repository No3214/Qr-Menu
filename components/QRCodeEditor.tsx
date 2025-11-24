import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode'; // Using raw logic library now
import { 
  Download, Upload, Type, Palette, Sparkles, Loader2, 
  LayoutTemplate, Image as ImageIcon, 
  BoxSelect, Frame, MousePointer2, Square, 
  AlertTriangle, Lock, Wand2, RefreshCcw, X,
  Wifi, Link as LinkIcon, Check, Eye, Smartphone, Zap, Ruler, ArrowRightLeft, ShieldCheck, Wrench,
  Circle, Grid3X3, Maximize, Minimize, Layers
} from 'lucide-react';
import { generateTaglines } from '../services/geminiService';
import toast from 'react-hot-toast';

// --- TYPES & INTERFACES ---
type LogoPlacement = 'center' | 'background';
type FrameStyle = 'none' | 'border' | 'polaroid' | 'acrylic' | 'scanme';
type TabId = 'content' | 'design' | 'frames' | 'check';
type QREcLevel = 'L' | 'M' | 'Q' | 'H';
type ContentType = 'url' | 'wifi';
type DotStyle = 'square' | 'circle';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'content', label: 'Content', icon: Type },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'frames', label: 'Frames', icon: LayoutTemplate },
  { id: 'check', label: 'Pre-flight', icon: Zap },
];

const FRAMES: { id: FrameStyle; label: string; icon: React.ElementType, desc: string }[] = [
  { id: 'none', label: 'Minimal', icon: Square, desc: 'Clean, raw code' },
  { id: 'border', label: 'Border', icon: BoxSelect, desc: 'Simple outline' },
  { id: 'polaroid', label: 'Polaroid', icon: ImageIcon, desc: 'Retro photo style' },
  { id: 'acrylic', label: 'Acrylic', icon: Frame, desc: 'Table stand mockup' },
  { id: 'scanme', label: 'Bubble', icon: MousePointer2, desc: 'Action button' },
];

const THEMES = [
  {
    name: 'Kozbeyli Stone',
    fg: '#1E293B',
    bg: '#E2E8F0',
    accent: '#0F172A',
    frame: 'none' as FrameStyle,
    radius: 0,
    density: 'H' as QREcLevel,
    useGradient: false,
    gradStart: '#000000',
    gradEnd: '#000000',
    dotScale: 0.35,
    dotStyle: 'circle' as DotStyle,
    placement: 'background' as LogoPlacement,
    bgScale: 0.9,
    bgOpacity: 0.15
  },
  {
    name: 'Midnight Gold',
    fg: '#D4AF37',
    bg: '#0F172A',
    accent: '#D4AF37',
    frame: 'acrylic' as FrameStyle,
    radius: 12,
    density: 'H' as QREcLevel,
    useGradient: true,
    gradStart: '#D4AF37',
    gradEnd: '#B45309',
    dotScale: 0.8,
    dotStyle: 'square' as DotStyle,
    placement: 'center' as LogoPlacement,
    bgScale: 1,
    bgOpacity: 0.2
  },
  {
    name: 'Clean Marble',
    fg: '#1E293B',
    bg: '#FFFFFF',
    accent: '#000000',
    frame: 'polaroid' as FrameStyle,
    radius: 0,
    density: 'Q' as QREcLevel,
    useGradient: false,
    gradStart: '#000000',
    gradEnd: '#000000',
    dotScale: 1,
    dotStyle: 'square' as DotStyle,
    placement: 'center' as LogoPlacement,
    bgScale: 1,
    bgOpacity: 0.2
  }
];

// --- UI COMPONENTS ---
const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 block group-hover:text-gold-500 transition-colors duration-300">{label}</label>
    <div className="relative flex items-center p-1.5 bg-slate-900 border border-slate-700 rounded-xl transition-all duration-300 hover:border-gold-500/50 hover:shadow-[0_0_15px_-3px_rgba(212,175,55,0.15)] group-focus-within:border-gold-500 ring-0 focus-within:ring-2 focus-within:ring-gold-500/20">
      <div 
        className="w-10 h-10 rounded-lg shadow-sm border border-white/5 relative overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: value }}
      >
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="ml-3 flex flex-col">
        <span className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">{value.toUpperCase()}</span>
      </div>
    </div>
  </div>
);

const RangeSlider = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onChange, 
  formatValue = (v: number) => v,
  subLabel
}: { 
  label: string, 
  value: number, 
  min: number, 
  max: number, 
  step?: number, 
  onChange: (val: number) => void,
  formatValue?: (v: number) => string | number,
  subLabel?: string
}) => {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
          {label}
        </label>
        <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-gold-400 group-hover:border-gold-500/30 transition-colors shadow-sm min-w-[3rem] text-center">
          {formatValue(value)}
        </span>
      </div>
      <div className="relative h-4 flex items-center">
         <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all z-10"
        />
      </div>
      {subLabel && <p className="text-[9px] text-slate-600 mt-1">{subLabel}</p>}
    </div>
  );
};


// Helper for color contrast
const getContrastRatio = (hex1: string, hex2: string) => {
  const getLum = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = ((rgb >> 0) & 0xff) / 255;
    const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  const l1 = getLum(hex1) + 0.05;
  const l2 = getLum(hex2) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
};

export const QRCodeEditor: React.FC = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<TabId>('content');
  
  // Content
  const [contentType, setContentType] = useState<ContentType>('url');
  const [url, setUrl] = useState('https://menu.yourhotel.com');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [restaurantName, setRestaurantName] = useState('Grand Hotel Dining');
  const [vibe, setVibe] = useState('Elegant and Relaxing');
  const [customLabel, setCustomLabel] = useState('Scan for Menu');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Design
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [eyeColor, setEyeColor] = useState('#0F172A');
  
  // Gradient State
  const [useGradient, setUseGradient] = useState(false);
  const [gradientStart, setGradientStart] = useState('#D4AF37');
  const [gradientEnd, setGradientEnd] = useState('#B45309');
  
  // Advanced Design
  const [dotScale, setDotScale] = useState(0.8);
  const [dotStyle, setDotStyle] = useState<DotStyle>('square');
  
  const [logoImg, setLogoImg] = useState<string | null>(null);
  const [logoPlacement, setLogoPlacement] = useState<LogoPlacement>('center');
  const [logoSize, setLogoSize] = useState(50); // Center logo size
  const [bgImageScale, setBgImageScale] = useState(1.0); // Background logo size
  
  const [bgOpacity, setBgOpacity] = useState(0.2);
  const [borderRadius, setBorderRadius] = useState(0);
  const [qrEcLevel, setQrEcLevel] = useState<QREcLevel>('H');

  // Pre-flight
  const [printSizeCm, setPrintSizeCm] = useState(10);

  // Frames
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [borderWidth, setBorderWidth] = useState(4);
  const [frameBgImg, setFrameBgImg] = useState<string | null>(null);
  const [showAcrylicBase, setShowAcrylicBase] = useState(true);
  const [acrylicOpacity, setAcrylicOpacity] = useState(0.9);
  
  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- DERIVED STATE ---
  const contrastFg = getContrastRatio(fgColor, bgColor);
  const contrastStart = useGradient ? getContrastRatio(gradientStart, bgColor) : contrastFg;
  const contrastEnd = useGradient ? getContrastRatio(gradientEnd, bgColor) : contrastFg;
  const contrastRatio = Math.min(contrastFg, contrastStart, contrastEnd);
  const isContrastPoor = contrastRatio < 2.5; 

  // --- GENERATE QR DATA ---
  const getQrValue = () => {
    if (contentType === 'wifi') {
      const safeSsid = wifiSsid.replace(/[\\;,:"]/g, '\\$&');
      const safePass = wifiPassword.replace(/[\\;,:"]/g, '\\$&');
      return `WIFI:T:WPA;S:${safeSsid};P:${safePass};H:${wifiHidden};;`;
    }
    return url;
  };

  // --- CUSTOM RENDER ENGINE ---
  const renderQRCode = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Generate Matrix
    let qrData;
    try {
        qrData = QRCode.create(getQrValue(), { 
            errorCorrectionLevel: qrEcLevel,
            maskPattern: undefined
        });
    } catch (e) {
        console.error("QR Gen Error", e);
        return;
    }

    const modules = qrData.modules;
    const moduleCount = modules.size;
    const pixelRatio = 4; // High res render for preview
    const margin = 2; // Modules margin
    const size = 300 * pixelRatio; 
    const cellSize = size / (moduleCount + margin * 2);
    
    // Resize Canvas
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // 2. Background Drawing
    if (logoPlacement === 'background' && logoImg) {
       const img = new Image();
       img.src = logoImg;
       await new Promise((r) => { img.onload = r; if(img.complete) r(null); });
       
       ctx.fillStyle = bgColor; // Base fill
       ctx.fillRect(0,0,size,size);
       
       ctx.globalAlpha = bgOpacity;
       
       // Calculate aspect ratio preserving dimensions
       // Use MIN to fit inside (contain), then multiply by user scale
       const scaleRatio = Math.min(size/img.width, size/img.height) * bgImageScale;
       
       const drawW = img.width * scaleRatio;
       const drawH = img.height * scaleRatio;
       const x = (size - drawW) / 2;
       const y = (size - drawH) / 2;
       
       ctx.drawImage(img, x, y, drawW, drawH);
       ctx.globalAlpha = 1.0;
    } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0,0,size,size);
    }

    // 3. Draw Modules
    ctx.fillStyle = fgColor;
    if (useGradient) {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, gradientStart);
        grad.addColorStop(1, gradientEnd);
        ctx.fillStyle = grad;
    }

    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (modules.get(r, c)) {
                // Determine position
                const px = (c + margin) * cellSize;
                const py = (r + margin) * cellSize;
                
                // CRITICAL FIX: Finder Pattern Detection
                // Finder patterns are 7x7 squares in Top-Left, Top-Right, Bottom-Left
                const isFinderPattern = 
                    (r < 7 && c < 7) || // Top-Left
                    (r < 7 && c >= moduleCount - 7) || // Top-Right
                    (r >= moduleCount - 7 && c < 7); // Bottom-Left

                // If it is a Finder Pattern, draw it SOLID (no scaling, always square/filled)
                // This ensures readability even if the rest of the code is very thin/artsy.
                if (isFinderPattern) {
                     ctx.beginPath();
                     ctx.rect(px, py, cellSize + 0.5, cellSize + 0.5); // +0.5 to prevent gap lines
                     ctx.fill();
                } else {
                    // Data Modules -> Apply Stylization (Dot Scale / Circle)
                    const dotSize = cellSize * dotScale;
                    const offset = (cellSize - dotSize) / 2;

                    if (dotStyle === 'circle') {
                        ctx.beginPath();
                        ctx.arc(px + cellSize/2, py + cellSize/2, dotSize/2, 0, Math.PI*2);
                        ctx.fill();
                    } else {
                        // Square (possibly rounded)
                        const radius = borderRadius > 0 ? (dotSize * (borderRadius/50) * 0.5) : 0;
                        ctx.beginPath();
                        ctx.roundRect(px + offset, py + offset, dotSize, dotSize, radius);
                        ctx.fill();
                    }
                }
            }
        }
    }

    // 4. Center Logo with Correct Aspect Ratio
    if (logoPlacement === 'center' && logoImg) {
        const img = new Image();
        img.src = logoImg;
        await new Promise((r) => { img.onload = r; if(img.complete) r(null); });
        
        // Calculate dimensions preserving aspect ratio
        const ratio = img.width / img.height;
        const logoBaseSize = (size * (logoSize / 100)); // The bounding box primary dimension
        
        let drawW, drawH;
        if (ratio >= 1) {
            // Landscape or Square
            drawW = logoBaseSize;
            drawH = logoBaseSize / ratio;
        } else {
            // Portrait
            drawH = logoBaseSize;
            drawW = logoBaseSize * ratio;
        }

        const lx = (size - drawW) / 2;
        const ly = (size - drawH) / 2;

        if (!useGradient) {
             ctx.fillStyle = bgColor;
             ctx.beginPath();
             // Adjust background pill to match logo shape
             ctx.roundRect(lx-5, ly-5, drawW+10, drawH+10, 20);
             ctx.fill();
        }

        ctx.drawImage(img, lx, ly, drawW, drawH);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        renderQRCode();
    }, 50); // Debounce
    return () => clearTimeout(timer);
  }, [
      url, wifiSsid, wifiPassword, wifiHidden, contentType, 
      fgColor, bgColor, bgOpacity, useGradient, gradientStart, gradientEnd,
      dotScale, dotStyle, logoImg, logoPlacement, logoSize, bgImageScale,
      qrEcLevel, borderRadius
  ]);


  // --- HANDLERS ---
  const applyTheme = (theme: typeof THEMES[0]) => {
    setFgColor(theme.fg);
    setBgColor(theme.bg);
    setEyeColor(theme.accent);
    setFrameStyle(theme.frame);
    setBorderRadius(theme.radius);
    setQrEcLevel(theme.density);
    setUseGradient(theme.useGradient);
    if (theme.useGradient) {
        setGradientStart(theme.gradStart);
        setGradientEnd(theme.gradEnd);
    }
    setDotScale(theme.dotScale);
    setDotStyle(theme.dotStyle);
    setLogoPlacement(theme.placement);
    
    // Theme specific logo settings
    if (theme.bgScale) setBgImageScale(theme.bgScale);
    if (theme.bgOpacity) setBgOpacity(theme.bgOpacity);

    setFrameBgImg(null);
    toast.success(`Theme "${theme.name}" applied`);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrameBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFrameBgImg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIGenerate = async () => {
    if (!restaurantName) {
      toast.error('Please enter a restaurant name first');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const suggestions = await generateTaglines(restaurantName, vibe);
      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Could not generate suggestions');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDownload = () => {
      const qrCanvas = canvasRef.current;
      if (!qrCanvas) return;

      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;
      
      const QR_PX = 1000;
      const PADDING = 200;
      let width = QR_PX + PADDING * 2;
      let height = QR_PX + PADDING * 2;
      
      // Frame Sizing
      if (frameStyle === 'polaroid') {
         height += 300;
      } else if (frameStyle === 'scanme') {
         height += 100;
      } else if (frameStyle === 'acrylic') {
         width += 100;
         height += 100;
      }
      
      finalCanvas.width = width;
      finalCanvas.height = height;
      
      // Draw background / Frame
      if (frameStyle === 'scanme') {
          ctx.fillStyle = eyeColor;
          ctx.fillRect(0,0,width,height);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(50, 50, width-100, height-100);
      } else if (frameStyle === 'acrylic') {
          // Transparent bg for PNG
          ctx.fillStyle = `rgba(255,255,255, ${acrylicOpacity})`;
          // Draw rounded rect
          ctx.beginPath();
          ctx.roundRect(0,0, width, height, 40);
          ctx.fill();
          
          // Add border
          ctx.strokeStyle = 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
      } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0,0,width,height);
      }

      // Draw QR centered
      const qrX = (width - QR_PX) / 2;
      const qrY = frameStyle === 'scanme' ? PADDING + 50 : (height - QR_PX) / 2;
      
      // If polaroid, shift up slightly
      const finalQrY = frameStyle === 'polaroid' ? PADDING : qrY;
      
      ctx.drawImage(qrCanvas, qrX, finalQrY, QR_PX, QR_PX);

      // Add Text
      if (frameStyle === 'polaroid') {
         ctx.fillStyle = '#0F172A';
         ctx.font = `bold 80px "Playfair Display"`;
         ctx.textAlign = 'center';
         ctx.fillText(restaurantName, width/2, height - 150);
         
         ctx.font = `40px "Inter"`;
         ctx.fillStyle = '#64748B';
         ctx.fillText(customLabel, width/2, height - 80);
      }
      
      if (frameStyle === 'border') {
         ctx.strokeStyle = eyeColor;
         ctx.lineWidth = borderWidth * 4;
         ctx.strokeRect(50,50, width-100, height-100);
      }

      const link = document.createElement('a');
      link.download = `GrainQR_${Date.now()}.png`;
      link.href = finalCanvas.toDataURL('image/png');
      link.click();
      toast.success("High-Res QR Downloaded");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* LEFT PANEL */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl shadow-black/20 sticky top-24 z-30">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gold-500 text-slate-900 shadow-lg shadow-gold-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 lg:p-8 min-h-[500px] shadow-2xl relative overflow-hidden">
          
          {/* Quick Templates */}
          {activeTab === 'design' && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
               <h3 className="text-sm font-serif font-semibold text-slate-300 mb-4 flex items-center gap-2">
                 <Wand2 className="w-4 h-4 text-gold-500"/> 
                 <span>Quick Presets</span>
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {THEMES.map((theme) => (
                   <button
                     key={theme.name}
                     onClick={() => applyTheme(theme)}
                     className="group relative bg-slate-800 border border-slate-700 hover:border-gold-500/50 p-3 rounded-2xl flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:shadow-gold-500/10 hover:-translate-y-0.5 overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <span className="text-xs font-medium text-slate-400 group-hover:text-gold-100 z-10">{theme.name}</span>
                   </button>
                 ))}
               </div>
            </div>
          )}
          
          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 w-full max-w-sm">
                <button 
                  onClick={() => setContentType('url')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${contentType === 'url' ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Website
                </button>
                <button 
                   onClick={() => setContentType('wifi')}
                   className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${contentType === 'wifi' ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Wifi className="w-3.5 h-3.5" /> WiFi
                </button>
              </div>

              <div className="space-y-6">
                {contentType === 'url' ? (
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider ml-1">Destination URL</label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all placeholder:text-slate-600"
                      placeholder="https://menu.yourhotel.com"
                    />
                  </div>
                ) : (
                  <div className="space-y-5 p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">SSID</label>
                        <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"/>
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Password</label>
                        <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"/>
                     </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider ml-1">Title</label>
                    <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white"/>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider ml-1">Subtitle</label>
                    <input type="text" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white"/>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESIGN TAB */}
          {activeTab === 'design' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               {/* Color & Gradient */}
               <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                 <h3 className="text-sm font-serif font-semibold text-slate-300 mb-5 flex items-center gap-2"><Palette className="w-4 h-4 text-gold-500"/> Appearance</h3>
                 
                 <div className="grid grid-cols-2 gap-6 mb-6">
                    <ColorPicker label="Foreground" value={fgColor} onChange={setFgColor} />
                    <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
                 </div>
                 
                 <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                    <span className="text-sm text-slate-300">Use Gradient</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={useGradient} onChange={(e) => setUseGradient(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:bg-gold-500 transition-colors"></div>
                    </label>
                 </div>
                 
                 {useGradient && (
                    <div className="grid grid-cols-2 gap-6 mt-4 bg-slate-900/50 p-4 rounded-xl">
                         <ColorPicker label="Gradient Start" value={gradientStart} onChange={setGradientStart} />
                         <ColorPicker label="Gradient End" value={gradientEnd} onChange={setGradientEnd} />
                    </div>
                 )}
               </div>

               {/* Logo Integration */}
               <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-serif font-semibold text-slate-300 mb-5 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-gold-500"/> Branding</h3>
                  
                  <div className="flex gap-4 mb-6">
                     <label className="flex-1 cursor-pointer bg-slate-900 border border-dashed border-slate-700 rounded-xl flex items-center justify-center h-24 hover:border-gold-500/50 transition-colors">
                        <div className="text-center">
                            <Upload className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                            <span className="text-xs text-slate-400">Upload Logo</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                     </label>
                     {logoImg && (
                       <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative">
                           <img src={logoImg} className="w-full h-full object-contain" alt="Logo" />
                           <button onClick={() => setLogoImg(null)} className="absolute top-1 right-1 bg-slate-800 rounded-full p-1 text-slate-400"><X className="w-3 h-3"/></button>
                       </div>
                     )}
                  </div>

                  {logoImg && (
                      <div className="space-y-4">
                          <div className="flex bg-slate-900 p-1 rounded-lg">
                              <button onClick={() => setLogoPlacement('center')} className={`flex-1 py-1 text-xs rounded-md ${logoPlacement === 'center' ? 'bg-gold-500 text-slate-900' : 'text-slate-400'}`}>Center</button>
                              <button onClick={() => setLogoPlacement('background')} className={`flex-1 py-1 text-xs rounded-md ${logoPlacement === 'background' ? 'bg-gold-500 text-slate-900' : 'text-slate-400'}`}>Background</button>
                          </div>
                          
                          {logoPlacement === 'background' && (
                              <div className="space-y-3">
                                  <RangeSlider 
                                    label="Watermark Opacity" 
                                    value={bgOpacity} 
                                    min={0.05} max={1} step={0.05} 
                                    onChange={setBgOpacity} 
                                    formatValue={(v) => `${Math.round(v*100)}%`}
                                  />
                                  <RangeSlider 
                                    label="Background Image Size" 
                                    value={bgImageScale} 
                                    min={0.1} max={1.5} step={0.05} 
                                    onChange={setBgImageScale} 
                                    formatValue={(v) => `${Math.round(v*100)}%`}
                                    subLabel="Adjusts size relative to QR code frame (contain mode)."
                                  />
                              </div>
                          )}
                          
                          {logoPlacement === 'center' && (
                              <div className="space-y-2">
                                  <RangeSlider 
                                    label="Logo Size" 
                                    value={logoSize} 
                                    min={10} max={40} 
                                    onChange={(val) => setLogoSize(val)} 
                                  />
                                  <div className="flex items-center gap-1.5 justify-end">
                                      <Lock className="w-3 h-3 text-gold-500" />
                                      <span className="text-[10px] text-slate-500">Aspect Ratio Locked</span>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
               </div>

               {/* Advanced Dot Control (THE KOZBEYLI LOOK) */}
               <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-sm font-serif font-semibold text-slate-300 mb-5 flex items-center gap-2"><Grid3X3 className="w-4 h-4 text-gold-500"/> Structure (The Stone Hotel Look)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                       <RangeSlider 
                         label="Dot Scale (Thinness)" 
                         value={dotScale} 
                         min={0.2} max={1.0} step={0.05}
                         onChange={setDotScale} 
                         formatValue={(v) => `${Math.round(v*100)}%`}
                         subLabel="Lower values create more space between dots."
                       />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2">Dot Style</label>
                        <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                            <button 
                                onClick={() => setDotStyle('square')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs rounded-lg transition-all ${dotStyle === 'square' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                            >
                                <Square className="w-3 h-3" /> Square
                            </button>
                            <button 
                                onClick={() => setDotStyle('circle')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs rounded-lg transition-all ${dotStyle === 'circle' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                            >
                                <Circle className="w-3 h-3" /> Circle
                            </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
          
          {/* FRAMES TAB (Restored) */}
          {activeTab === 'frames' && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {FRAMES.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setFrameStyle(frame.id)}
                      className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 group overflow-hidden ${
                        frameStyle === frame.id 
                          ? 'bg-slate-800 border-gold-500 shadow-lg shadow-gold-500/10' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      {/* Visual Preview for Selection */}
                      <div className={`w-12 h-12 flex items-center justify-center mb-2`}>
                          {frame.id === 'none' && (
                              <div className="w-8 h-8 bg-slate-700 rounded-sm"></div>
                          )}
                          {frame.id === 'border' && (
                              <div className="w-8 h-8 border-2 border-slate-400 rounded-sm"></div>
                          )}
                          {frame.id === 'polaroid' && (
                              <div className="w-8 h-10 bg-white rounded-sm flex flex-col items-center pt-1">
                                  <div className="w-6 h-6 bg-slate-300"></div>
                              </div>
                          )}
                          {frame.id === 'acrylic' && (
                              <div className="w-8 h-10 bg-white/20 border border-white/50 rounded-sm backdrop-blur-sm"></div>
                          )}
                          {frame.id === 'scanme' && (
                              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                              </div>
                          )}
                      </div>
                      
                      <span className={`block text-xs font-semibold ${frameStyle === frame.id ? 'text-white' : 'text-slate-400'}`}>{frame.label}</span>
                    </button>
                  ))}
                </div>

                {frameStyle === 'border' && (
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                     <RangeSlider 
                        label="Thickness" 
                        value={borderWidth} 
                        min={1} max={20} 
                        onChange={setBorderWidth} 
                     />
                   </div>
                )}
                
                {frameStyle === 'acrylic' && (
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
                     <div>
                       <RangeSlider 
                          label="Glass Opacity" 
                          value={acrylicOpacity} 
                          min={0.1} max={1.0} step={0.05} 
                          onChange={setAcrylicOpacity} 
                          formatValue={(v) => `${Math.round(v*100)}%`}
                       />
                     </div>
                     <div className="flex items-center gap-3">
                         <input 
                           type="checkbox" 
                           id="acrylicBase"
                           checked={showAcrylicBase}
                           onChange={(e) => setShowAcrylicBase(e.target.checked)}
                           className="rounded bg-slate-800 border-slate-600 text-gold-500 focus:ring-gold-500"
                         />
                         <label htmlFor="acrylicBase" className="text-xs text-slate-300 cursor-pointer">Show Wooden Base</label>
                      </div>
                   </div>
                )}
             </div>
          )}

          {/* CHECK TAB (Restored) */}
          {activeTab === 'check' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isContrastPoor ? 'bg-red-900/10 border-red-900/50' : 'bg-green-900/10 border-green-900/50'} text-center`}>
                       <Eye className={`w-6 h-6 mx-auto mb-2 ${isContrastPoor ? 'text-red-400' : 'text-green-400'}`} />
                       <p className="text-xs text-slate-300 font-bold">Contrast</p>
                       <p className={`text-[10px] ${isContrastPoor ? 'text-red-400' : 'text-green-400'}`}>{contrastRatio.toFixed(2)}:1 ({isContrastPoor ? 'Poor' : 'Good'})</p>
                    </div>
                    
                    <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 text-center">
                       <Ruler className="w-6 h-6 mx-auto mb-2 text-gold-400" />
                       <p className="text-xs text-slate-300 font-bold">Max Distance</p>
                       {/* Approx rule: Scan dist = 10x QR width */}
                       <p className="text-[10px] text-gold-400">~{printSizeCm * 10} cm</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                     <label className="text-[10px] text-slate-500 block mb-2">Print Size (cm)</label>
                     <input type="number" value={printSizeCm} onChange={(e) => setPrintSizeCm(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white"/>
                  </div>
              </div>
          )}

        </div>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 space-y-6">
          <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[500px] border-4 border-slate-800">
             
             {/* PREVIEW CONTAINER */}
             <div className={`relative transition-all duration-300 flex flex-col items-center ${
                  frameStyle === 'acrylic' ? 'p-8 rounded-xl shadow-2xl border border-white/40' : 
                  frameStyle === 'polaroid' ? 'bg-white p-4 pb-16 shadow-xl rotate-1' :
                  frameStyle === 'scanme' ? 'p-8 rounded-[2.5rem]' :
                  'bg-white p-4 rounded-xl shadow-xl'
                }`}
                style={{
                  backgroundColor: frameStyle === 'acrylic' ? `rgba(255,255,255,${acrylicOpacity})` : 
                                   frameStyle === 'scanme' ? eyeColor : 
                                   frameStyle === 'none' || frameStyle === 'border' ? '#ffffff' : undefined,
                  backdropFilter: frameStyle === 'acrylic' ? 'blur(12px)' : undefined,
                  width: frameStyle === 'acrylic' ? 'auto' : '340px',
                }}
             >
                <div className={`relative ${frameStyle === 'scanme' ? 'bg-white p-4 rounded-xl' : ''}`}>
                    <canvas ref={canvasRef} className="w-[300px] h-[300px] object-contain" />
                </div>
             
                 {frameStyle === 'polaroid' && (
                     <div className="mt-4 text-center">
                         <h2 className="font-serif font-bold text-xl text-slate-800">{restaurantName}</h2>
                         <p className="text-xs uppercase tracking-widest text-slate-500">{customLabel}</p>
                     </div>
                 )}

                 {frameStyle === 'acrylic' && showAcrylicBase && (
                    <div className="mt-5 w-56 h-8 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 rounded-b-xl shadow-xl border-t border-amber-700/50 relative overflow-hidden">
                         <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40"></div>
                    </div>
                )}
             </div>
          </div>
          
          <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-slate-900 font-bold py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all"
            >
              <Download className="w-5 h-5" />
              Download High-Res
          </button>
        </div>
      </div>
    </div>
  );
};
