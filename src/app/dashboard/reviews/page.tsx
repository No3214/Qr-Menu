'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Star, Loader2, Trash2, Eye, MessageSquare } from 'lucide-react'
import type { Review } from '@/types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
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

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .order('created_at', { ascending: false })

      if (reviewsData) setReviews(reviewsData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

      if (error) throw error

      setReviews(reviews.filter(r => r.id !== reviewId))
      toast({ title: 'Yorum silindi' })
    } catch (error) {
      toast({ title: 'Silme işlemi başarısız', variant: 'destructive' })
    }
  }

  // Calculate stats
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
  }))

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
        <h1 className="text-3xl font-bold">Yorumlar</h1>
        <p className="text-muted-foreground mt-1">
          Müşteri yorumlarını görüntüleyin ve yönetin
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Yorum
            </CardTitle>
            <div className="text-3xl font-bold">{reviews.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ortalama Puan
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{avgRating}</span>
              <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Puan Dağılımı
            </CardTitle>
            <div className="space-y-1 mt-2">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-4">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: reviews.length
                          ? `${(count / reviews.length) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Reviews Table */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz yorum yok</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="w-20">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {review.full_name || '-'}
                  </TableCell>
                  <TableCell>{review.phone || '-'}</TableCell>
                  <TableCell>{review.email || '-'}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{review.comment || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(review.created_at), 'dd MMM yyyy', { locale: tr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Review Detail Modal */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yorum Detayı</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < selectedReview.rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ad Soyad</p>
                <p>{selectedReview.full_name || '-'}</p>
              </div>
              {selectedReview.email && (
                <div>
                  <p className="text-sm text-muted-foreground">E-posta</p>
                  <p>{selectedReview.email}</p>
                </div>
              )}
              {selectedReview.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p>{selectedReview.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Yorum</p>
                <p className="whitespace-pre-wrap">{selectedReview.comment || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tarih</p>
                <p>
                  {format(new Date(selectedReview.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kaynak</p>
                <Badge variant="outline">{selectedReview.source}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
