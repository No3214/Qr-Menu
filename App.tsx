import React from 'react';
import { Header } from './components/Header';
import { DigitalMenu } from './components/DigitalMenu';
import { Toaster } from 'react-hot-toast';

/**
 * App - Ana uygulama bileşeni
 * Kozbeyli Konağı Dijital Menü Sistemi
 */
export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-gold-500/20 selection:text-gold-600">
      {/* Toast Notifications */}
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

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <DigitalMenu />
      </main>
    </div>
  );
}