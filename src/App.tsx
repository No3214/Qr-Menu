import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';

// Lazy load components for performance (Fixes INP issues on navigation)
const DigitalMenu = React.lazy(() => import('./components/DigitalMenu').then(module => ({ default: module.DigitalMenu })));
const DashboardLayout = React.lazy(() => import('./dashboard/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
const HomePage = React.lazy(() => import('./dashboard/pages/HomePage').then(module => ({ default: module.HomePage })));
const MenuManagement = React.lazy(() => import('./dashboard/pages/MenuManagement').then(module => ({ default: module.MenuManagement })));
const AnalyticsPage = React.lazy(() => import('./dashboard/pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const EventsPage = React.lazy(() => import('./dashboard/pages/EventsPage').then(module => ({ default: module.EventsPage })));
const ReviewsPage = React.lazy(() => import('./dashboard/pages/ReviewsPage').then(module => ({ default: module.ReviewsPage })));
const SettingsPage = React.lazy(() => import('./dashboard/pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const TranslationsPage = React.lazy(() => import('./dashboard/pages/TranslationsPage').then(module => ({ default: module.TranslationsPage })));

/**
 * App - Ana uygulama bileşeni
 * Kozbeyli Konağı Dijital Menü Sistemi
 */
export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E293B',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#C5A059',
              secondary: '#fff',
            },
          },
        }}
      />

      <LanguageProvider>
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            {/* Customer-facing menu (Mobile Only Look on Desktop) */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-primary/20 selection:text-primary">
                  <main className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl overflow-hidden relative">
                    <DigitalMenu />
                  </main>
                </div>
              }
            />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="translations" element={<TranslationsPage />} />
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </LanguageProvider>
    </>
  );
}
