import React, { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  User,
  Lock,
  Building2,
  Users,
  QrCode,
  Wifi,
  Bot,
  FileText,
  Megaphone,
  CreditCard,
  Save,
  Upload,
  Download,
  Copy,
  ExternalLink,
  ChevronDown,
  Mail,
  Bell,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';



import { useLanguage } from '../../context/LanguageContext';

type SettingsSection =
  | 'profile'
  | 'password'
  | 'restaurant'
  | 'guest'
  | 'qr'
  | 'wifi'
  | 'ai'
  | 'pdf'
  | 'marketing'
  | 'billing';

export function SettingsPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    { id: 'profile' as const, icon: User, label: t('dash.settings.sections.profile') },
    { id: 'password' as const, icon: Lock, label: t('dash.settings.sections.password') },
    { id: 'restaurant' as const, icon: Building2, label: t('dash.settings.sections.restaurant') },
    { id: 'guest' as const, icon: Users, label: t('dash.settings.sections.guest') },
    { id: 'qr' as const, icon: QrCode, label: t('dash.settings.sections.qr') },
    { id: 'wifi' as const, icon: Wifi, label: t('dash.settings.sections.wifi') },
    { id: 'ai' as const, icon: Bot, label: t('dash.settings.sections.ai') },
    { id: 'pdf' as const, icon: FileText, label: t('dash.settings.sections.pdf') },
    { id: 'marketing' as const, icon: Megaphone, label: t('dash.settings.sections.marketing') },
    { id: 'billing' as const, icon: CreditCard, label: t('dash.settings.sections.billing') },
  ];

  const activeLabel = sections.find((s) => s.id === activeSection)?.label || '';

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
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors ${activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:bg-gray-50'
                    }`}
                >
                  <section.icon size={17} />
                  {section.label}
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id
                ? 'bg-primary text-white'
                : 'text-text-muted hover:bg-gray-50 hover:text-text'
                }`}
            >
              <section.icon size={17} />
              {section.label}
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
          {activeSection === 'wifi' && <WiFiSection />}
          {activeSection === 'ai' && <AIChatSection />}
          {activeSection === 'pdf' && <PDFSection />}
          {activeSection === 'marketing' && <MarketingSection />}
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
      <button onClick={() => toast.success(t('dash.settings.save'))} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
        <Save size={16} />
        {t('dash.settings.saveBtn')}
      </button>
    </div>
  );
}

function ProfileSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.profile.title')}>
      <div className="flex items-center gap-4 pb-2">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><User size={24} className="text-gray-400" /></div>
        <button className="text-sm text-primary font-medium hover:underline">{t('dash.settings.profile.changePhoto')}</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t('dash.settings.profile.firstName')} defaultValue="Kozbeyli" />
        <InputField label={t('dash.settings.profile.lastName')} defaultValue="Konağı" />
      </div>
      <InputField label={t('dash.settings.profile.email')} type="email" defaultValue="info@kozbeylikonagi.com" />
      <InputField label={t('dash.settings.profile.phone')} type="tel" defaultValue="+90 555 123 4567" />
      <SaveButton />
    </SectionCard>
  );
}

function PasswordSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.password.title')}>
      <InputField label={t('dash.settings.password.current')} type="password" />
      <InputField label={t('dash.settings.password.new')} type="password" />
      <InputField label={t('dash.settings.password.confirm')} type="password" />
      <p className="text-xs text-text-muted">{t('dash.settings.password.hint')}</p>
      <SaveButton />
    </SectionCard>
  );
}

function RestaurantSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.rest.title')}>
      <InputField label={t('dash.settings.rest.name')} defaultValue="Kozbeyli Konağı" />
      <InputField label={t('dash.settings.rest.desc')} defaultValue="Geleneksel Türk Mutfağı" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t('dash.settings.rest.phone')} defaultValue="+90 555 123 4567" />
        <InputField label={t('dash.settings.rest.email')} defaultValue="info@kozbeylikonagi.com" />
      </div>
      <InputField label={t('dash.settings.rest.address')} defaultValue="Kozbeyli Mahallesi, İzmir" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t('dash.settings.rest.city')} defaultValue="İzmir" />
        <InputField label={t('dash.settings.rest.country')} defaultValue="Türkiye" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.rest.logo')}</label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Upload size={20} className="mx-auto text-text-muted mb-1" />
          <p className="text-sm text-text-muted">{t('dash.settings.rest.logoUpload')}</p>
        </div>
      </div>
      <SaveButton />
    </SectionCard>
  );
}

function GuestSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.guest.title')}>
      <p className="text-sm text-text-muted">{t('dash.settings.guest.desc')}</p>
      {[
        { label: t('dash.settings.profile.firstName') + ' ' + t('dash.settings.profile.lastName'), key: 'name' },
        { label: t('dash.settings.profile.email'), key: 'email' },
        { label: t('dash.settings.profile.phone'), key: 'phone' },
        { label: 'Masa Numarası', key: 'table' }
      ].map((field) => (
        <div key={field.key} className="flex items-center justify-between py-2">
          <span className="text-sm text-text">{field.label}</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-text-muted">
              <input type="checkbox" className="rounded" />
              {t('dash.settings.guest.required')}
            </label>
            <Toggle defaultOn={field.key === 'name' || field.key === 'table'} label={t('dash.settings.guest.collect').replace('{field}', field.label)} />
          </div>
        </div>
      ))}
      <SaveButton />
    </SectionCard>
  );
}

function QRCodeSection() {
  const { t } = useLanguage();
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const menuUrl = 'https://qr-menu-one-iota.vercel.app';

  const downloadQR = (format: 'png' | 'svg') => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
    const svg = document.getElementById('qr-svg') as SVGSVGElement | null;

    if (format === 'png' && canvas) {
      const link = document.createElement('a');
      link.download = 'kozbeyli-qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success(t('dash.settings.qr.downloaded').replace('{format}', 'PNG'));
    } else if (format === 'svg' && svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'kozbeyli-qr-code.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
      toast.success(t('dash.settings.qr.downloaded').replace('{format}', 'SVG'));
    }
  };

  return (
    <SectionCard title={t('dash.settings.qr.title')}>
      <p className="text-sm text-text-muted">{t('dash.settings.qr.desc')}</p>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <code className="text-sm text-text flex-1 truncate">{menuUrl}</code>
        <button onClick={() => { navigator.clipboard.writeText(menuUrl); toast.success('Kopyalandı'); }} aria-label={t('dash.settings.qr.copy')} className="p-1.5 rounded hover:bg-gray-200 text-text-muted transition-colors"><Copy size={15} /></button>
        <a href={menuUrl} target="_blank" rel="noopener noreferrer" aria-label={t('dash.settings.qr.open')} className="p-1.5 rounded hover:bg-gray-200 text-text-muted transition-colors"><ExternalLink size={15} /></a>
      </div>

      {/* QR Code Preview */}
      <div className="bg-white border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4">
        <div style={{ background: bgColor, padding: '16px', borderRadius: '12px' }}>
          {/* Canvas version for PNG download */}
          <QRCodeCanvas
            id="qr-canvas"
            value={menuUrl}
            size={192}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            includeMargin={false}
          />
        </div>
        {/* Hidden SVG for SVG download */}
        <div style={{ display: 'none' }}>
          <QRCodeSVG
            id="qr-svg"
            value={menuUrl}
            size={192}
            fgColor={fgColor}
            bgColor={bgColor}
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.qr.fg')}</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-full h-10 rounded-lg border border-border cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.qr.bg')}</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded-lg border border-border cursor-pointer"
          />
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => downloadQR('png')}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Download size={16} />{t('dash.settings.qr.png')}
        </button>
        <button
          onClick={() => downloadQR('svg')}
          className="flex items-center gap-2 border border-border text-text px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />{t('dash.settings.qr.svg')}
        </button>
      </div>
    </SectionCard>
  );
}

function AIChatSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.ai.title')}>
      <p className="text-sm text-text-muted">{t('dash.settings.ai.desc')}</p>
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-text">{t('dash.settings.ai.toggle')}</p>
          <p className="text-xs text-text-muted">{t('dash.settings.ai.toggleHint')}</p>
        </div>
        <Toggle defaultOn label={t('dash.settings.ai.toggle')} />
      </div>
      <InputField label={t('dash.settings.ai.welcome')} defaultValue="Merhaba! Size nasıl yardımcı olabilirim?" />
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.ai.persona')}</label>
        <textarea defaultValue="Kozbeyli Konağı'nın yardımcı asistanı olarak, menü hakkında bilgi verin. Nazik ve profesyonel olun." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.ai.model')}</label>
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
    <SectionCard title={t('dash.settings.pdf.title')}>
      <p className="text-sm text-text-muted">{t('dash.settings.pdf.desc')}</p>
      <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
        <div>
          <p className="text-sm font-medium text-text">Kozbeyli Konağı Menü.pdf</p>
          <p className="text-xs text-text-muted">{t('dash.settings.pdf.lastUpdate').replace('{date}', '20 Ocak 2025')}</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"><Download size={15} />{t('dash.settings.pdf.download')}</button>
      </div>
      <button className="flex items-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full justify-center"><FileText size={16} />{t('dash.settings.pdf.regenerate')}</button>
    </SectionCard>
  );
}

function WiFiSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.wifi.title')}>
      <p className="text-sm text-text-muted">{t('dash.settings.wifi.desc')}</p>
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-text">{t('dash.settings.wifi.show')}</p>
          <p className="text-xs text-text-muted">{t('dash.settings.wifi.showHint')}</p>
        </div>
        <Toggle defaultOn label={t('dash.settings.wifi.show')} />
      </div>
      <InputField label={t('dash.settings.wifi.name')} defaultValue="Kozbeyli_Misafir" placeholder="Wi-Fi ağ adı" />
      <InputField label={t('dash.settings.wifi.password')} defaultValue="kozbeyli2024" placeholder="Wi-Fi şifresi" />
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">{t('dash.settings.wifi.security')}</label>
        <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
          <option value="WPA2">WPA2</option>
          <option value="WPA3">WPA3</option>
          <option value="WEP">WEP</option>
          <option value="none">{t('dash.settings.wifi.noPassword')}</option>
        </select>
      </div>
      <SaveButton />
    </SectionCard>
  );
}

function MarketingSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.marketing.title')}>
      <p className="text-sm text-text-muted">{t('dash.settings.marketing.desc')}</p>

      {/* Email Marketing */}
      <div className="p-4 border border-border rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text">{t('dash.settings.marketing.email')}</p>
            <p className="text-xs text-text-muted">{t('dash.settings.marketing.emailDesc')}</p>
          </div>
          <Toggle defaultOn label={t('dash.settings.marketing.email')} />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="p-4 border border-border rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text">{t('dash.settings.marketing.push')}</p>
            <p className="text-xs text-text-muted">{t('dash.settings.marketing.pushDesc')}</p>
          </div>
          <Toggle defaultOn={false} label={t('dash.settings.marketing.push')} />
        </div>
      </div>

      {/* Social Media Integration */}
      <div className="p-4 border border-border rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <Share2 size={20} className="text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text">{t('dash.settings.marketing.social')}</p>
            <p className="text-xs text-text-muted">{t('dash.settings.marketing.socialDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Instagram" placeholder="@kozbeylikonagi" defaultValue="@kozbeylikonagi" />
          <InputField label="Facebook" placeholder="kozbeylikonagi" defaultValue="kozbeylikonagi" />
        </div>
      </div>

      {/* Promotional Popups */}
      <div className="p-4 border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">{t('dash.settings.marketing.popup')}</p>
            <p className="text-xs text-text-muted">{t('dash.settings.marketing.popupDesc')}</p>
          </div>
          <Toggle defaultOn label={t('dash.settings.marketing.popup')} />
        </div>
      </div>

      <SaveButton />
    </SectionCard>
  );
}

function BillingSection() {
  const { t } = useLanguage();
  return (
    <SectionCard title={t('dash.settings.bill.title')}>
      <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text">{t('dash.settings.bill.premium')}</p>
            <p className="text-xs text-text-muted mt-0.5">{t('dash.settings.bill.next').replace('{date}', '15 Şubat 2025')}</p>
          </div>
          <span className="text-lg font-bold text-primary">₺299/ay</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-text mb-2">{t('dash.settings.bill.features')}</p>
        <ul className="space-y-1.5 text-sm text-text-muted">
          {['Sınırsız ürün ekleme', 'QR Kod oluşturucu', 'AI Sohbet Botu', 'Analitik dashboard', 'Çoklu dil desteği', 'Öncelikli destek'].map((feature) => (
            <li key={feature} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success" />{feature}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">{t('dash.settings.bill.change')}</button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"><CreditCard size={16} />{t('dash.settings.bill.method')}</button>
      </div>
    </SectionCard>
  );
}
