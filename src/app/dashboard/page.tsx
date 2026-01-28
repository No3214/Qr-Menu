import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  UtensilsCrossed,
  Eye,
  Languages,
  Settings,
  ExternalLink,
  GraduationCap,
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  Star,
  QrCode,
  ArrowUpRight,
  ArrowRight,
  Bell,
  MessageSquare,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

const quickActions = [
  {
    title: 'Menü Yönetimi',
    description: 'Kategori ve ürünlerinizi düzenleyin',
    href: '/dashboard/menu?tab=categories',
    icon: UtensilsCrossed,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Analitik',
    description: 'Ziyaretçi ve performans verileri',
    href: '/dashboard/analytics',
    icon: BarChart3,
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Çeviriler',
    description: 'Çoklu dil içeriklerini yönetin',
    href: '/dashboard/translations',
    icon: Languages,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Ayarlar',
    description: 'Restoran ayarlarını düzenleyin',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'from-gray-500 to-gray-600',
  },
]

const onboardingSteps = [
  { id: 'menu', label: 'Menü oluştur', completed: false, href: '/dashboard/menu' },
  { id: 'settings', label: 'Ayarları düzenle', completed: false, href: '/dashboard/settings' },
  { id: 'qr', label: 'QR kodunu indir', completed: false, href: '/dashboard/settings?tab=qr' },
  { id: 'share', label: 'Menüyü paylaş', completed: false, href: '#' },
]

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: restaurantUser } = await supabase
    .from('restaurant_users')
    .select('restaurant_id, restaurants(name, slug)')
    .eq('auth_user_id', user?.id)
    .single()

  const restaurant = restaurantUser?.restaurants as unknown as { name: string; slug: string } | null
  const restaurantId = restaurantUser?.restaurant_id

  // Get stats
  const [
    { count: categoryCount },
    { count: itemCount },
    { count: reviewCount },
    { count: viewCount },
    { data: recentReviews },
  ] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId),
    supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId),
    supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId),
    supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurantId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('reviews')
      .select('rating, comment, created_at, name')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(3),
  ])
  const avgRating = recentReviews?.length
    ? (recentReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / recentReviews.length).toFixed(1)
    : '0'

  // Calculate completion percentage
  const hasMenu = (categoryCount || 0) > 0 && (itemCount || 0) > 0
  const completionSteps = onboardingSteps.map(step => ({
    ...step,
    completed: step.id === 'menu' ? hasMenu : false,
  }))
  const completionPercentage = Math.round((completionSteps.filter(s => s.completed).length / completionSteps.length) * 100)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Hoş Geldiniz!
            </h1>
            <span className="animate-bounce">👋</span>
          </div>
          <p className="text-gray-500">
            {restaurant?.name || 'Restoranınız'} için dijital menü kontrol paneli
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/r/${restaurant?.slug || ''}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Menüyü Önizle
            </Button>
          </Link>
          <Link href="/dashboard/menu">
            <Button className="gap-2 bg-gray-900 hover:bg-gray-800">
              <Zap className="h-4 w-4" />
              Hızlı Düzenle
            </Button>
          </Link>
        </div>
      </div>

      {/* Onboarding Progress (Show if not complete) */}
      {completionPercentage < 100 && (
        <Card className="mb-8 border-2 border-dashed border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Kurulumu Tamamlayın</CardTitle>
                  <CardDescription>Birkaç adımda menünüz hazır</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                <div className="text-xs text-gray-500">Tamamlandı</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 bg-blue-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {completionSteps.map((step, index) => (
                <Link key={step.id} href={step.href}>
                  <div className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    step.completed
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm font-medium">{step.label}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Bu Hafta Görüntüleme</CardDescription>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{viewCount || 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12% geçen haftaya göre</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Toplam Ürün</CardDescription>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{itemCount || 0}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-500">
              {categoryCount || 0} kategoride
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Ortalama Puan</CardDescription>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl flex items-baseline gap-1">
              {avgRating}
              <span className="text-sm text-gray-400">/5</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-500">
              {reviewCount || 0} değerlendirme
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">Menü Durumu</CardDescription>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-lg text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-500">
              7/24 erişilebilir
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h2>
          <Link href="/dashboard/menu" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Tümünü Gör <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base group-hover:text-blue-600 transition-colors">{action.title}</CardTitle>
                  <CardDescription className="text-xs">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Son Yorumlar</CardTitle>
                  <CardDescription className="text-xs">Müşteri geri bildirimleri</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/reviews">
                <Button variant="ghost" size="sm" className="text-xs">
                  Tümü
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {review.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{review.name || 'Anonim'}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{review.comment || 'Yorum yok'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Henüz yorum yok</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="space-y-4">
          {/* QR Code Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">QR Kodunuz</CardTitle>
                    <CardDescription className="text-xs text-gray-400">Masalara yerleştirin</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  <p>grain.menu/r/{restaurant?.slug}</p>
                </div>
                <Link href="/dashboard/settings?tab=qr">
                  <Button size="sm" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                    İndir
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Canlı Menü</CardTitle>
                  <CardDescription className="text-xs">Müşterilerinizin gördüğü ekran</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/r/${restaurant?.slug || ''}`} target="_blank">
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Menüyü Görüntüle
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Yardım Merkezi</CardTitle>
                  <CardDescription className="text-xs">Sorularınız mı var?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Destek Al
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
