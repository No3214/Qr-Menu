
import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  MoreVertical,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  Edit3,
  Trash2,
  Sparkles
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Past' | 'Cancelled';
  attendees: number;
  description: string;
  image?: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Geleneksel Fasıl Gecesi',
    date: '12 Mayıs 2024',
    time: '20:00',
    location: 'Bahçe Katı',
    status: 'Upcoming',
    attendees: 42,
    description: 'Usta sanatçılar eşliğinde eşsiz bir fasıl deneyimi Kozbeyli Konağında sizi bekliyor.',
    image: 'https://images.unsplash.com/photo-1514415008039-efa173293080?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Cumartesi Gurme Kahvaltısı',
    date: '15 Mayıs 2024',
    time: '09:00',
    location: 'Teras Katı',
    status: 'Upcoming',
    attendees: 18,
    description: 'Ege\'nin en taze ürünleriyle donatılmış özel gurme kahvaltı soframızda yerinizi alın.',
    image: 'https://images.unsplash.com/photo-1496044400980-192739b67456?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Chef\'s Special: Gastronomi Gecesi',
    date: '2 Mayıs 2024',
    time: '19:30',
    location: 'VIP Salon',
    status: 'Past',
    attendees: 24,
    description: 'Baş aşçımızın özel reçeteleriyle hazırlanan 7 aşamalı tadım menüsü.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop'
  }
];

export const EventsPage: React.FC = () => {
  const [events] = useState<Event[]>(mockEvents);
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-stone-900 tracking-tight mb-2">Etkinlik Yönetimi</h2>
          <p className="text-stone-500 font-medium">Restoran etkinlikleri ve özel duyuruları buradan yönetebilirsiniz.</p>
        </div>
        <button className="px-8 py-4 bg-stone-900 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-stone-200 active:scale-95 group">
          <div className="p-1 bg-primary rounded-lg group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4 text-stone-950" />
          </div>
          Yeni Etkinlik Oluştur
        </button>
      </div>

      {/* Quick Stats Overlay (Optional Decoration) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-stone-900">12</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Bu Ayki Etkinlikler</p>
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-100 rounded-[32px] p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white border border-stone-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Users className="w-8 h-8 text-stone-900" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-stone-900">450+</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Toplam Katılımcı</p>
          </div>
        </div>
        <div className="bg-stone-900 rounded-[32px] p-8 flex items-center gap-6 text-white overflow-hidden relative">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center relative z-10">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black">94%</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Memnuniyet Oranı</p>
          </div>
          <div className="absolute top-0 right-0 w-24 h-full bg-primary/10 -skew-x-12 translate-x-10" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white px-8 py-6 rounded-[24px] border border-stone-100 shadow-sm">
        <div className="flex gap-2">
          {['All', 'Upcoming', 'Past'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'}`}
            >
              {f === 'All' ? 'Tümü' : f === 'Upcoming' ? 'Gelecek' : 'Geçmiş'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Etkinlik ara..."
            className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events
          .filter(e => filter === 'All' || e.status === filter)
          .map((event) => (
            <div key={event.id} className="group bg-white rounded-[40px] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row h-full">
              {/* Image Part */}
              <div className="w-full sm:w-64 h-64 sm:h-auto relative overflow-hidden flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${event.status === 'Upcoming' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                      event.status === 'Past' ? 'bg-stone-500/10 text-stone-600 border-stone-500/20' :
                        'bg-red-500/10 text-red-600 border-red-500/20'
                    }`}>
                    {event.status === 'Upcoming' ? 'Gelecek' : 'Geçmiş'}
                  </span>
                </div>
              </div>

              {/* Content Part */}
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-stone-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-stone-500">
                    <div className="p-1.5 bg-stone-50 rounded-lg"><Calendar className="w-3.5 h-3.5" /></div>
                    <span className="text-xs font-bold">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-500">
                    <div className="p-1.5 bg-stone-50 rounded-lg"><Clock3 className="w-3.5 h-3.5" /></div>
                    <span className="text-xs font-bold">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-500">
                    <div className="p-1.5 bg-stone-50 rounded-lg"><MapPin className="w-3.5 h-3.5" /></div>
                    <span className="text-xs font-bold">{event.location}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-50 flex items-center justify-between">
                  <div className="flex items-center -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${event.id}${i}`} alt="Attendee" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-black text-white">
                      +{event.attendees - 3}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-3 bg-stone-50 text-stone-400 rounded-xl hover:bg-stone-900 hover:text-white transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-stone-50 text-stone-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
