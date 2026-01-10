'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Languages, Loader2, Edit, Globe } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/types'
import type { RestaurantSettings } from '@/types'

export default function TranslationsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: restaurantUser } = await supabase
        .from('restaurant_users')
        .select('restaurant_id')
        .eq('auth_user_id', user.id)
        .single()

      if (!restaurantUser) return
      setRestaurantId(restaurantUser.restaurant_id)

      const { data: settingsData } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .single()

      if (settingsData) {
        setSettings(settingsData)
        setSelectedLanguages(settingsData.supported_languages || ['tr'])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleSavePrimaryLanguage = async (langCode: string) => {
    if (!restaurantId) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .update({ primary_language: langCode })
        .eq('restaurant_id', restaurantId)

      if (error) throw error

      setSettings(prev => prev ? { ...prev, primary_language: langCode } : null)
      toast({ title: 'Ana dil güncellendi' })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLanguages = async () => {
    if (!restaurantId) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .update({ supported_languages: selectedLanguages })
        .eq('restaurant_id', restaurantId)

      if (error) throw error

      setSettings(prev => prev ? { ...prev, supported_languages: selectedLanguages } : null)
      setShowLanguageModal(false)
      toast({ title: 'Desteklenen diller güncellendi' })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const toggleLanguage = (langCode: string) => {
    if (selectedLanguages.includes(langCode)) {
      if (langCode === settings?.primary_language) {
        toast({ title: 'Ana dil kaldırılamaz', variant: 'destructive' })
        return
      }
      setSelectedLanguages(selectedLanguages.filter(l => l !== langCode))
    } else {
      setSelectedLanguages([...selectedLanguages, langCode])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const primaryLang = SUPPORTED_LANGUAGES.find(l => l.code === settings?.primary_language)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dil Ayarları</h1>
        <p className="text-muted-foreground mt-1">
          Menünüzün dil ayarlarını ve çevirilerini yönetin
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Primary Language */}
        <Card>
          <CardHeader>
            <CardTitle>Ana Menü Dili</CardTitle>
            <CardDescription>
              Menünüzün varsayılan olarak gösterileceği dil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={settings?.primary_language || 'tr'}
              onValueChange={handleSavePrimaryLanguage}
              disabled={saving}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Bu dil menünüzün ana dili olarak kullanılacak ve çeviriler bu dile göre yapılacaktır.
            </p>
          </CardContent>
        </Card>

        {/* Supported Languages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Desteklenen Diller</CardTitle>
                <CardDescription>
                  Müşterilerinizin seçebileceği diller
                </CardDescription>
              </div>
              <Button onClick={() => setShowLanguageModal(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Dilleri Düzenle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(settings?.supported_languages || ['tr']).map((langCode) => {
                const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode)
                if (!lang) return null

                return (
                  <Badge
                    key={langCode}
                    variant={langCode === settings?.primary_language ? 'default' : 'secondary'}
                    className="text-base py-1 px-3"
                  >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.name}
                    {langCode === settings?.primary_language && (
                      <span className="ml-2 text-xs opacity-70">Ana Dil</span>
                    )}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Translation Management */}
        <Card>
          <CardHeader>
            <CardTitle>Çeviri Yönetimi</CardTitle>
            <CardDescription>
              Menü içeriklerinizin çevirilerini yönetin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Kategorilerin ve ürünlerin çevirilerini menü yönetimi sayfasından yapabilirsiniz.
              </p>
              <Button variant="outline" asChild>
                <a href="/dashboard/menu">Menü Yönetimine Git</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Selection Modal */}
      <Dialog open={showLanguageModal} onOpenChange={setShowLanguageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desteklenen Dilleri Düzenle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguages.includes(lang.code)
              const isPrimary = lang.code === settings?.primary_language

              return (
                <div
                  key={lang.code}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={lang.code}
                      checked={isSelected}
                      onCheckedChange={() => toggleLanguage(lang.code)}
                      disabled={isPrimary}
                    />
                    <Label
                      htmlFor={lang.code}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </Label>
                  </div>
                  {isPrimary && (
                    <Badge variant="outline">Ana Dil</Badge>
                  )}
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLanguageModal(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveLanguages} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
