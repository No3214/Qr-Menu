import React, { useState } from 'react';
import {
  Search,
  Check,
  Languages,
  Edit3,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../services/MenuData';
import toast from 'react-hot-toast';

interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
  progress: number;
}

const supportedLanguages: SupportedLanguage[] = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', enabled: true, progress: 100 },
  { code: 'en', name: 'İngilizce', nativeName: 'English', enabled: true, progress: 78 },
  { code: 'de', name: 'Almanca', nativeName: 'Deutsch', enabled: true, progress: 45 },
  { code: 'ar', name: 'Arapça', nativeName: 'العربية', enabled: false, progress: 12 },
  { code: 'ru', name: 'Rusça', nativeName: 'Русский', enabled: false, progress: 0 },
  { code: 'fr', name: 'Fransızca', nativeName: 'Français', enabled: false, progress: 0 },
];

type TranslationItem = {
  id: string;
  type: 'category' | 'product';
  originalName: string;
  originalDesc: string;
  translations: Record<string, { name: string; description: string }>;
};

export function TranslationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const enabledLangs = supportedLanguages.filter((l) => l.code !== 'tr');

  // Build translation items from menu data
  const items: TranslationItem[] = [
    ...CATEGORIES.map((c) => ({
      id: `cat-${c.id}`,
      type: 'category' as const,
      originalName: c.title,
      originalDesc: c.description || '',
      translations: {
        en: { name: '', description: '' },
        de: { name: '', description: '' },
        ar: { name: '', description: '' },
      },
    })),
    ...PRODUCTS.map((p) => ({
      id: `prod-${p.id}`,
      type: 'product' as const,
      originalName: p.name,
      originalDesc: p.description,
      translations: {
        en: { name: '', description: '' },
        de: { name: '', description: '' },
        ar: { name: '', description: '' },
      },
    })),
  ];

  const filtered = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.originalName.toLowerCase().includes(q) ||
      item.originalDesc.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Çeviri Yönetimi</h1>
        <button
          onClick={() => toast.success('Otomatik çeviri yakında aktif olacak')}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Languages size={16} />
          Otomatik Çevir
        </button>
      </div>

      {/* Language cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {supportedLanguages.map((lang) => (
          <div
            key={lang.code}
            className={`border rounded-xl p-3.5 text-center transition-colors ${
              lang.code === 'tr'
                ? 'border-primary/30 bg-primary/5'
                : lang.code === selectedLang
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20 cursor-pointer'
                : lang.enabled
                ? 'border-border bg-white hover:border-primary/20 cursor-pointer'
                : 'border-border bg-gray-50 opacity-60'
            }`}
            onClick={() => lang.code !== 'tr' && setSelectedLang(lang.code)}
          >
            <p className="text-sm font-semibold text-text">{lang.nativeName}</p>
            <p className="text-xs text-text-muted">{lang.name}</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${lang.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              %{lang.progress} tamamlandı
            </p>
          </div>
        ))}
      </div>

      {/* Translation table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Ürün veya kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-primary"
          >
            {enabledLangs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Tür
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Orijinal (Türkçe)
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Çeviri ({supportedLanguages.find((l) => l.code === selectedLang)?.nativeName})
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                Durum
              </th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const translation = item.translations[selectedLang];
              const hasTranslation = translation?.name;
              const isEditing = editingItem === item.id;

              return (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.type === 'category'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {item.type === 'category' ? 'Kategori' : 'Ürün'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text">
                      {item.originalName}
                    </p>
                    {item.originalDesc && (
                      <p className="text-xs text-text-muted truncate max-w-[250px]">
                        {item.originalDesc}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={translation?.name || ''}
                        placeholder="Çeviri girin..."
                        className="w-full px-2 py-1.5 rounded border border-primary text-sm focus:outline-none"
                        autoFocus
                      />
                    ) : hasTranslation ? (
                      <p className="text-sm text-text">{translation.name}</p>
                    ) : (
                      <p className="text-sm text-text-muted italic">
                        Çeviri yok
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {hasTranslation ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <Check size={12} />
                        Tamamlandı
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                        Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        setEditingItem(isEditing ? null : item.id)
                      }
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-primary transition-colors"
                    >
                      {isEditing ? <Check size={15} /> : <Edit3 size={15} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Languages size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-text-muted">Sonuç bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
