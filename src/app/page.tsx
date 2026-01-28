import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  QrCode,
  Utensils,
  Video,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Smartphone,
  Star,
  ArrowRight,
  Check,
  Play,
  ChevronRight,
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Video,
      title: '4K Video Desteği',
      description: 'Yemeklerinizi sinematik kalitede sergileyin. Müşterilerinizi görsel bir şölenle karşılayın.',
      color: 'bg-red-500',
    },
    {
      icon: Smartphone,
      title: 'Mobil Öncelikli',
      description: 'Tüm cihazlarda mükemmel görünüm. QR kod ile saniyeler içinde erişim.',
      color: 'bg-blue-500',
    },
    {
      icon: Globe,
      title: 'Çoklu Dil Desteği',
      description: 'Türkçe, İngilizce ve daha fazlası. Uluslararası misafirlerinize kendi dillerinde hizmet verin.',
      color: 'bg-green-500',
    },
    {
      icon: BarChart3,
      title: 'Akıllı Analitik',
      description: 'En popüler ürünlerinizi keşfedin. Müşteri davranışlarını anlayın ve satışlarınızı artırın.',
      color: 'bg-purple-500',
    },
    {
      icon: Zap,
      title: 'Anlık Güncelleme',
      description: 'Fiyat ve menü değişiklikleri anında yansır. Basılı menü maliyetlerine son.',
      color: 'bg-yellow-500',
    },
    {
      icon: Shield,
      title: 'Güvenli Altyapı',
      description: 'Verileriniz güvende. SSL şifreleme ve enterprise düzey güvenlik.',
      color: 'bg-gray-700',
    },
  ]

  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Restoran Sahibi',
      content: 'Müşterilerimiz menüyü çok beğendi. Özellikle 4K videolar büyük ilgi görüyor.',
      rating: 5,
    },
    {
      name: 'Elif Demir',
      role: 'Kafe İşletmecisi',
      content: 'Çoklu dil desteği turistik bölgede büyük avantaj. Kesinlikle tavsiye ederim.',
      rating: 5,
    },
    {
      name: 'Mehmet Kaya',
      role: 'Otel F&B Müdürü',
      content: 'Analitik raporlar sayesinde en çok satılan ürünlerimizi optimize ettik.',
      rating: 5,
    },
  ]

  const stats = [
    { value: '10K+', label: 'Aktif Menü' },
    { value: '1M+', label: 'Aylık Görüntüleme' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9', label: 'Kullanıcı Puanı' },
  ]

  const pricingPlans = [
    {
      name: 'Başlangıç',
      price: 'Ücretsiz',
      description: 'Küçük işletmeler için ideal',
      features: ['1 Restoran', '50 Ürün', 'QR Kod', 'Temel Analitik'],
      cta: 'Ücretsiz Başla',
      popular: false,
    },
    {
      name: 'Profesyonel',
      price: '₺299',
      period: '/ay',
      description: 'Büyüyen işletmeler için',
      features: ['5 Restoran', 'Sınırsız Ürün', '4K Video', 'Çoklu Dil', 'Gelişmiş Analitik', 'Öncelikli Destek'],
      cta: 'Denemeye Başla',
      popular: true,
    },
    {
      name: 'Kurumsal',
      price: 'Özel',
      description: 'Büyük zincirler için',
      features: ['Sınırsız Restoran', 'API Erişimi', 'Özel Entegrasyonlar', 'Dedicated Destek', 'SLA Garantisi'],
      cta: 'İletişime Geç',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GRAIN</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Özellikler</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Fiyatlar</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Yorumlar</a>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:flex">Giriş Yap</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Ücretsiz Başla</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              2026&apos;nın En Yeni QR Menü Platformu
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up stagger-1">
              Restoranınız İçin{' '}
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                Premium Dijital Menü
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-2">
              4K video desteği, akıllı analitik ve çoklu dil seçenekleriyle müşterilerinize
              unutulmaz bir deneyim sunun.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
              <Link href="/register">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white gap-2 h-14 px-8 text-lg">
                  <QrCode className="h-5 w-5" />
                  Ücretsiz Dene
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-lg border-2">
                  <Play className="h-5 w-5" />
                  Demo Menüyü Gör
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-gray-400 text-sm animate-fade-in-up stagger-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>SSL Korumalı</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span>Kurulum 2 Dakika</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>4.9 Kullanıcı Puanı</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-4 md:p-8 shadow-2xl max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-900 h-8 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="aspect-[16/9] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Utensils className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Menü Önizleme</h3>
                    <p className="text-gray-600 mb-4">Demo menüyü görmek için tıklayın</p>
                    <Link href="/demo">
                      <Button className="bg-gray-900 hover:bg-gray-800">
                        Menüyü Aç
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              İşletmenizi Büyütecek Özellikler
            </h2>
            <p className="text-gray-600 text-lg">
              Modern restoran yönetimi için ihtiyacınız olan her şey tek platformda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Şeffaf Fiyatlandırma
            </h2>
            <p className="text-gray-600 text-lg">
              İşletmenizin büyüklüğüne uygun plan seçin. Gizli maliyet yok.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gray-900 text-white scale-105 shadow-2xl'
                    : 'bg-white border border-gray-200 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-sm font-semibold text-gray-900">
                    En Popüler
                  </div>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={plan.popular ? 'text-gray-400' : 'text-gray-500'}>{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className={`h-5 w-5 ${plan.popular ? 'text-green-400' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-gray-600 text-lg">
              Binlerce işletme GRAIN ile dijital dönüşümünü tamamladı.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dijital Menünüzü Bugün Oluşturun
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            2 dakikada kurulumu tamamlayın, müşterilerinize modern bir deneyim sunmaya başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 gap-2 h-14 px-8 text-lg">
                <QrCode className="h-5 w-5" />
                Ücretsiz Başla
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2 h-14 px-8 text-lg">
                Demo Menüyü İncele
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GRAIN</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-gray-900 transition-colors">İletişim</a>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2026 GRAIN. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
