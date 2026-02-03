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
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { to: '/dashboard', icon: Home, labelKey: 'dash.home', end: true },
  { to: '/dashboard/menu', icon: UtensilsCrossed, labelKey: 'dash.menuManagement' },
  { to: '/dashboard/menu?tab=recommendations', icon: Sparkles, labelKey: 'dash.aiRecommendations', badge: 'New' },
  { to: '/dashboard/events', icon: CalendarDays, labelKey: 'dash.events' },
  { to: '/dashboard/analytics', icon: BarChart3, labelKey: 'dash.analytics' },
  { to: '/dashboard/reviews', icon: MessageSquare, labelKey: 'dash.reviews' },
  { to: '/dashboard/translations', icon: Languages, labelKey: 'dash.translations' },
  { to: '/dashboard/settings', icon: Settings, labelKey: 'dash.settings' },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          role="button"
          aria-label={t('dash.closeSidebar')}
          tabIndex={0}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Theme (Foost style) */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-slate-900 border-r border-slate-800
          flex flex-col transition-transform duration-200 shadow-xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center overflow-hidden">
              <img src="/assets/logo-dark.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-[16px] text-white whitespace-nowrap">{t('landing.brandName')}<span className="text-emerald-500">.</span></span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label={t('dash.closeSidebar')}
            className="lg:hidden p-1 rounded hover:bg-slate-800 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to + item.labelKey}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={19} />
              <span>{t(item.labelKey)}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Globe size={19} />
            {t('dash.language')}: {language.toUpperCase()}
          </button>

          {/* Logout */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[14px] font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={19} />
            {t('dash.logout')}
          </button>

          {/* Connection Status */}
          <div className="pt-2">
            <div className={`
              text-xs px-2 py-1.5 rounded-md flex items-center justify-center gap-2 font-medium
              ${import.meta.env.VITE_SUPABASE_URL
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}
            `}>
              <div className={`w-2 h-2 rounded-full ${import.meta.env.VITE_SUPABASE_URL ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {import.meta.env.VITE_SUPABASE_URL ? t('dash.dbActive') : t('dash.dbDemo')}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label={t('menu')}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={16} />
            {t('dash.backToMenu')}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
              <img src="/assets/logo-dark.jpg" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
