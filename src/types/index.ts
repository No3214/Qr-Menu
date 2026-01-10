export * from './database'

export interface SessionUser {
  id: string
  email: string
  restaurant_id: string
  restaurant_name: string
  restaurant_slug: string
  role: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface AnalyticsMetrics {
  total_clicks: number
  total_views: number
  total_sessions: number
  qr_scans: number
  top_clicked_items: { entity_id: string; name: string; count: number }[]
  top_viewed_categories: { entity_id: string; name: string; count: number }[]
  least_viewed: { entity_id: string; name: string; count: number; type: string }[]
  avg_time_spent: number
  device_breakdown: { device_type: string; count: number }[]
  platform_breakdown: { platform: string; count: number }[]
  traffic_sources: { entrypoint: string; count: number }[]
  busy_hours: { hour: number; count: number }[]
  busy_days: { day: number; count: number }[]
}

export type DateRange = '7d' | '30d' | '90d'

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'az', name: 'Azərbaycanca', flag: '🇦🇿' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
] as const

export const DIETARY_RESTRICTIONS = [
  'Vegan',
  'Vejetaryen',
  'Glütensiz',
  'Laktozsuz',
  'Helal',
  'Koşer',
] as const

export const ALLERGEN_WARNINGS = [
  'Glüten',
  'Kabuklu Deniz Ürünleri',
  'Yumurta',
  'Balık',
  'Yer Fıstığı',
  'Soya',
  'Süt',
  'Kabuklu Yemişler',
  'Kereviz',
  'Hardal',
  'Susam',
  'Kükürt Dioksit',
  'Acı Bakla',
  'Yumuşakçalar',
] as const

export const LIFESTYLE_OPTIONS = [
  'Organik',
  'Yerel Ürün',
  'Mevsimlik',
  'Ev Yapımı',
  'Doğal',
] as const

export const SPICE_LEVELS = [
  'Acısız',
  'Hafif Acı',
  'Orta Acı',
  'Acı',
  'Çok Acı',
] as const
