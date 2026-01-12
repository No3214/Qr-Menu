'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  Globe,
  Star,
  Clock,
  Flame,
  Leaf,
  Wheat,
  Info,
  MessageSquare,
  X,
  Volume2,
  VolumeX,
  ChevronDown,
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

export default function PublicMenuPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const qrSource = searchParams.get('src')

  const [data, setData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [language, setLanguage] = useState('en')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
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
        if (menuData.categories?.[0]) {
          setSelectedCategory(menuData.categories[0].id)
        }
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

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    trackEvent('category_view', 'category', categoryId)
  }

  // Get translated text
  const t = (entityType: string, entityId: string, field: string, fallback: string) => {
    const key = `${entityType}_${entityId}`
    return data?.translations?.[key]?.[field] || fallback
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-900">Menu not available</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  const { restaurant, settings, categories } = data

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Video/Image */}
      <div className="relative w-full h-[280px] bg-black">
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
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
          </>
        ) : restaurant.cover_image_url ? (
          <Image
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-950" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {restaurant.logo_url && (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg">
                <Image
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguageMenu(true)}
              className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center"
            >
              <Globe className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Restaurant Name */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <h1 className="text-2xl font-bold text-white">{restaurant.name}</h1>
          {restaurant.address && (
            <p className="text-white/80 text-sm mt-1">{restaurant.address}</p>
          )}
        </div>
      </div>

      {/* Category Tabs - Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex px-4 py-3 gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {t('category', category.id, 'name', category.name)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="pb-24">
        {categories.map((category) => (
          <div
            key={category.id}
            ref={(el) => { categoryRefs.current[category.id] = el }}
            className="scroll-mt-14"
          >
            {/* Category Header */}
            <div className="px-4 pt-6 pb-3">
              <h2 className="text-xl font-bold text-gray-900">
                {t('category', category.id, 'name', category.name)}
              </h2>
              {category.description && (
                <p className="text-gray-500 text-sm mt-1">
                  {t('category', category.id, 'description', category.description)}
                </p>
              )}
            </div>

            {/* Menu Items */}
            <div className="px-4 space-y-3">
              {category.items?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item)
                    trackEvent('item_click', 'item', item.id)
                  }}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Item Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.video_url ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      >
                        <source src={item.video_url} type="video/mp4" />
                      </video>
                    ) : item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                        <span className="text-3xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
                        {t('item', item.id, 'name', item.name)}
                      </h3>
                      <span className="font-bold text-gray-900 text-[15px] whitespace-nowrap">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-gray-500 text-[13px] mt-1.5 line-clamp-2 leading-relaxed">
                        {t('item', item.id, 'description', item.description)}
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {item.dietary_restrictions?.map((diet) => {
                        const lowerDiet = diet.toLowerCase()
                        let icon = null
                        let bgColor = 'bg-gray-100'
                        let textColor = 'text-gray-600'

                        if (lowerDiet.includes('vegan')) {
                          icon = <Leaf className="w-3 h-3" />
                          bgColor = 'bg-green-50'
                          textColor = 'text-green-700'
                        } else if (lowerDiet.includes('vegetarian')) {
                          icon = <Leaf className="w-3 h-3" />
                          bgColor = 'bg-green-50'
                          textColor = 'text-green-700'
                        } else if (lowerDiet.includes('gluten')) {
                          icon = <Wheat className="w-3 h-3" />
                          bgColor = 'bg-amber-50'
                          textColor = 'text-amber-700'
                        }

                        return (
                          <span
                            key={diet}
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                              bgColor,
                              textColor
                            )}
                          >
                            {icon}
                            {diet}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-4 bg-black text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-40 hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-medium">Feedback</span>
      </button>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setSelectedItem(null)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Handle */}
            <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center z-10">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Item Image */}
            <div className="relative w-full h-56 bg-gray-100">
              {selectedItem.video_url ? (
                <video
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={selectedItem.video_url} type="video/mp4" />
                </video>
              ) : selectedItem.image_url ? (
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                  <span className="text-6xl">🍽️</span>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Item Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('item', selectedItem.id, 'name', selectedItem.name)}
                </h2>
                <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                  {formatPrice(selectedItem.price, selectedItem.currency)}
                </span>
              </div>

              {selectedItem.description && (
                <p className="text-gray-600 text-[15px] mt-3 leading-relaxed">
                  {t('item', selectedItem.id, 'description', selectedItem.description)}
                </p>
              )}

              {/* Quick Info */}
              {(selectedItem.prep_minutes || selectedItem.calories) && (
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  {selectedItem.prep_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedItem.prep_minutes} min
                    </span>
                  )}
                  {selectedItem.calories && (
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {selectedItem.calories} cal
                    </span>
                  )}
                </div>
              )}

              {/* Dietary Tags */}
              {selectedItem.dietary_restrictions && selectedItem.dietary_restrictions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedItem.dietary_restrictions.map((diet) => (
                    <span
                      key={diet}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 font-medium"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              )}

              {/* Allergen Warning */}
              {selectedItem.allergen_warnings && selectedItem.allergen_warnings.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-xl">
                  <p className="text-sm font-medium text-red-700 mb-2">Allergens</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.allergen_warnings.map((allergen) => (
                      <span
                        key={allergen}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageMenu && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowLanguageMenu(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Language</h3>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {SUPPORTED_LANGUAGES.filter(
                l => settings?.supported_languages?.includes(l.code)
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setShowLanguageMenu(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left',
                    language === lang.code
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setShowFeedback(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Feedback</h3>
            <FeedbackForm
              restaurantId={restaurant.id}
              onSuccess={() => setShowFeedback(false)}
            />
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
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
        <label className="text-sm font-medium text-gray-700">Rating</label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'w-8 h-8',
                  rating >= value
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Name (Optional)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          placeholder="Tell us about your experience..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
