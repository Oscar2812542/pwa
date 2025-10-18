import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// 🎨 Color del tema principal
const themeColor = '#007bff'

export default defineConfig({
  plugins: [
    react(),

    // 🧩 VISUALIZADOR OPCIONAL
    visualizer({
      filename: 'bundle-stats.html',
      open: false,
    }),

    // ⚡ PLUGIN PWA CONFIGURADO PARA MÓVIL
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/inventario/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },

      manifest: {
        name: 'Inventario Hospitalario',
        short_name: 'InvHospital',
        description: 'Sistema de Trazabilidad y Caducidades para Farmacia Hospitalaria',
        theme_color: themeColor,
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],

  build: {
    minify: 'esbuild',
    target: 'es2017',
    sourcemap: false,
    cssMinify: true,
    chunkSizeWarningLimit: 600,
  },

  // 💨 CONFIGURACIÓN DEL SERVIDOR PARA DESARROLLO LOCAL Y CELULAR
  server: {
    host: true,   // 🔑 Permite conexiones desde tu celular en la misma red
    port: 5173,   // 🔑 Puerto de tu dev server
    compress: true,
  },
})
