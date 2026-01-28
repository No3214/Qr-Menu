'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Heart,
  Share2,
  Bell,
  Moon,
  Sun,
  Leaf,
  Flame,
  X,
  Check,
  MessageCircle,
  Phone,
  Wifi,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dietary filter badges
export const DIETARY_FILTERS = [
  { id: 'vegetarian', label: 'Vejetaryen', icon: Leaf, color: 'bg-green-500' },
  { id: 'vegan', label: 'Vegan', icon: Leaf, color: 'bg-green-600' },
  { id: 'gluten_free', label: 'Glutensiz', icon: AlertTriangle, color: 'bg-yellow-500' },
  { id: 'spicy', label: 'Acılı', icon: Flame, color: 'bg-red-500' },
  { id: 'halal', label: 'Helal', icon: Check, color: 'bg-emerald-500' },
] as const

// Search bar component
export function SearchBar({
  value,
  onChange,
  placeholder = 'Menüde ara...',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  )
}

// Dietary filter chips
export function DietaryFilters({
  activeFilters,
  onToggle,
}: {
  activeFilters: string[]
  onToggle: (filterId: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 -mx-4 px-4">
      {DIETARY_FILTERS.map((filter) => {
        const isActive = activeFilters.includes(filter.id)
        const Icon = filter.icon
        return (
          <button
            key={filter.id}
            onClick={() => onToggle(filter.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
              isActive
                ? `${filter.color} text-white shadow-md scale-105`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

// Dark mode toggle
export function DarkModeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
      aria-label={isDark ? 'Açık moda geç' : 'Koyu moda geç'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  )
}

// Favorites button
export function FavoriteButton({
  itemId,
  isFavorite,
  onToggle,
}: {
  itemId: string
  isFavorite: boolean
  onToggle: (itemId: string) => void
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onToggle(itemId)
      }}
      className={cn(
        'p-2 rounded-full transition-all duration-300',
        isFavorite
          ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500'
      )}
    >
      <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
    </button>
  )
}

// Share modal
export function ShareModal({
  isOpen,
  onClose,
  url,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      url: '#',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 animate-backdrop-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Paylaş</h3>

        {/* Share buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110',
                link.color
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <link.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Copy link */}
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-gray-400 truncate">
            {url}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-all',
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
            )}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

// Call waiter modal
export function CallWaiterModal({
  isOpen,
  onClose,
  tableNumber,
  onCall,
}: {
  isOpen: boolean
  onClose: () => void
  tableNumber?: string
  onCall: (request: string) => void
}) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const requests = [
    { id: 'waiter', label: 'Garson Çağır', icon: Bell },
    { id: 'bill', label: 'Hesap İste', icon: Clock },
    { id: 'water', label: 'Su İste', icon: Wifi },
    { id: 'help', label: 'Yardım', icon: MessageCircle },
  ]

  const handleSend = async () => {
    if (!selectedRequest) return
    setSending(true)
    await onCall(selectedRequest)
    setSending(false)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 animate-backdrop-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {sent ? (
          <div className="text-center py-8 animate-bounce-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">İsteğiniz İletildi!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">En kısa sürede size yardımcı olacağız.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Garson Çağır</h3>
            {tableNumber && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Masa: {tableNumber}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {requests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request.id)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200',
                    selectedRequest === request.id
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <request.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{request.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleSend}
              disabled={!selectedRequest || sending}
              className={cn(
                'w-full py-4 rounded-xl font-semibold transition-all duration-200',
                selectedRequest
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              )}
            >
              {sending ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// Restaurant info card
export function RestaurantInfoCard({
  restaurant,
  isExpanded,
  onToggle,
}: {
  restaurant: {
    name: string
    description?: string
    address?: string
    phone?: string
    wifi_password?: string
    opening_hours?: string
  }
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900 dark:text-white">Restoran Bilgileri</span>
        <div
          className={cn(
            'transform transition-transform duration-300',
            isExpanded ? 'rotate-180' : ''
          )}
        >
          <Filter className="w-5 h-5 text-gray-500" />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-expand">
          {restaurant.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.address}</p>
            </div>
          )}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{restaurant.phone}</span>
            </a>
          )}
          {restaurant.wifi_password && (
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">WiFi Şifresi</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">
                  {restaurant.wifi_password}
                </p>
              </div>
            </div>
          )}
          {restaurant.opening_hours && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.opening_hours}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Allergen badge
export function AllergenBadge({ allergen }: { allergen: string }) {
  const allergenMap: Record<string, { label: string; color: string }> = {
    gluten: { label: 'Gluten', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
    dairy: { label: 'Süt', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    nuts: { label: 'Kuruyemiş', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    eggs: { label: 'Yumurta', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    seafood: { label: 'Deniz Ürünü', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
    soy: { label: 'Soya', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  }

  const info = allergenMap[allergen] || { label: allergen, color: 'bg-gray-100 text-gray-800' }

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', info.color)}>
      {info.label}
    </span>
  )
}

// Item dietary badges
export function DietaryBadges({ restrictions }: { restrictions: string[] }) {
  if (!restrictions?.length) return null

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {restrictions.map((r) => {
        const filter = DIETARY_FILTERS.find((f) => f.id === r)
        if (!filter) return null
        const Icon = filter.icon
        return (
          <span
            key={r}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white',
              filter.color
            )}
          >
            <Icon className="w-3 h-3" />
            {filter.label}
          </span>
        )
      })}
    </div>
  )
}

// Floating action buttons
export function FloatingActions({
  onCallWaiter,
  onShare,
  onScrollTop,
  showScrollTop,
}: {
  onCallWaiter: () => void
  onShare: () => void
  onScrollTop: () => void
  showScrollTop: boolean
}) {
  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-2 z-40">
      {showScrollTop && (
        <button
          onClick={onScrollTop}
          className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce-in"
        >
          <Filter className="w-5 h-5 rotate-180" />
        </button>
      )}
      <button
        onClick={onShare}
        className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button
        onClick={onCallWaiter}
        className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-pulse-glow"
      >
        <Bell className="w-5 h-5" />
      </button>
    </div>
  )
}

// Quick stats for time/price
export function QuickInfo({
  prepTime,
  calories,
  portion,
}: {
  prepTime?: number
  calories?: number
  portion?: string
}) {
  if (!prepTime && !calories && !portion) return null

  return (
    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
      {prepTime && (
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {prepTime} dk
        </span>
      )}
      {calories && (
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" />
          {calories} kcal
        </span>
      )}
      {portion && (
        <span className="flex items-center gap-1">
          {portion}
        </span>
      )}
    </div>
  )
}
