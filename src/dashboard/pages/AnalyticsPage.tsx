import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Users,
  Eye,
  MousePointer2,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  RefreshCw,
  Utensils,
  Coffee,
  Cake,
  Sunrise,
  Wine,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AnalyticsService, AnalyticsSummary } from '../../services/AnalyticsService';

// Category icon mapping
const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  'Ana Yemekler': Utensils,
  'Soğuk İçecekler': Coffee,
  'Tatlılar': Cake,
  'Kahvaltılıklar': Sunrise,
  'Sıcak İçecekler': Coffee,
  'Şaraplar': Wine,
};

// Device colors
const deviceColors: Record<string, string> = {
  mobile: '#C5A059',
  desktop: '#3B82F6',
  tablet: '#8B5CF6',
};

// Format number with K suffix
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

// Format duration (seconds to mm:ss)
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await AnalyticsService.getSummary('default', timeRange);
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // Calculate percentage changes (mock for now)
  const getChange = (metric: string): { value: string; isPositive: boolean } => {
    const changes: Record<string, { value: string; isPositive: boolean }> = {
      views: { value: '+12.5%', isPositive: true },
      scans: { value: '+18.2%', isPositive: true },
      users: { value: '+4.3%', isPositive: true },
      duration: { value: '-1.4%', isPositive: false },
    };
    return changes[metric] || { value: '0%', isPositive: true };
  };

  if (isLoading || !summary) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-stone-500 font-medium">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-stone-900 tracking-tight mb-2">{t('dash.analytics.title')}</h2>
          <p className="text-stone-500 font-medium">{t('dash.analytics.subtitle')}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex bg-white border border-stone-200 rounded-2xl p-1">
            {[
              { value: 7, label: '7 Gün' },
              { value: 14, label: '14 Gün' },
              { value: 30, label: '30 Gün' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as 7 | 14 | 30)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all
                  ${timeRange === option.value
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-3 bg-white border border-stone-200 rounded-2xl font-bold text-xs text-stone-600 flex items-center gap-2 hover:bg-stone-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
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
          { key: 'views', label: t('dash.analytics.metric.views'), value: formatNumber(summary.totalViews), icon: Eye, color: 'text-blue-500', bgColor: 'bg-blue-50' },
          { key: 'scans', label: t('dash.analytics.metric.scans'), value: formatNumber(summary.totalScans), icon: MousePointer2, color: 'text-primary', bgColor: 'bg-primary/10' },
          { key: 'users', label: t('dash.analytics.metric.users'), value: formatNumber(summary.uniqueUsers), icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50' },
          { key: 'duration', label: t('dash.analytics.metric.duration'), value: formatDuration(summary.avgSessionDuration), icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-50' },
        ].map((stat) => {
          const change = getChange(stat.key);
          return (
            <div key={stat.key} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 ${stat.bgColor} rounded-2xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {change.value}
                  {change.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-stone-900 tracking-tight">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Interaction Chart */}
        <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-stone-900 tracking-tight">{t('dash.analytics.chart.weekly')}</h3>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">{t('dash.analytics.chart.weeklySub')}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Görüntüleme</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">QR Tarama</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.viewsByDay}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F2" />
                <XAxis
                  dataKey="date"
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
                  labelStyle={{ fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Görüntüleme"
                  stroke="#C5A059"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  name="QR Tarama"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
          <h3 className="text-xl font-black text-stone-900 tracking-tight mb-10">Cihaz Dağılımı</h3>
          <div className="flex items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {summary.deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[entry.device] || '#E5E5E5'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {summary.deviceBreakdown.map((device) => {
                const total = summary.deviceBreakdown.reduce((acc, d) => acc + d.count, 0);
                const percentage = Math.round((device.count / total) * 100);
                const Icon = device.device === 'mobile' ? Smartphone : device.device === 'tablet' ? Tablet : Monitor;
                return (
                  <div key={device.device} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${deviceColors[device.device]}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: deviceColors[device.device] }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-bold text-stone-700 capitalize">{device.device}</span>
                        <span className="text-sm font-black text-stone-900">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: deviceColors[device.device] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Peak Hours & Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Peak Hours */}
        <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-stone-900 tracking-tight">Yoğun Saatler</h3>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">Günlük trafik dağılımı</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.peakHours.filter((_, i) => i % 2 === 0)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F2" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A8A29E', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(h) => `${h}:00`}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelFormatter={(h) => `${h}:00 - ${Number(h) + 2}:00`}
                />
                <Bar dataKey="count" fill="#C5A059" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-stone-100">
            <div className="text-center">
              <p className="text-2xl font-black text-primary">12:00-14:00</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Öğle Yoğunluğu</p>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-primary">19:00-21:00</p>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Akşam Yoğunluğu</p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
          <h3 className="text-xl font-black text-stone-900 tracking-tight mb-8">{t('dash.analytics.chart.categories')}</h3>
          <div className="space-y-6">
            {summary.topCategories.map((cat, i) => {
              const maxCount = summary.topCategories[0]?.count || 1;
              const percentage = Math.round((cat.count / maxCount) * 100);
              const Icon = categoryIcons[cat.name] || Utensils;
              const colors = ['bg-primary', 'bg-stone-800', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'];
              return (
                <div key={i} className="group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-10 h-10 ${colors[i] || 'bg-stone-200'} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-stone-700">{cat.name}</span>
                        <span className="text-xs font-black text-stone-900">{formatNumber(cat.count)} görüntüleme</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden ml-14">
                    <div
                      className={`h-full ${colors[i] || 'bg-stone-300'} rounded-full transition-all duration-700 group-hover:opacity-80`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-stone-900 tracking-tight">{t('dash.analytics.chart.productPerformance')}</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
            <Calendar className="w-4 h-4" />
            Son {timeRange} gün
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {summary.topProducts.map((product, i) => (
            <div
              key={i}
              className="bg-stone-50 rounded-3xl p-6 text-center hover:bg-stone-100 transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-2xl font-black text-primary">#{i + 1}</span>
              </div>
              <h4 className="font-bold text-stone-800 mb-1 truncate">{product.name}</h4>
              <div className="flex items-center justify-center gap-1 text-sm">
                <Eye className="w-4 h-4 text-stone-400" />
                <span className="font-black text-stone-900">{formatNumber(product.count)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center gap-3 text-sm text-stone-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Veriler gerçek zamanlı güncelleniyor</span>
      </div>
    </div>
  );
};
