import {
  MousePointerClick,
  Eye,
  Users,
  QrCode,
  TrendingUp,
  TrendingDown,
  Clock,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../services/MenuData';

const stats = [
  {
    label: 'Toplam Tıklama',
    value: '202',
    change: '+12%',
    trend: 'up' as const,
    icon: MousePointerClick,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Toplam Görüntüleme',
    value: '921',
    change: '+8%',
    trend: 'up' as const,
    icon: Eye,
    color: 'bg-green-50 text-green-600',
  },
  {
    label: 'Toplam Oturum',
    value: '1,253',
    change: '+15%',
    trend: 'up' as const,
    icon: Users,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    label: 'QR Tarama',
    value: '847',
    change: '+5%',
    trend: 'up' as const,
    icon: QrCode,
    color: 'bg-orange-50 text-orange-600',
  },
];

const topClicked = PRODUCTS.slice(0, 5).map((p, i) => ({
  name: p.name,
  clicks: [89, 76, 64, 52, 41][i],
}));

const topCategories = CATEGORIES.slice(0, 5).map((c, i) => ({
  name: c.title,
  views: [312, 245, 198, 167, 134][i],
}));

const leastViewed = PRODUCTS.slice(-5).map((p, i) => ({
  name: p.name,
  views: [3, 5, 7, 9, 12][i],
}));

const devices = [
  { name: 'iOS', percent: 42, icon: Smartphone },
  { name: 'Android', percent: 35, icon: Smartphone },
  { name: 'Windows', percent: 15, icon: Monitor },
  { name: 'Mac', percent: 8, icon: Monitor },
];

const peakHours = [
  { hour: '12:00', sessions: 89 },
  { hour: '13:00', sessions: 124 },
  { hour: '14:00', sessions: 76 },
  { hour: '18:00', sessions: 95 },
  { hour: '19:00', sessions: 156 },
  { hour: '20:00', sessions: 187 },
  { hour: '21:00', sessions: 143 },
  { hour: '22:00', sessions: 67 },
];

const maxSessions = Math.max(...peakHours.map((h) => h.sessions));

export function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Analitik</h1>
        <select className="px-3 py-2 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-primary">
          <option>Son 7 gün</option>
          <option>Son 30 gün</option>
          <option>Son 90 gün</option>
          <option>Tüm zamanlar</option>
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={18} />
              </div>
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  stat.trend === 'up' ? 'text-success' : 'text-danger'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clicked Products */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">
            En Çok Tıklanan Ürünler
          </h3>
          <div className="space-y-3">
            {topClicked.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted w-5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-medium text-text-muted ml-2">
                      {item.clicks}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(item.clicks / topClicked[0].clicks) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Viewed Categories */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">
            En Çok Görüntülenen Kategoriler
          </h3>
          <div className="space-y-3">
            {topCategories.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted w-5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-medium text-text-muted ml-2">
                      {item.views}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(item.views / topCategories[0].views) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Least Viewed */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">
            En Az Görüntülenen Ürünler
          </h3>
          <div className="space-y-2.5">
            {leastViewed.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5"
              >
                <span className="text-sm text-text truncate">{item.name}</span>
                <span className="text-xs font-medium text-danger ml-2">
                  {item.views} görüntüleme
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Avg Time & Devices */}
        <div className="bg-white border border-border rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-text mb-2">
              Ortalama Menü Süresi
            </h3>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <span className="text-2xl font-bold text-text">3dk 41sn</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text mb-3">
              Cihaz Dağılımı
            </h3>
            <div className="space-y-2.5">
              {devices.map((device) => (
                <div key={device.name} className="flex items-center gap-3">
                  <device.icon size={15} className="text-text-muted" />
                  <span className="text-sm text-text w-16">{device.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-primary/70 rounded-full"
                      style={{ width: `${device.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text-muted w-8 text-right">
                    %{device.percent}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Source */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">
            Trafik Kaynakları
          </h3>
          <div className="space-y-3">
            {[
              { source: 'QR Kod (Masa)', percent: 62, color: 'bg-primary' },
              { source: 'QR Kod (Giriş)', percent: 21, color: 'bg-green-500' },
              { source: 'Doğrudan Link', percent: 12, color: 'bg-orange-500' },
              { source: 'Sosyal Medya', percent: 5, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text">{item.source}</span>
                  <span className="text-xs font-medium text-text-muted">
                    %{item.percent}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text mb-4">
          Yoğun Saatler
        </h3>
        <div className="flex items-end gap-3 h-40">
          {peakHours.map((item) => (
            <div
              key={item.hour}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] font-medium text-text-muted">
                {item.sessions}
              </span>
              <div
                className="w-full bg-primary rounded-t-md transition-all group hover:bg-primary-hover"
                style={{
                  height: `${(item.sessions / maxSessions) * 100}%`,
                }}
              />
              <span className="text-[10px] text-text-muted">{item.hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
