import React, { useState } from 'react';
import { QRCodeEditor } from './components/QRCodeEditor';
import { Header } from './components/Header';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div className="min-h-screen bg-luxury-900 text-slate-200 selection:bg-gold-500 selection:text-white">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1E293B',
          color: '#fff',
          border: '1px solid #334155'
        }
      }} />
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-6xl mx-auto">
           <QRCodeEditor />
        </div>
      </main>
    </div>
  );
}