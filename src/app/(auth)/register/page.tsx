'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = slugify(restaurantName) + '-' + Date.now().toString(36)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          restaurantName,
          slug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Kayıt başarısız',
          description: data.error || 'Bir hata oluştu',
          variant: 'destructive',
        })
        return
      }

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
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir
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
