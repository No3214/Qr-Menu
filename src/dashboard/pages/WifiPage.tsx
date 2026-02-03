import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, Copy, QrCode, Save, RefreshCw } from 'lucide-react';
import { QRService, WifiConfig } from '../../services/QRService';
import toast from 'react-hot-toast';

export const WifiPage: React.FC = () => {
    const [wifiConfig, setWifiConfig] = useState<WifiConfig>({
        ssid: 'Kozbeyli-Guest',
        password: 'welcome2024',
        encryption: 'WPA',
        hidden: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const generateQR = async () => {
        if (!wifiConfig.ssid) {
            toast.error('Wi-Fi adı gerekli');
            return;
        }
        try {
            const url = await QRService.generateWifiQR(wifiConfig);
            setQrUrl(url);
        } catch (error) {
            toast.error('QR kod oluşturulamadı');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // In production, save to backend
            await new Promise(resolve => setTimeout(resolve, 500));
            toast.success('Wi-Fi ayarları kaydedildi');
            await generateQR();
        } catch (error) {
            toast.error('Kaydetme başarısız');
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} kopyalandı`);
    };

    const generateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setWifiConfig(prev => ({ ...prev, password }));
        toast.success('Yeni şifre oluşturuldu');
    };

    React.useEffect(() => {
        generateQR();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-stone-900">Wi-Fi Paylaşımı</h1>
                <p className="text-sm text-stone-500 mt-1">Müşterilerinizle Wi-Fi bilgilerini QR kod ile paylaşın</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings Panel */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-primary" />
                        Wi-Fi Ayarları
                    </h2>

                    <div className="space-y-4">
                        {/* SSID */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Ağ Adı (SSID)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={wifiConfig.ssid}
                                    onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Wi-Fi ağ adını girin"
                                />
                                <button
                                    onClick={() => copyToClipboard(wifiConfig.ssid, 'Ağ adı')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Şifre
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={wifiConfig.password}
                                    onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-4 py-2.5 pr-24 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Wi-Fi şifresini girin"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-stone-400 hover:text-stone-600 p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(wifiConfig.password, 'Şifre')}
                                        className="text-stone-400 hover:text-stone-600 p-1"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={generateRandomPassword}
                                className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Rastgele şifre oluştur
                            </button>
                        </div>

                        {/* Encryption */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Şifreleme Türü
                            </label>
                            <select
                                value={wifiConfig.encryption}
                                onChange={(e) => setWifiConfig(prev => ({ ...prev, encryption: e.target.value as WifiConfig['encryption'] }))}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Şifresiz</option>
                            </select>
                        </div>

                        {/* Hidden Network */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="hidden"
                                checked={wifiConfig.hidden}
                                onChange={(e) => setWifiConfig(prev => ({ ...prev, hidden: e.target.checked }))}
                                className="w-4 h-4 text-primary border-stone-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="hidden" className="text-sm text-stone-700">
                                Gizli ağ
                            </label>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Kaydet ve QR Oluştur
                        </button>
                    </div>
                </div>

                {/* QR Preview Panel */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-primary" />
                        Wi-Fi QR Kodu
                    </h2>

                    <div className="text-center">
                        {qrUrl ? (
                            <>
                                <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-stone-200 inline-block">
                                    <img src={qrUrl} alt="Wi-Fi QR Code" className="w-64 h-64" />
                                </div>
                                <p className="text-sm text-stone-500 mt-4">
                                    Müşteriler bu QR kodu tarayarak Wi-Fi ağınıza otomatik bağlanabilir
                                </p>

                                <div className="flex justify-center gap-3 mt-6">
                                    <button
                                        onClick={() => QRService.downloadQR(qrUrl.replace('256x256', '512x512'), 'wifi-qr')}
                                        className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
                                    >
                                        İndir (PNG)
                                    </button>
                                    <button
                                        onClick={() => QRService.printQRs([qrUrl.replace('256x256', '512x512')], ['Wi-Fi QR'])}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                                    >
                                        Yazdır
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-12">
                                <Wifi className="w-16 h-16 mx-auto text-stone-200 mb-4" />
                                <p className="text-stone-400">QR kod oluşturmak için Wi-Fi bilgilerini girin ve kaydedin</p>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Nasıl Kullanılır?</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>1. QR kodu masa üzerine veya menüye yerleştirin</li>
                            <li>2. Müşteriler telefonları ile QR kodu taratsın</li>
                            <li>3. Wi-Fi ağına otomatik bağlantı önerisi gelecek</li>
                            <li>4. Şifre girmeye gerek kalmadan bağlanırlar</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WifiPage;
