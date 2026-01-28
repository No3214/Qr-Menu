'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  Menu,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { Restaurant, MenuCategoryWithItems, MenuItem, RestaurantSettings } from '@/types'
import { SUPPORTED_LANGUAGES } from '@/types'

interface MenuData {
  restaurant: Restaurant
  settings: RestaurantSettings
  categories: MenuCategoryWithItems[]
  translations: Record<string, Record<string, string>>
}

type ViewMode = 'home' | 'category'

export default function PublicMenuPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const qrSource = searchParams.get('src')

  const [data, setData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('home')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [language, setLanguage] = useState('tr')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoModal, setVideoModal] = useState<{ url: string; title: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Track event
  const trackEvent = async (eventType: string, entityType?: string, entityId?: string) => {
    if (!data?.restaurant?.id) return
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: data.restaurant.id,
          event_type: eventType,
          entity_type: entityType,
          entity_id: entityId,
          qr_entrypoint: qrSource,
        }),
      })
    } catch (e) {
      console.error('Failed to track event:', e)
    }
  }

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menu/public?slug=${slug}&lang=${language}`)
        if (!res.ok) throw new Error('Menu not found')
        const menuData = await res.json()
        setData(menuData)
      } catch (e) {
        setError('Menu not found')
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [slug, language])

  // Track initial view
  useEffect(() => {
    if (data?.restaurant?.id) {
      trackEvent(qrSource ? 'qr_scan' : 'menu_view')
    }
  }, [data?.restaurant?.id])

  // Get translated text
  const t = (entityType: string, entityId: string, field: string, fallback: string) => {
    const key = `${entityType}_${entityId}`
    return data?.translations?.[key]?.[field] || fallback
  }

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setViewMode('category')
    trackEvent('category_view', 'category', categoryId)
  }

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setTimeout(() => {
      categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton Brand Header */}
        <div className="bg-white text-center py-2 border-b border-gray-100">
          <div className="h-4 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Skeleton Main Card */}
        <div className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
          {/* Skeleton Nav */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Skeleton Content */}
          <div className="p-4 space-y-4">
            {/* Hero Skeleton */}
            <div className="w-full aspect-[16/10] bg-gray-200 rounded-xl animate-pulse" />

            {/* Category Grid Skeleton */}
            <div className="space-y-3">
              <div className="w-full aspect-[16/9] bg-gray-200 rounded-xl animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Footer */}
        <div className="text-center py-6">
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-900">Menü bulunamadı</p>
          <p className="text-gray-500 mt-2">Lütfen daha sonra tekrar deneyin</p>
        </div>
      </div>
    )
  }

  const { restaurant, settings, categories } = data
  const selectedCategory = categories.find(c => c.id === selectedCategoryId)

  // Dietary icon component
  const DietaryIcons = ({ item }: { item: MenuItem }) => {
    const icons: JSX.Element[] = []
    item.dietary_restrictions?.forEach((diet, idx) => {
      const d = diet.toLowerCase()
      if (d.includes('vegan') || d.includes('vegetarian')) {
        icons.push(<span key={idx} className="text-green-600">🥬</span>)
      }
      if (d.includes('gluten')) {
        icons.push(<span key={idx} className="text-amber-600">🌾</span>)
      }
      if (d.includes('spicy') || d.includes('acı')) {
        icons.push(<span key={idx}>🌶️</span>)
      }
    })
    if (item.prep_minutes) {
      icons.push(<span key="time" className="text-gray-400">⏱️</span>)
    }
    return icons.length > 0 ? <span className="inline-flex gap-1 ml-2">{icons}</span> : null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-white text-center py-2 border-b border-gray-100">
        <span className="text-sm font-semibold tracking-[0.3em] text-gray-800">GRAIN</span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {restaurant.logo_url ? (
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">{restaurant.name}</p>
            </div>
          )}

          <button
            onClick={() => setShowLanguageMenu(true)}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {viewMode === 'category' && (
          /* Category Tabs */
          <div className="overflow-x-auto scrollbar-hide border-b border-gray-100">
            <div className="flex px-4 py-3 gap-6 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={cn(
                    'text-sm whitespace-nowrap transition-colors pb-1',
                    selectedCategoryId === category.id
                      ? 'text-gray-900 font-semibold border-b-2 border-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {t('category', category.id, 'name', category.name)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        {viewMode === 'home' ? (
          /* HOME VIEW - Category Grid */
          <div className="p-4">
            {/* Hero Video/Image with Ken Burns Effect */}
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 animate-scale-in">
              {restaurant.video_url ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={restaurant.video_url} type="video/mp4" />
                  </video>
                  {/* Video Controls with animation */}
                  <div className="absolute bottom-3 right-3 z-20 flex gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 btn-press"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => setVideoModal({ url: restaurant.video_url!, title: restaurant.name })}
                      className="w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 btn-press"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  {/* 4K Badge with pulse */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse-glow">4K</span>
                  </div>
                </>
              ) : restaurant.cover_image_url ? (
                <Image
                  src={restaurant.cover_image_url}
                  alt={restaurant.name}
                  fill
                  className="object-cover animate-ken-burns"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-900" />
              )}
              <div className="absolute inset-0 bg-black/20" />

              {/* View Menu Button with premium hover */}
              <button
                onClick={() => {
                  if (categories[0]) handleCategorySelect(categories[0].id)
                }}
                className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 py-3 rounded-lg font-medium text-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] btn-press"
              >
                Menüyü Görüntüle
              </button>
            </div>

            {/* Category Grid - Foost Style with Premium Animations */}
            <div className="space-y-3">
              {/* First category - Full width hero */}
              {categories[0] && (
                <button
                  onClick={() => handleCategorySelect(categories[0].id)}
                  className="relative w-full aspect-[16/9] rounded-xl overflow-hidden card-hover img-zoom animate-fade-in-up stagger-1"
                >
                  {categories[0].image_url ? (
                    <Image
                      src={categories[0].image_url}
                      alt={categories[0].name}
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 hover:from-black/70" />
                  <div className="absolute bottom-0 left-0 p-4 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">
                      {t('category', categories[0].id, 'name', categories[0].name)}
                    </h3>
                    {categories[0].description && (
                      <p className="text-white/70 text-sm mt-0.5 drop-shadow">
                        {t('category', categories[0].id, 'description', categories[0].description)}
                      </p>
                    )}
                  </div>
                </button>
              )}

              {/* Remaining categories - 2-column grid with staggered animations */}
              {categories.length > 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(1).map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={cn(
                        "relative aspect-[4/3] rounded-xl overflow-hidden card-hover img-zoom animate-fade-in-up",
                        `stagger-${Math.min(index + 2, 8)}`
                      )}
                    >
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 p-3">
                        <h3 className="text-white font-bold text-sm leading-tight drop-shadow-lg">
                          {t('category', category.id, 'name', category.name)}
                        </h3>
                        {category.description && (
                          <p className="text-white/70 text-xs mt-0.5 line-clamp-1 drop-shadow">
                            {t('category', category.id, 'description', category.description)}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* CATEGORY VIEW - Menu Items */
          <div className="p-4">
            {categories.map((category) => (
              <div
                key={category.id}
                ref={(el) => { categoryRefs.current[category.id] = el }}
                className="scroll-mt-32"
              >
                {/* Featured Item Banner with Video Support */}
                {(category.items?.[0]?.image_url || category.items?.[0]?.video_url) && (
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    {category.items[0].video_url ? (
                      <>
                        <video
                          src={category.items[0].video_url}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                        {/* Play Full Video Button */}
                        <button
                          onClick={() => setVideoModal({
                            url: category.items[0].video_url!,
                            title: category.items[0].name
                          })}
                          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Maximize2 className="w-5 h-5 text-gray-900" />
                        </button>
                      </>
                    ) : category.items[0].image_url ? (
                      <Image
                        src={category.items[0].image_url}
                        alt={category.items[0].name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-semibold">
                        {t('item', category.items[0].id, 'name', category.items[0].name)}
                      </p>
                      <p className="text-white/80 text-sm">
                        ₺ {category.items[0].price}
                      </p>
                    </div>
                  </div>
                )}

                {/* Category Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {t('category', category.id, 'name', category.name)}
                </h2>

                {/* Menu Items with Staggered Animation */}
                <div className="space-y-1">
                  {category.items?.map((item, itemIndex) => {
                    const isExpanded = expandedItems.has(item.id)

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "border-b border-gray-100 last:border-0 animate-fade-in-up",
                          `stagger-${Math.min(itemIndex + 1, 8)}`
                        )}
                      >
                        {/* Item Header */}
                        <div
                          className="flex gap-3 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/50 rounded-lg -mx-2 px-2"
                          onClick={() => {
                            toggleItemExpand(item.id)
                            trackEvent('item_click', 'item', item.id)
                          }}
                        >
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title Row */}
                            <div className="flex items-center gap-1">
                              <h3 className="font-semibold text-gray-900 text-[15px]">
                                {t('item', item.id, 'name', item.name)}
                              </h3>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <DietaryIcons item={item} />
                            </div>

                            {/* Description */}
                            {item.description && (
                              <p className={cn(
                                'text-gray-500 text-sm mt-1.5 leading-relaxed',
                                !isExpanded && 'line-clamp-2'
                              )}>
                                {t('item', item.id, 'description', item.description)}
                              </p>
                            )}

                            {/* See More Link */}
                            {item.description && item.description.length > 100 && !isExpanded && (
                              <button className="text-teal-600 text-sm mt-1 hover:underline">
                                Devamını Gör
                              </button>
                            )}

                            {/* Price */}
                            <p className="text-gray-900 font-semibold mt-2">
                              ₺ {item.price}
                            </p>

                            {/* Explore Button (when expanded) with animation */}
                            {isExpanded && (
                              <button className="mt-3 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 hover:border-gray-400 btn-press animate-fade-in">
                                Keşfet
                                <ArrowRight className="w-4 h-4 transition-transform duration-300" />
                              </button>
                            )}
                          </div>

                          {/* Item Image/Video */}
                          {(item.image_url || item.video_url) && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              {item.video_url ? (
                                <>
                                  {/* Video thumbnail or first frame */}
                                  {item.image_url ? (
                                    <Image
                                      src={item.image_url}
                                      alt={item.name}
                                      width={96}
                                      height={96}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <video
                                      src={item.video_url}
                                      className="object-cover w-full h-full"
                                      muted
                                      preload="metadata"
                                    />
                                  )}
                                  {/* Video Play Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setVideoModal({ url: item.video_url!, title: item.name })
                                      trackEvent('video_view', 'item', item.id)
                                    }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                                  >
                                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                      <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                                    </div>
                                  </button>
                                </>
                              ) : item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="object-cover w-full h-full"
                                />
                              ) : null}
                            </div>
                          )}
                        </div>

                        {/* Recommendations (when expanded) with premium animations */}
                        {isExpanded && (
                          <div className="pb-4 animate-expand">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 animate-fade-in">Öneriler</h4>
                            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
                              {/* Use API recommendations if available, otherwise fallback to category items */}
                              {(item.recommendations?.length > 0
                                ? item.recommendations.map(rec => ({ ...rec.item, reason: rec.reason }))
                                : category.items?.slice(0, 3).filter(i => i.id !== item.id).map(i => ({ ...i, reason: i.description?.slice(0, 50) || 'Harika bir seçim!' }))
                              )?.map((recItem, recIndex) => (
                                <div
                                  key={recItem.id}
                                  onClick={() => {
                                    toggleItemExpand(recItem.id)
                                    trackEvent('recommendation_click', 'item', recItem.id)
                                  }}
                                  className={cn(
                                    "flex-shrink-0 w-40 bg-gray-50 rounded-xl p-3 cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-1 card-hover animate-fade-in-up",
                                    `stagger-${recIndex + 1}`
                                  )}
                                >
                                  {recItem.image_url && (
                                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 img-zoom">
                                      <Image
                                        src={recItem.image_url}
                                        alt={recItem.name}
                                        width={160}
                                        height={120}
                                        className="object-cover w-full h-full transition-transform duration-500"
                                      />
                                    </div>
                                  )}
                                  <h5 className="font-medium text-gray-900 text-sm">
                                    {t('item', recItem.id, 'name', recItem.name)}
                                  </h5>
                                  <p className="text-gray-500 text-xs mt-1">
                                    <span className="font-semibold text-gray-700">Neden?</span>{' '}
                                    {recItem.reason}...
                                  </p>
                                  <p className="text-gray-900 font-semibold text-sm mt-2">
                                    ₺ {recItem.price}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="h-6" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fast Feedback Button with premium animation */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-20 left-4 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 z-40 hover:scale-105 active:scale-95 btn-press animate-bounce-in"
        style={{ animationDelay: '0.5s' }}
      >
        FAST FEEDBACK
      </button>

      {/* Powered by Footer */}
      <div className="text-center py-6 text-gray-400 text-sm">
        <Zap className="w-4 h-4 inline mr-1" />
        Powered by Grain
      </div>

      {/* Language Sidebar with glass effect */}
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
              {SUPPORTED_LANGUAGES.filter(
                l => settings?.supported_languages?.includes(l.code)
              ).map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setShowLanguageMenu(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left animate-fade-in-up',
                    `stagger-${index + 1}`,
                    language === lang.code
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-900 hover:translate-x-1'
                  )}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Menu with glass effect */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 animate-backdrop-in" onClick={() => setShowSidebar(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 animate-slide-in-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
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
                  key={category.id}
                  onClick={() => {
                    handleCategorySelect(category.id)
                    setShowSidebar(false)
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:translate-x-1 animate-fade-in-up",
                    `stagger-${Math.min(index + 2, 8)}`
                  )}
                >
                  {t('category', category.id, 'name', category.name)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal with glass effect */}
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
            <h3 className="text-lg font-bold text-gray-900 mb-4 animate-fade-in">Geri Bildirim</h3>
            <FeedbackForm
              restaurantId={restaurant.id}
              onSuccess={() => setShowFeedback(false)}
            />
          </div>
        </div>
      )}

      {/* 4K Video Modal with premium animations */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center animate-backdrop-in"
          onClick={() => setVideoModal(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setVideoModal(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 animate-fade-in"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video Title */}
          <div className="absolute top-4 left-4 z-10 animate-fade-in-up stagger-1">
            <p className="text-white font-semibold text-lg drop-shadow-lg">{videoModal.title}</p>
          </div>

          {/* Video Player */}
          <div
            className="relative w-full h-full max-w-4xl max-h-[80vh] mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={modalVideoRef}
              src={videoModal.url}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              controls
              autoPlay
              playsInline
              controlsList="nodownload"
            >
              <source src={videoModal.url} type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>

          {/* Video Quality Badge */}
          <div className="absolute bottom-4 right-4 z-10 animate-bounce-in">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded shadow-lg">4K</span>
          </div>
        </div>
      )}

      {/* All animations are now in globals.css for better performance */}
    </div>
  )
}

function FeedbackForm({
  restaurantId,
  onSuccess,
}: {
  restaurantId: string
  onSuccess: () => void
}) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/reviews/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          rating,
          comment,
          full_name: name,
        }),
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Puanınız</label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((value, index) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={cn(
                "transition-all duration-200 hover:scale-125 active:scale-95 animate-fade-in-up",
                `stagger-${index + 1}`
              )}
            >
              <Star
                className={cn(
                  'w-8 h-8 transition-colors duration-200',
                  rating >= value
                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                    : 'text-gray-300 hover:text-yellow-300'
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Adınız (Opsiyonel)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Adınız"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Yorumunuz</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          placeholder="Deneyiminizi paylaşın..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </form>
  )
}
