import React, { useState } from 'react';
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
  ImageIcon,
  Copy,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

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

const sections = [
  { id: 'profile' as const, icon: User, label: 'Profil' },
  { id: 'password' as const, icon: Lock, label: 'Şifre' },
  { id: 'restaurant' as const, icon: Building2, label: 'Restoran Bilgileri' },
  { id: 'guest' as const, icon: Users, label: 'Misafir Bilgileri' },
  { id: 'qr' as const, icon: QrCode, label: 'QR Kod Oluşturucu' },
  { id: 'ai' as const, icon: Bot, label: 'AI Sohbet Botu' },
  { id: 'pdf' as const, icon: FileText, label: 'PDF Menü' },
  { id: 'language' as const, icon: Globe, label: 'Dil' },
  { id: 'billing' as const, icon: CreditCard, label: 'Plan & Faturalandırma' },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = sections.find((s) => s.id === activeSection)?.label || '';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-text">Ayarlar</h1>

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
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors ${
                    activeSection === section.id
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
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
  return (
    <div className="flex justify-end pt-2">
      <button onClick={() => toast.success('Kaydedildi')} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
        <Save size={16} />
        Kaydet
      </button>
    </div>
  );
}

function ProfileSection() {
  return (
    <SectionCard title="Profil Bilgileri">
      <div className="flex items-center gap-4 pb-2">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><User size={24} className="text-gray-400" /></div>
        <button className="text-sm text-primary font-medium hover:underline">Fotoğraf Değiştir</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Ad" defaultValue="Kozbeyli" />
        <InputField label="Soyad" defaultValue="Konağı" />
      </div>
      <InputField label="E-posta" type="email" defaultValue="info@kozbeylikonagi.com" />
      <InputField label="Telefon" type="tel" defaultValue="+90 555 123 4567" />
      <SaveButton />
    </SectionCard>
  );
}

function PasswordSection() {
  return (
    <SectionCard title="Şifre Değiştir">
      <InputField label="Mevcut Şifre" type="password" />
      <InputField label="Yeni Şifre" type="password" />
      <InputField label="Yeni Şifre (Tekrar)" type="password" />
      <p className="text-xs text-text-muted">Şifreniz en az 8 karakter, büyük harf, küçük harf ve rakam içermelidir.</p>
      <SaveButton />
    </SectionCard>
  );
}

function RestaurantSection() {
  return (
    <SectionCard title="Restoran Bilgileri">
      <InputField label="Restoran Adı" defaultValue="Kozbeyli Konağı" />
      <InputField label="Açıklama" defaultValue="Geleneksel Türk Mutfağı" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Telefon" defaultValue="+90 555 123 4567" />
        <InputField label="E-posta" defaultValue="info@kozbeylikonagi.com" />
      </div>
      <InputField label="Adres" defaultValue="Kozbeyli Mahallesi, İzmir" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Şehir" defaultValue="İzmir" />
        <InputField label="Ülke" defaultValue="Türkiye" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Logo</label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Upload size={20} className="mx-auto text-text-muted mb-1" />
          <p className="text-sm text-text-muted">Logo yükleyin</p>
        </div>
      </div>
      <SaveButton />
    </SectionCard>
  );
}

function GuestSection() {
  return (
    <SectionCard title="Misafir Bilgi Toplama">
      <p className="text-sm text-text-muted">Menüye erişmeden önce müşterilerden hangi bilgilerin toplanacağını ayarlayın.</p>
      {['Ad Soyad', 'E-posta', 'Telefon', 'Masa Numarası'].map((field) => (
        <div key={field} className="flex items-center justify-between py-2">
          <span className="text-sm text-text">{field}</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-text-muted">
              <input type="checkbox" className="rounded" />
              Zorunlu
            </label>
            <Toggle defaultOn={field === 'Ad Soyad' || field === 'Masa Numarası'} label={`${field} topla`} />
          </div>
        </div>
      ))}
      <SaveButton />
    </SectionCard>
  );
}

function QRCodeSection() {
  return (
    <SectionCard title="QR Kod Oluşturucu">
      <p className="text-sm text-text-muted">Restoranınız için özel QR kodlar oluşturun ve indirin.</p>
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <code className="text-sm text-text flex-1 truncate">https://menu.kozbeylikonagi.com</code>
        <button onClick={() => { navigator.clipboard.writeText('https://menu.kozbeylikonagi.com'); toast.success('Kopyalandı'); }} aria-label="URL kopyala" className="p-1.5 rounded hover:bg-gray-200 text-text-muted transition-colors"><Copy size={15} /></button>
        <button aria-label="Linki aç" className="p-1.5 rounded hover:bg-gray-200 text-text-muted transition-colors"><ExternalLink size={15} /></button>
      </div>
      <div className="bg-white border border-border rounded-xl p-8 flex items-center justify-center">
        <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center"><QrCode size={80} className="text-gray-300" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Ön Plan Rengi</label>
          <input type="color" defaultValue="#000000" className="w-full h-10 rounded-lg border border-border cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Arka Plan Rengi</label>
          <input type="color" defaultValue="#FFFFFF" className="w-full h-10 rounded-lg border border-border cursor-pointer" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">QR Kod Logo</label>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <ImageIcon size={20} className="mx-auto text-text-muted mb-1" />
          <p className="text-xs text-text-muted">Logo ekleyin (opsiyonel)</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"><Download size={16} />PNG İndir</button>
        <button className="flex items-center gap-2 border border-border text-text px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"><Download size={16} />SVG İndir</button>
      </div>
    </SectionCard>
  );
}

function AIChatSection() {
  return (
    <SectionCard title="AI Sohbet Botu Ayarları">
      <p className="text-sm text-text-muted">Müşterileriniz için AI destekli sohbet botunu yapılandırın.</p>
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-text">Sohbet Botu</p>
          <p className="text-xs text-text-muted">Menüde AI sohbet botunu etkinleştirin</p>
        </div>
        <Toggle defaultOn label="AI sohbet botu" />
      </div>
      <InputField label="Karşılama Mesajı" defaultValue="Merhaba! Size nasıl yardımcı olabilirim?" />
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Bot Karakteri</label>
        <textarea defaultValue="Kozbeyli Konağı'nın yardımcı asistanı olarak, menü hakkında bilgi verin. Nazik ve profesyonel olun." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">AI Modeli</label>
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
  return (
    <SectionCard title="PDF Menü İndirme">
      <p className="text-sm text-text-muted">Menünüzün PDF versiyonunu oluşturun ve indirin.</p>
      <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
        <div>
          <p className="text-sm font-medium text-text">Kozbeyli Konağı Menü.pdf</p>
          <p className="text-xs text-text-muted">Son güncelleme: 20 Ocak 2025</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"><Download size={15} />İndir</button>
      </div>
      <button className="flex items-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full justify-center"><FileText size={16} />PDF Yeniden Oluştur</button>
    </SectionCard>
  );
}

function LanguageSection() {
  return (
    <SectionCard title="Dil Ayarları">
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Panel Dili</label>
        <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
          <option>Türkçe</option>
          <option>English</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Menü Varsayılan Dili</label>
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
  return (
    <SectionCard title="Plan & Faturalandırma">
      <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text">Premium Plan</p>
            <p className="text-xs text-text-muted mt-0.5">Aylık faturalandırma • Sonraki ödeme: 15 Şubat 2025</p>
          </div>
          <span className="text-lg font-bold text-primary">₺299/ay</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-text mb-2">Plan Özellikleri</p>
        <ul className="space-y-1.5 text-sm text-text-muted">
          {['Sınırsız ürün ekleme', 'QR Kod oluşturucu', 'AI Sohbet Botu', 'Analitik dashboard', 'Çoklu dil desteği', 'Öncelikli destek'].map((feature) => (
            <li key={feature} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-success" />{feature}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Planı Değiştir</button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"><CreditCard size={16} />Ödeme Yöntemi</button>
      </div>
    </SectionCard>
  );
}
