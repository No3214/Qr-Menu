import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

function parseUserAgent(ua: string) {
  let deviceType = 'desktop'
  let platform = 'unknown'

  if (/mobile/i.test(ua)) {
    deviceType = 'mobile'
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = 'tablet'
  }

  if (/android/i.test(ua)) {
    platform = 'android'
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    platform = 'ios'
  } else if (/windows/i.test(ua)) {
    platform = 'windows'
  } else if (/mac/i.test(ua)) {
    platform = 'macos'
  } else if (/linux/i.test(ua)) {
    platform = 'linux'
  }

  return { deviceType, platform }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant_id, event_type, entity_type, entity_id, qr_entrypoint } = body

    if (!restaurant_id || !event_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const cookieStore = cookies()
    let sessionId = cookieStore.get('session_id')?.value

    if (!sessionId) {
      sessionId = uuidv4()
    }

    const userAgent = request.headers.get('user-agent') || ''
    const { deviceType, platform } = parseUserAgent(userAgent)

    const supabase = createServiceClient()

    await supabase.from('analytics_events').insert({
      restaurant_id,
      event_type,
      entity_type,
      entity_id,
      qr_entrypoint,
      session_id: sessionId,
      device_type: deviceType,
      platform,
      user_agent: userAgent,
    })

    const response = NextResponse.json({ success: true })

    if (!cookieStore.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      })
    }

    return response
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
