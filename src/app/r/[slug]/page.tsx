'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Globe,
  Star,
  Clock,
  Flame,
  Leaf,
  Wheat,
  Info,
  MessageSquare,
  ArrowLeft,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { Restaurant, MenuCategoryWithItems, MenuItem, RestaurantSettings } from '@/types'
import { SUPPORTED_LANGUAGES } from '@/types'

interface MenuData {
  restaurant: Restaurant
  settings: RestaurantSettings
  categories: MenuCategoryWithItems[]
  translations: Record<string, Record<string, string>>
  events: Array<{
    id: string
    title: string
    description: string
    media_url: string
    start_at: string
    end_at: string
  }>
}

type ViewMode = 'categories' | 'items'

export default function PublicMenuPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const qrSource = searchParams.get('src')

  const [data, setData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('categories')
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryWithItems | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [language, setLanguage] = useState('en')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showGuestInfo, setShowGuestInfo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Track page view
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
        if (!res.ok) {
          throw new Error('Menu not found')
        }
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

  const handleCategoryClick = (category: MenuCategoryWithItems) => {
    setSelectedCategory(category)
    setViewMode('items')
    trackEvent('category_view', 'category', category.id)
  }

  const handleBackToCategories = () => {
    setViewMode('categories')
    setSelectedCategory(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d2d2d] mx-auto"></div>
          <p className="mt-4 text-[#666] font-medium">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-[#f0f0f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2d2d2d] mb-2">Menu Not Found</h1>
          <p className="text-[#666]">This restaurant menu is not available.</p>
        </div>
      </div>
    )
  }

  const { restaurant, settings, categories } = data

  // Dietary icon helper
  const getDietaryIcon = (diet: string) => {
    const lowerDiet = diet.toLowerCase()
    if (lowerDiet.includes('vegan')) return <Leaf className="h-3.5 w-3.5" />
    if (lowerDiet.includes('vegetarian')) return <Leaf className="h-3.5 w-3.5" />
    if (lowerDiet.includes('gluten')) return <Wheat className="h-3.5 w-3.5" />
    return null
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#faf9f6]/95 backdrop-blur-sm border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between px-4 py-3">
          {viewMode === 'items' ? (
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-[#2d2d2d] font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {restaurant.logo_url && (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm">
                  <Image
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h1 className="text-lg font-bold text-[#2d2d2d] truncate max-w-[200px]">
                {restaurant.name}
              </h1>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguageMenu(true)}
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Globe className="h-4 w-4 text-[#2d2d2d]" />
            </button>
            <button
              onClick={() => setShowGuestInfo(true)}
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Info className="h-4 w-4 text-[#2d2d2d]" />
            </button>
          </div>
        </div>

        {/* Category Title when viewing items */}
        {viewMode === 'items' && selectedCategory && (
          <div className="px-4 pb-3">
            <h2 className="text-2xl font-bold text-[#2d2d2d]">
              {t('category', selectedCategory.id, 'name', selectedCategory.name)}
            </h2>
            {selectedCategory.description && (
              <p className="text-[#666] text-sm mt-1">
                {t('category', selectedCategory.id, 'description', selectedCategory.description)}
              </p>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {viewMode === 'categories' ? (
          /* Category Grid View */
          <div className="p-4">
            {/* Hero Video/Image */}
            {(restaurant.video_url || restaurant.cover_image_url) && (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 shadow-lg">
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
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </>
                ) : (
                  <Image
                    src={restaurant.cover_image_url!}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl font-bold">{restaurant.name}</h2>
                  {restaurant.address && (
                    <p className="text-sm text-white/80 mt-1">{restaurant.address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md group"
                >
                  {/* Category Image */}
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b7355] to-[#5c4d3d]" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category Name */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <h3 className="text-white font-bold text-base leading-tight">
                      {t('category', category.id, 'name', category.name)}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">
                      {category.items?.length || 0} items
                    </p>
                    {category.is_special && (
                      <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">
                        Special
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Menu Items View */
          <div className="p-4">
            <div className="space-y-3">
              {selectedCategory?.items?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item)
                    trackEvent('item_click', 'item', item.id)
                  }}
                  className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Item Image */}
                    <div className="relative w-28 h-28 flex-shrink-0">
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
                        <div className="w-full h-full bg-gradient-to-br from-[#f0ebe3] to-[#e8e3db] flex items-center justify-center">
                          <span className="text-3xl">🍽️</span>
                        </div>
                      )}
                      {/* Price Badge on Image */}
                      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                        <span className="text-sm font-bold text-[#2d2d2d]">
                          {formatPrice(item.price, item.currency)}
                        </span>
                      </div>
                      {item.is_new && (
                        <Badge className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5">
                          NEW
                        </Badge>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 p-3 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[#2d2d2d] text-sm leading-tight">
                          {t('item', item.id, 'name', item.name)}
                        </h3>
                        {item.featured && (
                          <Star className="h-4 w-4 text-amber-500 flex-shrink-0 fill-amber-500" />
                        )}
                      </div>

                      {item.description && (
                        <p className="text-[#888] text-xs mt-1.5 line-clamp-2 leading-relaxed">
                          {t('item', item.id, 'description', item.description)}
                        </p>
                      )}

                      {/* Dietary & Info Badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {item.dietary_restrictions?.map((diet) => (
                          <span
                            key={diet}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0f0f0] text-[#666] text-[10px] font-medium"
                          >
                            {getDietaryIcon(diet)}
                            {diet}
                          </span>
                        ))}
                        {item.prep_minutes && (
                          <span className="inline-flex items-center gap-1 text-[#888] text-[10px]">
                            <Clock className="h-3 w-3" />
                            {item.prep_minutes}m
                          </span>
                        )}
                        {item.calories && (
                          <span className="inline-flex items-center gap-1 text-[#888] text-[10px]">
                            <Flame className="h-3 w-3" />
                            {item.calories}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 bg-[#2d2d2d] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#3d3d3d] transition-colors z-40"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium text-sm">Feedback</span>
      </button>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md bg-white border-0 p-0 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              {/* Item Image/Video */}
              <div className="relative h-64 bg-[#f5f5f5]">
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
                  <div className="w-full h-full bg-gradient-to-br from-[#f0ebe3] to-[#e8e3db] flex items-center justify-center">
                    <span className="text-7xl">🍽️</span>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {selectedItem.is_new && (
                    <Badge className="bg-emerald-500 text-white">NEW</Badge>
                  )}
                  {selectedItem.featured && (
                    <Badge className="bg-amber-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Item Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-[#2d2d2d]">
                    {t('item', selectedItem.id, 'name', selectedItem.name)}
                  </h2>
                  <span className="text-2xl font-bold text-[#2d2d2d]">
                    {formatPrice(selectedItem.price, selectedItem.currency)}
                  </span>
                </div>

                {selectedItem.description && (
                  <p className="text-[#666] leading-relaxed">
                    {t('item', selectedItem.id, 'description', selectedItem.description)}
                  </p>
                )}

                {/* Quick Info */}
                <div className="flex items-center gap-4 text-sm text-[#888]">
                  {selectedItem.prep_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedItem.prep_minutes} min
                    </span>
                  )}
                  {selectedItem.calories && (
                    <span className="flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      {selectedItem.calories} cal
                    </span>
                  )}
                  {selectedItem.grams && (
                    <span>{selectedItem.grams}g</span>
                  )}
                </div>

                {/* Dietary Restrictions */}
                {selectedItem.dietary_restrictions && selectedItem.dietary_restrictions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.dietary_restrictions.map((diet) => (
                      <span
                        key={diet}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f0f0] text-[#555] text-sm font-medium"
                      >
                        {getDietaryIcon(diet)}
                        {diet}
                      </span>
                    ))}
                  </div>
                )}

                {/* Allergen Warnings */}
                {selectedItem.allergen_warnings && selectedItem.allergen_warnings.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-xl">
                    <p className="text-sm font-medium text-red-700 mb-2">Allergen Warning</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.allergen_warnings.map((allergen) => (
                        <span
                          key={allergen}
                          className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spice Level */}
                {selectedItem.spice_level && (
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span className="text-[#666]">Spice Level: {selectedItem.spice_level}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Language Modal */}
      <Dialog open={showLanguageMenu} onOpenChange={setShowLanguageMenu}>
        <DialogContent className="max-w-sm bg-white border-0 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#2d2d2d]">Select Language</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 mt-4">
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
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left',
                  language === lang.code
                    ? 'bg-[#2d2d2d] text-white'
                    : 'bg-[#f5f5f5] text-[#2d2d2d] hover:bg-[#e8e8e8]'
                )}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Info Modal */}
      <Dialog open={showGuestInfo} onOpenChange={setShowGuestInfo}>
        <DialogContent className="max-w-sm bg-white border-0 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#2d2d2d]">Guest Information</DialogTitle>
          </DialogHeader>
          {settings?.guest_info_html ? (
            <div
              className="prose max-w-none mt-4 text-[#555]"
              dangerouslySetInnerHTML={{ __html: settings.guest_info_html }}
            />
          ) : (
            <div className="text-center py-8 text-[#888]">
              <Info className="h-12 w-12 mx-auto mb-4 text-[#ccc]" />
              <p>No guest information available.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-sm bg-white border-0 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#2d2d2d]">Leave Feedback</DialogTitle>
          </DialogHeader>
          <FeedbackForm
            restaurantId={restaurant.id}
            onSuccess={() => setShowFeedback(false)}
          />
        </DialogContent>
      </Dialog>
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label className="text-[#555] font-medium">Your Rating</Label>
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
                  'h-8 w-8 transition-colors',
                  rating >= value
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="name" className="text-[#555] font-medium">Your Name (Optional)</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 rounded-xl border-[#e8e8e8] focus:border-[#2d2d2d] focus:ring-[#2d2d2d]"
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="comment" className="text-[#555] font-medium">Your Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 rounded-xl border-[#e8e8e8] focus:border-[#2d2d2d] focus:ring-[#2d2d2d]"
          rows={4}
          placeholder="Tell us about your experience..."
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded-xl py-3 font-medium"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  )
}
