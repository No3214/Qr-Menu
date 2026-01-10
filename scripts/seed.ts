import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('Starting seed...')

  // Create restaurant
  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .upsert({
      name: 'Kozbeyli Konağı',
      slug: 'kozbeyli-konagi',
      phone: '+90 555 123 4567',
      address: 'Kozbeyli Köyü, İzmir',
      default_currency: 'TRY',
      video_url: 'https://player.vimeo.com/external/459389137.hd.mp4?s=865f29c5e9c5f9e8c4a5e5e5e5e5e5e5e5e5e5e5&profile_id=175',
    }, {
      onConflict: 'slug',
    })
    .select()
    .single()

  if (restaurantError) {
    console.error('Error creating restaurant:', restaurantError)
    return
  }

  console.log('Restaurant created:', restaurant.name)

  // Create settings
  await supabase
    .from('restaurant_settings')
    .upsert({
      restaurant_id: restaurant.id,
      primary_language: 'tr',
      supported_languages: ['tr', 'en', 'de', 'ru'],
      ai_chat_enabled: true,
      guest_info_html: '<h2>Hoş Geldiniz!</h2><p>WiFi: KozbeyliKonagi2024</p><p>Şifre: misafir123</p>',
    }, {
      onConflict: 'restaurant_id',
    })

  // Create categories
  const categories = [
    { name: 'Başlangıçlar', description: 'Lezzetli başlangıç seçenekleri', sort_order: 0, image_url: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400' },
    { name: 'Ana Yemekler', description: 'Enfes ana yemeklerimiz', sort_order: 1, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
    { name: 'Izgara', description: 'Mangal ve ızgara çeşitleri', sort_order: 2, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', is_special: true },
    { name: 'Tatlılar', description: 'Ev yapımı tatlılarımız', sort_order: 3, image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
    { name: 'İçecekler', description: 'Soğuk ve sıcak içecekler', sort_order: 4, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
  ]

  const categoryIds: Record<string, string> = {}

  for (const cat of categories) {
    const { data, error } = await supabase
      .from('menu_categories')
      .upsert({
        ...cat,
        restaurant_id: restaurant.id,
      }, {
        onConflict: 'id',
      })
      .select()
      .single()

    if (data) {
      categoryIds[cat.name] = data.id
      console.log('Category created:', cat.name)
    }
  }

  // Create menu items
  const items = [
    // Başlangıçlar
    {
      category: 'Başlangıçlar',
      name: 'Mercimek Çorbası',
      description: 'Geleneksel ev yapımı mercimek çorbası, limon ve kruton ile',
      price: 85,
      calories: 180,
      grams: 300,
      prep_minutes: 10,
      dietary_restrictions: ['Vegan', 'Vejetaryen'],
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    },
    {
      category: 'Başlangıçlar',
      name: 'Humus',
      description: 'Tahin, limon ve zeytinyağı ile hazırlanan nohut ezmesi',
      price: 95,
      calories: 220,
      grams: 200,
      prep_minutes: 5,
      dietary_restrictions: ['Vegan', 'Vejetaryen', 'Glütensiz'],
      image_url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400',
    },
    {
      category: 'Başlangıçlar',
      name: 'Sigara Böreği',
      description: 'Çıtır yufka içinde beyaz peynir, maydanoz',
      price: 120,
      calories: 350,
      grams: 150,
      prep_minutes: 15,
      dietary_restrictions: ['Vejetaryen'],
      allergen_warnings: ['Glüten', 'Süt'],
      is_new: true,
      image_url: 'https://images.unsplash.com/photo-1628052995048-aa7e5f726e80?w=400',
    },
    // Ana Yemekler
    {
      category: 'Ana Yemekler',
      name: 'Kuru Fasulye',
      description: 'Geleneksel Türk kuru fasulyesi, pilav ile servis edilir',
      price: 145,
      calories: 450,
      grams: 400,
      prep_minutes: 20,
      dietary_restrictions: ['Vegan'],
      featured: true,
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    },
    {
      category: 'Ana Yemekler',
      name: 'İskender Kebap',
      description: 'Döner, tereyağlı domates sosu, yoğurt ve pide ile',
      price: 285,
      calories: 850,
      grams: 350,
      prep_minutes: 15,
      allergen_warnings: ['Glüten', 'Süt'],
      featured: true,
      image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400',
    },
    {
      category: 'Ana Yemekler',
      name: 'Mantı',
      description: 'El yapımı Türk mantısı, sarımsaklı yoğurt ve tereyağlı sos ile',
      price: 165,
      calories: 550,
      grams: 300,
      prep_minutes: 25,
      allergen_warnings: ['Glüten', 'Süt'],
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    },
    // Izgara
    {
      category: 'Izgara',
      name: 'Kuzu Pirzola',
      description: '4 parça kuzu pirzola, közlenmiş sebzeler ile',
      price: 450,
      calories: 650,
      grams: 300,
      prep_minutes: 20,
      spice_level: 'Hafif Acı',
      featured: true,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76978a5edf1?w=400',
    },
    {
      category: 'Izgara',
      name: 'Adana Kebap',
      description: 'Baharat karışımı ile hazırlanan acılı kebap, közlenmiş domates ve biber',
      price: 245,
      calories: 580,
      grams: 250,
      prep_minutes: 15,
      spice_level: 'Acı',
      allergen_warnings: ['Glüten'],
      image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
    },
    {
      category: 'Izgara',
      name: 'Tavuk Kanat',
      description: 'Baharatlı tavuk kanatları, ranch sos ile',
      price: 145,
      calories: 420,
      grams: 250,
      prep_minutes: 20,
      spice_level: 'Orta Acı',
      is_new: true,
      image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    },
    // Tatlılar
    {
      category: 'Tatlılar',
      name: 'Künefe',
      description: 'Sıcak servis edilen peynirli künefe, antep fıstığı ile',
      price: 165,
      calories: 480,
      grams: 200,
      prep_minutes: 15,
      allergen_warnings: ['Glüten', 'Süt', 'Kabuklu Yemişler'],
      featured: true,
      image_url: 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=400',
    },
    {
      category: 'Tatlılar',
      name: 'Sütlaç',
      description: 'Geleneksel fırın sütlaç, tarçın ile',
      price: 85,
      calories: 280,
      grams: 180,
      prep_minutes: 5,
      dietary_restrictions: ['Vejetaryen', 'Glütensiz'],
      allergen_warnings: ['Süt'],
      image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    },
    // İçecekler
    {
      category: 'İçecekler',
      name: 'Türk Kahvesi',
      description: 'Geleneksel Türk kahvesi, lokum ile',
      price: 55,
      calories: 10,
      grams: 80,
      prep_minutes: 5,
      dietary_restrictions: ['Vegan', 'Glütensiz'],
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    },
    {
      category: 'İçecekler',
      name: 'Ayran',
      description: 'Ev yapımı geleneksel ayran',
      price: 35,
      calories: 120,
      grams: 300,
      prep_minutes: 2,
      dietary_restrictions: ['Vejetaryen', 'Glütensiz'],
      allergen_warnings: ['Süt'],
      image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    },
    {
      category: 'İçecekler',
      name: 'Limonata',
      description: 'Taze sıkılmış ev yapımı limonata, nane ile',
      price: 45,
      calories: 80,
      grams: 350,
      prep_minutes: 3,
      dietary_restrictions: ['Vegan', 'Glütensiz'],
      image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    },
  ]

  for (const item of items) {
    const categoryId = categoryIds[item.category]
    if (!categoryId) continue

    const { category, ...itemData } = item

    await supabase
      .from('menu_items')
      .insert({
        ...itemData,
        restaurant_id: restaurant.id,
        category_id: categoryId,
        currency: 'TRY',
        dietary_restrictions: itemData.dietary_restrictions || [],
        allergen_warnings: itemData.allergen_warnings || [],
        lifestyle_options: [],
        ingredient_source: [],
        special_features: [],
        is_available: true,
        is_new: itemData.is_new || false,
        featured: itemData.featured || false,
      })

    console.log('Item created:', item.name)
  }

  // Create sample reviews
  const reviews = [
    { full_name: 'Ahmet Yılmaz', rating: 5, comment: 'Harika bir mekan! Yemekler çok lezzetli, servis mükemmel.' },
    { full_name: 'Ayşe Demir', rating: 4, comment: 'Güzel atmosfer, yemekler taze ve lezzetli. Tekrar geleceğim.' },
    { full_name: 'Mehmet Kaya', rating: 5, comment: 'İskender muhteşemdi! Kesinlikle tavsiye ederim.' },
  ]

  for (const review of reviews) {
    await supabase
      .from('reviews')
      .insert({
        ...review,
        restaurant_id: restaurant.id,
        source: 'manual',
      })
    console.log('Review created by:', review.full_name)
  }

  console.log('Seed completed successfully!')
}

seed().catch(console.error)
