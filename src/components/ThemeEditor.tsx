import React, { useState } from 'react';
import { Palette, Type, Square, Save, RotateCcw, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useBrand, BrandConfig } from '../context/BrandContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-stone-200"
      />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-stone-600 mb-0.5">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-xs font-mono bg-stone-50 border border-stone-200 rounded"
      />
    </div>
  </div>
);

export const ThemeEditor: React.FC = () => {
  const { brand, updateBrand, resetToDefaults, canUseFeature } = useBrand();
  const { t } = useLanguage();
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout'>('colors');
  const [localColors, setLocalColors] = useState(brand.colors);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColorChange = (key: keyof BrandConfig['colors'], value: string) => {
    setLocalColors(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateBrand({ colors: localColors });
      setHasChanges(false);
      toast.success(t('dash.settings.save'));
    } catch {
      toast.error('Kaydetme başarısız');
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setLocalColors(brand.colors);
    setHasChanges(false);
    toast.success('Varsayılana sıfırlandı');
  };

  const handleApplyPreset = (preset: 'gold' | 'blue' | 'green' | 'purple' | 'dark') => {
    const presets: Record<string, Partial<BrandConfig['colors']>> = {
      gold: {
        primary: '#C5A059',
        primaryHover: '#A88B4A',
        background: '#FCFBF7',
        surface: '#FFFFFF',
      },
      blue: {
        primary: '#0EA5E9',
        primaryHover: '#0284C7',
        background: '#F0F9FF',
        surface: '#FFFFFF',
      },
      green: {
        primary: '#22C55E',
        primaryHover: '#16A34A',
        background: '#F0FDF4',
        surface: '#FFFFFF',
      },
      purple: {
        primary: '#8B5CF6',
        primaryHover: '#7C3AED',
        background: '#FAF5FF',
        surface: '#FFFFFF',
      },
      dark: {
        primary: '#C5A059',
        primaryHover: '#A88B4A',
        background: '#1C1917',
        surface: '#292524',
        text: '#FAFAF9',
        textMuted: '#A8A29E',
        border: '#44403C',
      },
    };

    setLocalColors(prev => ({ ...prev, ...presets[preset] }));
    setHasChanges(true);
  };

  if (!canUseFeature('removeBranding')) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-bold text-stone-900 mb-2">Premium Özellik</h3>
        <p className="text-sm text-stone-600 mb-4">
          Tema özelleştirme Professional ve Enterprise planlarda kullanılabilir.
        </p>
        <button className="px-6 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover transition-colors">
          Planı Yükselt
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Tema Editörü</h2>
          <p className="text-sm text-stone-500">Markanıza özel renkler ve stiller</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${hasChanges
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }
            `}
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        {[
          { id: 'colors', label: 'Renkler', icon: Palette },
          { id: 'typography', label: 'Tipografi', icon: Type },
          { id: 'layout', label: 'Düzen', icon: Square },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'colors' | 'typography' | 'layout')}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-stone-500 hover:text-stone-700'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          {activeTab === 'colors' && (
            <>
              {/* Presets */}
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Hazır Temalar</h3>
                <div className="flex gap-2">
                  {[
                    { id: 'gold', color: '#C5A059', label: 'Altın' },
                    { id: 'blue', color: '#0EA5E9', label: 'Mavi' },
                    { id: 'green', color: '#22C55E', label: 'Yeşil' },
                    { id: 'purple', color: '#8B5CF6', label: 'Mor' },
                    { id: 'dark', color: '#1C1917', label: 'Koyu' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id as 'gold' | 'blue' | 'green' | 'purple' | 'dark')}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl border border-stone-200 hover:border-primary transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span className="text-[10px] font-medium text-stone-600">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Colors */}
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Ana Renkler</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Birincil Renk"
                    value={localColors.primary}
                    onChange={(v) => handleColorChange('primary', v)}
                  />
                  <ColorInput
                    label="Birincil Hover"
                    value={localColors.primaryHover}
                    onChange={(v) => handleColorChange('primaryHover', v)}
                  />
                  <ColorInput
                    label="İkincil Renk"
                    value={localColors.secondary}
                    onChange={(v) => handleColorChange('secondary', v)}
                  />
                  <ColorInput
                    label="Vurgu Rengi"
                    value={localColors.accent}
                    onChange={(v) => handleColorChange('accent', v)}
                  />
                </div>
              </div>

              {/* Background Colors */}
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Arka Plan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Arka Plan"
                    value={localColors.background}
                    onChange={(v) => handleColorChange('background', v)}
                  />
                  <ColorInput
                    label="Yüzey"
                    value={localColors.surface}
                    onChange={(v) => handleColorChange('surface', v)}
                  />
                </div>
              </div>

              {/* Text Colors */}
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Metin</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Metin Rengi"
                    value={localColors.text}
                    onChange={(v) => handleColorChange('text', v)}
                  />
                  <ColorInput
                    label="Soluk Metin"
                    value={localColors.textMuted}
                    onChange={(v) => handleColorChange('textMuted', v)}
                  />
                  <ColorInput
                    label="Kenarlık"
                    value={localColors.border}
                    onChange={(v) => handleColorChange('border', v)}
                  />
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Durum Renkleri</h3>
                <div className="grid grid-cols-3 gap-4">
                  <ColorInput
                    label="Başarılı"
                    value={localColors.success}
                    onChange={(v) => handleColorChange('success', v)}
                  />
                  <ColorInput
                    label="Uyarı"
                    value={localColors.warning}
                    onChange={(v) => handleColorChange('warning', v)}
                  />
                  <ColorInput
                    label="Hata"
                    value={localColors.error}
                    onChange={(v) => handleColorChange('error', v)}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Yazı Tipi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Başlık Fontu</label>
                    <select className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm">
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Playfair Display">Playfair Display</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Gövde Fontu</label>
                    <select className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm">
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Köşe Yuvarlaklığı</h3>
                <div className="flex gap-2">
                  {['none', 'sm', 'md', 'lg', 'xl', 'full'].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => updateBrand({ borderRadius: radius as BrandConfig['borderRadius'] })}
                      className={`
                        flex-1 py-3 text-xs font-medium border-2 transition-colors
                        ${brand.borderRadius === radius
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                        }
                      `}
                      style={{
                        borderRadius: radius === 'none' ? '0' :
                          radius === 'sm' ? '4px' :
                            radius === 'md' ? '8px' :
                              radius === 'lg' ? '12px' :
                                radius === 'xl' ? '16px' : '9999px'
                      }}
                    >
                      {radius}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div
            className="rounded-2xl overflow-hidden border border-stone-200"
            style={{ backgroundColor: localColors.background }}
          >
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold" style={{ color: localColors.text }}>
                Önizleme
              </h3>

              {/* Button Preview */}
              <div className="space-y-2">
                <button
                  className="w-full py-3 rounded-xl font-semibold text-white transition-colors"
                  style={{ backgroundColor: localColors.primary }}
                >
                  Birincil Buton
                </button>
                <button
                  className="w-full py-3 rounded-xl font-semibold border-2"
                  style={{ borderColor: localColors.primary, color: localColors.primary }}
                >
                  İkincil Buton
                </button>
              </div>

              {/* Card Preview */}
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: localColors.surface, borderColor: localColors.border, borderWidth: 1 }}
              >
                <h4 className="font-semibold mb-1" style={{ color: localColors.text }}>Kart Başlığı</h4>
                <p className="text-sm" style={{ color: localColors.textMuted }}>
                  Bu bir önizleme kartıdır. Renklerin nasıl göründüğünü buradan kontrol edebilirsiniz.
                </p>
              </div>

              {/* Status Preview */}
              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: localColors.success }}
                >
                  Başarılı
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: localColors.warning }}
                >
                  Uyarı
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: localColors.error }}
                >
                  Hata
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeEditor;
