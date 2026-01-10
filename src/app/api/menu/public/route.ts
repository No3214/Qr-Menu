import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')
  const lang = searchParams.get('lang') || 'tr'

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Get restaurant
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  // Get settings
  const { data: settings } = await supabase
    .from('restaurant_settings')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .single()

  // Get categories with items
  const { data: categories, error: categoriesError } = await supabase
    .from('menu_categories')
    .select(`
      *,
      items:menu_items(
        *,
        options:menu_item_options(*)
      ),
      subcategories:menu_subcategories(*)
    `)
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('sort_order')

  if (categoriesError) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }

  // Filter active items and sort
  const processedCategories = categories?.map(category => ({
    ...category,
    items: category.items
      ?.filter((item: { is_available: boolean }) => item.is_available)
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    subcategories: category.subcategories
      ?.filter((sub: { is_active: boolean }) => sub.is_active)
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  })) || []

  // Get translations if language is not primary
  let translations: Record<string, Record<string, string>> = {}
  if (lang !== settings?.primary_language) {
    const { data: translationData } = await supabase
      .from('translations')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('language_code', lang)

    if (translationData) {
      translationData.forEach(t => {
        const key = `${t.entity_type}_${t.entity_id}`
        if (!translations[key]) {
          translations[key] = {}
        }
        translations[key][t.field_name] = t.translated_text
      })
    }
  }

  // Get featured events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('status', 'published')
    .gte('end_at', new Date().toISOString())
    .order('start_at')
    .limit(5)

  return NextResponse.json({
    restaurant,
    settings,
    categories: processedCategories,
    translations,
    events: events || [],
  })
}
