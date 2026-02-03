import React, { useState, useMemo, useEffect } from 'react';
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
import { MenuService, Product, Category } from '../../services/MenuService';
import { parseMenuFromImage } from '../../services/geminiService';
import toast from 'react-hot-toast';
import { Sparkles, Loader2 } from 'lucide-react';

type Tab = 'products' | 'recommendations' | 'display';

import { useLanguage } from '../../context/LanguageContext';

export function MenuManagement() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'products';

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        MenuService.getCategories(),
        MenuService.getProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (error) {
      toast.error(t('dash.menu.error.load'));
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'products' as Tab, label: t('dash.menu.tab.products') },
    { id: 'recommendations' as Tab, label: t('dash.menu.tab.recommendations') },
    { id: 'display' as Tab, label: t('dash.menu.tab.display') },
  ];

  const filteredProducts = useMemo(() => {
    let items = products;
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
  }, [selectedCategory, searchQuery, products]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'products' ? {} : { tab });
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await MenuService.updateProduct(editingProduct.id, productData);
        toast.success(t('dash.menu.edit.success'));
      } else {
        await MenuService.addProduct(productData);
        toast.success(t('dash.menu.add.success'));
      }
      await loadData();
      setEditingProduct(null);
      setIsAddingProduct(false);
    } catch (error) {
      toast.error(t('dash.menu.error.save'));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t('dash.menu.delete.confirm'))) return;
    try {
      await MenuService.deleteProduct(id);
      toast.success(t('dash.menu.delete.success'));
      await loadData();
    } catch (error) {
      toast.error(t('dash.menu.error.save'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">{t('dash.menu.title')}</h1>
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
          categories={categories}
          products={filteredProducts}
          onDeleteProduct={handleDeleteProduct}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onEditProduct={setEditingProduct}
          onAddProduct={() => setIsAddingProduct(true)}
        />
      )}
      {activeTab === 'recommendations' && <RecommendationsTab products={products} />}
      {activeTab === 'display' && <DisplayPreferencesTab />}

      {/* Edit/Add Modal */}
      {(editingProduct || isAddingProduct) && (
        <ProductEditModal
          product={editingProduct || undefined}
          categories={categories}
          onClose={() => {
            setEditingProduct(null);
            setIsAddingProduct(false);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

/* ── AI Importer Component ── */
function AIImporter() {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const toastId = toast.loading(t('dash.menu.aiProcessing'));

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const extracted = await parseMenuFromImage(base64);

      if (!extracted.categories.length) {
        throw new Error(t('dash.menu.aiError'));
      }

      await MenuService.bulkInsertMenuData(extracted);
      toast.success(t('dash.menu.aiSuccess'), { id: toastId });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      toast.error(t('dash.menu.aiError'), { id: toastId });
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
        <span className="text-sm font-bold">{t('dash.menu.aiImporter')}</span>
      </label>
    </div>
  );
}

/* ── Products Tab ── */
function ProductsTab({
  categories,
  products,
  onDeleteProduct,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onEditProduct,
  onAddProduct,
}: {
  categories: Category[];
  products: Product[];
  onDeleteProduct: (id: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEditProduct: (p: Product | null) => void;
  onAddProduct: () => void;
}) {
  const { t } = useLanguage();
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
          {t('dash.menu.allCategories')} ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length;
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
          {t('dash.menu.addCategory')}
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
              placeholder={t('dash.menu.searchProduct')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <AIImporter />
            <button
              onClick={onAddProduct}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <Plus size={16} />
              {t('dash.menu.addProduct')}
            </button>
          </div>
        </div>

        {/* Product table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="w-10 px-3 py-3" />
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {t('dash.menu.table.product')}
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {t('dash.menu.table.price')}
                </th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {t('dash.menu.table.status')}
                </th>
                <th className="text-right px-3 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {t('dash.menu.table.actions')}
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
                    {product.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-green-50 px-2 py-1 rounded-full">
                        <Eye size={12} />
                        {t('dash.menu.status.active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-text-muted bg-gray-100 px-2 py-1 rounded-full">
                        <EyeOff size={12} />
                        {t('dash.menu.status.inactive')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-primary transition-colors"
                        title={t('dash.nav.events.search')}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-danger transition-colors"
                        title={t('close')}
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
                      {t('dash.menu.empty')}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-text-muted mt-3">
          {t('dash.menu.total').replace('{count}', products.length.toString())}
        </p>
      </div>
    </div>
  );
}

/* ── Product Edit Modal ── */
function ProductEditModal({
  product,
  categories,
  onClose,
  onSave,
}: {
  product?: Product;
  categories: Category[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [is_active, setIsActive] = useState(product?.is_active ?? true);
  const [categoryId, setCategoryId] = useState(product?.category || categories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState(product?.image || '');

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
          <h2 className="text-lg font-semibold text-text">
            {product ? t('dash.menu.edit.title') : t('dash.menu.addProduct')}
          </h2>
          <button
            onClick={onClose}
            aria-label={t('close')}
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
              {t('dash.menu.edit.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('dash.menu.edit.category')}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* Image URL (Simple for now) */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Resim URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('dash.menu.edit.price')}
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
                {t('dash.menu.edit.currency')}
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
              {t('dash.menu.edit.desc')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Nutrition row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t('dash.menu.edit.calories')}
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
                {t('dash.menu.edit.weight')}
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
                {t('dash.menu.edit.servingTime')}
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
              {t('dash.menu.edit.dietary')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'dietary.vegan', label: t('dietary.vegan') },
                { key: 'dietary.vegetarian', label: t('dietary.vegetarian') },
                { key: 'dietary.glutenfree', label: t('dietary.glutenfree') },
                { key: 'dietary.lactosefree', label: t('dietary.lactosefree') },
                { key: 'dietary.organic', label: t('dietary.organic') },
                { key: 'dietary.halal', label: t('dietary.halal') }
              ].map(
                (tag) => (
                  <button
                    key={tag.key}
                    onClick={() => toggleSet(selectedDietary, setSelectedDietary, tag.label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedDietary.has(tag.label)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-muted hover:border-primary hover:text-primary'
                      }`}
                  >
                    {tag.label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {t('dash.menu.edit.allergens')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'allergen.gluten', label: t('allergen.gluten') },
                { key: 'allergen.dairy', label: t('allergen.dairy') },
                { key: 'allergen.egg', label: t('allergen.egg') },
                { key: 'allergen.peanut', label: t('allergen.peanut') },
                { key: 'allergen.soy', label: t('allergen.soy') },
                { key: 'allergen.fish', label: t('allergen.fish') },
                { key: 'allergen.shellfish', label: t('allergen.shellfish') },
                { key: 'allergen.celery', label: t('allergen.celery') },
                { key: 'allergen.mustard', label: t('allergen.mustard') },
                { key: 'allergen.sesame', label: t('allergen.sesame') }
              ].map((allergen) => (
                <button
                  key={allergen.key}
                  onClick={() => toggleSet(selectedAllergens, setSelectedAllergens, allergen.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedAllergens.has(allergen.label)
                    ? 'border-warning bg-warning/10 text-warning'
                    : 'border-border text-text-muted hover:border-warning hover:text-warning'
                    }`}
                >
                  {allergen.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text">{t('dash.menu.edit.availability')}</p>
              <p className="text-xs text-text-muted">
                {t('dash.menu.edit.availabilityHint')}
              </p>
            </div>
            <button
              onClick={() => setIsActive(!is_active)}
              className={`relative w-11 h-6 rounded-full transition-colors ${is_active ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${is_active ? 'translate-x-5' : ''
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
            {t('dash.menu.edit.cancel')}
          </button>
          <button
            onClick={() => {
              onSave({
                title: name,
                price: parseFloat(price) || 0,
                description,
                category: categoryId,
                is_active,
                image: imageUrl
              });
            }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Save size={16} />
            {t('dash.menu.edit.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Recommendations Tab ── */
function RecommendationsTab({ products }: { products: Product[] }) {
  const { t } = useLanguage();
  const recommendedProducts = products.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-text">{t('dash.menu.tab.recommendations')}</h2>
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
  const { t } = useLanguage();
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Restaurant Info */}
      <div className="bg-white border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-text">{t('dash.display.restInfo')}</h2>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            {t('dash.display.restName')}
          </label>
          <input
            type="text"
            defaultValue="Kozbeyli Konağı"
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            {t('dash.display.logo')}
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
            <ImageIcon size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-sm text-text-muted">{t('dash.display.logoUpload')}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">
            {t('dash.display.videoUrl')}
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
        <h2 className="text-lg font-semibold text-text">{t('dash.display.themeSettings')}</h2>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t('dash.display.colorTheme')}
          </label>
          <div className="flex gap-3">
            {[
              { name: 'Default', color: '#4F6EF7' },
              { name: 'Gold', color: '#C5A059' },
              { name: 'Green', color: '#16A34A' },
              { name: 'Red', color: '#EF4444' },
              { name: 'Purple', color: '#8B5CF6' },
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
            {t('dash.display.categoryView')}
          </label>
          <div className="flex gap-3">
            <button className="flex-1 border-2 border-primary rounded-xl p-3 text-center">
              <div className="grid grid-cols-3 gap-1 mb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 rounded bg-gray-200" />
                ))}
              </div>
              <p className="text-xs font-medium text-primary">{t('dash.display.view.grid')}</p>
            </button>
            <button className="flex-1 border-2 border-border rounded-xl p-3 text-center hover:border-gray-300 transition-colors">
              <div className="space-y-1 mb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 rounded bg-gray-200" />
                ))}
              </div>
              <p className="text-xs font-medium text-text-muted">{t('dash.display.view.list')}</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          <Save size={16} />
          {t('dash.display.save')}
        </button>
      </div>
    </div>
  );
}
