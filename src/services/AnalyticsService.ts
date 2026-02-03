import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Analytics event types
export type AnalyticsEventType =
  | 'page_view'
  | 'menu_view'
  | 'category_click'
  | 'product_view'
  | 'product_click'
  | 'qr_scan'
  | 'search'
  | 'filter_use'
  | 'ai_chat_open'
  | 'ai_chat_message'
  | 'review_submit'
  | 'wifi_view'
  | 'call_waiter'
  | 'share'
  | 'language_change';

export interface AnalyticsEvent {
  id?: string;
  event_type: AnalyticsEventType;
  location_id: string;
  session_id: string;
  user_agent: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screen_size: string;
  language: string;
  referrer: string;
  page_url: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalScans: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  topCategories: { name: string; count: number }[];
  topProducts: { name: string; count: number }[];
  viewsByDay: { date: string; views: number; scans: number }[];
  deviceBreakdown: { device: string; count: number }[];
  peakHours: { hour: number; count: number }[];
}

// Session management
let sessionId: string | null = null;
let sessionStartTime: number | null = null;

// Local storage for offline support
const OFFLINE_EVENTS_KEY = 'qrmenu_offline_analytics';
const SESSION_KEY = 'qrmenu_session_id';
const SESSION_START_KEY = 'qrmenu_session_start';

// Generate unique session ID
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session
function getSession(): { id: string; startTime: number } {
  if (sessionId && sessionStartTime) {
    return { id: sessionId, startTime: sessionStartTime };
  }

  // Check localStorage
  const storedSession = localStorage.getItem(SESSION_KEY);
  const storedStart = localStorage.getItem(SESSION_START_KEY);

  if (storedSession && storedStart) {
    const startTime = parseInt(storedStart, 10);
    // Session expires after 30 minutes of inactivity
    if (Date.now() - startTime < 30 * 60 * 1000) {
      sessionId = storedSession;
      sessionStartTime = startTime;
      return { id: sessionId, startTime: sessionStartTime };
    }
  }

  // Create new session
  sessionId = generateSessionId();
  sessionStartTime = Date.now();
  localStorage.setItem(SESSION_KEY, sessionId);
  localStorage.setItem(SESSION_START_KEY, sessionStartTime.toString());

  return { id: sessionId, startTime: sessionStartTime };
}

// Refresh session timestamp
function refreshSession(): void {
  sessionStartTime = Date.now();
  if (sessionStartTime) {
    localStorage.setItem(SESSION_START_KEY, sessionStartTime.toString());
  }
}

// Device detection
function getDeviceInfo(): { deviceType: 'mobile' | 'tablet' | 'desktop'; browser: string; os: string } {
  const ua = navigator.userAgent;

  // Device type
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/Mobi|Android/i.test(ua)) {
    deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
  }

  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';

  // OS detection
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { deviceType, browser, os };
}

// Save event to localStorage for offline support
function saveOfflineEvent(event: AnalyticsEvent): void {
  try {
    const existing = localStorage.getItem(OFFLINE_EVENTS_KEY);
    const events: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
    events.push(event);
    localStorage.setItem(OFFLINE_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to save offline analytics event:', e);
  }
}

// Sync offline events when online
async function syncOfflineEvents(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const existing = localStorage.getItem(OFFLINE_EVENTS_KEY);
    if (!existing) return;

    const events: AnalyticsEvent[] = JSON.parse(existing);
    if (events.length === 0) return;

    const { error } = await supabase
      .from('analytics_events')
      .insert(events);

    if (!error) {
      localStorage.removeItem(OFFLINE_EVENTS_KEY);
    }
  } catch (e) {
    console.warn('Failed to sync offline analytics:', e);
  }
}

// Main Analytics Service
export const AnalyticsService = {
  // Initialize analytics (call on app start)
  init(): void {
    getSession();

    // Sync offline events when online
    if (navigator.onLine) {
      syncOfflineEvents();
    }

    window.addEventListener('online', syncOfflineEvents);

    // Track session end
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });
  },

  // Track an event
  async track(
    eventType: AnalyticsEventType,
    locationId: string = 'default',
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const session = getSession();
    refreshSession();
    const deviceInfo = getDeviceInfo();

    const event: AnalyticsEvent = {
      event_type: eventType,
      location_id: locationId,
      session_id: session.id,
      user_agent: navigator.userAgent,
      device_type: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      referrer: document.referrer,
      page_url: window.location.href,
      metadata,
      created_at: new Date().toISOString(),
    };

    // Try to send to Supabase
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        await supabase.from('analytics_events').insert([event]);
      } catch (e) {
        // Save offline if failed
        saveOfflineEvent(event);
      }
    } else {
      // Save offline
      saveOfflineEvent(event);
    }
  },

  // Track page view
  trackPageView(page: string, locationId?: string): void {
    this.track('page_view', locationId, { page });
  },

  // Track menu view
  trackMenuView(locationId?: string): void {
    this.track('menu_view', locationId);
  },

  // Track category click
  trackCategoryClick(categoryId: string, categoryName: string, locationId?: string): void {
    this.track('category_click', locationId, { categoryId, categoryName });
  },

  // Track product view
  trackProductView(productId: string, productName: string, categoryName: string, locationId?: string): void {
    this.track('product_view', locationId, { productId, productName, categoryName });
  },

  // Track QR scan
  trackQRScan(source?: string, locationId?: string): void {
    this.track('qr_scan', locationId, { source });
  },

  // Track search
  trackSearch(query: string, resultsCount: number, locationId?: string): void {
    this.track('search', locationId, { query, resultsCount });
  },

  // Track AI chat
  trackAIChatOpen(locationId?: string): void {
    this.track('ai_chat_open', locationId);
  },

  trackAIChatMessage(messageType: 'user' | 'bot', locationId?: string): void {
    this.track('ai_chat_message', locationId, { messageType });
  },

  // Track language change
  trackLanguageChange(from: string, to: string, locationId?: string): void {
    this.track('language_change', locationId, { from, to });
  },

  // Track session end
  trackSessionEnd(): void {
    const session = getSession();
    const duration = Date.now() - session.startTime;
    this.track('page_view', undefined, {
      action: 'session_end',
      duration_ms: duration
    });
  },

  // Get analytics summary (for dashboard)
  async getSummary(locationId: string, days: number = 7): Promise<AnalyticsSummary | null> {
    if (!isSupabaseConfigured()) {
      return this.getMockSummary();
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      // Get all events for the period
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('location_id', locationId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error || !events) {
        return this.getMockSummary();
      }

      // Calculate metrics
      const uniqueSessions = new Set(events.map(e => e.session_id));
      const pageViews = events.filter(e => e.event_type === 'page_view');
      const qrScans = events.filter(e => e.event_type === 'qr_scan');
      const categoryClicks = events.filter(e => e.event_type === 'category_click');
      const productViews = events.filter(e => e.event_type === 'product_view');

      // Group by day
      const viewsByDay = this.groupByDay(pageViews, qrScans, days);

      // Top categories
      const categoryMap = new Map<string, number>();
      categoryClicks.forEach(e => {
        const name = e.metadata?.categoryName as string || 'Unknown';
        categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
      });
      const topCategories = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Top products
      const productMap = new Map<string, number>();
      productViews.forEach(e => {
        const name = e.metadata?.productName as string || 'Unknown';
        productMap.set(name, (productMap.get(name) || 0) + 1);
      });
      const topProducts = Array.from(productMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Device breakdown
      const deviceMap = new Map<string, number>();
      events.forEach(e => {
        deviceMap.set(e.device_type, (deviceMap.get(e.device_type) || 0) + 1);
      });
      const deviceBreakdown = Array.from(deviceMap.entries())
        .map(([device, count]) => ({ device, count }));

      // Peak hours
      const hourMap = new Map<number, number>();
      events.forEach(e => {
        const hour = new Date(e.created_at).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      });
      const peakHours = Array.from(hourMap.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour - b.hour);

      return {
        totalViews: pageViews.length,
        totalScans: qrScans.length,
        uniqueUsers: uniqueSessions.size,
        avgSessionDuration: this.calculateAvgSessionDuration(events),
        topCategories,
        topProducts,
        viewsByDay,
        deviceBreakdown,
        peakHours,
      };
    } catch (e) {
      console.error('Failed to get analytics summary:', e);
      return this.getMockSummary();
    }
  },

  // Helper: Group events by day
  groupByDay(
    pageViews: AnalyticsEvent[],
    qrScans: AnalyticsEvent[],
    days: number
  ): { date: string; views: number; scans: number }[] {
    const result: { date: string; views: number; scans: number }[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const views = pageViews.filter(e =>
        e.created_at?.startsWith(dateStr)
      ).length;

      const scans = qrScans.filter(e =>
        e.created_at?.startsWith(dateStr)
      ).length;

      result.push({ date: dateStr, views, scans });
    }

    return result;
  },

  // Helper: Calculate average session duration
  calculateAvgSessionDuration(events: AnalyticsEvent[]): number {
    // Group by session
    const sessions = new Map<string, AnalyticsEvent[]>();
    events.forEach(e => {
      const existing = sessions.get(e.session_id) || [];
      existing.push(e);
      sessions.set(e.session_id, existing);
    });

    let totalDuration = 0;
    let count = 0;

    sessions.forEach(sessionEvents => {
      if (sessionEvents.length > 1) {
        const sorted = sessionEvents.sort((a, b) =>
          new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
        );
        const first = new Date(sorted[0].created_at!).getTime();
        const last = new Date(sorted[sorted.length - 1].created_at!).getTime();
        totalDuration += last - first;
        count++;
      }
    });

    return count > 0 ? Math.round(totalDuration / count / 1000) : 0; // Return seconds
  },

  // Mock summary for demo/offline
  getMockSummary(): AnalyticsSummary {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    return {
      totalViews: 18432,
      totalScans: 4287,
      uniqueUsers: 3142,
      avgSessionDuration: 312, // 5min 12sec
      topCategories: [
        { name: 'Ana Yemekler', count: 4521 },
        { name: 'Soğuk İçecekler', count: 3287 },
        { name: 'Tatlılar', count: 2156 },
        { name: 'Kahvaltılıklar', count: 1432 },
        { name: 'Sıcak İçecekler', count: 987 },
      ],
      topProducts: [
        { name: 'Kozbeyli Kebabı', count: 1428 },
        { name: 'Türk Kahvesi', count: 1156 },
        { name: 'Künefe', count: 987 },
        { name: 'Serpme Kahvaltı', count: 876 },
        { name: 'Limonata', count: 754 },
      ],
      viewsByDay: days.map((day) => ({
        date: day,
        views: 200 + Math.floor(Math.random() * 300),
        scans: 100 + Math.floor(Math.random() * 150),
      })),
      deviceBreakdown: [
        { device: 'mobile', count: 12543 },
        { device: 'desktop', count: 3287 },
        { device: 'tablet', count: 1542 },
      ],
      peakHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: i >= 11 && i <= 14 ? 500 + Math.random() * 300 :
               i >= 18 && i <= 21 ? 600 + Math.random() * 400 :
               Math.random() * 200,
      })),
    };
  },
};

export default AnalyticsService;
