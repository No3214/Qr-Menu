import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ImageIcon,
  Save,
  X,
  Star,
} from 'lucide-react';
import { MenuService, Product, Category, CATEGORIES, PRODUCTS } from '../../services/MenuService';
import { parseMenuFromImage } from '../../services/geminiService';
import toast from 'react-hot-toast';
import { Sparkles, Loader2 } from 'lucide-react';

type Tab = 'products' | 'recommendations' | 'display';

export function MenuManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'products';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const tabs = [
    { id: 'products' as Tab, label: 'Kategoriler & Ürünler' },
    { id: 'recommendations' as Tab, label: 'Öneriler' },
    { id: 'display' as Tab, label: 'Görüntüleme Tercihleri' },
  ];

  const filteredProducts = useMemo(() => {
    let items = PRODUCTS;
    if (selectedCategory) {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [selectedCategory, searchQuery]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'products' ? {} : { tab });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Menü Yönetimi</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <ProductsTab
          categories={CATEGORIES}
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          editingProduct={editingProduct}
          onEditProduct={setEditingProduct}
        />
      )}
      {activeTab === 'recommendations' && <RecommendationsTab />}
      {activeTab === 'display' && <DisplayPreferencesTab />}
    </div>
  );
}

/* ── AI Importer Component ── */
function AIImporter() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const toastId = toast.loading('AI Menüyü Analiz Ediyor...');

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const extracted = await parseMenuFromImage(base64);

      if (!extracted.categories.length) {
        throw new Error('Menü verisi çekilemedi.');
      }

      await MenuService.bulkInsertMenuData(extracted);
      toast.success('Menü başarıyla içe aktarıldı!', { id: toastId });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      toast.error('Aktarma sırasında hata oluştu.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="ai-menu-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isProcessing}
      />
      <label
        htmlFor="ai-menu-upload"
        className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${isProcessing
            ? 'bg-stone-50 border-stone-200 text-stone-400'
            : 'border-primary/30 text-primary hover:bg-primary/5 active:scale-95'}`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="text-sm font-bold">AI İçe Aktar</span>
      </label>
    </div>
  );
}

/* ── Products Tab ── */
function ProductsTab({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  editingProduct,
  onEditProduct,
}: {
  categories: Category[];
  products: Product[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  editingProduct: Product | null;
  onEditProduct: (p: Product | null) => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Category sidebar */}
      <div className="lg:w-60 shrink-0 space-y-2 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-0 scrollbar-hide">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full shrink-0 text-left px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory
            ? 'bg-primary text-white'
            : 'text-text-muted hover:bg-gray-50'
            }`}
        >
          Tüm Kategoriler ({PRODUCTS.length})
        </button>
        {categories.map((cat) => {
          const count = PRODUCTS.filter((p) => p.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full shrink-0 flex items-center justify-between px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'text-text-muted hover:bg-gray-50'
                }`}
            >
              <span className="font-medium truncate">{cat.title}</span>
              <span className="text-xs opacity-70">{count}</span>
            </button>
          );
        })}
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary font-medium hover:bg-primary/5 transition-colors mt-3">
          <Plus size={16} />
          Kategori Ekle
        </button>
      </div>

      {/* Product list */}
      <div className="flex-1 min-w-0">
        {/* Search & Add */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            <Plus size={16} />
            Ürün Ekle
          </button>
        </div>

        {/* Product table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="w-10 px-3 py-3" />
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Ürün
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Fiyat
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Durum
                </th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-3 py-3">
                    <GripVertical
                      size={16}
                      className="text-gray-300 cursor-grab"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-text-muted truncate max-w-[260px]">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-medium text-text">
                      ₺{product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {product.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-green-50 px-2 py-1 rounded-full">
                        <Eye size={12} />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-text-muted bg-gray-100 px-2 py-1 rounded-full">
                        <EyeOff size={12} />
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-primary transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-danger transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-12 text-center">
                    <p className="text-sm text-text-muted">
                      Bu kategoride ürün bulunamadı.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-text-muted mt-3">
          Toplam {products.length} ürün gösteriliyor
        </p>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => onEditProduct(null)}
        />
      )}
    </div>
  );
}

/* ── Product Edit Modal ── */
function ProductEditModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [isAvailable, setIsAvailable] = useState(product.isAvailable);
  const [calories, setCalories] = useState('');
  const [grams, setGrams] = useState('');
  const [servingTime, setServingTime] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());
  const [currency, setCurrency] = useState('TRY (₺)');

  const toggleSet = (set: Set<string>, setFn: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    setFn(next);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Ürün Düzenle</h2>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Ürün Adı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Fiyat
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Para Birimi
              </label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
                <option>TRY (₺)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Ürün Görseli
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <ImageIcon size={24} className="mx-auto text-text-muted mb-2" />
              <p className="text-sm text-text-muted">
                Görsel yüklemek için tıklayın veya sürükleyin
              </p>
              <p className="text-xs text-text-muted mt-1">
                PNG, JPG, WEBP (max 2MB)
              </p>
            </div>
          </div>

          {/* Nutrition row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Kalori (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Gram (g)
              </label>
              <input
                type="number"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Servis Süresi (dk)
              </label>
              <input
                type="number"
                value={servingTime}
                onChange={(e) => setServingTime(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Dietary */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Diyet Kısıtlamaları
            </label>
            <div className="flex flex-wrap gap-2">
              {['Vegan', 'Vejeteryan', 'Glutensiz', 'Laktoz İçermez', 'Organik', 'Halal'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleSet(selectedDietary, setSelectedDietary, tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedDietary.has(tag)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-muted hover:border-primary hover:text-primary'
                      }`}
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Alerjenler
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Gluten', 'Süt', 'Yumurta', 'Fıstık', 'Soya', 'Balık',
                'Kabuklu Deniz', 'Kereviz', 'Hardal', 'Susam',
              ].map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => toggleSet(selectedAllergens, setSelectedAllergens, allergen)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedAllergens.has(allergen)
                    ? 'border-warning bg-warning/10 text-warning'
                    : 'border-border text-text-muted hover:border-warning hover:text-warning'
                    }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text">Ürün Durumu</p>
              <p className="text-xs text-text-muted">
                Ürünü menüde göster/gizle
              </p>
            </div>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isAvailable ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isAvailable ? 'translate-x-5' : ''
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => {
              toast.success('Ürün kaydedildi');
              onClose();
            }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Save size={16} />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Recommendations Tab ── */
function RecommendationsTab() {
  const recommendedProducts = PRODUCTS.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-text">Ürün Listesi</h2>
        <div className="flex items-center gap-2">
          <AIImporter />
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-sm hover:bg-primary-hover active:scale-95 transition-all">
            <Plus size={18} />
            <span className="text-sm font-bold">Ürün Ekle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-border rounded-xl p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Star size={18} className="text-warning" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-text truncate">
                  {product.title}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm font-semibold text-primary mt-2">
                  ₺{product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Display Preferences Tab ── */
function DisplayPreferencesTab() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Restaurant Info */}
      <div className="bg-white border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text">Restoran Bilgileri</h2>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Restoran Adı
          </label>
          <input
            type="text"
            defaultValue="Kozbeyli Konağı"
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Logo
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
            <ImageIcon size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-sm text-text-muted">Logo yükleyin</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            Tanıtım Videosu URL
          </label>
          <input
            type="url"
            placeholder="https://youtube.com/..."
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text">Tema Ayarları</h2>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Renk Teması
          </label>
          <div className="flex gap-3">
            {[
              { name: 'Varsayılan', color: '#4F6EF7' },
              { name: 'Altın', color: '#C5A059' },
              { name: 'Yeşil', color: '#16A34A' },
              { name: 'Kırmızı', color: '#EF4444' },
              { name: 'Mor', color: '#8B5CF6' },
            ].map((theme) => (
              <button
                key={theme.name}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-gray-300 transition-colors"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-xs text-text-muted">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Kategori Görünümü
          </label>
          <div className="flex gap-3">
            <button className="flex-1 border-2 border-primary rounded-xl p-3 text-center">
              <div className="grid grid-cols-3 gap-1 mb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 rounded bg-gray-200" />
                ))}
              </div>
              <p className="text-xs font-medium text-primary">Grid</p>
            </button>
            <button className="flex-1 border-2 border-border rounded-xl p-3 text-center hover:border-gray-300 transition-colors">
              <div className="space-y-1 mb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 rounded bg-gray-200" />
                ))}
              </div>
              <p className="text-xs font-medium text-text-muted">Liste</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          <Save size={16} />
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}
