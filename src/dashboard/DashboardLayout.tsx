
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Menu as MenuIcon,
  Settings,
  LogOut,
  Calendar,
  MessageSquare,
  Globe,
  Home,
  ChevronLeft,
  ChevronRight,
  User,
  Languages
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

export const DashboardLayout: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('dash.nav.panel') },
    { path: '/dashboard/menu', icon: MenuIcon, label: t('dash.nav.menu') },
    { path: '/dashboard/events', icon: Calendar, label: t('dash.nav.events') },
    { path: '/dashboard/analytics', icon: BarChart3, label: t('dash.nav.analytics') },
    { path: '/dashboard/reviews', icon: MessageSquare, label: t('dash.nav.reviews') },
    { path: '/dashboard/translations', icon: Globe, label: t('dash.nav.translations') },
    { path: '/dashboard/settings', icon: Settings, label: t('dash.nav.settings') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside
        className={`
                    ${isSidebarOpen ? 'w-72' : 'w-24'} 
                    bg-stone-900 border-r border-stone-800 transition-all duration-500 ease-in-out relative flex flex-col z-50
                `}
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-black text-white italic">K</span>
          </div>
          {isSidebarOpen && (
            <div className="animate-fade-in whitespace-nowrap">
              <h2 className="text-white font-black text-xs tracking-[0.2em] uppercase">Kozbeyli</h2>
              <p className="text-stone-500 text-[9px] font-bold uppercase tracking-widest">Digital Admin</p>
            </div>
          )}
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-12 bg-primary text-stone-950 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl z-[60]"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-10 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative
                                ${isActive
                  ? 'bg-primary text-stone-950 shadow-[0_10px_20px_-10px_rgba(197,160,89,0.5)]'
                  : 'text-stone-500 hover:text-white hover:bg-white/5'
                }
                            `}
            >
              <item.icon className={`w-5 h-5 ${isSidebarOpen ? '' : 'mx-auto'}`} />
              {isSidebarOpen && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-stone-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Controls */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-stone-500 hover:text-white hover:bg-white/5 transition-all group"
          >
            <Languages className={`w-5 h-5 ${isSidebarOpen ? '' : 'mx-auto'}`} />
            {isSidebarOpen && (
              <span className="text-sm font-bold tracking-tight">
                {t('dash.nav.language')} ({language.toUpperCase()})
              </span>
            )}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-stone-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {t('dash.nav.language')}
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-stone-500 hover:text-white hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut className={`w-5 h-5 ${isSidebarOpen ? '' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="text-sm font-bold tracking-tight">{t('dash.nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white border-b border-stone-100 flex items-center justify-between px-10 flex-shrink-0">
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-1">{t('dash.header.workspace')}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-stone-900">{t('dash.header.branch')}</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-sm font-bold text-stone-900">Admin Panel</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Kozbeyli Konağı</span>
            </div>
            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100">
              <User className="w-5 h-5 text-stone-400" />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
