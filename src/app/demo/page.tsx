'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Heart,
  Star,
  Bell,
  Share2,
  Home,
  ArrowUp,
  ShoppingBag,
  Clock,
  Leaf,
  Check,
  MessageCircle,
  Play,
  AlertTriangle,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { KOZBEYLI_KONAGI_DATA } from '@/data/kozbeyli-konagi-menu'

type Language = 'tr' | 'en'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: string[]
}

interface SelectedItem {
  categoryIndex: number
  itemIndex: number
}

// Foost Blueprint Design Tokens
const DESIGN = {
  color: {
    primary: '#4F6EF7',
    primaryLight: '#6B85F9',
    primaryDark: '#3A56D4',
    bg: '#F7F7F9',
    surface: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    accent: '#C5A059',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.1)',
    lg: '0 8px 30px rgba(0,0,0,0.12)',
  },
}

// Sample option groups for product detail
const SAMPLE_OPTIONS: Record<string, { name: string; name_en: string; type: 'single' | 'multi'; required: boolean; choices: { name: string; name_en: string; price: number }[] }[]> = {
  'pizza': [
    {
      name: 'Hamur Tipi',
      name_en: 'Dough Type',
      type: 'single',
      required: true,
      choices: [
        { name: 'İnce', name_en: 'Thin', price: 0 },
        { name: 'Kalın', name_en: 'Thick', price: 0 },
        { name: 'Tam Buğday', name_en: 'Whole Wheat', price: 30 },
      ],
    },
    {
      name: 'Ekstra Malzeme',
      name_en: 'Extra Toppings',
      type: 'multi',
      required: false,
      choices: [
        { name: 'Mozzarella', name_en: 'Mozzarella', price: 50 },
        { name: 'Zeytin', name_en: 'Olives', price: 30 },
        { name: 'Mantar', name_en: 'Mushrooms', price: 40 },
        { name: 'Sucuk', name_en: 'Sausage', price: 60 },
      ],
    },
  ],
  'default': [
    {
      name: 'Porsiyon',
      name_en: 'Portion',
      type: 'single',
      required: false,
      choices: [
        { name: 'Normal', name_en: 'Regular', price: 0 },
        { name: 'Büyük', name_en: 'Large', price: 100 },
      ],
    },
  ],
}

// Category images/icons for the grid view
const CATEGORY_VISUALS: Record<string, { emoji: string; gradient: string }> = {
  'Kahvaltı': { emoji: '🍳', gradient: 'from-amber-400 to-orange-500' },
  'Ekstralar': { emoji: '🥐', gradient: 'from-yellow-400 to-amber-500' },
  'Başlangıç & Paylaşımlıklar': { emoji: '🥗', gradient: 'from-green-400 to-emerald-500' },
  'Taş Fırın Pizza ve Sandviç': { emoji: '🍕', gradient: 'from-red-400 to-rose-500' },
  'Peynir Tabağı': { emoji: '🧀', gradient: 'from-yellow-300 to-amber-400' },
  'Tatlı': { emoji: '🍰', gradient: 'from-pink-400 to-rose-500' },
  'Ana Yemek': { emoji: '🥩', gradient: 'from-red-500 to-red-700' },
  'Ara Sıcaklar': { emoji: '🥟', gradient: 'from-orange-400 to-red-400' },
  'Meze': { emoji: '🫒', gradient: 'from-emerald-400 to-teal-500' },
  'Soğuk İçecekler': { emoji: '🧊', gradient: 'from-cyan-400 to-blue-500' },
  'Sıcak İçecekler': { emoji: '☕', gradient: 'from-amber-600 to-amber-800' },
  'Şarap': { emoji: '🍷', gradient: 'from-purple-500 to-purple-700' },
  'Kokteyl': { emoji: '🍸', gradient: 'from-pink-400 to-fuchsia-500' },
  'Bira': { emoji: '🍺', gradient: 'from-yellow-500 to-amber-600' },
  'Viski': { emoji: '🥃', gradient: 'from-amber-700 to-amber-900' },
  'Rakı': { emoji: '🥂', gradient: 'from-slate-400 to-slate-600' },
}

type ViewMode = 'entry' | 'categories' | 'menu'

export default function DemoMenuPage() {
  const menuData = KOZBEYLI_KONAGI_DATA
  const [language, setLanguage] = useState<Language>('tr')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [showCallWaiter, setShowCallWaiter] = useState(false)
  const [waiterCalled, setWaiterCalled] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('entry')
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [videoLoaded, setVideoLoaded] = useState(false)

  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])
  const categoryNavRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const categories = menuData.categories

  const getText = (tr: string, en: string) => language === 'en' ? en : tr

  // Cart helpers
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // ScrollSpy
  useEffect(() => {
    if (viewMode !== 'menu') return
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200
      setShowScrollTop(window.scrollY > 400)

      for (let i = categories.length - 1; i >= 0; i--) {
        const ref = categoryRefs.current[i]
        if (ref && ref.offsetTop <= scrollPosition) {
          if (activeCategory !== i) {
            setActiveCategory(i)
            scrollCategoryNavToActive(i)
          }
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categories.length, activeCategory, viewMode])

  const scrollCategoryNavToActive = useCallback((index: number) => {
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
  }, [])

  const scrollToCategory = (index: number) => {
    const ref = categoryRefs.current[index]
    if (ref) {
      const yOffset = -160
      const y = ref.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const addToCart = (id: string, name: string, price: number, options?: string[]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id)
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id, name, price, quantity: 1, options }]
    })
  }

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const q = item.quantity + delta
            return q > 0 ? { ...item, quantity: q } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
    )
  }

  const getCartItemQuantity = (id: string) =>
    cart.find(item => item.id === id)?.quantity || 0

  // Search
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleCallWaiter = () => {
    setWaiterCalled(true)
    setTimeout(() => {
      setShowCallWaiter(false)
      setTimeout(() => setWaiterCalled(false), 3000)
    }, 1500)
  }

  const getSelectedItemData = () => {
    if (!selectedItem) return null
    const category = categories[selectedItem.categoryIndex]
    const item = category.items[selectedItem.itemIndex]
    return { ...item, categoryName: getText(category.name, category.name_en) }
  }

  const enterMenu = () => {
    setViewMode('categories')
    window.scrollTo({ top: 0 })
  }

  const goToMenuFromGrid = (categoryIndex?: number) => {
    setViewMode('menu')
    window.scrollTo({ top: 0 })
    if (categoryIndex !== undefined) {
      setTimeout(() => {
        setActiveCategory(categoryIndex)
        scrollToCategory(categoryIndex)
      }, 100)
    }
  }

  const getOptionGroups = (categoryName: string) => {
    if (categoryName.toLowerCase().includes('pizza') || categoryName.toLowerCase().includes('sandviç')) {
      return SAMPLE_OPTIONS['pizza']
    }
    return SAMPLE_OPTIONS['default']
  }

  const toggleOption = (groupName: string, choice: string, type: 'single' | 'multi') => {
    setSelectedOptions(prev => {
      const current = prev[groupName] || []
      if (type === 'single') {
        return { ...prev, [groupName]: [choice] }
      }
      if (current.includes(choice)) {
        return { ...prev, [groupName]: current.filter(c => c !== choice) }
      }
      return { ...prev, [groupName]: [...current, choice] }
    })
  }

  // ─── VIDEO ENTRY SCREEN ───────────────────────────────────────────────
  if (viewMode === 'entry') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Demo Banner */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-sm text-white px-4 py-2 text-center text-sm">
          <span className="font-medium">Demo Menü</span>
          <span className="mx-2 opacity-50">•</span>
          <span className="opacity-70">{menuData.restaurant.name}</span>
          <Link href="/register" className="ml-3 underline opacity-70 hover:opacity-100">
            {getText('Kendi menünüzü oluşturun →', 'Create your own menu →')}
          </Link>
        </div>

        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Poster fallback / gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black" />

          {/* Simulated atmospheric video effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-700/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          </div>

          {/* Video element (will show placeholder since no real video available) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              videoLoaded ? "opacity-60" : "opacity-0"
            )}
            poster="/video-poster.jpg"
            onCanPlay={() => setVideoLoaded(true)}
          >
            {/* Add actual video sources here */}
            <source src="/entry-video.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-end pb-16 px-6">
          {/* Restaurant Logo */}
          <div className="mb-8 text-center">
            <div
              className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${DESIGN.color.primary}, ${DESIGN.color.primaryDark})`,
                boxShadow: `0 8px 32px ${DESIGN.color.primary}40`,
              }}
            >
              <span className="text-white font-bold text-3xl">KK</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {menuData.restaurant.name}
            </h1>
            <p className="text-white/60 text-base">
              {getText('Geleneksel Türk Mutfağı', 'Traditional Turkish Cuisine')}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={enterMenu}
            className="w-full max-w-sm py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3"
            style={{
              background: `linear-gradient(135deg, ${DESIGN.color.primary}, ${DESIGN.color.primaryLight})`,
              boxShadow: `0 4px 20px ${DESIGN.color.primary}50`,
            }}
          >
            <Play className="w-5 h-5" />
            {getText('Menüyü Görüntüle', 'View Menu')}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(l => l === 'tr' ? 'en' : 'tr')}
            className="mt-4 text-white/50 text-sm hover:text-white/80 transition-colors"
          >
            {language === 'tr' ? '🇬🇧 Switch to English' : '🇹🇷 Türkçe\'ye Geç'}
          </button>
        </div>

        {/* Animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    )
  }

  // ─── CATEGORY GRID VIEW ───────────────────────────────────────────────
  if (viewMode === 'categories') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: DESIGN.color.bg }}>
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 text-center text-sm">
          <span className="font-medium">Demo Menü</span>
          <span className="mx-2 opacity-50">•</span>
          <span className="opacity-70">{menuData.restaurant.name}</span>
          <Link href="/register" className="ml-3 underline opacity-70 hover:opacity-100">
            {getText('Kendi menünüzü oluşturun →', 'Create your own menu →')}
          </Link>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${DESIGN.color.primary}, ${DESIGN.color.primaryDark})` }}
              >
                <span className="text-white font-bold text-sm">KK</span>
              </div>
              <div>
                <h1 className="text-base font-bold" style={{ color: DESIGN.color.text }}>
                  {menuData.restaurant.name}
                </h1>
                <p className="text-xs" style={{ color: DESIGN.color.textMuted }}>
                  {getText('Kategori Seçin', 'Choose Category')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setViewMode('menu'); setShowSearch(true) }}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" style={{ color: DESIGN.color.textSecondary }} />
              </button>
              <button
                onClick={() => setShowLanguageMenu(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: `${DESIGN.color.primary}10`, color: DESIGN.color.primary }}
              >
                {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
              </button>
            </div>
          </div>
        </header>

        {/* Category Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => {
              const visual = CATEGORY_VISUALS[category.name] || { emoji: '🍽️', gradient: 'from-gray-400 to-gray-600' }
              return (
                <button
                  key={index}
                  onClick={() => goToMenuFromGrid(index)}
                  className="relative overflow-hidden rounded-2xl aspect-[4/3] group transition-transform active:scale-95"
                >
                  {/* Background gradient */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br transition-all',
                    visual.gradient
                  )} />

                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_40%,white_1px,transparent_1px)] bg-[length:20px_20px]" />

                  {/* Scrim (dark overlay at bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Emoji icon */}
                  <div className="absolute top-3 right-3 text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {visual.emoji}
                  </div>

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-sm leading-tight">
                      {getText(category.name, category.name_en)}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">
                      {category.items.length} {getText('ürün', 'items')}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* View All Button */}
          <button
            onClick={() => goToMenuFromGrid()}
            className="w-full mt-4 py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              backgroundColor: DESIGN.color.primary,
              color: 'white',
              boxShadow: `0 4px 16px ${DESIGN.color.primary}30`,
            }}
          >
            {getText('Tüm Menüyü Görüntüle', 'View Full Menu')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-40">
          {cartItemCount > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="w-full flex items-center justify-between px-4 py-3 text-white"
              style={{ backgroundColor: DESIGN.color.primary }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-medium">{cartItemCount} {getText('ürün', 'items')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{formatPrice(cartTotal, 'TRY')}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          )}
          <div className="flex items-center justify-around py-3 px-4">
            <button className="flex flex-col items-center gap-1 px-4 py-1" style={{ color: DESIGN.color.primary }}>
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">{getText('Menü', 'Menu')}</span>
            </button>
            <button onClick={() => setShowRating(true)} className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Star className="w-5 h-5" />
              <span className="text-xs">{getText('Değerlendir', 'Rate')}</span>
            </button>
            <button onClick={() => setShowCallWaiter(true)} className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="text-xs">{getText('Garson', 'Waiter')}</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-xs">{getText('Paylaş', 'Share')}</span>
            </button>
          </div>
        </nav>

        {/* Language Selector (shared) */}
        {showLanguageMenu && renderLanguageModal()}

        {/* Cart Modal (shared) */}
        {showCart && renderCartModal()}

        {/* Call Waiter (shared) */}
        {showCallWaiter && renderCallWaiterModal()}

        {/* Rating (shared) */}
        {showRating && renderRatingModal()}

        {renderGlobalStyles()}
      </div>
    )
  }

  // ─── FULL MENU VIEW ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: DESIGN.color.bg }}>
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 text-center text-sm">
        <span className="font-medium">Demo Menü</span>
        <span className="mx-2 opacity-50">•</span>
        <span className="opacity-70">{menuData.restaurant.name}</span>
        <Link href="/register" className="ml-3 underline opacity-70 hover:opacity-100">
          {getText('Kendi menünüzü oluşturun →', 'Create your own menu →')}
        </Link>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('categories')}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ border: `1px solid ${DESIGN.color.border}` }}
            >
              <ChevronDown className="w-5 h-5 rotate-90" style={{ color: DESIGN.color.textSecondary, transform: 'rotate(90deg)' }} />
            </button>
            <div>
              <h1 className="text-base font-bold" style={{ color: DESIGN.color.text }}>
                {menuData.restaurant.name}
              </h1>
              <p className="text-xs" style={{ color: DESIGN.color.textMuted }}>
                {getText('Dijital Menü', 'Digital Menu')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" style={{ color: DESIGN.color.textSecondary }} />
            </button>
            <button
              onClick={() => setShowLanguageMenu(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: `${DESIGN.color.primary}10`, color: DESIGN.color.primary }}
            >
              {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div
          ref={categoryNavRef}
          className="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => scrollToCategory(index)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                activeCategory === index
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              style={{
                backgroundColor: activeCategory === index ? DESIGN.color.primary : `${DESIGN.color.bg}`,
                ...(activeCategory === index ? { boxShadow: `0 4px 12px ${DESIGN.color.primary}30` } : {}),
              }}
            >
              {getText(category.name, category.name_en)}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-32">
        {categories.map((category, catIndex) => (
          <div
            key={catIndex}
            ref={el => { categoryRefs.current[catIndex] = el }}
          >
            {/* Category Header */}
            <div className="sticky top-[120px] z-30 px-4 py-3 border-b" style={{ backgroundColor: DESIGN.color.bg, borderColor: DESIGN.color.border }}>
              <h2 className="text-lg font-bold" style={{ color: DESIGN.color.text }}>
                {getText(category.name, category.name_en)}
              </h2>
              <p className="text-sm" style={{ color: DESIGN.color.textMuted }}>
                {category.items.length} {getText('ürün', 'items')}
              </p>
            </div>

            {/* Items */}
            <div className="divide-y" style={{ borderColor: `${DESIGN.color.border}80` }}>
              {category.items.map((item, itemIndex) => {
                const itemId = `${catIndex}-${itemIndex}`
                const isFavorite = favorites.has(itemId)
                const quantity = getCartItemQuantity(itemId)
                const visual = CATEGORY_VISUALS[category.name] || { emoji: '🍽️', gradient: 'from-gray-400 to-gray-600' }

                return (
                  <div
                    key={itemIndex}
                    onClick={() => {
                      setSelectedItem({ categoryIndex: catIndex, itemIndex })
                      setSelectedOptions({})
                    }}
                    className="flex gap-4 p-4 bg-white hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold leading-tight" style={{ color: DESIGN.color.text }}>
                          {getText(item.name, item.name_en)}
                        </h3>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(itemId) }}
                          className={cn(
                            "p-1.5 rounded-full transition-all flex-shrink-0",
                            isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                        </button>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2" style={{ color: DESIGN.color.textSecondary }}>
                        {getText(item.description, item.description_en)}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-base font-bold" style={{ color: DESIGN.color.primary }}>
                          {formatPrice(item.price, 'TRY')}
                        </span>
                        {item.prep_minutes && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: DESIGN.color.textMuted }}>
                            <Clock className="w-3 h-3" />
                            {item.prep_minutes} dk
                          </span>
                        )}
                        {item.dietary_restrictions && item.dietary_restrictions.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <Leaf className="w-3 h-3" />
                            {item.dietary_restrictions[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Thumbnail */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className={cn(
                        'w-full h-full rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br shadow-sm',
                        visual.gradient
                      )}>
                        <span className="text-4xl opacity-80">{visual.emoji}</span>
                      </div>
                      {quantity > 0 ? (
                        <div
                          className="absolute -bottom-2 -right-2 flex items-center gap-0.5 rounded-full shadow-lg px-1"
                          style={{ backgroundColor: DESIGN.color.primary }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => updateCartQuantity(itemId, -1)}
                            className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
                          >
                            <Minus className="w-3 h-3" strokeWidth={3} />
                          </button>
                          <span className="text-white font-bold text-sm min-w-[20px] text-center">{quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(itemId, 1)}
                            className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
                          >
                            <Plus className="w-3 h-3" strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(itemId, getText(item.name, item.name_en), item.price)
                          }}
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                          style={{
                            backgroundColor: DESIGN.color.primary,
                            boxShadow: `0 4px 12px ${DESIGN.color.primary}40`,
                          }}
                        >
                          <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {cartItemCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="w-full flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: DESIGN.color.primary }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-medium">{cartItemCount} {getText('ürün', 'items')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{formatPrice(cartTotal, 'TRY')}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        )}
        <div className="flex items-center justify-around py-3 px-4">
          <button className="flex flex-col items-center gap-1 px-4 py-1" style={{ color: DESIGN.color.primary }}>
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">{getText('Menü', 'Menu')}</span>
          </button>
          <button onClick={() => setShowRating(true)} className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Star className="w-5 h-5" />
            <span className="text-xs">{getText('Değerlendir', 'Rate')}</span>
          </button>
          <button onClick={() => setShowCallWaiter(true)} className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="text-xs">{getText('Garson', 'Waiter')}</span>
            {waiterCalled && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />}
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-xs">{getText('Paylaş', 'Share')}</span>
          </button>
        </div>
      </nav>

      {/* Scroll to Top */}
      {showScrollTop && !showCart && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-36 right-4 w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center z-30 transition-all hover:scale-110"
          style={{
            backgroundColor: DESIGN.color.primary,
            boxShadow: `0 4px 16px ${DESIGN.color.primary}40`,
          }}
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Product Detail Modal */}
      {selectedItem && renderProductDetailModal()}

      {/* Cart Modal */}
      {showCart && renderCartModal()}

      {/* Call Waiter Modal */}
      {showCallWaiter && renderCallWaiterModal()}

      {/* Rating Modal */}
      {showRating && renderRatingModal()}

      {/* Search Overlay */}
      {showSearch && renderSearchOverlay()}

      {/* Language Selector */}
      {showLanguageMenu && renderLanguageModal()}

      {renderGlobalStyles()}
    </div>
  )

  // ─── SHARED RENDER FUNCTIONS ──────────────────────────────────────────

  function renderProductDetailModal() {
    return (
      <div className="fixed inset-0 z-50" onClick={() => setSelectedItem(null)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const item = getSelectedItemData()
            if (!item) return null
            const itemId = `${selectedItem!.categoryIndex}-${selectedItem!.itemIndex}`
            const quantity = getCartItemQuantity(itemId)
            const visual = CATEGORY_VISUALS[categories[selectedItem!.categoryIndex].name] || { emoji: '🍽️', gradient: 'from-gray-400 to-gray-600' }
            const optionGroups = getOptionGroups(item.categoryName)

            return (
              <>
                {/* Drag Handle */}
                <div className="sticky top-0 bg-white pt-3 pb-2 z-10 rounded-t-3xl">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
                </div>

                {/* Hero Image */}
                <div className={cn(
                  'w-full aspect-[16/10] flex items-center justify-center bg-gradient-to-br',
                  visual.gradient
                )}>
                  <span className="text-[100px] opacity-80">{visual.emoji}</span>
                </div>

                <div className="p-6">
                  {/* Title & Favorite */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <p className="text-sm mb-1" style={{ color: DESIGN.color.textMuted }}>
                        {item.categoryName}
                      </p>
                      <h2 className="text-2xl font-bold" style={{ color: DESIGN.color.text }}>
                        {getText(item.name, item.name_en)}
                      </h2>
                    </div>
                    <button
                      onClick={() => toggleFavorite(itemId)}
                      className={cn(
                        "p-2.5 rounded-xl border transition-colors",
                        favorites.has(itemId)
                          ? "border-red-200 bg-red-50 text-red-500"
                          : "border-gray-200 text-gray-400"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", favorites.has(itemId) && "fill-current")} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="leading-relaxed mb-5" style={{ color: DESIGN.color.textSecondary }}>
                    {getText(item.description, item.description_en)}
                  </p>

                  {/* Tags / Chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.prep_minutes && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm"
                        style={{ backgroundColor: `${DESIGN.color.primary}10`, color: DESIGN.color.primary }}
                      >
                        <Clock className="w-4 h-4" />
                        {item.prep_minutes} {getText('dakika', 'min')}
                      </span>
                    )}
                    {item.dietary_restrictions?.map((tag, idx) => (
                      <span key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-xl text-sm text-green-700"
                      >
                        <Leaf className="w-4 h-4" />
                        {tag}
                      </span>
                    ))}
                    {/* Allergen warning example */}
                    {item.dietary_restrictions && item.dietary_restrictions.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl text-sm text-amber-700">
                        <AlertTriangle className="w-4 h-4" />
                        {getText('Alerjen bilgisi mevcut', 'Allergen info available')}
                      </span>
                    )}
                  </div>

                  {/* Option Groups */}
                  {optionGroups.map((group, gIdx) => (
                    <div key={gIdx} className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold" style={{ color: DESIGN.color.text }}>
                          {getText(group.name, group.name_en)}
                        </h4>
                        {group.required && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                            {getText('Zorunlu', 'Required')}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {group.choices.map((choice, cIdx) => {
                          const isSelected = (selectedOptions[group.name] || []).includes(choice.name)
                          return (
                            <button
                              key={cIdx}
                              onClick={() => toggleOption(group.name, choice.name, group.type)}
                              className={cn(
                                'w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left',
                                isSelected
                                  ? 'border-current bg-opacity-5'
                                  : 'border-gray-200 hover:border-gray-300'
                              )}
                              style={{
                                borderColor: isSelected ? DESIGN.color.primary : undefined,
                                backgroundColor: isSelected ? `${DESIGN.color.primary}08` : undefined,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                                    group.type === 'multi' ? 'rounded-md' : 'rounded-full'
                                  )}
                                  style={{
                                    borderColor: isSelected ? DESIGN.color.primary : '#D1D5DB',
                                    backgroundColor: isSelected ? DESIGN.color.primary : 'transparent',
                                  }}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                                <span className="font-medium" style={{ color: DESIGN.color.text }}>
                                  {getText(choice.name, choice.name_en)}
                                </span>
                              </div>
                              {choice.price > 0 && (
                                <span className="text-sm font-medium" style={{ color: DESIGN.color.primary }}>
                                  +{formatPrice(choice.price, 'TRY')}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: DESIGN.color.border }}>
                    <div>
                      <p className="text-sm" style={{ color: DESIGN.color.textMuted }}>{getText('Fiyat', 'Price')}</p>
                      <p className="text-2xl font-bold" style={{ color: DESIGN.color.primary }}>
                        {formatPrice(item.price, 'TRY')}
                      </p>
                    </div>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl" style={{ backgroundColor: DESIGN.color.primary }}>
                        <button
                          onClick={() => updateCartQuantity(itemId, -1)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
                        >
                          <Minus className="w-4 h-4" strokeWidth={3} />
                        </button>
                        <span className="text-white font-bold text-lg min-w-[30px] text-center">{quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(itemId, 1)}
                          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
                        >
                          <Plus className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(itemId, getText(item.name, item.name_en), item.price)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-transform hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: DESIGN.color.primary,
                          boxShadow: `0 4px 16px ${DESIGN.color.primary}40`,
                        }}
                      >
                        <Plus className="w-5 h-5" />
                        {getText('Sepete Ekle', 'Add to Cart')}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    )
  }

  function renderCartModal() {
    return (
      <div className="fixed inset-0 z-50" onClick={() => setShowCart(false)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white pt-3 pb-4 px-6 border-b z-10" style={{ borderColor: DESIGN.color.border }}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: DESIGN.color.text }}>{getText('Sepetim', 'My Cart')}</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5" style={{ color: DESIGN.color.textMuted }} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 200px)' }}>
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: DESIGN.color.border }} />
                <p style={{ color: DESIGN.color.textMuted }}>{getText('Sepetiniz boş', 'Your cart is empty')}</p>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl" style={{ backgroundColor: DESIGN.color.bg }}>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate" style={{ color: DESIGN.color.text }}>{item.name}</h4>
                      <p className="text-sm font-bold" style={{ color: DESIGN.color.primary }}>
                        {formatPrice(item.price * item.quantity, 'TRY')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border px-2" style={{ borderColor: DESIGN.color.border }}>
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center" style={{ color: DESIGN.color.textSecondary }}>
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium min-w-[24px] text-center" style={{ color: DESIGN.color.text }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center" style={{ color: DESIGN.color.textSecondary }}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t p-6" style={{ borderColor: DESIGN.color.border }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ color: DESIGN.color.textSecondary }}>{getText('Toplam', 'Total')}</span>
                <span className="text-2xl font-bold" style={{ color: DESIGN.color.primary }}>
                  {formatPrice(cartTotal, 'TRY')}
                </span>
              </div>
              <button
                className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: DESIGN.color.primary,
                  boxShadow: `0 4px 16px ${DESIGN.color.primary}40`,
                }}
              >
                {getText('Siparişi Onayla', 'Confirm Order')}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderCallWaiterModal() {
    return (
      <div className="fixed inset-0 z-50" onClick={() => setShowCallWaiter(false)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
          {waiterCalled ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${DESIGN.color.success}15` }}>
                <Check className="w-10 h-10" style={{ color: DESIGN.color.success }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: DESIGN.color.text }}>
                {getText('Garson Çağrıldı!', 'Waiter Called!')}
              </h3>
              <p style={{ color: DESIGN.color.textMuted }}>
                {getText('Garsonunuz kısa sürede yanınızda olacak.', 'Your waiter will be with you shortly.')}
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-6 text-center" style={{ color: DESIGN.color.text }}>
                {getText('Garson Çağır', 'Call Waiter')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCallWaiter}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-colors hover:opacity-80"
                  style={{ backgroundColor: `${DESIGN.color.primary}08` }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${DESIGN.color.primary}15` }}>
                    <Bell className="w-7 h-7" style={{ color: DESIGN.color.primary }} />
                  </div>
                  <span className="font-medium" style={{ color: DESIGN.color.text }}>{getText('Servis', 'Service')}</span>
                </button>
                <button
                  onClick={handleCallWaiter}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-colors hover:opacity-80"
                  style={{ backgroundColor: `${DESIGN.color.success}08` }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${DESIGN.color.success}15` }}>
                    <MessageCircle className="w-7 h-7" style={{ color: DESIGN.color.success }} />
                  </div>
                  <span className="font-medium" style={{ color: DESIGN.color.text }}>{getText('Hesap', 'Bill')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  function renderRatingModal() {
    return (
      <div className="fixed inset-0 z-50" onClick={() => setShowRating(false)}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
          <h3 className="text-xl font-bold mb-2 text-center" style={{ color: DESIGN.color.text }}>
            {getText('Deneyiminizi Değerlendirin', 'Rate Your Experience')}
          </h3>
          <p className="text-center mb-6" style={{ color: DESIGN.color.textMuted }}>
            {getText('Hizmetimizi nasıl buldunuz?', 'How was our service?')}
          </p>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="p-2 transition-transform hover:scale-110">
                <Star className={cn("w-10 h-10 transition-colors", star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <button
              onClick={() => { setShowRating(false); setRating(0) }}
              className="w-full py-4 rounded-2xl text-white font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: DESIGN.color.primary,
                boxShadow: `0 4px 16px ${DESIGN.color.primary}40`,
              }}
            >
              {getText('Gönder', 'Submit')}
            </button>
          )}
        </div>
      </div>
    )
  }

  function renderSearchOverlay() {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="sticky top-0 bg-white border-b p-4" style={{ borderColor: DESIGN.color.border }}>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5" style={{ color: DESIGN.color.textSecondary }} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: DESIGN.color.textMuted }} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getText('Menüde ara...', 'Search menu...')}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: DESIGN.color.bg,
                  // @ts-expect-error -- ring color
                  '--tw-ring-color': `${DESIGN.color.primary}30`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          {searchQuery.trim() === '' ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4" style={{ color: DESIGN.color.border }} />
              <p style={{ color: DESIGN.color.textMuted }}>{getText('Bir şeyler aramaya başlayın', 'Start searching')}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4" style={{ color: DESIGN.color.border }} />
              <p style={{ color: DESIGN.color.textMuted }}>{getText('Sonuç bulunamadı', 'No results found')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm mb-4" style={{ color: DESIGN.color.textMuted }}>
                {searchResults.length} {getText('sonuç bulundu', 'results found')}
              </p>
              {searchResults.map((item) => {
                const visual = CATEGORY_VISUALS[categories[item.categoryIndex].name] || { emoji: '🍽️', gradient: 'from-gray-400 to-gray-600' }
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery('')
                      setSelectedItem({ categoryIndex: item.categoryIndex, itemIndex: item.itemIndex })
                      setSelectedOptions({})
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left"
                    style={{ backgroundColor: DESIGN.color.bg }}
                  >
                    <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br', visual.gradient)}>
                      <span className="text-xl">{visual.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" style={{ color: DESIGN.color.text }}>{getText(item.name, item.name_en)}</p>
                      <p className="text-xs" style={{ color: DESIGN.color.textMuted }}>{item.categoryName}</p>
                      <p className="text-sm font-bold mt-1" style={{ color: DESIGN.color.primary }}>{formatPrice(item.price, 'TRY')}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: DESIGN.color.textMuted }} />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderLanguageModal() {
    return (
      <div className="fixed inset-0 z-50" onClick={() => setShowLanguageMenu(false)}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 shadow-2xl animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold" style={{ color: DESIGN.color.text }}>{getText('Dil Seçimi', 'Select Language')}</h3>
            <button onClick={() => setShowLanguageMenu(false)} className="p-1 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5" style={{ color: DESIGN.color.textMuted }} />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
              { code: 'en', flag: '🇬🇧', name: 'English' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code as Language); setShowLanguageMenu(false) }}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left',
                  language === lang.code ? 'text-white' : 'hover:bg-gray-100'
                )}
                style={{
                  backgroundColor: language === lang.code ? DESIGN.color.primary : undefined,
                  color: language === lang.code ? 'white' : DESIGN.color.text,
                }}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function renderGlobalStyles() {
    return (
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    )
  }
}
