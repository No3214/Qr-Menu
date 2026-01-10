'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { QrCode, Loader2 } from 'lucide-react'
import { slugify } from '@/lib/utils'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        toast({
          title: 'Kayıt başarısız',
          description: authError.message,
          variant: 'destructive',
        })
        return
      }

      if (!authData.user) {
        toast({
          title: 'Kayıt başarısız',
          description: 'Kullanıcı oluşturulamadı',
          variant: 'destructive',
        })
        return
      }

      // Create restaurant
      const slug = slugify(restaurantName) + '-' + Date.now().toString(36)
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: restaurantName,
          slug,
        })
        .select()
        .single()

      if (restaurantError) {
        toast({
          title: 'Restoran oluşturulamadı',
          description: restaurantError.message,
          variant: 'destructive',
        })
        return
      }

      // Link user to restaurant
      const { error: linkError } = await supabase
        .from('restaurant_users')
        .insert({
          restaurant_id: restaurant.id,
          auth_user_id: authData.user.id,
          role: 'owner',
        })

      if (linkError) {
        toast({
          title: 'Kullanıcı bağlanamadı',
          description: linkError.message,
          variant: 'destructive',
        })
        return
      }

      // Create default settings
      await supabase
        .from('restaurant_settings')
        .insert({
          restaurant_id: restaurant.id,
        })

      toast({
        title: 'Kayıt başarılı',
        description: 'Hesabınız oluşturuldu. Giriş yapabilirsiniz.',
      })

      router.push('/login')
    } catch (error) {
      toast({
        title: 'Bir hata oluştu',
        description: 'Lütfen tekrar deneyin',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <QrCode className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
          <CardDescription>
            Restoranınız için dijital menü oluşturmaya başlayın
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restoran Adı</Label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="Örn: Kozbeyli Konağı"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                En az 6 karakter olmalıdır
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Kayıt Ol
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Giriş Yap
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
