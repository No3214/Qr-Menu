import React, { useState } from 'react';
import { Monitor, Eye, Settings, X, ChevronDown, Menu, Search } from 'lucide-react';
import { CATEGORIES } from '../../services/MenuService';
import toast from 'react-hot-toast';

interface RestaurantSettings {
    name: string;
    logo: string | null;
    video: string | null;
    videoEnabled: boolean;
    urlPath: string;
    email: string;
    theme: 'light' | 'dark';
}

export const DisplayPreferencesPage: React.FC = () => {
    const [settings, setSettings] = useState<RestaurantSettings>({
        name: 'Kozbeyli Konağı',
        logo: '/assets/logo-dark.jpg',
        video: '/assets/hero-video.mp4',
        videoEnabled: true,
        urlPath: 'kozbeyli-konagi',
        email: 'info@kozbeylikonagi.com',
        theme: 'light'
    });
    const [previewSize, setPreviewSize] = useState<'large' | 'small'>('large');
    const [isDirty, setIsDirty] = useState(false);

    const handleChange = (field: keyof RestaurantSettings, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        // In production, save to backend
        toast.success('Restoran bilgileri kaydedildi');
        setIsDirty(false);
    };

    const removeMedia = (field: 'logo' | 'video') => {
        setSettings(prev => ({ ...prev, [field]: null }));
        setIsDirty(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Görüntüleme Tercihleri</h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Menü kategorilerinizin müşterilere nasıl gösterileceğini yapılandırın
                    </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
                    <Settings className="w-4 h-4" />
                    Yapılandırmayı Düzenle
                </button>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Restaurant Settings */}
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Monitor className="w-5 h-5 text-stone-500" />
                        <h2 className="text-base font-semibold text-stone-900">Restoran</h2>
                    </div>
                    <p className="text-sm text-stone-500 mb-6">Restoran bilgilerini ve medyayı yapılandırın</p>

                    <div className="space-y-5">
                        {/* Restaurant Name */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Restoran Adı</label>
                            <input
                                type="text"
                                value={settings.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full h-11 px-4 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>

                        {/* Logo */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Restoran Logosu</label>
                            {settings.logo ? (
                                <div className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
                                    <img src={settings.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-stone-900">Yüklenen medya</p>
                                        <p className="text-xs text-stone-500">Yüklendi</p>
                                    </div>
                                    <button
                                        onClick={() => removeMedia('logo')}
                                        className="p-1 text-stone-400 hover:text-red-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-stone-200 rounded-xl text-center">
                                    <p className="text-sm text-stone-500">Logo yüklemek için tıklayın</p>
                                </div>
                            )}
                        </div>

                        {/* Video Toggle */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-stone-700">Restoran Videosu</label>
                            <button
                                onClick={() => handleChange('videoEnabled', !settings.videoEnabled)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${
                                    settings.videoEnabled ? 'bg-stone-900' : 'bg-stone-300'
                                }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                        settings.videoEnabled ? 'left-6' : 'left-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Video Upload */}
                        {settings.videoEnabled && (
                            <div>
                                {settings.video ? (
                                    <div className="flex items-center gap-3 p-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
                                        <div className="w-12 h-12 rounded-lg bg-stone-200 flex items-center justify-center">
                                            <span className="text-lg">🎬</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-stone-900">Yüklenen medya</p>
                                            <p className="text-xs text-stone-500">Yüklendi</p>
                                        </div>
                                        <button
                                            onClick={() => removeMedia('video')}
                                            className="p-1 text-stone-400 hover:text-red-500"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 border-2 border-dashed border-stone-200 rounded-xl text-center">
                                        <p className="text-sm text-stone-500">Video yüklemek için tıklayın</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* URL Path */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Restoran URL Yolu</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-stone-500 bg-stone-50 border border-r-0 border-stone-200 rounded-l-lg">
                                    kozbeylikonagi.com/
                                </span>
                                <input
                                    type="text"
                                    value={settings.urlPath}
                                    onChange={(e) => handleChange('urlPath', e.target.value)}
                                    className="flex-1 h-11 px-4 border border-stone-200 rounded-r-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">İletişim E-postası</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full h-11 px-4 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>

                        {/* Theme */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Görüntüleme Teması</label>
                            <div className="relative">
                                <select
                                    value={settings.theme}
                                    onChange={(e) => handleChange('theme', e.target.value)}
                                    className="w-full h-11 px-4 pr-10 border border-stone-200 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="light">Açık mod</option>
                                    <option value="dark">Koyu mod</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={!isDirty}
                            className={`w-full h-11 rounded-lg text-sm font-medium transition-colors ${
                                isDirty
                                    ? 'bg-primary text-white hover:bg-primary-hover'
                                    : 'bg-stone-300 text-white cursor-not-allowed'
                            }`}
                        >
                            Restoran Bilgilerini Kaydet
                        </button>
                    </div>
                </div>

                {/* Center Column - Phone Preview */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-semibold text-stone-900">Telefon Önizleme</h2>
                        <div className="relative">
                            <select
                                value={previewSize}
                                onChange={(e) => setPreviewSize(e.target.value as 'large' | 'small')}
                                className="h-9 pl-3 pr-8 border border-stone-200 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="large">Büyük</option>
                                <option value="small">Küçük</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Phone Mockup */}
                    <div
                        className="mx-auto bg-stone-800 rounded-[40px] p-3 shadow-2xl"
                        style={{ width: previewSize === 'large' ? '320px' : '280px' }}
                    >
                        <div className="bg-white rounded-[32px] overflow-hidden" style={{ height: previewSize === 'large' ? '580px' : '500px' }}>
                            {/* Phone Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                                <Menu className="w-5 h-5 text-stone-700" />
                                <img src={settings.logo || '/assets/logo-dark.jpg'} alt="Logo" className="h-8 object-contain" />
                                <Search className="w-5 h-5 text-stone-700" />
                            </div>

                            {/* Hero Section */}
                            <div className="relative h-48">
                                <img
                                    src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80"
                                    alt="Hero"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <button className="w-full py-3 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-semibold text-stone-900">
                                        Menüyü Görüntüle
                                    </button>
                                </div>
                                {/* Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-2 py-1 bg-stone-900/80 text-white text-[10px] font-medium rounded">
                                        HEMEN BİLDİR
                                    </span>
                                </div>
                            </div>

                            {/* Categories Grid Preview */}
                            <div className="p-3 space-y-2 overflow-hidden opacity-60">
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.slice(0, 4).map((cat) => (
                                        <div key={cat.id} className="relative h-16 rounded-lg overflow-hidden">
                                            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50" />
                                            <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white">
                                                {cat.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Display Configuration */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-stone-500" />
                                <h2 className="text-base font-semibold text-stone-900">Görüntüleme Yapılandırması</h2>
                            </div>
                            <p className="text-sm text-stone-500 mt-1">
                                Yapılandırılmış görüntüleme bileşenleriniz ({CATEGORIES.length})
                            </p>
                        </div>
                    </div>

                    {/* Draggable Category Cards */}
                    <div className="space-y-4">
                        {/* Full Width Card */}
                        <div className="relative h-28 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={CATEGORIES[0]?.image}
                                alt={CATEGORIES[0]?.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-lg font-bold text-white">{CATEGORIES[0]?.title}</h3>
                                <p className="text-sm text-white/80">{CATEGORIES[0]?.description}</p>
                            </div>
                        </div>

                        {/* Two Column Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.slice(1, 3).map((cat) => (
                                <div
                                    key={cat.id}
                                    className="relative h-24 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <h3 className="text-sm font-bold text-white">{cat.title}</h3>
                                        <p className="text-xs text-white/70 truncate">{cat.description?.slice(0, 20)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* More Two Column Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.slice(3, 5).map((cat) => (
                                <div
                                    key={cat.id}
                                    className="relative h-24 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <h3 className="text-sm font-bold text-white">{cat.title}</h3>
                                        <p className="text-xs text-white/70 truncate">{cat.description?.slice(0, 20)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Full Width Card */}
                        <div className="relative h-28 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={CATEGORIES[5]?.image || CATEGORIES[0]?.image}
                                alt={CATEGORIES[5]?.title || 'Kategori'}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-lg font-bold text-white">{CATEGORIES[5]?.title || 'Ana Yemek'}</h3>
                                <p className="text-sm text-white/80">{CATEGORIES[5]?.description || 'Sofranın başrolü.'}</p>
                            </div>
                        </div>

                        {/* Final Row */}
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.slice(6, 8).map((cat) => (
                                <div
                                    key={cat.id}
                                    className="relative h-24 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <h3 className="text-sm font-bold text-white">{cat.title}</h3>
                                        <p className="text-xs text-white/70 truncate">{cat.description?.slice(0, 20)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayPreferencesPage;
