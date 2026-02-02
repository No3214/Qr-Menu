import React, { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  User,
  Lock,
  Building2,
  Users,
  QrCode,
  Bot,
  FileText,
  Globe,
  CreditCard,
  Save,
  Upload,
  Download,
  Copy,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

type SettingsSection =
  | 'profile'
  | 'password'
  | 'restaurant'
  | 'guest'
  | 'qr'
  | 'ai'
  | 'pdf'
  | 'language'
  | 'billing';

export function SettingsPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    { id: 'profile' as const, icon: User, labelKey: 'dash.settings.profile' },
    { id: 'password' as const, icon: Lock, labelKey: 'dash.settings.password' },
    { id: 'restaurant' as const, icon: Building2, labelKey: 'dash.settings.restaurant' },
    { id: 'guest' as const, icon: Users, labelKey: 'dash.settings.guest' },
    { id: 'qr' as const, icon: QrCode, labelKey: 'dash.settings.qrCode' },
    { id: 'ai' as const, icon: Bot, labelKey: 'dash.settings.aiChat' },
    { id: 'pdf' as const, icon: FileText, labelKey: 'dash.settings.pdfMenu' },
    { id: 'language' as const, icon: Globe, labelKey: 'dash.settings.languageSetting' },
    { id: 'billing' as const, icon: CreditCard, labelKey: 'dash.settings.billing' },
  ];

  const activeLabel = t(sections.find((s) => s.id === activeSection)?.labelKey || '');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-text">{t('dash.settings.title')}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile dropdown */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium text-text"
          >
            {activeLabel}
            <ChevronDown size={16} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileOpen && (
            <div className="mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => { setActiveSection(section.id); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors ${activeSection === section.id ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50'}`}
                >
                  <section.icon size={17} />
                  {t(section.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 shrink-0 space-y-0.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50 hover:text-text'}`}
            >
              <section.icon size={17} />
              {t(section.labelKey)}
            </button>
          ))}
        </div>

        {/* Settings content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'password' && <PasswordSection />}
          {activeSection === 'restaurant' && <RestaurantSection />}
          {activeSection === 'guest' && <GuestSection />}
          {activeSection === 'qr' && <QRCodeSection />}
          {activeSection === 'ai' && <AIChatSection />}
          {activeSection === 'pdf' && <PDFSection />}
          {activeSection === 'language' && <LanguageSection />}
          {activeSection === 'billing' && <BillingSection />}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {children}
    </div>
  );
}

function InputField({ label, type = 'text', defaultValue = '', placeholder = '' }: { label: string; type?: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
    </div>
  );
}

function Toggle({ defaultOn = false, label }: { defaultOn?: boolean; label?: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} aria-label={label} role="switch" aria-checked={on} className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
}

function SaveButton() {
  const { t } = useLanguage();
  return (
    <div className="flex justify-end pt-2">
      <button onClick={() => toast.success(t('dash.settings.saved'))} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
        <Save size={16} />
        {t('dash.settings.save')}
      </button>
    </div>
  );
}

function ProfileSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.profileInfo')}>
      <div className="flex items-center gap-4 pb-2">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><User size={24} className="text-gray-400" /></div>
        <button className="text-sm text-primary font-medium hover:underline">{t('dash.settings.changePhoto')}</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t('dash.settings.firstName')} defaultValue="Kozbeyli" />
        <InputField label={t('dash.settings.lastName')} defaultValue="Konağı" />
      </div>
      <InputField label={t('dash.settings.email')} type="email" defaultValue="info@kozbeylikonagi.com" />
      <InputField label={t('dash.settings.phone')} type="tel" defaultValue="+90 555 123 4567" />
      <SaveButton />
    </SectionCard>
  );
}

function PasswordSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.changePassword')}>
      <InputField label={t('dash.settings.currentPassword')} type="password" />
      <InputField label={t('dash.settings.newPassword')} type="password" />
      <InputField label={t('dash.settings.confirmPassword')} type="password" />
      <p className="text-xs text-text-muted">{t('dash.settings.passwordHint')}</p>
      <SaveButton />
    </SectionCard>
  );
}

function RestaurantSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.restaurant')}>
      <InputField label={t('dash.settings.restaurantName')} defaultValue="Kozbeyli Konağı" />
      <InputField label={t('dash.settings.restaurantDesc')} defaultValue="Geleneksel Türk Mutfağı" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t('dash.settings.phone')} defaultValue="+90 555 123 4567" />
        <InputField label={t('dash.settings.email')} defaultValue="info@kozbeylikonagi.com" />
      </div>
      <InputField label={t('dash.settings.address')} defaultValue="Kozbeyli Mahallesi, İzmir" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t('dash.settings.city')} defaultValue="İzmir" />
        <InputField label={t('dash.settings.country')} defaultValue="Türkiye" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.logoLabel')}</label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Upload size={20} className="mx-auto text-text-muted mb-1" />
          <p className="text-sm text-text-muted">{t('dash.settings.logoUpload')}</p>
        </div>
      </div>
      <SaveButton />
    </SectionCard>
  );
}

function GuestSection() {
  const { t } = useLanguage();
  const guestFields = [
    { nameKey: 'dash.settings.fullName', defaultOn: true },
    { nameKey: 'dash.settings.email', defaultOn: false },
    { nameKey: 'dash.settings.phone', defaultOn: false },
    { nameKey: 'dash.settings.tableNumber', defaultOn: true },
  ];

  return (
    <SectionCard title={t('dash.settings.guestCollection')}>
      <p className="text-sm text-text-muted">{t('dash.settings.guestCollectionDesc')}</p>
      {guestFields.map((field) => (
        <div key={field.nameKey} className="flex items-center justify-between py-2">
          <span className="text-sm text-text">{t(field.nameKey)}</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-text-muted">
              <input type="checkbox" className="rounded" />
              {t('dash.settings.required')}
            </label>
            <Toggle defaultOn={field.defaultOn} label={`${t(field.nameKey)} collect`} />
          </div>
        </div>
      ))}
      <SaveButton />
    </SectionCard>
  );
}

function QRCodeSection() {
  const { t } = useLanguage();
  const [fgColor, setFgColor] = React.useState('#000000');
  const [bgColor, setBgColor] = React.useState('#FFFFFF');
  const menuUrl = import.meta.env.VITE_MENU_URL || 'https://kozbeyli-konagi.vercel.app';

  const downloadQR = (format: 'png' | 'svg') => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
    const svg = document.getElementById('qr-svg') as SVGSVGElement | null;

    if (format === 'png' && canvas) {
      const link = document.createElement('a');
      link.download = 'kozbeyli-qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success(t('dash.settings.pngDownloaded'));
    } else if (format === 'svg' && svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'kozbeyli-qr-code.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
      toast.success(t('dash.settings.svgDownloaded'));
    }
  };

  return (
    <SectionCard title={t('dash.settings.qrTitle')}>
      <p className="text-sm text-text-muted">{t('dash.settings.qrDesc')}</p>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <code className="text-sm text-text flex-1 truncate">{menuUrl}</code>
        <button onClick={() => { navigator.clipboard.writeText(menuUrl); toast.success(t('dash.settings.copied')); }} aria-label="URL copy" className="p-1.5 rounded hover:bg-gray-200 text-text-muted transition-colors"><Copy size={15} /></button>
        <a href={menuUrl} target="_blank" rel="noopener noreferrer" aria-label="Open link" className="p-1.5 rounded hover:bg-gray-200 text-text-muted transition-colors"><ExternalLink size={15} /></a>
      </div>

      <div className="bg-white border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4">
        <div style={{ background: bgColor, padding: '16px', borderRadius: '12px' }}>
          <QRCodeCanvas id="qr-canvas" value={menuUrl} size={192} fgColor={fgColor} bgColor={bgColor} level="H" includeMargin={false} />
        </div>
        <div style={{ display: 'none' }}>
          <QRCodeSVG id="qr-svg" value={menuUrl} size={192} fgColor={fgColor} bgColor={bgColor} level="H" includeMargin={false} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.fgColor')}</label>
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.bgColor')}</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => downloadQR('png')} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          <Download size={16} />{t('dash.settings.downloadPng')}
        </button>
        <button onClick={() => downloadQR('svg')} className="flex items-center gap-2 border border-border text-text px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download size={16} />{t('dash.settings.downloadSvg')}
        </button>
      </div>
    </SectionCard>
  );
}

function AIChatSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.aiChatSettings')}>
      <p className="text-sm text-text-muted">{t('dash.settings.aiChatDesc')}</p>
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-text">{t('dash.settings.chatBot')}</p>
          <p className="text-xs text-text-muted">{t('dash.settings.chatBotDesc')}</p>
        </div>
        <Toggle defaultOn label="AI chat bot" />
      </div>
      <InputField label={t('dash.settings.welcomeMessage')} defaultValue={t('dash.settings.welcomeDefault')} />
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.botCharacter')}</label>
        <textarea defaultValue={t('dash.settings.botCharacterDefault')} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.aiModel')}</label>
        <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
          <option>Gemini 1.5 Flash</option>
          <option>Gemini 1.5 Pro</option>
        </select>
      </div>
      <SaveButton />
    </SectionCard>
  );
}

function PDFSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.pdfTitle')}>
      <p className="text-sm text-text-muted">{t('dash.settings.pdfDesc')}</p>
      <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
        <div>
          <p className="text-sm font-medium text-text">{t('dash.settings.pdfFileName')}</p>
          <p className="text-xs text-text-muted">{t('dash.settings.pdfLastUpdate')}</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"><Download size={15} />{t('dash.settings.pdfDownload')}</button>
      </div>
      <button className="flex items-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full justify-center"><FileText size={16} />{t('dash.settings.pdfRegenerate')}</button>
    </SectionCard>
  );
}

function LanguageSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.languageSetting')}>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.panelLanguage')}</label>
        <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
          <option>Türkçe</option>
          <option>English</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.menuDefaultLang')}</label>
        <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
          <option>Türkçe</option>
          <option>English</option>
          <option>Deutsch</option>
          <option>العربية</option>
        </select>
      </div>
      <SaveButton />
    </SectionCard>
  );
}

function BillingSection() {
  const { t } = useLanguage();
  const features = [
    'dash.settings.feat.unlimitedProducts',
    'dash.settings.feat.qrGenerator',
    'dash.settings.feat.aiChatBot',
    'dash.settings.feat.analytics',
    'dash.settings.feat.multiLang',
    'dash.settings.feat.prioritySupport',
  ];

  return (
    <SectionCard title={t('dash.settings.billing')}>
      <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text">{t('dash.settings.premiumPlan')}</p>
            <p className="text-xs text-text-muted mt-0.5">{t('dash.settings.monthlyBilling')}</p>
          </div>
          <span className="text-lg font-bold text-primary">₺299/ay</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-text mb-2">{t('dash.settings.planFeatures')}</p>
        <ul className="space-y-1.5 text-sm text-text-muted">
          {features.map((featureKey) => (
            <li key={featureKey} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success" />{t(featureKey)}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">{t('dash.settings.changePlan')}</button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"><CreditCard size={16} />{t('dash.settings.paymentMethod')}</button>
      </div>
    </SectionCard>
  );
}
