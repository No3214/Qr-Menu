import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')
  const lang = searchParams.get('lang') || 'tr'

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  // Use service role to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get restaurant
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (restaurantError || !restaurant) {
    console.error('Restaurant error:', restaurantError)
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  // Get settings
  const { data: settings } = await supabase
    .from('restaurant_settings')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .single()

  // Get categories
  const { data: categories, error: categoriesError } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('sort_order')

  if (categoriesError) {
    console.error('Categories error:', categoriesError)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }

  // Get items for each category
  const { data: allItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_available', true)
    .order('sort_order')

  // Attach items to categories
  const processedCategories = categories?.map(category => ({
    ...category,
    items: allItems?.filter(item => item.category_id === category.id) || [],
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

  return NextResponse.json({
    restaurant,
    settings,
    categories: processedCategories,
    translations,
    events: [],
  })
}
