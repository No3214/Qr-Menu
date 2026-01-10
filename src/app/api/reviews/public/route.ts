import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant_id, rating, comment, full_name, phone, email } = body

    if (!restaurant_id || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { error } = await supabase.from('reviews').insert({
      restaurant_id,
      rating,
      comment,
      full_name,
      phone,
      email,
      source: 'public_menu',
    })

    if (error) {
      console.error('Error inserting review:', error)
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
