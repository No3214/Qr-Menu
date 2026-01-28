import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Development server
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
  },

  // Preview server (for local production testing)
  preview: {
    port: 4173,
    host: '0.0.0.0',
  },

  // Build configuration
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@components': path.resolve(__dirname, './components'),
      '@services': path.resolve(__dirname, './services'),
    },
  },

  // Optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'react-hot-toast'],
  },
});
