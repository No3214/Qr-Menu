'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Globe,
  Star,
  Clock,
  Flame,
  Leaf,
  Info,
  MessageSquare,
  X,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
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
  const [language, setLanguage] = useState('tr')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showGuestInfo, setShowGuestInfo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const categoryTabsRef = useRef<HTMLDivElement>(null)

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
        if (menuData.categories?.[0]) {
          setSelectedCategory(menuData.categories[0].id)
        }
      } catch (e) {
        setError('Menü bulunamadı')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Menü Bulunamadı</h1>
          <p className="text-gray-400">Bu restoran için menü mevcut değil.</p>
        </div>
      </div>
    )
  }

  const { restaurant, settings, categories, events } = data
  const currentCategory = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Video */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        {restaurant.video_url ? (
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
        ) : restaurant.cover_image_url ? (
          <Image
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {restaurant.video_url && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setShowLanguageMenu(true)}
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setShowGuestInfo(true)}
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          {restaurant.logo_url && (
            <div className="w-16 h-16 rounded-full bg-white p-1 mb-4">
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
          {restaurant.address && (
            <p className="text-gray-300 text-sm">{restaurant.address}</p>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div
        ref={categoryTabsRef}
        className="sticky top-0 z-20 bg-black border-b border-gray-800 category-tabs"
      >
        <div className="flex overflow-x-auto py-3 px-4 gap-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                'category-tab flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
              onClick={() => {
                setSelectedCategory(category.id)
                trackEvent('category_view', 'category', category.id)
              }}
            >
              {t('category', category.id, 'name', category.name)}
              {category.is_special && (
                <Badge variant="secondary" className="ml-2">Özel</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 pb-24">
        {currentCategory && (
          <div className="animate-fade-in">
            {currentCategory.description && (
              <p className="text-gray-400 mb-4">
                {t('category', currentCategory.id, 'description', currentCategory.description)}
              </p>
            )}

            <div className="grid gap-4">
              {currentCategory.items?.map((item) => (
                <Card
                  key={item.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => {
                    setSelectedItem(item)
                    trackEvent('item_click', 'item', item.id)
                  }}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Item Image/Video */}
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
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <span className="text-3xl">🍽️</span>
                          </div>
                        )}
                        {item.is_new && (
                          <Badge className="absolute top-2 left-2 bg-green-500">Yeni</Badge>
                        )}
                        {item.featured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500">
                            <Star className="h-3 w-3 mr-1" />
                            Öne Çıkan
                          </Badge>
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-white">
                              {t('item', item.id, 'name', item.name)}
                            </h3>
                            <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          </div>
                          {item.description && (
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {t('item', item.id, 'description', item.description)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            {item.prep_minutes && (
                              <span className="flex items-center text-xs text-gray-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.prep_minutes} dk
                              </span>
                            )}
                            {item.calories && (
                              <span className="flex items-center text-xs text-gray-400">
                                <Flame className="h-3 w-3 mr-1" />
                                {item.calories} kcal
                              </span>
                            )}
                            {item.dietary_restrictions?.includes('Vegan') && (
                              <Leaf className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <span className="font-bold text-primary">
                            {formatPrice(item.price, item.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Feedback Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-30"
        size="lg"
        onClick={() => setShowFeedback(true)}
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Geri Bildirim
      </Button>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-auto">
          {selectedItem && (
            <>
              <div className="relative h-64 -mx-6 -mt-6 mb-4">
                {selectedItem.video_url ? (
                  <video
                    autoPlay
                    loop
                    muted
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
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}
              </div>

              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {t('item', selectedItem.id, 'name', selectedItem.name)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-gray-300">
                  {t('item', selectedItem.id, 'description', selectedItem.description || '')}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  {selectedItem.prep_minutes && (
                    <span className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedItem.prep_minutes} dakika
                    </span>
                  )}
                  {selectedItem.calories && (
                    <span className="flex items-center text-gray-400">
                      <Flame className="h-4 w-4 mr-1" />
                      {selectedItem.calories} kcal
                    </span>
                  )}
                  {selectedItem.grams && (
                    <span className="text-gray-400">{selectedItem.grams}g</span>
                  )}
                </div>

                {selectedItem.dietary_restrictions?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Diyet Bilgisi:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.dietary_restrictions.map((diet) => (
                        <Badge key={diet} variant="secondary">{diet}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.allergen_warnings?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Alerjen Uyarıları:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.allergen_warnings.map((allergen) => (
                        <Badge key={allergen} variant="destructive">{allergen}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.spice_level && (
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{selectedItem.spice_level}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-800">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(selectedItem.price, selectedItem.currency)}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Language Modal */}
      <Dialog open={showLanguageMenu} onOpenChange={setShowLanguageMenu}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Dil Seçimi</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {SUPPORTED_LANGUAGES.filter(
              l => settings?.supported_languages?.includes(l.code)
            ).map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? 'default' : 'ghost'}
                className="justify-start"
                onClick={() => {
                  setLanguage(lang.code)
                  setShowLanguageMenu(false)
                }}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Guest Info Modal */}
      <Dialog open={showGuestInfo} onOpenChange={setShowGuestInfo}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Misafir Bilgileri</DialogTitle>
          </DialogHeader>
          {settings?.guest_info_html ? (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: settings.guest_info_html }}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Info className="h-12 w-12 mx-auto mb-4" />
              <p>Henüz misafir bilgisi eklenmemiş.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Geri Bildirim</DialogTitle>
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Puanınız</Label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={cn(
                'w-10 h-10 rounded-full transition-colors',
                rating >= value
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              )}
            >
              <Star className="h-5 w-5 mx-auto" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="name">Adınız (Opsiyonel)</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 border-gray-700 mt-1"
        />
      </div>
      <div>
        <Label htmlFor="comment">Yorumunuz</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-gray-800 border-gray-700 mt-1"
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </Button>
    </form>
  )
}
