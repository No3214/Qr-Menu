import React, { useState } from 'react';
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
          onClick={() => setSidebarOpen(false)}
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
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-[17px] text-text">FOOST</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
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
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center px-5 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-xs">KK</span>
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
