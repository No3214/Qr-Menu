'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Menu,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Search,
  Bell,
  Share2,
  Heart,
  Clock,
  Flame,
  Leaf,
  Home,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { KOZBEYLI_KONAGI_DATA } from '@/data/kozbeyli-konagi-menu'

type ViewMode = 'home' | 'category'
type Language = 'tr' | 'en'

export default function DemoMenuPage() {
  const menuData = KOZBEYLI_KONAGI_DATA
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [language, setLanguage] = useState<Language>('tr')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const categories = menuData.categories

  const handleCategorySelect = (index: number) => {
    setSelectedCategoryIndex(index)
    setViewMode('category')
    setExpandedItems(new Set())
  }

  const toggleItemExpand = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(index)) {
      newFavorites.delete(index)
    } else {
      newFavorites.add(index)
    }
    setFavorites(newFavorites)
  }

  const getText = (tr: string, en: string) => language === 'en' ? en : tr

  const selectedCategory = selectedCategoryIndex !== null ? categories[selectedCategoryIndex] : null

  // Filter items based on search
  const filteredItems = selectedCategory?.items.filter(item =>
    searchQuery === '' ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 text-center text-sm">
        <span className="font-medium">Demo Menü</span>
        <span className="mx-2">•</span>
        <span className="text-gray-300">Kozbeyli Konağı</span>
        <Link href="/register" className="ml-4 underline hover:text-gray-200">
          Kendi menünüzü oluşturun →
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            {viewMode === 'category' && (
              <button
                onClick={() => setViewMode('home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>

          <h1 className="text-lg font-bold text-gray-900">
            {viewMode === 'home'
              ? menuData.restaurant.name
              : getText(selectedCategory?.name || '', selectedCategory?.name_en || '')}
          </h1>

          <button
            onClick={() => setShowLanguageMenu(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {viewMode === 'home' ? (
          <div className="p-4">
            {/* Hero Section */}
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 animate-scale-in bg-gradient-to-br from-amber-700 to-amber-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{menuData.restaurant.name}</h2>
                  <p className="text-white/80">{menuData.restaurant.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleCategorySelect(0)}
                className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 py-3 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] btn-press"
              >
                Menüyü Görüntüle
              </button>
            </div>

            {/* Category Grid */}
            <div className="space-y-3">
              {/* First category - Full width */}
              {categories[0] && (
                <button
                  onClick={() => handleCategorySelect(0)}
                  className="relative w-full aspect-[16/9] rounded-xl overflow-hidden card-hover animate-fade-in-up stagger-1 bg-gradient-to-br from-stone-600 to-stone-800"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">
                      {getText(categories[0].name, categories[0].name_en)}
                    </h3>
                    <p className="text-white/70 text-sm mt-0.5">
                      {categories[0].items.length} ürün
                    </p>
                  </div>
                </button>
              )}

              {/* Remaining categories - 2-column grid */}
              <div className="grid grid-cols-2 gap-3">
                {categories.slice(1).map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategorySelect(index + 1)}
                    className={cn(
                      "relative aspect-[4/3] rounded-xl overflow-hidden card-hover animate-fade-in-up bg-gradient-to-br from-stone-600 to-stone-800",
                      `stagger-${Math.min(index + 2, 8)}`
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <h3 className="text-white font-bold text-sm leading-tight drop-shadow-lg">
                        {getText(category.name, category.name_en)}
                      </h3>
                      <p className="text-white/70 text-xs mt-0.5">
                        {category.items.length} ürün
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Category View */
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Menüde ara..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategorySelect(idx)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                    selectedCategoryIndex === idx
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {getText(cat.name, cat.name_en)}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="space-y-1">
              {filteredItems?.map((item, itemIndex) => {
                const isExpanded = expandedItems.has(itemIndex)
                const isFavorite = favorites.has(itemIndex)
                const globalIndex = (selectedCategoryIndex || 0) * 100 + itemIndex

                return (
                  <div
                    key={itemIndex}
                    className={cn(
                      "border-b border-gray-100 last:border-0 animate-fade-in-up",
                      `stagger-${Math.min(itemIndex + 1, 8)}`
                    )}
                  >
                    {/* Item Header */}
                    <div
                      className="flex gap-3 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/50 rounded-lg -mx-2 px-2"
                      onClick={() => toggleItemExpand(itemIndex)}
                    >
                      {/* Item Image Placeholder */}
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {getText(item.name, item.name_en)}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(globalIndex)
                            }}
                            className={cn(
                              "p-1.5 rounded-full transition-all",
                              isFavorite
                                ? "bg-red-100 text-red-500"
                                : "text-gray-300 hover:text-red-400"
                            )}
                          >
                            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {getText(item.description, item.description_en)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.price, 'TRY')}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="pb-4 animate-expand">
                        <div className="bg-gray-50 rounded-lg p-4 ml-[88px]">
                          <p className="text-gray-600 text-sm mb-3">
                            {getText(item.description, item.description_en)}
                          </p>
                          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 btn-press">
                            Keşfet
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {filteredItems?.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Sonuç bulunamadı</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-40">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setViewMode('home')}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors",
              viewMode === 'home' ? 'text-gray-900' : 'text-gray-400'
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Ana Sayfa</span>
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-gray-400"
          >
            <Star className="w-5 h-5" />
            <span className="text-xs">Değerlendir</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-gray-400">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Garson</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-gray-400">
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Paylaş</span>
          </button>
        </div>
      </nav>

      {/* Language Sidebar */}
      {showLanguageMenu && (
        <div className="fixed inset-0 z-50 animate-backdrop-in" onClick={() => setShowLanguageMenu(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 animate-slide-in-right shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Dil Seçimi</h3>
              <button
                onClick={() => setShowLanguageMenu(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setLanguage('tr')
                  setShowLanguageMenu(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left animate-fade-in-up stagger-1',
                  language === 'tr'
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-100 text-gray-900 hover:translate-x-1'
                )}
              >
                <span className="text-xl">🇹🇷</span>
                <span className="font-medium">Türkçe</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en')
                  setShowLanguageMenu(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left animate-fade-in-up stagger-2',
                  language === 'en'
                    ? 'bg-gray-900 text-white'
                    : 'hover:bg-gray-100 text-gray-900 hover:translate-x-1'
                )}
              >
                <span className="text-xl">🇬🇧</span>
                <span className="font-medium">English</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Menu */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 animate-backdrop-in" onClick={() => setShowSidebar(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 animate-slide-in-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{menuData.restaurant.name}</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setViewMode('home')
                  setShowSidebar(false)
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 font-medium transition-all duration-200 hover:translate-x-1 animate-fade-in-up stagger-1"
              >
                Ana Sayfa
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleCategorySelect(index)
                    setShowSidebar(false)
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:translate-x-1 animate-fade-in-up",
                    `stagger-${Math.min(index + 2, 8)}`
                  )}
                >
                  {getText(category.name, category.name_en)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-end animate-backdrop-in" onClick={() => setShowFeedback(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full bg-white rounded-t-3xl p-6 animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Değerlendirme</h3>
            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className="transition-transform hover:scale-125"
                >
                  <Star className="w-10 h-10 text-gray-300 hover:text-yellow-400 hover:fill-yellow-400" />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Yorumunuzu yazın... (Opsiyonel)"
              className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              onClick={() => setShowFeedback(false)}
              className="w-full mt-4 bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
