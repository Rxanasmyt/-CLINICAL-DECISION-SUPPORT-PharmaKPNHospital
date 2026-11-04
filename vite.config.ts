import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PharmaKPNHospital — ระบบสนับสนุนการตัดสินใจด้านยา',
        short_name: 'PharmaKPN',
        description: 'ระบบสนับสนุนการตัดสินใจด้านยาสำหรับเภสัชกร · โรงพยาบาลกรงปินัง',
        lang: 'th',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#F4F1EA',
        theme_color: '#0E3F3B',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          { urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, handler: 'StaleWhileRevalidate', options: { cacheName: 'gfonts-css' } },
          { urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i, handler: 'CacheFirst', options: { cacheName: 'gfonts-files', expiration: { maxEntries: 30, maxAgeSeconds: 31536000 }, cacheableResponse: { statuses: [0, 200] } } },
        ],
      },
    }),
  ],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
