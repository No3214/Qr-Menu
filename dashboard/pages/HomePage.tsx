import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Eye,
  Languages,
  Settings,
  Smartphone,
  Headphones,
  Mail,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  ChefHat,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS, CATEGORIES } from '../../services/MenuData';

// Stats Card Component (Foost style)
interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-md duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className="p-2.5 bg-emerald-50 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`flex items-center gap-0.5 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </span>
        <span className="text-xs text-slate-400">vs geçen ay</span>
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Calculate stats from menu data
  const totalProducts = PRODUCTS.length;
  const totalCategories = CATEGORIES.length;
  const popularProducts = PRODUCTS.filter(p => p.isPopular).length;

  const quickActions = [
    {
      icon: UtensilsCrossed,
      titleKey: 'dash.action.categories',
      descKey: 'dash.action.categoriesDesc',
      to: '/dashboard/menu',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Sparkles,
      titleKey: 'dash.aiRecommendations',
      descKey: 'dash.action.aiDesc',
      to: '/dashboard/menu?tab=recommendations',
      color: 'bg-purple-50 text-purple-600',
      badge: 'New',
    },
    {
      icon: Eye,
      titleKey: 'dash.action.display',
      descKey: 'dash.action.displayDesc',
      to: '/dashboard/menu?tab=display',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: Languages,
      titleKey: 'dash.action.translation',
      descKey: 'dash.action.translationDesc',
      to: '/dashboard/translations',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Settings,
      titleKey: 'dash.settings.title',
      descKey: 'dash.action.settingsDesc',
      to: '/dashboard/settings',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Smartphone,
      titleKey: 'dash.action.demo',
      descKey: 'dash.action.demoDesc',
      to: '/',
      color: 'bg-teal-50 text-teal-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('dash.welcome')} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {t('dash.welcomeDesc')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {t('dash.analytics.title')}
          </button>
          <button
            onClick={() => navigate('/dashboard/menu')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            {t('dash.menu.addProduct')}
          </button>
        </div>
      </div>

      {/* Stats Cards (Foost style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={t('dash.stats.totalProducts')}
          value={totalProducts.toString()}
          change="+5"
          trend="up"
          icon={ShoppingBag}
        />
        <StatsCard
          title={t('dash.stats.categories')}
          value={totalCategories.toString()}
          change="+2"
          trend="up"
          icon={UtensilsCrossed}
        />
        <StatsCard
          title={t('dash.stats.popularItems')}
          value={popularProducts.toString()}
          change="+3"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - 2 columns */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t('dash.quickAccess')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.titleKey}
                onClick={() => navigate(action.to)}
                className="bg-white border border-slate-100 rounded-xl p-5 text-left hover:shadow-md hover:border-emerald-200 transition-all group relative"
              >
                {action.badge && (
                  <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                    {action.badge}
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
                >
                  <action.icon size={20} />
                </div>
                <h3 className="font-semibold text-[15px] text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {t(action.titleKey)}
                </h3>
                <p className="text-[13px] text-slate-500 mt-1">
                  {t(action.descKey)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* AI Insights Panel (Foost style) - 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xl p-6 relative overflow-hidden h-full">
            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl translate-x-10 -translate-y-10" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-lg">{t('dash.ai.title')}</h3>
              </div>

              <div className="bg-white/10 p-4 rounded-lg mb-4 backdrop-blur-sm">
                <p className="text-sm text-slate-200 leading-relaxed">
                  "{t('dash.ai.suggestion')}"
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard/menu?tab=recommendations')}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t('dash.ai.applySuggestion')}
              </button>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400 text-center">
                  {t('dash.ai.poweredBy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Headphones size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{t('dash.support')}</h3>
            <p className="text-[13px] text-slate-500 mt-1">
              {t('dash.supportDesc')}
            </p>
            <a
              href="mailto:info@kozbeylikonagi.com"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-emerald-600 font-medium hover:underline"
            >
              <Mail size={15} />
              info@kozbeylikonagi.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
