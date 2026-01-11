import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, restaurantName, slug } = await request.json()

    if (!email || !password || !restaurantName || !slug) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      )
    }

    // Use service role to bypass RLS
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

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Kullanıcı oluşturulamadı' },
        { status: 500 }
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
        { error: 'Restoran oluşturulamadı: ' + restaurantError.message },
        { status: 500 }
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
        { error: 'Kullanıcı bağlanamadı: ' + linkError.message },
        { status: 500 }
      )
    }

    // 4. Create default settings
    const { error: settingsError } = await supabase
      .from('restaurant_settings')
      .insert({
        restaurant_id: restaurant.id,
      })

    if (settingsError) {
      console.error('Settings error:', settingsError)
      // Continue anyway, settings can be created later
    }

    return NextResponse.json({
      success: true,
      message: 'Hesap başarıyla oluşturuldu',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}
