'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  Edit,
  Trash2,
} from 'lucide-react'
import type { Event, EventReservation } from '@/types'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState<Event[]>([])
  const [reservations, setReservations] = useState<EventReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
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

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .order('start_at', { ascending: false })

      if (eventsData) setEvents(eventsData)

      // Fetch reservations
      const { data: reservationsData } = await supabase
        .from('event_reservations')
        .select('*, events(title)')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .order('created_at', { ascending: false })

      if (reservationsData) setReservations(reservationsData as EventReservation[])

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleSaveEvent = async (formData: Partial<Event>) => {
    if (!restaurantId) return

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', editingEvent.id)

        if (error) throw error

        setEvents(events.map(e =>
          e.id === editingEvent.id ? { ...e, ...formData } : e
        ))
        toast({ title: 'Etkinlik güncellendi' })
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert({ ...formData, restaurant_id: restaurantId })
          .select()
          .single()

        if (error) throw error

        setEvents([data, ...events])
        toast({ title: 'Etkinlik oluşturuldu' })
      }

      setShowEventModal(false)
      setEditingEvent(null)
    } catch (error) {
      toast({ title: 'Bir hata oluştu', variant: 'destructive' })
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      setEvents(events.filter(e => e.id !== eventId))
      toast({ title: 'Etkinlik silindi' })
    } catch (error) {
      toast({ title: 'Silme işlemi başarısız', variant: 'destructive' })
    }
  }

  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('event_reservations')
        .update({ status })
        .eq('id', reservationId)

      if (error) throw error

      setReservations(reservations.map(r =>
        r.id === reservationId ? { ...r, status: status as 'pending' | 'confirmed' | 'cancelled' } : r
      ))
      toast({ title: 'Rezervasyon güncellendi' })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
    }
  }

  // Calculate stats
  const totalEvents = events.length
  const totalReservations = reservations.length
  const estimatedRevenue = events.reduce((sum, e) => {
    const eventReservations = reservations.filter(r => r.event_id === e.id && r.status === 'confirmed')
    return sum + eventReservations.reduce((s, r) => s + (e.price || 0) * r.party_size, 0)
  }, 0)

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
        <h1 className="text-3xl font-bold">Etkinlik Tanıtımı</h1>
        <p className="text-muted-foreground mt-1">
          Etkinliklerinizi ve rezervasyonlarınızı yönetin
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Toplam Etkinlik
            </CardDescription>
            <CardTitle className="text-3xl">{totalEvents}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Toplam Rezervasyon
            </CardDescription>
            <CardTitle className="text-3xl">{totalReservations}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Tahmini Toplam Kazanç
            </CardDescription>
            <CardTitle className="text-3xl">{formatPrice(estimatedRevenue, 'TRY')}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="events">Etkinlikler</TabsTrigger>
          <TabsTrigger value="reservations">Rezervasyonlar</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <div className="flex justify-end mb-4">
            <Button onClick={() => {
              setEditingEvent(null)
              setShowEventModal(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Etkinlik Oluştur
            </Button>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Henüz etkinlik yok</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setEditingEvent(null)
                    setShowEventModal(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Etkinliği Oluştur
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {event.media_url ? (
                            <img
                              src={event.media_url}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <Badge variant={event.status === 'published' ? 'success' : 'secondary'}>
                              {event.status === 'published' ? 'Yayında' : 'Taslak'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {format(new Date(event.start_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                            </span>
                            {event.price && (
                              <span>{formatPrice(event.price, event.currency)}</span>
                            )}
                            {event.capacity && (
                              <span>Maks. {event.capacity} kişi</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEvent(event)
                            setShowEventModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reservations">
          {reservations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Henüz rezervasyon yok</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Etkinlik</TableHead>
                    <TableHead>Kişi Sayısı</TableHead>
                    <TableHead>İletişim</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.full_name}</TableCell>
                      <TableCell>{(reservation as any).events?.title || '-'}</TableCell>
                      <TableCell>{reservation.party_size}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {reservation.email && <div>{reservation.email}</div>}
                          {reservation.phone && <div>{reservation.phone}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.created_at), 'dd MMM yyyy', { locale: tr })}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={reservation.status}
                          onValueChange={(v) => updateReservationStatus(reservation.id, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Beklemede</SelectItem>
                            <SelectItem value="confirmed">Onaylandı</SelectItem>
                            <SelectItem value="cancelled">İptal</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Modal */}
      <EventModal
        open={showEventModal}
        onClose={() => {
          setShowEventModal(false)
          setEditingEvent(null)
        }}
        event={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  )
}

function EventModal({
  open,
  onClose,
  event,
  onSave,
}: {
  open: boolean
  onClose: () => void
  event: Event | null
  onSave: (data: Partial<Event>) => void
}) {
  const [formData, setFormData] = useState<Partial<Event>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (event) {
      setFormData(event)
    } else {
      setFormData({
        title: '',
        description: '',
        media_url: null,
        price: null,
        currency: 'TRY',
        capacity: null,
        start_at: new Date().toISOString().slice(0, 16),
        end_at: new Date().toISOString().slice(0, 16),
        status: 'draft',
      })
    }
  }, [event, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Etkinlik Adı</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Etkinlik Bilgisi</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="price">Fiyat</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="capacity">Maksimum Katılımcı</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            <div>
              <Label htmlFor="startAt">Başlangıç</Label>
              <Input
                id="startAt"
                type="datetime-local"
                value={formData.start_at?.slice(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="endAt">Bitiş</Label>
              <Input
                id="endAt"
                type="datetime-local"
                value={formData.end_at?.slice(0, 16) || ''}
                onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="mediaUrl">Görsel/Video URL</Label>
              <Input
                id="mediaUrl"
                value={formData.media_url || ''}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="status">Durum</Label>
              <Select
                value={formData.status || 'draft'}
                onValueChange={(v) => setFormData({ ...formData, status: v as 'draft' | 'published' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="published">Yayınla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {event ? 'Güncelle' : 'Kaydet ve Yayınla'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
