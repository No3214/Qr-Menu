'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  ChevronRight,
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
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { KOZBEYLI_KONAGI_DATA } from '@/data/kozbeyli-konagi-menu'

type Language = 'tr' | 'en'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface SelectedItem {
  categoryIndex: number
  itemIndex: number
}

// Foost Design System Colors
const FOOST_COLORS = {
  primary: '#C5A059',
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
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [showCallWaiter, setShowCallWaiter] = useState(false)
  const [waiterCalled, setWaiterCalled] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)

  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])
  const categoryNavRef = useRef<HTMLDivElement>(null)
  const categories = menuData.categories

  const getText = (tr: string, en: string) => language === 'en' ? en : tr

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180
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
      const yOffset = -160
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

  const addToCart = (id: string, name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id)
      if (existing) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id, name, price, quantity: 1 }]
    })
  }

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter((item): item is CartItem => item !== null)
    })
  }

  const getCartItemQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0
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
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
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

        {/* Category Navigation */}
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
      <main className="pb-32">
        {categories.map((category, catIndex) => (
          <div
            key={catIndex}
            ref={el => { categoryRefs.current[catIndex] = el }}
            className="border-b border-gray-100 last:border-b-0"
          >
            <div className="sticky top-[120px] z-30 bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {getText(category.name, category.name_en)}
              </h2>
              <p className="text-sm text-gray-500">
                {category.items.length} {getText('ürün', 'items')}
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {category.items.map((item, itemIndex) => {
                const itemId = `${catIndex}-${itemIndex}`
                const isFavorite = favorites.has(itemId)
                const quantity = getCartItemQuantity(itemId)

                return (
                  <div
                    key={itemIndex}
                    onClick={() => setSelectedItem({ categoryIndex: catIndex, itemIndex })}
                    className="flex gap-4 p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
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
                        <span className="text-base font-bold" style={{ color: FOOST_COLORS.primary }}>
                          {formatPrice(item.price, 'TRY')}
                        </span>
                        {item.prep_minutes && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {item.prep_minutes} dk
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                        <span className="text-3xl">🍽️</span>
                      </div>
                      {quantity > 0 ? (
                        <div
                          className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full shadow-lg px-1"
                          style={{ backgroundColor: FOOST_COLORS.primary }}
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
                          style={{ backgroundColor: FOOST_COLORS.primary }}
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {/* Cart Summary */}
        {cartItemCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="w-full flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: FOOST_COLORS.primary }}
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

        {/* Nav Items */}
        <div className="flex items-center justify-around py-3 px-4">
          <button className="flex flex-col items-center gap-1 px-4 py-1" style={{ color: FOOST_COLORS.primary }}>
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">{getText('Menü', 'Menu')}</span>
          </button>
          <button
            onClick={() => setShowRating(true)}
            className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Star className="w-5 h-5" />
            <span className="text-xs">{getText('Değerlendir', 'Rate')}</span>
          </button>
          <button
            onClick={() => setShowCallWaiter(true)}
            className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400 hover:text-gray-600 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs">{getText('Garson', 'Waiter')}</span>
            {waiterCalled && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
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
          className="fixed bottom-36 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-30 transition-all hover:scale-110"
          style={{ backgroundColor: FOOST_COLORS.primary }}
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50" onClick={() => setSelectedItem(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const item = getSelectedItemData()
              if (!item) return null
              const itemId = `${selectedItem.categoryIndex}-${selectedItem.itemIndex}`
              const quantity = getCartItemQuantity(itemId)

              return (
                <>
                  <div className="sticky top-0 bg-white pt-3 pb-2 z-10">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
                  </div>

                  <div className="w-full aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <span className="text-8xl">🍽️</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{item.categoryName}</p>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {getText(item.name, item.name_en)}
                        </h2>
                      </div>
                      <button
                        onClick={() => toggleFavorite(itemId)}
                        className={cn(
                          "p-2 rounded-full border transition-colors",
                          favorites.has(itemId)
                            ? "border-red-200 bg-red-50 text-red-500"
                            : "border-gray-200 text-gray-400"
                        )}
                      >
                        <Heart className={cn("w-5 h-5", favorites.has(itemId) && "fill-current")} />
                      </button>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6">
                      {getText(item.description, item.description_en)}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.prep_minutes && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {item.prep_minutes} {getText('dakika', 'minutes')}
                        </span>
                      )}
                      {item.dietary_restrictions?.map((restriction, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 rounded-full text-sm text-green-700"
                        >
                          <Leaf className="w-4 h-4" />
                          {restriction}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">{getText('Fiyat', 'Price')}</p>
                        <p className="text-2xl font-bold" style={{ color: FOOST_COLORS.primary }}>
                          {formatPrice(item.price, 'TRY')}
                        </p>
                      </div>

                      {quantity > 0 ? (
                        <div
                          className="flex items-center gap-3 px-4 py-2 rounded-full"
                          style={{ backgroundColor: FOOST_COLORS.primary }}
                        >
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
                          className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-transform hover:scale-105"
                          style={{ backgroundColor: FOOST_COLORS.primary }}
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
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50" onClick={() => setShowCart(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white pt-3 pb-4 px-6 border-b border-gray-100 z-10">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{getText('Sepetim', 'My Cart')}</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 200px)' }}>
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">{getText('Sepetiniz boş', 'Your cart is empty')}</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🍽️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm font-bold" style={{ color: FOOST_COLORS.primary }}>
                          {formatPrice(item.price * item.quantity, 'TRY')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-2">
                        <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium min-w-[24px] text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{getText('Toplam', 'Total')}</span>
                  <span className="text-2xl font-bold" style={{ color: FOOST_COLORS.primary }}>
                    {formatPrice(cartTotal, 'TRY')}
                  </span>
                </div>
                <button
                  className="w-full py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: FOOST_COLORS.primary }}
                >
                  {getText('Siparişi Onayla', 'Confirm Order')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call Waiter Modal */}
      {showCallWaiter && (
        <div className="fixed inset-0 z-50" onClick={() => setShowCallWaiter(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

            {waiterCalled ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getText('Garson Çağrıldı!', 'Waiter Called!')}
                </h3>
                <p className="text-gray-500">
                  {getText('Garsonunuz kısa sürede yanınızda olacak.', 'Your waiter will be with you shortly.')}
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  {getText('Garson Çağır', 'Call Waiter')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCallWaiter}
                    className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-7 h-7 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{getText('Servis', 'Service')}</span>
                  </button>
                  <button
                    onClick={handleCallWaiter}
                    className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">{getText('Hesap', 'Bill')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 z-50" onClick={() => setShowRating(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              {getText('Deneyiminizi Değerlendirin', 'Rate Your Experience')}
            </h3>
            <p className="text-gray-500 text-center mb-6">
              {getText('Hizmetimizi nasıl buldunuz?', 'How was our service?')}
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="p-2 transition-transform hover:scale-110">
                  <Star
                    className={cn(
                      "w-10 h-10 transition-colors",
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button
                onClick={() => { setShowRating(false); setRating(0) }}
                className="w-full py-4 rounded-xl text-white font-bold transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: FOOST_COLORS.primary }}
              >
                {getText('Gönder', 'Submit')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                <p className="text-sm text-gray-500 mb-4">{searchResults.length} {getText('sonuç bulundu', 'results found')}</p>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery('')
                      setSelectedItem({ categoryIndex: item.categoryIndex, itemIndex: item.itemIndex })
                    }}
                    className="w-full flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{getText(item.name, item.name_en)}</p>
                      <p className="text-xs text-gray-500">{item.categoryName}</p>
                      <p className="text-sm font-bold mt-1" style={{ color: FOOST_COLORS.primary }}>{formatPrice(item.price, 'TRY')}</p>
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
            className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{getText('Dil Seçimi', 'Select Language')}</h3>
              <button onClick={() => setShowLanguageMenu(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
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
                    'w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left',
                    language === lang.code ? 'text-white' : 'hover:bg-gray-100 text-gray-900'
                  )}
                  style={{ backgroundColor: language === lang.code ? FOOST_COLORS.primary : undefined }}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
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
    </div>
  )
}
