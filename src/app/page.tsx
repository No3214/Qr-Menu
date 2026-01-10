import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QrCode, Utensils, Video, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">QR Menu</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button>Ücretsiz Başla</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Restoranınız için{' '}
            <span className="text-primary">4K Video Destekli</span>{' '}
            Dijital Menü
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Müşterilerinize benzersiz bir deneyim sunun. QR kod ile anında erişilebilen,
            4K video içerikli modern menü sistemi.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <QrCode className="h-5 w-5" />
                Hemen Başla
              </Button>
            </Link>
            <Link href="/r/kozbeyli-konagi">
              <Button size="lg" variant="outline" className="gap-2">
                Demo Menüyü Gör
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">4K Video Desteği</h3>
            <p className="text-gray-600">
              Yemeklerinizi en etkileyici şekilde sergileyin. 4K kalitesinde video içerikler
              ile müşterilerinizi etkileyin.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Utensils className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Kolay Yönetim</h3>
            <p className="text-gray-600">
              Menünüzü kolayca yönetin. Kategoriler, ürünler, fiyatlar ve görsellerinizi
              tek panelden düzenleyin.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detaylı Analitik</h3>
            <p className="text-gray-600">
              Müşteri davranışlarını takip edin. En çok görüntülenen ürünler, ziyaretçi
              istatistikleri ve daha fazlası.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 mt-20 border-t">
        <div className="text-center text-gray-500">
          <p>&copy; 2024 QR Menu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
