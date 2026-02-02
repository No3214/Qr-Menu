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
import { useLanguage } from '../../context/LanguageContext';

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const quickActions = [
    {
      icon: UtensilsCrossed,
      titleKey: 'dash.action.categories',
      descKey: 'dash.action.categoriesDesc',
      to: '/dashboard/menu',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Eye,
      titleKey: 'dash.action.display',
      descKey: 'dash.action.displayDesc',
      to: '/dashboard/menu?tab=display',
      color: 'bg-purple-50 text-purple-600',
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
    {
      icon: GraduationCap,
      titleKey: 'dash.action.tutorial',
      descKey: 'dash.action.tutorialDesc',
      to: '/dashboard/settings',
      color: 'bg-pink-50 text-pink-600',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-text">
          {t('dash.welcome')} 👋
        </h1>
        <p className="text-text-muted mt-1">
          {t('dash.welcomeDesc')}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text mb-4">{t('dash.quickAccess')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.titleKey}
              onClick={() => navigate(action.to)}
              className="bg-white border border-border rounded-xl p-5 text-left hover:shadow-card hover:border-primary/20 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
              >
                <action.icon size={20} />
              </div>
              <h3 className="font-medium text-[15px] text-text group-hover:text-primary transition-colors">
                {t(action.titleKey)}
              </h3>
              <p className="text-[13px] text-text-muted mt-1">
                {t(action.descKey)}
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
            <h3 className="font-semibold text-text">{t('dash.support')}</h3>
            <p className="text-[13px] text-text-muted mt-1">
              {t('dash.supportDesc')}
            </p>
            <a
              href="mailto:info@kozbeylikonagi.com"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-medium hover:underline"
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
