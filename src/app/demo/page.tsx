'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  Globe,
  X,
  ChevronRight,
  Plus,
  Heart,
  Star,
  Bell,
  Share2,
  Home,
  ArrowUp,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { KOZBEYLI_KONAGI_DATA } from '@/data/kozbeyli-konagi-menu'

type Language = 'tr' | 'en'

// Foost Design System Colors
const FOOST_COLORS = {
  primary: '#C5A059',      // Gold accent
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textMuted: '#666666',
  border: '#EEEEEE',
}

export default function DemoMenuPage() {
  const menuData = KOZBEYLI_KONAGI_DATA
  const [language, setLanguage] = useState<Language>('tr')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)

  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])
  const categoryNavRef = useRef<HTMLDivElement>(null)
  const categories = menuData.categories

  const getText = (tr: string, en: string) => language === 'en' ? en : tr

  // ScrollSpy - Track which category is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180 // Account for header height

      setShowScrollTop(window.scrollY > 400)

      for (let i = categories.length - 1; i >= 0; i--) {
        const ref = categoryRefs.current[i]
        if (ref && ref.offsetTop <= scrollPosition) {
          if (activeCategory !== i) {
            setActiveCategory(i)
            // Scroll category nav to show active item
            scrollCategoryNavToActive(i)
          }
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories.length, activeCategory])

  const scrollCategoryNavToActive = (index: number) => {
    if (categoryNavRef.current) {
      const buttons = categoryNavRef.current.querySelectorAll('button')
      const activeButton = buttons[index]
      if (activeButton) {
        const containerWidth = categoryNavRef.current.offsetWidth
        const buttonLeft = activeButton.offsetLeft
        const buttonWidth = activeButton.offsetWidth
        const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2
        categoryNavRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }

  const scrollToCategory = (index: number) => {
    const ref = categoryRefs.current[index]
    if (ref) {
      const yOffset = -160 // Account for sticky header
      const y = ref.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId)
      } else {
        newFavorites.add(itemId)
      }
      return newFavorites
    })
  }

  // Filter all items for search
  const allItems = categories.flatMap((cat, catIdx) =>
    cat.items.map((item, itemIdx) => ({
      ...item,
      categoryName: getText(cat.name, cat.name_en),
      categoryIndex: catIdx,
      itemIndex: itemIdx,
      id: `${catIdx}-${itemIdx}`,
    }))
  )

  const searchResults = searchQuery.trim()
    ? allItems.filter(item =>
        getText(item.name, item.name_en).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getText(item.description, item.description_en).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 text-center text-sm">
        <span className="font-medium">Demo Menü</span>
        <span className="mx-2">•</span>
        <span className="text-gray-300">{menuData.restaurant.name}</span>
        <Link href="/register" className="ml-4 underline hover:text-gray-200">
          Kendi menünüzü oluşturun →
        </Link>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        {/* Main Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">KK</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">{menuData.restaurant.name}</h1>
              <p className="text-xs text-gray-500">{getText('Dijital Menü', 'Digital Menu')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowLanguageMenu(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        {/* Sticky Category Navigation - ScrollSpy */}
        <div
          ref={categoryNavRef}
          className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => scrollToCategory(index)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                activeCategory === index
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              style={{
                backgroundColor: activeCategory === index ? FOOST_COLORS.primary : undefined,
              }}
            >
              {getText(category.name, category.name_en)}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {categories.map((category, catIndex) => (
          <div
            key={catIndex}
            ref={el => { categoryRefs.current[catIndex] = el }}
            className="border-b border-gray-100 last:border-b-0"
          >
            {/* Category Header */}
            <div className="sticky top-[120px] z-30 bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {getText(category.name, category.name_en)}
              </h2>
              <p className="text-sm text-gray-500">
                {category.items.length} {getText('ürün', 'items')}
              </p>
            </div>

            {/* Products */}
            <div className="divide-y divide-gray-100">
              {category.items.map((item, itemIndex) => {
                const itemId = `${catIndex}-${itemIndex}`
                const isFavorite = favorites.has(itemId)

                return (
                  <div
                    key={itemIndex}
                    className="flex gap-4 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-gray-900 leading-tight">
                          {getText(item.name, item.name_en)}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(itemId)
                          }}
                          className={cn(
                            "p-1.5 rounded-full transition-all flex-shrink-0",
                            isFavorite
                              ? "text-red-500"
                              : "text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {getText(item.description, item.description_en)}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <span
                          className="text-base font-bold"
                          style={{ color: FOOST_COLORS.primary }}
                        >
                          {formatPrice(item.price, 'TRY')}
                        </span>
                        {item.dietary_restrictions?.includes('vegan') && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Vegan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Image & Add Button */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                        <span className="text-3xl">🍽️</span>
                      </div>
                      <button
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                        style={{ backgroundColor: FOOST_COLORS.primary }}
                      >
                        <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 px-4 py-1 text-gray-900">
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">{getText('Menü', 'Menu')}</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Star className="w-5 h-5" />
            <span className="text-xs">{getText('Değerlendir', 'Rate')}</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="text-xs">{getText('Garson', 'Waiter')}</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-xs">{getText('Paylaş', 'Share')}</span>
          </button>
        </div>
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-40 transition-all hover:scale-110"
          style={{ backgroundColor: FOOST_COLORS.primary }}
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery('')
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getText('Menüde ara...', 'Search menu...')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
            {searchQuery.trim() === '' ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{getText('Bir şeyler aramaya başlayın', 'Start searching for something')}</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{getText('Sonuç bulunamadı', 'No results found')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-4">
                  {searchResults.length} {getText('sonuç bulundu', 'results found')}
                </p>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery('')
                      scrollToCategory(item.categoryIndex)
                    }}
                    className="w-full flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {getText(item.name, item.name_en)}
                      </p>
                      <p className="text-xs text-gray-500">{item.categoryName}</p>
                      <p className="text-sm font-bold mt-1" style={{ color: FOOST_COLORS.primary }}>
                        {formatPrice(item.price, 'TRY')}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Language Selector */}
      {showLanguageMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowLanguageMenu(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {getText('Dil Seçimi', 'Select Language')}
              </h3>
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
                  'w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left',
                  language === 'tr'
                    ? 'text-white'
                    : 'hover:bg-gray-100 text-gray-900'
                )}
                style={{
                  backgroundColor: language === 'tr' ? FOOST_COLORS.primary : undefined,
                }}
              >
                <span className="text-2xl">🇹🇷</span>
                <span className="font-medium">Türkçe</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en')
                  setShowLanguageMenu(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left',
                  language === 'en'
                    ? 'text-white'
                    : 'hover:bg-gray-100 text-gray-900'
                )}
                style={{
                  backgroundColor: language === 'en' ? FOOST_COLORS.primary : undefined,
                }}
              >
                <span className="text-2xl">🇬🇧</span>
                <span className="font-medium">English</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
