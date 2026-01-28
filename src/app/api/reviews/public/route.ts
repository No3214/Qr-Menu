import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  isValidEmail,
  isValidRating,
  sanitizeComment,
  sanitizeName,
  checkRateLimit,
  getSecurityHeaders,
} from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`review:${ip}`, 10, 60000) // 10 reviews per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
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
    const { restaurant_id, rating, comment, full_name, phone, email } = body

    // Validate required fields
    if (!restaurant_id || rating === undefined) {
      return NextResponse.json(
        { error: 'Restoran ID ve puan zorunludur' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate rating (1-5)
    if (!isValidRating(rating)) {
      return NextResponse.json(
        { error: 'Puan 1-5 arasında olmalıdır' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      restaurant_id,
      rating,
      comment: comment ? sanitizeComment(comment) : null,
      full_name: full_name ? sanitizeName(full_name) : null,
      phone: phone ? sanitizeName(phone) : null,
      email: email ? email.toLowerCase().trim() : null,
      source: 'public_menu',
    }

    const supabase = createServiceClient()

    const { error } = await supabase.from('reviews').insert(sanitizedData)

    if (error) {
      console.error('Error inserting review:', error)
      return NextResponse.json(
        { error: 'Yorum gönderilemedi. Lütfen tekrar deneyin.' },
        { status: 500, headers: getSecurityHeaders() }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Yorumunuz için teşekkürler!' },
      { headers: getSecurityHeaders() }
    )
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
