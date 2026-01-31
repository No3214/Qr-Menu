import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  UtensilsCrossed,
  CalendarDays,
  BarChart3,
  MessageSquare,
  Languages,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Ana Sayfa', end: true },
  { to: '/dashboard/menu', icon: UtensilsCrossed, label: 'Menü Yönetimi' },
  { to: '/dashboard/events', icon: CalendarDays, label: 'Etkinlik Tanıtımı' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analitik' },
  { to: '/dashboard/reviews', icon: MessageSquare, label: 'Yorumlar' },
  { to: '/dashboard/translations', icon: Languages, label: 'Çeviri' },
  { to: '/dashboard/settings', icon: Settings, label: 'Ayarlar' },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'TR' | 'EN'>('TR');
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          role="button"
          aria-label="Menü kapat"
          tabIndex={0}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-white border-r border-border
          flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center overflow-hidden">
              <img src="/assets/logo-dark.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-[16px] text-text whitespace-nowrap">Kozbeyli Konağı</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Menü kapat"
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${isActive
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:bg-gray-50 hover:text-text'
                }`
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border p-3 space-y-1">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'TR' ? 'EN' : 'TR')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-text-muted hover:bg-gray-50 hover:text-text transition-colors"
          >
            <Globe size={19} />
            Dil: {language}
          </button>

          {/* Logout */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-text-muted hover:bg-gray-50 hover:text-text transition-colors"
          >
            <LogOut size={19} />
            Çıkış Yap
          </button>

          {/* Connection Status */}
          <div className="pt-2">
            <div className={`
              text-xs px-2 py-1.5 rounded-md flex items-center justify-center gap-2 font-medium border
              ${import.meta.env.VITE_SUPABASE_URL
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'}
            `}>
              <div className={`w-2 h-2 rounded-full ${import.meta.env.VITE_SUPABASE_URL ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {import.meta.env.VITE_SUPABASE_URL ? 'Veritabanı: Aktif' : 'Veritabanı: Demo'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center px-5 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Menü aç"
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
          >
            <ChevronLeft size={16} />
            Menüye Dön
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
              <img src="/assets/logo-dark.jpg" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
