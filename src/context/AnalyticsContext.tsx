import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { AnalyticsService, AnalyticsSummary } from '../services/AnalyticsService';

interface AnalyticsContextType {
  // Track events
  trackPageView: (page: string) => void;
  trackMenuView: () => void;
  trackCategoryClick: (categoryId: string, categoryName: string) => void;
  trackProductView: (productId: string, productName: string, categoryName: string) => void;
  trackQRScan: (source?: string) => void;
  trackSearch: (query: string, resultsCount: number) => void;
  trackAIChatOpen: () => void;
  trackAIChatMessage: (messageType: 'user' | 'bot') => void;
  trackLanguageChange: (from: string, to: string) => void;
  // Get analytics
  getSummary: (days?: number) => Promise<AnalyticsSummary | null>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  locationId?: string;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  locationId = 'default'
}) => {
  // Initialize analytics on mount
  useEffect(() => {
    AnalyticsService.init();
    // Track initial page view
    AnalyticsService.trackPageView(window.location.pathname, locationId);
  }, [locationId]);

  const trackPageView = useCallback((page: string) => {
    AnalyticsService.trackPageView(page, locationId);
  }, [locationId]);

  const trackMenuView = useCallback(() => {
    AnalyticsService.trackMenuView(locationId);
  }, [locationId]);

  const trackCategoryClick = useCallback((categoryId: string, categoryName: string) => {
    AnalyticsService.trackCategoryClick(categoryId, categoryName, locationId);
  }, [locationId]);

  const trackProductView = useCallback((productId: string, productName: string, categoryName: string) => {
    AnalyticsService.trackProductView(productId, productName, categoryName, locationId);
  }, [locationId]);

  const trackQRScan = useCallback((source?: string) => {
    AnalyticsService.trackQRScan(source, locationId);
  }, [locationId]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    AnalyticsService.trackSearch(query, resultsCount, locationId);
  }, [locationId]);

  const trackAIChatOpen = useCallback(() => {
    AnalyticsService.trackAIChatOpen(locationId);
  }, [locationId]);

  const trackAIChatMessage = useCallback((messageType: 'user' | 'bot') => {
    AnalyticsService.trackAIChatMessage(messageType, locationId);
  }, [locationId]);

  const trackLanguageChange = useCallback((from: string, to: string) => {
    AnalyticsService.trackLanguageChange(from, to, locationId);
  }, [locationId]);

  const getSummary = useCallback(async (days: number = 7) => {
    return AnalyticsService.getSummary(locationId, days);
  }, [locationId]);

  const value: AnalyticsContextType = {
    trackPageView,
    trackMenuView,
    trackCategoryClick,
    trackProductView,
    trackQRScan,
    trackSearch,
    trackAIChatOpen,
    trackAIChatMessage,
    trackLanguageChange,
    getSummary,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;
