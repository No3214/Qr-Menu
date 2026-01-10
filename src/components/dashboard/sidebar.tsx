'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Home,
  UtensilsCrossed,
  Calendar,
  BarChart3,
  MessageSquare,
  Languages,
  Settings,
  LogOut,
  QrCode,
  Globe,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const menuItems = [
  {
    title: 'Ana Sayfa',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Menü Yönetimi',
    href: '/dashboard/menu',
    icon: UtensilsCrossed,
  },
  {
    title: 'Etkinlik Tanıtımı',
    href: '/dashboard/events',
    icon: Calendar,
  },
  {
    title: 'Analitik',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Yorumlar',
    href: '/dashboard/reviews',
    icon: MessageSquare,
  },
  {
    title: 'Çeviri',
    href: '/dashboard/translations',
    icon: Languages,
  },
  {
    title: 'Ayarlar',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  restaurantName?: string
  restaurantSlug?: string
}

export function Sidebar({ restaurantName = 'Restoran', restaurantSlug = '' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: 'Çıkış yapıldı',
      description: 'Güvenli bir şekilde çıkış yaptınız.',
    })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <QrCode className="h-8 w-8 text-primary" />
        <span className="font-bold text-lg">QR Menu</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4" />

        {/* Quick Links */}
        <div className="space-y-1">
          <Link href={`/r/${restaurantSlug}`} target="_blank">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Globe className="h-5 w-5" />
              Menüyü Görüntüle
            </Button>
          </Link>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium truncate">{restaurantName}</p>
          <p className="text-xs text-muted-foreground truncate">{restaurantSlug}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Çıkış Yap
        </Button>
      </div>
    </div>
  )
}
