import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  isValidEmail,
  isValidPassword,
  isValidSlug,
  sanitizeName,
  checkRateLimit,
  getSecurityHeaders,
  slugify,
} from '@/lib/utils'
import { mockAuth } from '@/lib/mock-auth'

// Check if Supabase is available
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return false

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(`${url}/rest/v1/`, {
      method: 'HEAD',
      signal: controller.signal,
    }).catch(() => null)

    clearTimeout(timeoutId)
    return response !== null
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`register:${ip}`, 5, 300000) // 5 registrations per 5 minutes

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla kayıt denemesi. Lütfen 5 dakika bekleyin.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
            ...getSecurityHeaders(),
          },
        }
      )
    }

    const body = await request.json()
    let { email, password, restaurantName, slug } = body

    // Validate required fields
    if (!email || !password || !restaurantName || !slug) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Sanitize inputs
    email = email.toLowerCase().trim()
    restaurantName = sanitizeName(restaurantName)
    slug = slugify(slug)

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate password strength
    const passwordCheck = isValidPassword(password)
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: passwordCheck.message },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate restaurant name
    if (restaurantName.length < 2 || restaurantName.length > 100) {
      return NextResponse.json(
        { error: 'Restoran adı 2-100 karakter arasında olmalıdır' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate slug
    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: 'Geçersiz URL. Sadece küçük harf, rakam ve tire kullanın (3-50 karakter)' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Check if Supabase is available
    const supabaseAvailable = await isSupabaseAvailable()

    if (!supabaseAvailable) {
      // Use mock auth for local development
      console.log('Supabase unavailable, using mock auth')

      // Check if slug exists
      const existingRestaurant = mockAuth.getRestaurantBySlug(slug)
      if (existingRestaurant) {
        return NextResponse.json(
          { error: 'Bu URL zaten kullanılıyor. Başka bir URL deneyin.' },
          { status: 400, headers: getSecurityHeaders() }
        )
      }

      // Create user
      const { user, error: userError } = await mockAuth.createUser(email, password)
      if (userError || !user) {
        const errorMessage = userError?.includes('already registered')
          ? 'Bu e-posta adresi zaten kayıtlı'
          : 'Hesap oluşturulamadı'
        return NextResponse.json(
          { error: errorMessage },
          { status: 400, headers: getSecurityHeaders() }
        )
      }

      // Create restaurant
      const { restaurant, error: restaurantError } = await mockAuth.createRestaurant(
        restaurantName,
        slug,
        user.id
      )

      if (restaurantError || !restaurant) {
        mockAuth.deleteUser(user.id)
        return NextResponse.json(
          { error: 'Restoran oluşturulamadı. Lütfen tekrar deneyin.' },
          { status: 500, headers: getSecurityHeaders() }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.',
          user: {
            id: user.id,
            email: user.email,
          },
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
          },
          mode: 'development', // Indicate this is mock mode
        },
        { headers: getSecurityHeaders() }
      )
    }

    // Use Supabase for production
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check if slug is already taken
    const { data: existingRestaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'Bu URL zaten kullanılıyor. Başka bir URL deneyin.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error('Auth error:', authError)

      // User-friendly error messages
      let errorMessage = 'Hesap oluşturulamadı'
      let statusCode = 400

      if (authError.message.includes('already registered')) {
        errorMessage = 'Bu e-posta adresi zaten kayıtlı'
      } else if (authError.message.includes('fetch failed') || authError.message.includes('network')) {
        errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.'
        statusCode = 503
      } else if (authError.message.includes('Invalid API key')) {
        errorMessage = 'Sistem yapılandırma hatası. Lütfen yönetici ile iletişime geçin.'
        statusCode = 500
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode, headers: getSecurityHeaders() }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Kullanıcı oluşturulamadı' },
        { status: 500, headers: getSecurityHeaders() }
      )
    }

    // 2. Create restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        name: restaurantName,
        slug,
      })
      .select()
      .single()

    if (restaurantError) {
      console.error('Restaurant error:', restaurantError)
      // Clean up: delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Restoran oluşturulamadı. Lütfen tekrar deneyin.' },
        { status: 500, headers: getSecurityHeaders() }
      )
    }

    // 3. Link user to restaurant
    const { error: linkError } = await supabase
      .from('restaurant_users')
      .insert({
        restaurant_id: restaurant.id,
        auth_user_id: authData.user.id,
        role: 'owner',
      })

    if (linkError) {
      console.error('Link error:', linkError)
      // Clean up
      await supabase.from('restaurants').delete().eq('id', restaurant.id)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Hesap bağlantısı kurulamadı. Lütfen tekrar deneyin.' },
        { status: 500, headers: getSecurityHeaders() }
      )
    }

    // 4. Create default settings
    const { error: settingsError } = await supabase
      .from('restaurant_settings')
      .insert({
        restaurant_id: restaurant.id,
        supported_languages: ['tr', 'en'],
      })

    if (settingsError) {
      console.error('Settings error:', settingsError)
      // Continue anyway, settings can be created later
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
      },
      { headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
