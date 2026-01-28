'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { QrCode, Loader2, Check, X, Eye, EyeOff } from 'lucide-react'
import { slugify } from '@/lib/utils'

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }), [password])

  const strength = Object.values(checks).filter(Boolean).length
  const strengthText = strength === 0 ? '' : strength === 1 ? 'Zayıf' : strength === 2 ? 'Orta' : strength === 3 ? 'İyi' : 'Güçlü'
  const strengthColor = strength === 0 ? 'bg-gray-200' : strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-orange-500' : strength === 3 ? 'bg-yellow-500' : 'bg-green-500'

  if (!password) return null

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {strengthText && (
        <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-600' : strength === 2 ? 'text-orange-600' : strength === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          Şifre gücü: {strengthText}
        </p>
      )}
      <div className="space-y-1">
        <RequirementItem met={checks.length} text="En az 8 karakter" />
        <RequirementItem met={checks.uppercase} text="Bir büyük harf (A-Z)" />
        <RequirementItem met={checks.lowercase} text="Bir küçük harf (a-z)" />
        <RequirementItem met={checks.number} text="Bir rakam (0-9)" />
      </div>
    </div>
  )
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {text}
    </div>
  )
}

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const isPasswordValid = useMemo(() => {
    return password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
  }, [password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      toast({
        title: 'Şifre gereksinimleri karşılanmıyor',
        description: 'Lütfen tüm şifre gereksinimlerini kontrol edin',
        variant: 'destructive',
      })
      return
    }

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
        title: 'Bağlantı hatası',
        description: 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.',
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
                minLength={2}
                maxLength={100}
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || !email || !restaurantName}
            >
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
