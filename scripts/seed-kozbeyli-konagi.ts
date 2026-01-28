/**
 * Seed Script for Kozbeyli Konağı Menu
 *
 * Usage: npx ts-node scripts/seed-kozbeyli-konagi.ts
 *
 * Make sure to set these environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { KOZBEYLI_KONAGI_DATA } from '../src/data/kozbeyli-konagi-menu'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedKozbeyliKonagi() {
  console.log('🚀 Starting Kozbeyli Konağı seed...')

  const { restaurant, settings, categories } = KOZBEYLI_KONAGI_DATA

  try {
    // 1. Check if restaurant already exists
    const { data: existingRestaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', restaurant.slug)
      .single()

    let restaurantId: string

    if (existingRestaurant) {
      console.log('📍 Restaurant already exists, updating...')
      restaurantId = existingRestaurant.id

      // Update restaurant
      await supabase
        .from('restaurants')
        .update({
          name: restaurant.name,
          description: restaurant.description,
        })
        .eq('id', restaurantId)

      // Delete existing categories and items for fresh seed
      await supabase.from('menu_items').delete().eq('restaurant_id', restaurantId)
      await supabase.from('menu_categories').delete().eq('restaurant_id', restaurantId)

      console.log('🧹 Cleared existing menu data')
    } else {
      // Create new restaurant
      const { data: newRestaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: restaurant.name,
          slug: restaurant.slug,
          description: restaurant.description,
        })
        .select()
        .single()

      if (restaurantError) {
        throw new Error(`Failed to create restaurant: ${restaurantError.message}`)
      }

      restaurantId = newRestaurant.id
      console.log('✅ Created restaurant:', restaurant.name)
    }

    // 2. Update or create settings
    const { error: settingsError } = await supabase
      .from('restaurant_settings')
      .upsert({
        restaurant_id: restaurantId,
        supported_languages: settings.supported_languages,
        currency: settings.currency,
        primary_color: settings.primary_color,
      })

    if (settingsError) {
      console.warn('⚠️ Settings error:', settingsError.message)
    } else {
      console.log('✅ Settings configured')
    }

    // 3. Create categories and items
    let totalItems = 0

    for (const category of categories) {
      // Create category
      const { data: newCategory, error: categoryError } = await supabase
        .from('menu_categories')
        .insert({
          restaurant_id: restaurantId,
          name: category.name,
          sort_order: category.sort_order,
        })
        .select()
        .single()

      if (categoryError) {
        console.error(`❌ Failed to create category ${category.name}:`, categoryError.message)
        continue
      }

      console.log(`📁 Created category: ${category.name}`)

      // Create translations for category
      await supabase.from('translations').insert({
        restaurant_id: restaurantId,
        entity_type: 'category',
        entity_id: newCategory.id,
        language_code: 'en',
        field: 'name',
        value: category.name_en,
      })

      // Create items for this category
      for (const item of category.items) {
        // Type assertion for optional fields
        const itemWithOptional = item as typeof item & {
          image_url?: string
          video_url?: string
          dietary_restrictions?: string[]
          prep_minutes?: number
        }

        const { data: newItem, error: itemError } = await supabase
          .from('menu_items')
          .insert({
            restaurant_id: restaurantId,
            category_id: newCategory.id,
            name: item.name,
            description: item.description,
            price: item.price,
            sort_order: item.sort_order,
            image_url: itemWithOptional.image_url ?? null,
            video_url: itemWithOptional.video_url ?? null,
            dietary_restrictions: itemWithOptional.dietary_restrictions ?? [],
            prep_minutes: itemWithOptional.prep_minutes ?? null,
            is_available: true,
          })
          .select()
          .single()

        if (itemError) {
          console.error(`  ❌ Failed to create item ${item.name}:`, itemError.message)
          continue
        }

        // Create translations for item
        await supabase.from('translations').insert([
          {
            restaurant_id: restaurantId,
            entity_type: 'item',
            entity_id: newItem.id,
            language_code: 'en',
            field: 'name',
            value: item.name_en,
          },
          {
            restaurant_id: restaurantId,
            entity_type: 'item',
            entity_id: newItem.id,
            language_code: 'en',
            field: 'description',
            value: item.description_en,
          },
        ])

        totalItems++
      }
    }

    console.log('')
    console.log('🎉 Seed completed successfully!')
    console.log(`   Restaurant: ${restaurant.name}`)
    console.log(`   Categories: ${categories.length}`)
    console.log(`   Items: ${totalItems}`)
    console.log('')
    console.log(`🔗 View menu at: /r/${restaurant.slug}`)

  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed
seedKozbeyliKonagi()
