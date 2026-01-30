import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Edit3,
  Trash2,
  ImageIcon,
  X,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Canlı Müzik Gecesi',
    date: '2026-02-15',
    time: '20:00',
    location: 'Ana Salon',
    category: 'Müzik',
    capacity: 120,
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Şef ile Yemek Atölyesi',
    date: '2026-02-20',
    time: '14:00',
    location: 'Mutfak Stüdyo',
    category: 'Atölye',
    capacity: 20,
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Tadım Gecesi - İtalyan Şarapları',
    date: '2026-03-01',
    time: '19:00',
    location: 'Şarap Mahzeni',
    category: 'Tadım',
    capacity: 30,
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Kahvaltı Festivali',
    date: '2025-12-10',
    time: '09:00',
    location: 'Bahçe',
    category: 'Festival',
    capacity: 200,
    status: 'past',
  },
];

export function EventsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filtered =
    filter === 'all'
      ? sampleEvents
      : sampleEvents.filter((e) => e.status === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">
          Etkinlik Tanıtımı
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          Etkinlik Oluştur
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { id: 'all' as const, label: 'Tümü' },
          { id: 'upcoming' as const, label: 'Yaklaşan' },
          { id: 'past' as const, label: 'Geçmiş' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-muted hover:text-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-4">
        {filtered.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-border rounded-xl p-5 flex gap-5 hover:shadow-card transition-shadow"
          >
            {/* Image placeholder */}
            <div className="w-28 h-28 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Calendar size={28} className="text-gray-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">
                    {event.title}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-chip-bg text-text-muted">
                    {event.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toast.success('Düzenleme yakında aktif olacak')}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-primary transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => toast.success('Silme yakında aktif olacak')}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-danger transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(event.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {event.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  {event.capacity} kişi
                </span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-text-muted">Etkinlik bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateEventModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Etkinlik Oluştur</h2>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Etkinlik Görseli
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <ImageIcon size={24} className="mx-auto text-text-muted mb-2" />
              <p className="text-sm text-text-muted">Görsel veya video yükleyin</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Etkinlik Adı
            </label>
            <input
              type="text"
              placeholder="Etkinlik adını girin"
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Tarih
              </label>
              <input
                type="date"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Saat
              </label>
              <input
                type="time"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Location & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Konum
              </label>
              <input
                type="text"
                placeholder="Etkinlik konumu"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Kategori
              </label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
                <option>Müzik</option>
                <option>Atölye</option>
                <option>Tadım</option>
                <option>Festival</option>
                <option>Özel Gece</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Kapasite
            </label>
            <input
              type="number"
              placeholder="Maksimum katılımcı sayısı"
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Açıklama
            </label>
            <textarea
              rows={3}
              placeholder="Etkinlik detaylarını yazın"
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                İletişim Telefon
              </label>
              <input
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                İletişim E-posta
              </label>
              <input
                type="email"
                placeholder="email@ornek.com"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Fiyat (₺)
              </label>
              <input
                type="number"
                placeholder="0 = Ücretsiz"
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Ödeme Yöntemi
              </label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary bg-white">
                <option>Kapıda Ödeme</option>
                <option>Online Ödeme</option>
                <option>Ücretsiz</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => {
              toast.success('Etkinlik oluşturuldu');
              onClose();
            }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <Save size={16} />
            Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
