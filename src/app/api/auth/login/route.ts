import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  isValidEmail,
  checkRateLimit,
  getSecurityHeaders,
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
    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60000) // 10 attempts per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla giriş denemesi. Lütfen 1 dakika bekleyin.' },
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
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Check if Supabase is available
    const supabaseAvailable = await isSupabaseAvailable()

    if (!supabaseAvailable) {
      // Use mock auth for local development
      console.log('Supabase unavailable, using mock auth for login')

      const { session, error } = await mockAuth.signIn(email, password)

      if (error || !session) {
        return NextResponse.json(
          { error: 'E-posta veya şifre hatalı' },
          { status: 401, headers: getSecurityHeaders() }
        )
      }

      // Get restaurant for this user
      const restaurant = mockAuth.getRestaurantByUserId(session.user.id)

      return NextResponse.json(
        {
          success: true,
          message: 'Giriş başarılı!',
          user: session.user,
          session: {
            access_token: session.access_token,
            expires_at: session.expires_at,
          },
          restaurant: restaurant ? {
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
          } : null,
          mode: 'development',
        },
        { headers: getSecurityHeaders() }
      )
    }

    // Use Supabase for production
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      let errorMessage = 'Giriş başarısız'

      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'E-posta veya şifre hatalı'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'E-posta adresiniz henüz doğrulanmamış'
      } else if (error.message.includes('fetch failed') || error.message.includes('network')) {
        errorMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.'
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: 'Giriş yapılamadı' },
        { status: 500, headers: getSecurityHeaders() }
      )
    }

    // Get user's restaurant
    const { data: restaurantUser } = await supabase
      .from('restaurant_users')
      .select('restaurant_id, restaurants(id, name, slug)')
      .eq('auth_user_id', data.user.id)
      .single()

    return NextResponse.json(
      {
        success: true,
        message: 'Giriş başarılı!',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: {
          access_token: data.session.access_token,
          expires_at: data.session.expires_at,
        },
        restaurant: restaurantUser?.restaurants || null,
      },
      { headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
