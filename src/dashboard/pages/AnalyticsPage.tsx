
import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Users,
  Eye,
  MousePointer2,
  Clock, // Added Clock import as it's used but missing
} from 'lucide-react';

const data = [
  { name: 'Pzt', views: 400, scans: 240, amt: 2400 },
  { name: 'Sal', views: 300, scans: 139, amt: 2210 },
  { name: 'Çar', views: 200, scans: 980, amt: 2290 },
  { name: 'Per', views: 278, scans: 390, amt: 2000 },
  { name: 'Cum', views: 189, scans: 480, amt: 2181 },
  { name: 'Cmt', views: 239, scans: 380, amt: 2500 },
  { name: 'Paz', views: 349, scans: 430, amt: 2100 },
];

import { useLanguage } from '../../context/LanguageContext';

export const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-stone-900 tracking-tight mb-2">{t('dash.analytics.title')}</h2>
          <p className="text-stone-500 font-medium">{t('dash.analytics.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-white border border-stone-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-stone-600 flex items-center gap-2 hover:bg-stone-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" /> {t('dash.analytics.filter')}
          </button>
          <button className="px-5 py-3 bg-stone-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-stone-200">
            <Download className="w-4 h-4" /> {t('dash.analytics.export')}
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t('dash.analytics.metric.views'), value: '18.4k', change: '+12.5%', icon: Eye, color: 'text-blue-500' },
          { label: t('dash.analytics.metric.scans'), value: '4.2k', change: '+18.2%', icon: MousePointer2, color: 'text-primary' },
          { label: t('dash.analytics.metric.users'), value: '3.1k', change: '+4.3%', icon: Users, color: 'text-purple-500' },
          { label: t('dash.analytics.metric.duration'), value: '5m 12s', change: '-1.4%', icon: Clock, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-stone-50 rounded-2xl">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Interaction Chart */}
        <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-stone-900 tracking-tight">{t('dash.analytics.chart.weekly')}</h3>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">{t('dash.analytics.chart.weeklySub')}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{t('dash.analytics.metric.views').split(' ').pop()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-stone-200 rounded-full" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{t('dash.analytics.metric.scans').split(' ').pop()}</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F2" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-primary)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
          <h3 className="text-xl font-black text-stone-900 tracking-tight mb-10">{t('dash.analytics.chart.categories')}</h3>
          <div className="space-y-8">
            {[
              { name: 'Ana Yemekler', value: 85, color: 'bg-primary' },
              { name: 'Soğuk İçecekler', value: 65, color: 'bg-stone-800' },
              { name: 'Tatlılar', value: 45, color: 'bg-stone-400' },
              { name: 'Kahvaltılıklar', value: 30, color: 'bg-stone-200' },
            ].map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-stone-700">{cat.name}</span>
                  <span className="text-xs font-black text-stone-900 tracking-widest">{cat.value}%</span>
                </div>
                <div className="w-full h-3 bg-stone-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table Placeholder */}
      <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-black uppercase tracking-widest text-stone-900">{t('dash.analytics.chart.comingSoon')}</span>
          </div>
        </div>
        <h3 className="text-xl font-black text-stone-900 tracking-tight mb-8">{t('dash.analytics.chart.productPerformance')}</h3>
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between pb-6 border-b border-stone-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-xl" />
                <div>
                  <h4 className="text-sm font-bold text-stone-800">Kozbeyli Kebabı</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Ana Yemekler</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-stone-900">1.428</div>
                <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('dash.analytics.metric.views').split(' ').pop()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
