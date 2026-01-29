import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Eye,
  Languages,
  Settings,
  Smartphone,
  GraduationCap,
  Headphones,
  Mail,
} from 'lucide-react';

const quickActions = [
  {
    icon: UtensilsCrossed,
    title: 'Kategoriler & Ürünler',
    description: 'Menü kategorilerinizi ve ürünlerinizi yönetin',
    to: '/dashboard/menu',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Eye,
    title: 'Görüntüleme Tercihleri',
    description: 'Menünüzün görünümünü özelleştirin',
    to: '/dashboard/menu?tab=display',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Languages,
    title: 'Çeviri Paneli',
    description: 'Menünüzü farklı dillere çevirin',
    to: '/dashboard/translations',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Settings,
    title: 'Ayarlar',
    description: 'Restoran ve hesap ayarlarınızı düzenleyin',
    to: '/dashboard/settings',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Smartphone,
    title: 'Demo Menü',
    description: 'Menünüzün müşteri görünümünü önizleyin',
    to: '/',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: GraduationCap,
    title: 'Hızlı Eğitim',
    description: 'Platform kullanım rehberini inceleyin',
    to: '#',
    color: 'bg-pink-50 text-pink-600',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-text">
          Hoş Geldiniz! 👋
        </h1>
        <p className="text-text-muted mt-1">
          Kozbeyli Konağı dijital menü yönetim paneline hoş geldiniz. Aşağıdaki
          hızlı erişim kartlarını kullanarak işlemlerinize başlayabilirsiniz.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.to)}
              className="bg-white border border-border rounded-xl p-5 text-left hover:shadow-card hover:border-primary/20 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
              >
                <action.icon size={20} />
              </div>
              <h3 className="font-medium text-[15px] text-text group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-[13px] text-text-muted mt-1">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Support Card */}
      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Headphones size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-text">Destek</h3>
            <p className="text-[13px] text-text-muted mt-1">
              Herhangi bir sorunuz veya sorununuz mu var? Destek ekibimizle
              iletişime geçin.
            </p>
            <a
              href="mailto:destek@foost.com"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-medium hover:underline"
            >
              <Mail size={15} />
              destek@foost.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
