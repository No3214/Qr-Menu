import React, { useState, useMemo } from 'react';
import { Info, Sparkles, Search, ChevronDown, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product } from '../../services/MenuService';

interface Recommendation {
    id: string;
    productId: string;
    recommendations: {
        id: string;
        title: string;
        description: string;
        isAI: boolean;
    }[];
}

// Mock recommendations data
const generateMockRecommendations = (products: Product[]): Recommendation[] => {
    return products.map(product => ({
        id: `rec-${product.id}`,
        productId: product.id,
        recommendations: [
            {
                id: `${product.id}-r1`,
                title: products[Math.floor(Math.random() * products.length)]?.title || 'Öneri 1',
                description: 'Lezzetli bir kombinasyon sunar, zengin aromalarıyla damak tadınıza hitap eder.',
                isAI: true
            },
            {
                id: `${product.id}-r2`,
                title: products[Math.floor(Math.random() * products.length)]?.title || 'Öneri 2',
                description: 'Taze malzemelerle hazırlanan bu ürün mükemmel bir eşlik sunar.',
                isAI: true
            },
            {
                id: `${product.id}-r3`,
                title: products[Math.floor(Math.random() * products.length)]?.title || 'Öneri 3',
                description: 'Geleneksel tariflerin modern yorumu, sofranıza değer katar.',
                isAI: Math.random() > 0.5
            }
        ]
    }));
};

export const RecommendationsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const itemsPerPage = 10;

    const recommendations = useMemo(() => generateMockRecommendations(PRODUCTS), []);

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getCategoryName = (categoryId: string) => {
        return CATEGORIES.find(c => c.id === categoryId)?.title || categoryId;
    };

    const getRecommendations = (productId: string) => {
        return recommendations.find(r => r.productId === productId)?.recommendations || [];
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === paginatedProducts.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(paginatedProducts.map(p => p.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-stone-900">Öneriler</h1>
                <p className="text-sm text-stone-500 mt-1">
                    Müşterilerin ilgili ürünleri keşfetmelerine yardımcı olmak için ürün önerilerini yönetin
                </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">Öneriler Nasıl Çalışır</h3>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            Öneriler, müşterilerinizin ilgili ürünleri keşfetmesine ve gelirinizi artırmasına yardımcı olur.
                            ChefAI özelliğimizi kullanabilir veya manuel olarak oluşturabilirsiniz.
                        </p>
                        <div className="mt-3 p-3 bg-white/50 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Öneri Oluşturmadan Önce:</p>
                            <p className="text-sm text-blue-700">
                                Tüm ürünlerin eklendiğinden emin olmak çok önemlidir. Bu, yapay zeka sistemimize daha geniş
                                bir seçenek yelpazesi sağlayacak ve daha doğru sonuçlar üretmesini sağlayacaktır.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-stone-900">Tüm Öneriler</h2>
                            <span className="text-sm text-stone-500">({filteredProducts.length} ürün)</span>
                        </div>
                        <p className="text-sm text-stone-500 mt-1">
                            Tüm ürün önerilerini yönetin (hem yapay zeka tarafından oluşturulan hem de manuel).
                            Menüde görüntülenmeyen ürünler soluk stil ile gösterilir.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-stone-700 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors">
                        <Sparkles className="w-4 h-4" />
                        Öneriler Oluştur
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="flex gap-3 mt-5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Ürün veya önerileri ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="h-10 pl-4 pr-10 border border-stone-200 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-w-[160px]"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="w-10 p-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === paginatedProducts.length && paginatedProducts.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                                    />
                                </th>
                                <th className="text-left p-3 text-sm font-medium text-stone-500 min-w-[180px]">
                                    <div className="flex items-center gap-1">
                                        Ürün Adı
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="text-left p-3 text-sm font-medium text-stone-500 min-w-[100px]">Kategori</th>
                                <th className="text-left p-3 text-sm font-medium text-stone-500 min-w-[200px]">
                                    <div className="flex items-center gap-1">
                                        Öneri 1
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="text-left p-3 text-sm font-medium text-stone-500 min-w-[200px]">
                                    <div className="flex items-center gap-1">
                                        Öneri 2
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="text-left p-3 text-sm font-medium text-stone-500 min-w-[200px]">
                                    <div className="flex items-center gap-1">
                                        Öneri 3
                                        <ChevronDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="text-left p-3 text-sm font-medium text-stone-500 w-[120px]">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map((product) => {
                                const recs = getRecommendations(product.id);
                                return (
                                    <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(product.id)}
                                                onChange={() => toggleSelectItem(product.id)}
                                                className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 bg-green-500 rounded" title="Aktif" />
                                                <span className="text-sm font-medium text-stone-900 truncate max-w-[150px]">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-sm text-stone-500">{getCategoryName(product.category)}</span>
                                        </td>
                                        {recs.slice(0, 3).map((rec) => (
                                            <td key={rec.id} className="p-3">
                                                <div className="border border-stone-200 rounded-lg p-3 bg-white min-h-[70px]">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-sm font-medium text-stone-900 truncate flex-1">
                                                            {rec.title.slice(0, 20)}...
                                                        </span>
                                                        <span className="w-3 h-3 bg-green-500 rounded flex-shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                                                        {rec.description.slice(0, 60)}...
                                                    </p>
                                                    {rec.isAI && (
                                                        <span className="text-xs text-blue-600 mt-1 block">Yapay zeka ile</span>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center justify-center w-8 h-6 bg-red-500 text-white text-xs font-medium rounded">
                                                    +{Math.floor(Math.random() * 5) + 1}
                                                </span>
                                                <button className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded hover:bg-stone-50">
                                                    <Plus className="w-4 h-4 text-stone-600" />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded hover:bg-stone-50">
                                                    <Pencil className="w-4 h-4 text-stone-600" />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded hover:bg-red-50 hover:border-red-200">
                                                    <Trash2 className="w-4 h-4 text-stone-600 hover:text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-200">
                    <p className="text-sm text-stone-500">
                        Showing <span className="font-medium text-stone-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium text-stone-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of{' '}
                        <span className="font-medium text-stone-900">{filteredProducts.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-stone-600 disabled:text-stone-300 disabled:cursor-not-allowed hover:text-stone-900"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        {[1, 2].map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium ${
                                    currentPage === page
                                        ? 'bg-stone-900 text-white'
                                        : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        {totalPages > 3 && <span className="text-stone-400">...</span>}
                        {totalPages > 2 && (
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium ${
                                    currentPage === totalPages
                                        ? 'bg-stone-900 text-white'
                                        : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                {totalPages}
                            </button>
                        )}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-stone-600 disabled:text-stone-300 disabled:cursor-not-allowed hover:text-stone-900"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationsPage;
