'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  MousePointer,
  Eye,
  Users,
  QrCode,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
} from 'lucide-react'
import type { DateRange, AnalyticsMetrics } from '@/types'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('menu')
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: restaurantUser } = await supabase
        .from('restaurant_users')
        .select('restaurant_id')
        .eq('auth_user_id', user.id)
        .single()

      if (!restaurantUser) return
      setRestaurantId(restaurantUser.restaurant_id)

      // Calculate date range
      const now = new Date()
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

      // Fetch analytics events
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .gte('created_at', startDate.toISOString())

      if (events) {
        // Calculate metrics
        const itemClicks = events.filter(e => e.event_type === 'item_click')
        const menuViews = events.filter(e => e.event_type === 'menu_view')
        const qrScans = events.filter(e => e.event_type === 'qr_scan')
        const categoryViews = events.filter(e => e.event_type === 'category_view')

        // Unique sessions
        const uniqueSessions = new Set(events.map(e => e.session_id)).size

        // Device breakdown
        const deviceCounts: Record<string, number> = {}
        events.forEach(e => {
          if (e.device_type) {
            deviceCounts[e.device_type] = (deviceCounts[e.device_type] || 0) + 1
          }
        })

        // Platform breakdown
        const platformCounts: Record<string, number> = {}
        events.forEach(e => {
          if (e.platform) {
            platformCounts[e.platform] = (platformCounts[e.platform] || 0) + 1
          }
        })

        // Traffic sources
        const sourceCounts: Record<string, number> = {}
        qrScans.forEach(e => {
          const source = e.qr_entrypoint || 'direct'
          sourceCounts[source] = (sourceCounts[source] || 0) + 1
        })

        // Top clicked items
        const itemClickCounts: Record<string, number> = {}
        itemClicks.forEach(e => {
          if (e.entity_id) {
            itemClickCounts[e.entity_id] = (itemClickCounts[e.entity_id] || 0) + 1
          }
        })

        // Top viewed categories
        const categoryViewCounts: Record<string, number> = {}
        categoryViews.forEach(e => {
          if (e.entity_id) {
            categoryViewCounts[e.entity_id] = (categoryViewCounts[e.entity_id] || 0) + 1
          }
        })

        // Busy hours
        const hourCounts: Record<number, number> = {}
        events.forEach(e => {
          const hour = new Date(e.created_at).getHours()
          hourCounts[hour] = (hourCounts[hour] || 0) + 1
        })

        // Busy days
        const dayCounts: Record<number, number> = {}
        events.forEach(e => {
          const day = new Date(e.created_at).getDay()
          dayCounts[day] = (dayCounts[day] || 0) + 1
        })

        setMetrics({
          total_clicks: itemClicks.length,
          total_views: menuViews.length,
          total_sessions: uniqueSessions,
          qr_scans: qrScans.length,
          top_clicked_items: Object.entries(itemClickCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => ({ entity_id: id, name: `Ürün ${id.slice(0, 8)}`, count })),
          top_viewed_categories: Object.entries(categoryViewCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([id, count]) => ({ entity_id: id, name: `Kategori ${id.slice(0, 8)}`, count })),
          least_viewed: [],
          avg_time_spent: 0,
          device_breakdown: Object.entries(deviceCounts).map(([type, count]) => ({
            device_type: type,
            count,
          })),
          platform_breakdown: Object.entries(platformCounts).map(([platform, count]) => ({
            platform,
            count,
          })),
          traffic_sources: Object.entries(sourceCounts).map(([entrypoint, count]) => ({
            entrypoint,
            count,
          })),
          busy_hours: Object.entries(hourCounts).map(([hour, count]) => ({
            hour: parseInt(hour),
            count,
          })),
          busy_days: Object.entries(dayCounts).map(([day, count]) => ({
            day: parseInt(day),
            count,
          })),
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [dateRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analitik</h1>
          <p className="text-muted-foreground mt-1">
            Menü performansınızı ve ziyaretçi istatistiklerinizi takip edin
          </p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Son 7 Gün</SelectItem>
            <SelectItem value="30d">Son 30 Gün</SelectItem>
            <SelectItem value="90d">Son 90 Gün</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Menü Analitiği</TabsTrigger>
          <TabsTrigger value="events">Etkinlik Analitiği</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  Toplam Tıklama
                </CardDescription>
                <CardTitle className="text-3xl">{metrics?.total_clicks || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Toplam Görüntüleme
                </CardDescription>
                <CardTitle className="text-3xl">{metrics?.total_views || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Toplam Oturum
                </CardDescription>
                <CardTitle className="text-3xl">{metrics?.total_sessions || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Tarama
                </CardDescription>
                <CardTitle className="text-3xl">{metrics?.qr_scans || 0}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clicked Items */}
            <Card>
              <CardHeader>
                <CardTitle>En Çok Tıklanan Ürünler</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.top_clicked_items?.length ? (
                  <div className="space-y-4">
                    {metrics.top_clicked_items.map((item, i) => (
                      <div key={item.entity_id} className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-muted-foreground w-8">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground">{item.count}</span>
                          </div>
                          <Progress
                            value={(item.count / (metrics.top_clicked_items[0]?.count || 1)) * 100}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Henüz veri yok</p>
                )}
              </CardContent>
            </Card>

            {/* Top Viewed Categories */}
            <Card>
              <CardHeader>
                <CardTitle>En Çok Görüntülenen Kategoriler</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.top_viewed_categories?.length ? (
                  <div className="space-y-4">
                    {metrics.top_viewed_categories.map((category, i) => (
                      <div key={category.entity_id} className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-muted-foreground w-8">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-muted-foreground">{category.count}</span>
                          </div>
                          <Progress
                            value={(category.count / (metrics.top_viewed_categories[0]?.count || 1)) * 100}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Henüz veri yok</p>
                )}
              </CardContent>
            </Card>

            {/* Device Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Cihaz Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.device_breakdown?.length ? (
                  <div className="space-y-4">
                    {metrics.device_breakdown.map((device) => {
                      const total = metrics.device_breakdown.reduce((s, d) => s + d.count, 0)
                      const percent = total ? Math.round((device.count / total) * 100) : 0
                      const Icon = device.device_type === 'mobile' ? Smartphone :
                        device.device_type === 'tablet' ? Tablet : Monitor

                      return (
                        <div key={device.device_type} className="flex items-center gap-4">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium capitalize">{device.device_type}</span>
                              <span className="text-muted-foreground">{percent}%</span>
                            </div>
                            <Progress value={percent} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Henüz veri yok</p>
                )}
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Trafik Kaynağı (QR Giriş Noktaları)</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics?.traffic_sources?.length ? (
                  <div className="space-y-4">
                    {metrics.traffic_sources.map((source) => {
                      const total = metrics.traffic_sources.reduce((s, t) => s + t.count, 0)
                      const percent = total ? Math.round((source.count / total) * 100) : 0

                      return (
                        <div key={source.entrypoint} className="flex items-center gap-4">
                          <QrCode className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{source.entrypoint}</span>
                              <span className="text-muted-foreground">{source.count} ({percent}%)</span>
                            </div>
                            <Progress value={percent} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Henüz veri yok</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Etkinlik analitiği yakında eklenecek.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
