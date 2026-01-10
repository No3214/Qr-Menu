'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  Image as ImageIcon,
  Video,
  Loader2,
} from 'lucide-react'
import type { MenuCategory, MenuItem, MenuItemOption } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import {
  DIETARY_RESTRICTIONS,
  ALLERGEN_WARNINGS,
  LIFESTYLE_OPTIONS,
  SPICE_LEVELS,
} from '@/types'

export default function MenuManagementPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'categories'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<Record<string, MenuItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const supabase = createClient()
  const { toast } = useToast()

  // Fetch data
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

      // Fetch categories
      const { data: cats } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantUser.restaurant_id)
        .order('sort_order')

      if (cats) {
        setCategories(cats)

        // Fetch items for each category
        const itemsByCategory: Record<string, MenuItem[]> = {}
        for (const cat of cats) {
          const { data: catItems } = await supabase
            .from('menu_items')
            .select('*')
            .eq('category_id', cat.id)
            .order('sort_order')

          itemsByCategory[cat.id] = catItems || []
        }
        setItems(itemsByCategory)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  // Category CRUD
  const handleSaveCategory = async (formData: Partial<MenuCategory>) => {
    if (!restaurantId) return

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('menu_categories')
          .update(formData)
          .eq('id', editingCategory.id)

        if (error) throw error

        setCategories(categories.map(c =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        ))
        toast({ title: 'Kategori güncellendi' })
      } else {
        const { data, error } = await supabase
          .from('menu_categories')
          .insert({
            ...formData,
            restaurant_id: restaurantId,
            sort_order: categories.length,
          })
          .select()
          .single()

        if (error) throw error

        setCategories([...categories, data])
        setItems({ ...items, [data.id]: [] })
        toast({ title: 'Kategori oluşturuldu' })
      }

      setShowCategoryModal(false)
      setEditingCategory(null)
    } catch (error) {
      toast({ title: 'Bir hata oluştu', variant: 'destructive' })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      setCategories(categories.filter(c => c.id !== categoryId))
      const newItems = { ...items }
      delete newItems[categoryId]
      setItems(newItems)
      toast({ title: 'Kategori silindi' })
    } catch (error) {
      toast({ title: 'Silme işlemi başarısız', variant: 'destructive' })
    }
  }

  // Item CRUD
  const handleSaveItem = async (formData: Partial<MenuItem>) => {
    if (!restaurantId || !selectedCategoryId) return

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', editingItem.id)

        if (error) throw error

        const categoryItems = items[editingItem.category_id] || []
        setItems({
          ...items,
          [editingItem.category_id]: categoryItems.map(i =>
            i.id === editingItem.id ? { ...i, ...formData } : i
          ),
        })
        toast({ title: 'Ürün güncellendi' })
      } else {
        const categoryItems = items[selectedCategoryId] || []
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            ...formData,
            restaurant_id: restaurantId,
            category_id: selectedCategoryId,
            sort_order: categoryItems.length,
          })
          .select()
          .single()

        if (error) throw error

        setItems({
          ...items,
          [selectedCategoryId]: [...categoryItems, data],
        })
        toast({ title: 'Ürün oluşturuldu' })
      }

      setShowItemModal(false)
      setEditingItem(null)
    } catch (error) {
      toast({ title: 'Bir hata oluştu', variant: 'destructive' })
    }
  }

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', item.id)

      if (error) throw error

      setItems({
        ...items,
        [item.category_id]: (items[item.category_id] || []).filter(i => i.id !== item.id),
      })
      toast({ title: 'Ürün silindi' })
    } catch (error) {
      toast({ title: 'Silme işlemi başarısız', variant: 'destructive' })
    }
  }

  const toggleItemAvailability = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !item.is_available })
        .eq('id', item.id)

      if (error) throw error

      setItems({
        ...items,
        [item.category_id]: (items[item.category_id] || []).map(i =>
          i.id === item.id ? { ...i, is_available: !i.is_available } : i
        ),
      })
    } catch (error) {
      toast({ title: 'Güncelleme başarısız', variant: 'destructive' })
    }
  }

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold">Menü Yönetimi</h1>
        <p className="text-muted-foreground mt-1">
          Kategorilerinizi ve ürünlerinizi yönetin
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="categories">1. Kategoriler ve Ürünler</TabsTrigger>
          <TabsTrigger value="recommendations">2. Öneriler</TabsTrigger>
          <TabsTrigger value="display">3. Görüntüleme Tercihleri</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          {/* Top Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Kategorileri ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button onClick={() => {
              setEditingCategory(null)
              setShowCategoryModal(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Kategori Ekle
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Henüz kategori eklenmemiş.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setEditingCategory(null)
                      setShowCategoryModal(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Kategoriyi Ekle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" className="space-y-4">
                {filteredCategories.map((category) => (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    className="border rounded-lg bg-white"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {category.image_url ? (
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{category.name}</h3>
                            {category.is_special && (
                              <Badge variant="secondary">Özel</Badge>
                            )}
                            {!category.is_active && (
                              <Badge variant="outline">Pasif</Badge>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {category.description}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {items[category.id]?.length || 0} ürün
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {/* Category Actions */}
                      <div className="flex justify-between items-center mb-4 pt-2 border-t">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedCategoryId(category.id)
                              setEditingItem(null)
                              setShowItemModal(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ürün Ekle
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(category)
                              setShowCategoryModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {(items[category.id] || []).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium truncate">{item.name}</h4>
                                {item.is_new && <Badge className="bg-green-500">Yeni</Badge>}
                                {item.featured && <Badge className="bg-yellow-500">Öne Çıkan</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="flex-shrink-0">
                              {formatPrice(item.price, item.currency)}
                            </Badge>
                            <Badge
                              variant={item.is_available ? 'success' : 'secondary'}
                              className="flex-shrink-0 cursor-pointer"
                              onClick={() => toggleItemAvailability(item)}
                            >
                              {item.is_available ? 'Aktif' : 'Pasif'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedCategoryId(category.id)
                                setEditingItem(item)
                                setShowItemModal(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteItem(item)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Sil
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                        {(items[category.id] || []).length === 0 && (
                          <p className="text-center text-muted-foreground py-4">
                            Bu kategoride henüz ürün yok.
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Önerileri</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ürünler arası öneri ilişkileri burada yönetilecek.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <DisplayPreferences restaurantId={restaurantId} />
        </TabsContent>
      </Tabs>

      {/* Category Modal */}
      <CategoryModal
        open={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setEditingCategory(null)
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Item Modal */}
      <ItemModal
        open={showItemModal}
        onClose={() => {
          setShowItemModal(false)
          setEditingItem(null)
        }}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </div>
  )
}

// Category Modal Component
function CategoryModal({
  open,
  onClose,
  category,
  onSave,
}: {
  open: boolean
  onClose: () => void
  category: MenuCategory | null
  onSave: (data: Partial<MenuCategory>) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSpecial, setIsSpecial] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description || '')
      setImageUrl(category.image_url || '')
      setIsActive(category.is_active)
      setIsSpecial(category.is_special)
    } else {
      setName('')
      setDescription('')
      setImageUrl('')
      setIsActive(true)
      setIsSpecial(false)
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave({
      name,
      description: description || null,
      image_url: imageUrl || null,
      is_active: isActive,
      is_special: isSpecial,
    })
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Kategori Adı</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Görsel URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isSpecial"
                checked={isSpecial}
                onCheckedChange={setIsSpecial}
              />
              <Label htmlFor="isSpecial">Özel Kategori</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Item Modal Component
function ItemModal({
  open,
  onClose,
  item,
  onSave,
}: {
  open: boolean
  onClose: () => void
  item: MenuItem | null
  onSave: (data: Partial<MenuItem>) => void
}) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        currency: 'TRY',
        image_url: null,
        video_url: null,
        featured: false,
        calories: null,
        grams: null,
        prep_minutes: null,
        dietary_restrictions: [],
        allergen_warnings: [],
        lifestyle_options: [],
        spice_level: null,
        is_available: true,
        is_new: false,
      })
    }
    setActiveTab('general')
  }, [item, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  const updateField = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleArrayItem = (field: string, value: string) => {
    const arr = (formData[field as keyof MenuItem] as string[]) || []
    if (arr.includes(value)) {
      updateField(field, arr.filter(v => v !== value))
    } else {
      updateField(field, [...arr, value])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Ürünü Düzenle' : 'Yeni Ürün'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
            <TabsTrigger value="options">Seçenekler</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Ürün Adı</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Fiyat</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => updateField('price', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Para Birimi</Label>
                  <Select
                    value={formData.currency || 'TRY'}
                    onValueChange={(v) => updateField('currency', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">TRY</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Görsel URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.image_url || ''}
                    onChange={(e) => updateField('image_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="videoUrl">Video URL (4K)</Label>
                  <Input
                    id="videoUrl"
                    value={formData.video_url || ''}
                    onChange={(e) => updateField('video_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="calories">Kalori</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories || ''}
                    onChange={(e) => updateField('calories', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="grams">Gram</Label>
                  <Input
                    id="grams"
                    type="number"
                    value={formData.grams || ''}
                    onChange={(e) => updateField('grams', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="prepMinutes">Hazırlama Süresi (dk)</Label>
                  <Input
                    id="prepMinutes"
                    type="number"
                    value={formData.prep_minutes || ''}
                    onChange={(e) => updateField('prep_minutes', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <div>
                  <Label>Baharatlık Seviyesi</Label>
                  <Select
                    value={formData.spice_level || ''}
                    onValueChange={(v) => updateField('spice_level', v || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Yok</SelectItem>
                      {SPICE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Diyet Kısıtlamaları</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DIETARY_RESTRICTIONS.map((diet) => (
                    <Badge
                      key={diet}
                      variant={formData.dietary_restrictions?.includes(diet) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('dietary_restrictions', diet)}
                    >
                      {diet}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Alerjen Uyarıları</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ALLERGEN_WARNINGS.map((allergen) => (
                    <Badge
                      key={allergen}
                      variant={formData.allergen_warnings?.includes(allergen) ? 'destructive' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('allergen_warnings', allergen)}
                    >
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Yaşam Tarzı Seçenekleri</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LIFESTYLE_OPTIONS.map((option) => (
                    <Badge
                      key={option}
                      variant={formData.lifestyle_options?.includes(option) ? 'secondary' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('lifestyle_options', option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(v) => updateField('featured', v)}
                  />
                  <Label htmlFor="featured">Öne Çıkan</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isNew"
                    checked={formData.is_new || false}
                    onCheckedChange={(v) => updateField('is_new', v)}
                  />
                  <Label htmlFor="isNew">Yeni Ürün</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isAvailable"
                    checked={formData.is_available ?? true}
                    onCheckedChange={(v) => updateField('is_available', v)}
                  />
                  <Label htmlFor="isAvailable">Mevcut</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-4">
              <p className="text-muted-foreground">
                Ürün seçenekleri (ekstra malzeme, porsiyon boyutu vb.) burada yönetilecek.
              </p>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Display Preferences Component
function DisplayPreferences({ restaurantId }: { restaurantId: string | null }) {
  const [settings, setSettings] = useState({
    showLogo: true,
    showVideo: true,
    showAddress: true,
    theme: 'dark',
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Görüntüleme Tercihleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Logo Göster</Label>
            <p className="text-sm text-muted-foreground">Menü üstünde logoyu göster</p>
          </div>
          <Switch
            checked={settings.showLogo}
            onCheckedChange={(v) => setSettings({ ...settings, showLogo: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Video Arka Plan</Label>
            <p className="text-sm text-muted-foreground">4K video arka planı etkinleştir</p>
          </div>
          <Switch
            checked={settings.showVideo}
            onCheckedChange={(v) => setSettings({ ...settings, showVideo: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Adres Göster</Label>
            <p className="text-sm text-muted-foreground">Restoran adresini göster</p>
          </div>
          <Switch
            checked={settings.showAddress}
            onCheckedChange={(v) => setSettings({ ...settings, showAddress: v })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
