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
} from 'lucide-react'

const quickActions = [
  {
    title: 'Kategoriler ve Ürünler',
    description: 'Menünüzü düzenleyin',
    href: '/dashboard/menu?tab=categories',
    icon: UtensilsCrossed,
    color: 'bg-blue-500',
  },
  {
    title: 'Görüntüleme Tercihleri',
    description: 'Menü görünümünü özelleştirin',
    href: '/dashboard/menu?tab=display',
    icon: Eye,
    color: 'bg-purple-500',
  },
  {
    title: 'Çeviri Paneli',
    description: 'Dil ayarlarını yönetin',
    href: '/dashboard/translations',
    icon: Languages,
    color: 'bg-green-500',
  },
  {
    title: 'Ayarlar',
    description: 'Restoran ayarlarını düzenleyin',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'bg-gray-500',
  },
]

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: restaurantUser } = await supabase
    .from('restaurant_users')
    .select('restaurant_id, restaurants(name, slug)')
    .eq('auth_user_id', user?.id)
    .single()

  const restaurant = restaurantUser?.restaurants as { name: string; slug: string } | null

  // Get stats
  const { count: categoryCount } = await supabase
    .from('menu_categories')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantUser?.restaurant_id)

  const { count: itemCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantUser?.restaurant_id)

  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantUser?.restaurant_id)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Merhaba, {restaurant?.name || 'Restoran'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Dijital menünüzü buradan yönetebilirsiniz
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Kategori</CardDescription>
            <CardTitle className="text-3xl">{categoryCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Ürün</CardDescription>
            <CardTitle className="text-3xl">{itemCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam Yorum</CardDescription>
            <CardTitle className="text-3xl">{reviewCount || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menü Durumu</CardDescription>
            <CardTitle className="text-lg text-green-600">Aktif</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Demo Menüyü Görüntüle</CardTitle>
                <CardDescription>Müşterilerinizin gördüğü menüyü inceleyin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href={`/r/${restaurant?.slug || ''}`} target="_blank">
              <Button className="w-full">
                Menüyü Aç
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Hızlı Eğitim</CardTitle>
                <CardDescription>Platformu kullanmayı öğrenin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Eğitime Başla
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
