import React, { useState, useEffect } from 'react';
import { QrCode, Plus, Download, Printer, Copy, Wifi, UtensilsCrossed, Table2, Check, RefreshCw } from 'lucide-react';
import { QRService, QRCodeConfig, WifiConfig } from '../../services/QRService';
import toast from 'react-hot-toast';

export const QRCodePage: React.FC = () => {
    const [qrConfigs, setQrConfigs] = useState<QRCodeConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'menu' | 'table' | 'wifi'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [generatedQR, setGeneratedQR] = useState<string | null>(null);
    const [tableCount, setTableCount] = useState(10);
    const [wifiConfig, setWifiConfig] = useState<WifiConfig>({
        ssid: 'Kozbeyli-Guest',
        password: '',
        encryption: 'WPA',
        hidden: false
    });

    useEffect(() => {
        loadQRConfigs();
    }, []);

    const loadQRConfigs = async () => {
        setLoading(true);
        try {
            const configs = await QRService.getQRConfigs();
            setQrConfigs(configs);
        } catch (error) {
            toast.error('QR kodları yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const generateMenuQR = async () => {
        try {
            const qrUrl = await QRService.generateMenuQR('');
            setGeneratedQR(qrUrl);
            toast.success('QR kod oluşturuldu');
        } catch (error) {
            toast.error('QR kod oluşturulamadı');
        }
    };

    const generateWifiQR = async () => {
        if (!wifiConfig.ssid || !wifiConfig.password) {
            toast.error('Wi-Fi adı ve şifre gerekli');
            return;
        }
        try {
            const qrUrl = await QRService.generateWifiQR(wifiConfig);
            setGeneratedQR(qrUrl);
            toast.success('Wi-Fi QR kodu oluşturuldu');
        } catch (error) {
            toast.error('QR kod oluşturulamadı');
        }
    };

    const generateTableQRs = async () => {
        try {
            const tableQRs = await QRService.generateTableQRs('', tableCount);
            const urls = tableQRs.map(t => t.qrUrl);
            const titles = tableQRs.map(t => `Masa ${t.tableNumber}`);
            QRService.printQRs(urls, titles);
            toast.success(`${tableCount} masa QR kodu hazırlandı`);
        } catch (error) {
            toast.error('Masa QR kodları oluşturulamadı');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Kopyalandı');
    };

    const downloadQR = async (url: string, name: string) => {
        await QRService.downloadQR(url, name);
        toast.success('İndirildi');
    };

    const filteredConfigs = activeTab === 'all'
        ? qrConfigs
        : qrConfigs.filter(c => c.type === activeTab);

    const stats = {
        total: qrConfigs.length,
        totalScans: qrConfigs.reduce((sum, c) => sum + c.scans, 0),
        active: qrConfigs.filter(c => c.isActive).length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">QR Kod Yönetimi</h1>
                    <p className="text-sm text-stone-500 mt-1">Menü ve masa QR kodlarınızı oluşturun ve yönetin</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni QR Oluştur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
                            <p className="text-xs text-stone-500">Toplam QR Kod</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-stone-900">{stats.active}</p>
                            <p className="text-xs text-stone-500">Aktif QR Kod</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-stone-900">{stats.totalScans.toLocaleString('tr-TR')}</p>
                            <p className="text-xs text-stone-500">Toplam Tarama</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-stone-200">
                {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'menu', label: 'Menü', icon: UtensilsCrossed },
                    { id: 'table', label: 'Masa', icon: Table2 },
                    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                            activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-stone-500 hover:text-stone-700'
                        }`}
                    >
                        {tab.icon && <tab.icon className="w-4 h-4" />}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* QR List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse">
                            <div className="w-32 h-32 bg-stone-200 rounded-lg mx-auto mb-4" />
                            <div className="h-4 bg-stone-200 rounded w-2/3 mx-auto mb-2" />
                            <div className="h-3 bg-stone-100 rounded w-1/2 mx-auto" />
                        </div>
                    ))
                ) : filteredConfigs.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-stone-500">
                        <QrCode className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Henüz QR kod oluşturulmamış</p>
                    </div>
                ) : (
                    filteredConfigs.map((config) => (
                        <div key={config.id} className="bg-white rounded-xl border border-stone-200 p-4">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(config.url)}&format=svg`}
                                    alt={config.name}
                                    className="w-32 h-32"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-stone-900">{config.name}</h3>
                                <p className="text-xs text-stone-500 mt-1">{config.scans} tarama</p>
                                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                    config.type === 'menu' ? 'bg-primary/10 text-primary' :
                                    config.type === 'table' ? 'bg-blue-100 text-blue-700' :
                                    config.type === 'wifi' ? 'bg-green-100 text-green-700' :
                                    'bg-stone-100 text-stone-700'
                                }`}>
                                    {config.type === 'menu' ? 'Menü' :
                                     config.type === 'table' ? 'Masa' :
                                     config.type === 'wifi' ? 'Wi-Fi' : 'Özel'}
                                </span>
                            </div>
                            <div className="flex justify-center gap-2 mt-4">
                                <button
                                    onClick={() => copyToClipboard(config.url)}
                                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                                    title="URL Kopyala"
                                >
                                    <Copy className="w-4 h-4 text-stone-600" />
                                </button>
                                <button
                                    onClick={() => downloadQR(`https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(config.url)}&format=svg`, config.name)}
                                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                                    title="İndir"
                                >
                                    <Download className="w-4 h-4 text-stone-600" />
                                </button>
                                <button
                                    onClick={() => QRService.printQRs([`https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(config.url)}&format=svg`], [config.name])}
                                    className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                                    title="Yazdır"
                                >
                                    <Printer className="w-4 h-4 text-stone-600" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-stone-900 mb-4">Yeni QR Kod Oluştur</h2>

                        <div className="space-y-4">
                            {/* Menu QR */}
                            <div className="p-4 border border-stone-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Menü QR Kodu</h3>
                                </div>
                                <p className="text-sm text-stone-500 mb-3">Ana menü sayfasına yönlendiren QR kod</p>
                                <button
                                    onClick={generateMenuQR}
                                    className="w-full py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
                                >
                                    Oluştur
                                </button>
                            </div>

                            {/* Table QRs */}
                            <div className="p-4 border border-stone-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Table2 className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold">Masa QR Kodları</h3>
                                </div>
                                <p className="text-sm text-stone-500 mb-3">Masa bazlı QR kodları toplu oluştur</p>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={tableCount}
                                        onChange={(e) => setTableCount(Number(e.target.value))}
                                        className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm"
                                        placeholder="Masa sayısı"
                                    />
                                    <button
                                        onClick={generateTableQRs}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                                    >
                                        {tableCount} Masa Oluştur
                                    </button>
                                </div>
                            </div>

                            {/* WiFi QR */}
                            <div className="p-4 border border-stone-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Wifi className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold">Wi-Fi QR Kodu</h3>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <input
                                        type="text"
                                        value={wifiConfig.ssid}
                                        onChange={(e) => setWifiConfig(prev => ({ ...prev, ssid: e.target.value }))}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                                        placeholder="Wi-Fi Adı (SSID)"
                                    />
                                    <input
                                        type="password"
                                        value={wifiConfig.password}
                                        onChange={(e) => setWifiConfig(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                                        placeholder="Şifre"
                                    />
                                </div>
                                <button
                                    onClick={generateWifiQR}
                                    className="w-full py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                                >
                                    Wi-Fi QR Oluştur
                                </button>
                            </div>
                        </div>

                        {/* Generated QR Preview */}
                        {generatedQR && (
                            <div className="mt-4 p-4 bg-stone-50 rounded-xl text-center">
                                <img src={generatedQR} alt="Generated QR" className="w-48 h-48 mx-auto mb-3" />
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => downloadQR(generatedQR, 'qr-code')}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        İndir
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setShowCreateModal(false);
                                setGeneratedQR(null);
                            }}
                            className="w-full mt-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 transition-colors"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodePage;
