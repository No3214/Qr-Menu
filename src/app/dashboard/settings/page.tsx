'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  User,
  Lock,
  Building,
  Info,
  QrCode,
  Bot,
  FileText,
  CreditCard,
  Loader2,
  Download,
  Check,
} from 'lucide-react'
import type { Restaurant, RestaurantSettings } from '@/types'
import QRCodeLib from 'qrcode'

const settingsTabs = [
  { value: 'profile', label: 'Profil', icon: User },
  { value: 'password', label: 'Şifre', icon: Lock },
  { value: 'restaurant', label: 'Restoran Bilgileri', icon: Building },
  { value: 'guest', label: 'Misafir Bilgileri', icon: Info },
  { value: 'qr', label: 'QR Kod', icon: QrCode },
  { value: 'ai', label: 'AI Chat', icon: Bot },
  { value: 'pdf', label: 'PDF Menü', icon: FileText },
  { value: 'billing', label: 'Plan ve Faturalama', icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  // Form states
  const [profileForm, setProfileForm] = useState({ email: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    phone: '',
    address: '',
    logo_url: '',
    cover_image_url: '',
    video_url: '',
  })
  const [guestInfoHtml, setGuestInfoHtml] = useState('')
  const [aiChatEnabled, setAiChatEnabled] = useState(false)

  // PDF Modal
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfSettings, setPdfSettings] = useState({
    paperSize: 'A4',
    fontSize: 12,
    fontStyle: 'Normal',
    language: 'tr',
  })

  // QR Code
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email || '')
      setProfileForm({ email: user.email || '' })

      const { data: restaurantUser } = await supabase
        .from('restaurant_users')
        .select('restaurant_id, restaurants(*)')
        .eq('auth_user_id', user.id)
        .single()

      if (!restaurantUser) return
      setRestaurantId(restaurantUser.restaurant_id)

      const rest = restaurantUser.restaurants as unknown as Restaurant
      setRestaurant(rest)
      setRestaurantForm({
        name: rest.name || '',
        phone: rest.phone || '',
        address: rest.address || '',
        logo_url: rest.logo_url || '',
        cover_image_url: rest.cover_image_url || '',
        video_url: rest.video_url || '',
      })

      // Generate QR Code
      const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/r/${rest.slug}`
      const qrUrl = await QRCodeLib.toDataURL(menuUrl, { width: 300, margin: 2 })
      setQrDataUrl(qrUrl)

      const { data: settingsData } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .single()

      if (settingsData) {
        setSettings(settingsData)
        setGuestInfoHtml(settingsData.guest_info_html || '')
        setAiChatEnabled(settingsData.ai_chat_enabled)
        setPdfSettings({
          paperSize: settingsData.pdf_paper_size,
          fontSize: settingsData.pdf_font_size,
          fontStyle: settingsData.pdf_font_style,
          language: settingsData.primary_language,
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleSaveRestaurant = async () => {
    if (!restaurantId) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('restaurants')
        .update(restaurantForm)
        .eq('id', restaurantId)

      if (error) throw error

      setRestaurant(prev => prev ? { ...prev, ...restaurantForm } : null)
      toast({ title: 'Restoran bilgileri güncellendi' })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveGuestInfo = async () => {
    if (!restaurantId) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .update({ guest_info_html: guestInfoHtml })
        .eq('restaurant_id', restaurantId)

      if (error) throw error
      toast({ title: 'Misafir bilgileri güncellendi' })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAiChat = async (enabled: boolean) => {
    if (!restaurantId) return

    setAiChatEnabled(enabled)
    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .update({ ai_chat_enabled: enabled })
        .eq('restaurant_id', restaurantId)

      if (error) throw error
      toast({ title: enabled ? 'AI Chat etkinleştirildi' : 'AI Chat devre dışı bırakıldı' })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
      setAiChatEnabled(!enabled)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({ title: 'Şifreler eşleşmiyor', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new,
      })

      if (error) throw error

      setPasswordForm({ current: '', new: '', confirm: '' })
      toast({ title: 'Şifre güncellendi' })
    } catch (error) {
      toast({ title: 'Şifre güncellenemedi', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const downloadQR = (format: 'png' | 'svg') => {
    const link = document.createElement('a')
    link.download = `qr-menu.${format}`
    link.href = qrDataUrl
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground mt-1">
          Hesap ve restoran ayarlarınızı yönetin
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>Hesap bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    E-posta adresinizi değiştirmek için destek ile iletişime geçin.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
                <CardDescription>Hesap şifrenizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Şifreyi Güncelle
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'restaurant' && (
            <Card>
              <CardHeader>
                <CardTitle>Restoran Bilgileri</CardTitle>
                <CardDescription>Restoranınızın genel bilgilerini düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Restoran Adı</Label>
                  <Input
                    id="name"
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={restaurantForm.phone}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={restaurantForm.address}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={restaurantForm.logo_url}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, logo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="coverUrl">Kapak Görseli URL</Label>
                  <Input
                    id="coverUrl"
                    value={restaurantForm.cover_image_url}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, cover_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="videoUrl">4K Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={restaurantForm.video_url}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, video_url: e.target.value })}
                    placeholder="https://... (MP4 formatında)"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    4K video menünüzün arka planında gösterilecektir.
                  </p>
                </div>
                <Button onClick={handleSaveRestaurant} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Kaydet
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'guest' && (
            <Card>
              <CardHeader>
                <CardTitle>Misafir Bilgileri</CardTitle>
                <CardDescription>
                  Müşterilerinize göstermek istediğiniz bilgileri ekleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="guestInfo">Misafir Bilgi Metni (HTML)</Label>
                  <Textarea
                    id="guestInfo"
                    value={guestInfoHtml}
                    onChange={(e) => setGuestInfoHtml(e.target.value)}
                    rows={8}
                    placeholder="<h2>Hoş Geldiniz</h2><p>WiFi şifresi: ...</p>"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    HTML formatında yazabilirsiniz. Bu bilgi müşterilerinize menüde gösterilecektir.
                  </p>
                </div>
                <Button onClick={handleSaveGuestInfo} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Kaydet
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'qr' && (
            <Card>
              <CardHeader>
                <CardTitle>QR Kod</CardTitle>
                <CardDescription>
                  Menünüze erişim için QR kodunuzu indirin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-xl shadow-lg">
                    {qrDataUrl && (
                      <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Menü URL: {process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/r/{restaurant?.slug}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => downloadQR('png')}>
                      <Download className="h-4 w-4 mr-2" />
                      PNG İndir
                    </Button>
                    <Button variant="outline" onClick={() => downloadQR('svg')}>
                      <Download className="h-4 w-4 mr-2" />
                      SVG İndir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'ai' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Chat</CardTitle>
                <CardDescription>
                  Yapay zeka destekli sohbet botunu yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Sohbet Botunu Etkinleştir</Label>
                    <p className="text-sm text-muted-foreground">
                      Müşterileriniz menüde AI asistan ile konuşabilir
                    </p>
                  </div>
                  <Switch
                    checked={aiChatEnabled}
                    onCheckedChange={handleToggleAiChat}
                  />
                </div>
                <div>
                  <Label>Aylık Mesaj Kullanımı</Label>
                  <div className="mt-2">
                    <Progress
                      value={(settings?.ai_chat_used || 0) / (settings?.ai_chat_monthly_quota || 750) * 100}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {settings?.ai_chat_used || 0} / {settings?.ai_chat_monthly_quota || 750} mesaj kullanıldı
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  AI Boost - Kapasite Artır
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'pdf' && (
            <Card>
              <CardHeader>
                <CardTitle>PDF Menü İndir</CardTitle>
                <CardDescription>
                  Menünüzü PDF formatında indirin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowPdfModal(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Olarak İndir
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Basic</CardTitle>
                      <Badge>Mevcut Plan</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Dijital Menü
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Yapay Zeka Önerileri
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Geri Bildirimler
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Yönetim Paneli
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        E-posta Desteği
                      </li>
                    </ul>
                    <p className="text-2xl font-bold">$80/ay</p>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Core</CardTitle>
                      <Badge variant="secondary">Önerilen</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Basic dahil her şey
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        2-3 Restoran Desteği
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Sizin için kuruyoruz
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Etkinlik Yönetimi
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        Aynı Gün Destek
                      </li>
                    </ul>
                    <p className="text-2xl font-bold">$105/ay</p>
                    <Button className="w-full" disabled>
                      Planı Yükselt
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fatura Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Henüz fatura bulunmuyor
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menüyü PDF Olarak İndir</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Kağıt Boyutu</Label>
              <Select
                value={pdfSettings.paperSize}
                onValueChange={(v) => setPdfSettings({ ...pdfSettings, paperSize: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                  <SelectItem value="A5">A5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Yazı Boyutu: {pdfSettings.fontSize}pt</Label>
              <Slider
                value={[pdfSettings.fontSize]}
                onValueChange={([v]) => setPdfSettings({ ...pdfSettings, fontSize: v })}
                min={8}
                max={24}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Yazı Stili</Label>
              <Select
                value={pdfSettings.fontStyle}
                onValueChange={(v) => setPdfSettings({ ...pdfSettings, fontStyle: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Serif">Serif</SelectItem>
                  <SelectItem value="Sans-serif">Sans-serif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPdfModal(false)}>
              İptal
            </Button>
            <Button onClick={() => {
              toast({ title: 'PDF indiriliyor...' })
              setShowPdfModal(false)
            }}>
              <Download className="h-4 w-4 mr-2" />
              PDF İndir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
