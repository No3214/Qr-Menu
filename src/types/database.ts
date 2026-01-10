export interface Restaurant {
  id: string
  name: string
  slug: string
  logo_url: string | null
  cover_image_url: string | null
  video_url: string | null
  phone: string | null
  address: string | null
  default_currency: string
  created_at: string
}

export interface RestaurantUser {
  id: string
  restaurant_id: string
  auth_user_id: string
  role: 'owner' | 'admin' | 'staff'
  created_at: string
}

export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  is_special: boolean
  created_at: string
}

export interface MenuSubcategory {
  id: string
  category_id: string
  name: string
  sort_order: number
  is_active: boolean
}

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string
  subcategory_id: string | null
  name: string
  description: string | null
  price: number
  currency: string
  image_url: string | null
  video_url: string | null
  featured: boolean
  calories: number | null
  grams: number | null
  prep_minutes: number | null
  dietary_restrictions: string[]
  allergen_warnings: string[]
  nutrition_facts: string[]
  lifestyle_options: string[]
  spice_level: string | null
  ingredient_source: string[]
  special_features: string[]
  is_available: boolean
  is_new: boolean
  sort_order: number
  created_at: string
}

export interface MenuItemOption {
  id: string
  menu_item_id: string
  name: string
  extra_price: number
  currency: string
  is_enabled: boolean
  sort_order: number
}

export interface Recommendation {
  id: string
  restaurant_id: string
  source_item_id: string
  target_item_id: string
  note: string | null
  created_at: string
}

export interface Translation {
  id: string
  restaurant_id: string
  entity_type: string
  entity_id: string
  language_code: string
  field_name: string
  translated_text: string
  created_at: string
}

export interface Review {
  id: string
  restaurant_id: string
  full_name: string | null
  phone: string | null
  email: string | null
  comment: string | null
  rating: number
  source: string
  created_at: string
}

export interface Event {
  id: string
  restaurant_id: string
  title: string
  description: string | null
  media_url: string | null
  price: number | null
  currency: string
  capacity: number | null
  start_at: string
  end_at: string
  operation_type: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  rules: string[]
  payment_policy: string | null
  cancel_policy: string | null
  placement_mode: 'special_category' | 'in_category'
  event_category_name: string | null
  position_after_category_id: string | null
  theme_color: string | null
  menu_enabled: boolean
  menu_name: string | null
  menu_price: number | null
  menu_price_type: string
  menu_category_ids: string[]
  status: 'draft' | 'published'
  created_at: string
}

export interface EventReservation {
  id: string
  restaurant_id: string
  event_id: string
  full_name: string
  email: string | null
  phone: string | null
  party_size: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  restaurant_id: string
  event_type: string
  entity_type: string | null
  entity_id: string | null
  qr_entrypoint: string | null
  session_id: string | null
  device_type: string | null
  platform: string | null
  user_agent: string | null
  created_at: string
}

export interface RestaurantSettings {
  restaurant_id: string
  primary_language: string
  supported_languages: string[]
  guest_info_html: string | null
  ai_chat_enabled: boolean
  ai_chat_monthly_quota: number
  ai_chat_used: number
  pdf_paper_size: string
  pdf_font_size: number
  pdf_font_style: string
  theme: Record<string, unknown>
  updated_at: string
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[]
  subcategories?: MenuSubcategory[]
}

export interface MenuItemWithOptions extends MenuItem {
  options: MenuItemOption[]
}
