import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { DigitalMenu } from './components/DigitalMenu';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { HomePage } from './dashboard/pages/HomePage';
import { MenuManagement } from './dashboard/pages/MenuManagement';
import { AnalyticsPage } from './dashboard/pages/AnalyticsPage';
import { EventsPage } from './dashboard/pages/EventsPage';
import { ReviewsPage } from './dashboard/pages/ReviewsPage';
import { SettingsPage } from './dashboard/pages/SettingsPage';
import { TranslationsPage } from './dashboard/pages/TranslationsPage';
import { Toaster } from 'react-hot-toast';

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

      <Routes>
        {/* Customer-facing menu */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white text-slate-900 selection:bg-gold-500/20 selection:text-gold-600">
              <Header />
              <main>
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
    </>
  );
}
