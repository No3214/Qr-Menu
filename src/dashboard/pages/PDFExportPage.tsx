import React, { useState } from 'react';
import { FileText, Download, Printer, Eye, Settings2 } from 'lucide-react';
import { PDFService, PDFOptions } from '../../services/PDFService';
import toast from 'react-hot-toast';

export const PDFExportPage: React.FC = () => {
    const [options, setOptions] = useState<Partial<PDFOptions>>({
        includeImages: false,
        includeDescriptions: true,
        includePrices: true,
        paperSize: 'A4',
        orientation: 'portrait',
        language: 'tr',
        theme: 'elegant',
        restaurantName: 'Kozbeyli Konağı'
    });

    const handlePreview = () => {
        PDFService.previewMenu(options);
    };

    const handlePrint = () => {
        PDFService.printMenu(options);
        toast.success('Yazdırma penceresi açıldı');
    };

    const handleDownload = () => {
        PDFService.downloadMenuHTML(options);
        toast.success('Menü indirildi');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-stone-900">PDF Menü İndir</h1>
                <p className="text-sm text-stone-500 mt-1">Menünüzü yazdırılabilir PDF formatında indirin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Options Panel */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-stone-200 p-6">
                    <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        PDF Ayarları
                    </h2>

                    <div className="space-y-4">
                        {/* Restaurant Name */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Restoran Adı
                            </label>
                            <input
                                type="text"
                                value={options.restaurantName}
                                onChange={(e) => setOptions(prev => ({ ...prev, restaurantName: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>

                        {/* Theme */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Tema
                            </label>
                            <select
                                value={options.theme}
                                onChange={(e) => setOptions(prev => ({ ...prev, theme: e.target.value as PDFOptions['theme'] }))}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="elegant">Elegant (Krem)</option>
                                <option value="light">Light (Beyaz)</option>
                                <option value="dark">Dark (Koyu)</option>
                            </select>
                        </div>

                        {/* Paper Size */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Kağıt Boyutu
                            </label>
                            <select
                                value={options.paperSize}
                                onChange={(e) => setOptions(prev => ({ ...prev, paperSize: e.target.value as PDFOptions['paperSize'] }))}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="A4">A4</option>
                                <option value="A5">A5</option>
                                <option value="Letter">Letter</option>
                            </select>
                        </div>

                        {/* Orientation */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Yön
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOptions(prev => ({ ...prev, orientation: 'portrait' }))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                        options.orientation === 'portrait'
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                    }`}
                                >
                                    Dikey
                                </button>
                                <button
                                    onClick={() => setOptions(prev => ({ ...prev, orientation: 'landscape' }))}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                        options.orientation === 'landscape'
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                    }`}
                                >
                                    Yatay
                                </button>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-3 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.includePrices}
                                    onChange={(e) => setOptions(prev => ({ ...prev, includePrices: e.target.checked }))}
                                    className="w-4 h-4 text-primary border-stone-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-stone-700">Fiyatları göster</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.includeDescriptions}
                                    onChange={(e) => setOptions(prev => ({ ...prev, includeDescriptions: e.target.checked }))}
                                    className="w-4 h-4 text-primary border-stone-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-stone-700">Açıklamaları göster</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Preview & Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preview Card */}
                    <div className="bg-white rounded-2xl border border-stone-200 p-6">
                        <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Önizleme
                        </h2>

                        <div className={`rounded-xl border-2 border-dashed border-stone-200 p-8 text-center ${
                            options.theme === 'dark' ? 'bg-stone-900' : options.theme === 'elegant' ? 'bg-[#faf9f6]' : 'bg-white'
                        }`}>
                            <div className={`max-w-xs mx-auto ${options.theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                <p className="text-xs text-primary uppercase tracking-widest mb-2">Menü</p>
                                <h3 className="text-2xl font-bold mb-4">{options.restaurantName}</h3>
                                <div className="space-y-3 text-left">
                                    <div className="border-b border-stone-200 pb-2">
                                        <p className="text-primary text-sm font-semibold">KAHVALTI</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="font-medium">Gurme Serpme Kahvaltı</p>
                                            {options.includeDescriptions && (
                                                <p className={`text-xs ${options.theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                                                    2 kişilik zengin serpme...
                                                </p>
                                            )}
                                        </div>
                                        {options.includePrices && <span className="font-semibold">₺850</span>}
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="font-medium">Eggs Benedict</p>
                                            {options.includeDescriptions && (
                                                <p className={`text-xs ${options.theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                                                    Poşe yumurta, füme somon...
                                                </p>
                                            )}
                                        </div>
                                        {options.includePrices && <span className="font-semibold">₺380</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-stone-400 text-center mt-4">
                            Bu bir önizlemedir. Gerçek PDF daha detaylı olacaktır.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={handlePreview}
                            className="flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                        >
                            <Eye className="w-5 h-5" />
                            Önizle
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                        >
                            <Printer className="w-5 h-5" />
                            Yazdır
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            HTML İndir
                        </button>
                    </div>

                    {/* Tips */}
                    <div className="bg-amber-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-amber-900 mb-2">PDF Olarak Kaydetme</h4>
                        <p className="text-xs text-amber-700">
                            "Yazdır" butonuna tıkladıktan sonra, yazıcı seçim penceresinde "PDF olarak kaydet" veya "Save as PDF"
                            seçeneğini kullanarak menünüzü PDF formatında kaydedebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFExportPage;
