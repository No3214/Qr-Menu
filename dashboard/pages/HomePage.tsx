
import React from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-stone-900 rounded-[32px] p-12 text-white relative overflow-hidden shadow-2xl shadow-stone-200">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6 border border-white/10">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest">System Operational</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-4">
            Hoşgeldiniz,<br />
            <span className="text-primary italic">Kozbeyli Konağı</span>
          </h2>
          <p className="text-stone-400 font-medium text-lg mb-8 leading-relaxed">
            Dijital menü yönetim paneliniz hazır. Bugün için toplam 1.284 menü görüntülenmesi gerçekleşti.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-stone-900 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Hızlı Rapor</button>
            <button className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">Destek</button>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Günlük İzlenme', value: '1.2k', change: '+12%', icon: Users },
          { label: 'Aktif Sepetler', value: '42', change: '+5%', icon: Clock },
          { label: 'Ort. Süre', value: '4m 12s', change: '-2%', icon: TrendingUp },
          { label: 'Geri Dönüş', value: '89%', change: '+1%', icon: StarIcon },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-stone-50 rounded-xl">
                <stat.icon className="w-5 h-5 text-stone-900" />
              </div>
              <span className={`text-[10px] font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-stone-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white rounded-[32px] p-8 border border-stone-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight text-stone-900">Yaklaşan Etkinlikler</h3>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest">Tümünü Gör</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-all group cursor-pointer border border-transparent hover:border-stone-100">
                <div className="w-12 h-12 bg-stone-100 rounded-xl flex flex-col items-center justify-center font-black text-stone-500 text-xs">
                  <span className="text-stone-900">12</span>
                  <span>MAY</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-stone-900 text-sm">Geleneksel Fasıl Gecesi</h4>
                  <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Saat: 20:00 • Bahçe Katı</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-[32px] p-8 border border-stone-100">
          <h3 className="text-xl font-black tracking-tight text-stone-900 mb-8">Sistem Hareketleri</h3>
          <div className="space-y-6">
            {[
              { type: 'Update', msg: 'Menüde 3 yeni ürün güncellendi.', time: '12dk önce' },
              { type: 'Review', msg: 'Yeni bir 5 yıldızlı yorum alındı.', time: '1sa önce' },
              { type: 'System', msg: 'QR Kod tasarımı güncellendi.', time: '2sa önce' },
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="text-sm font-bold text-stone-800">{act.msg}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StarIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
