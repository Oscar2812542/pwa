// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// 🎨 Color del tema principal
const themeColor = '#007bff'

export default defineConfig({
  plugins: [
    react(),

    // 🧩 VISUALIZADOR OPCIONAL (para ver el peso del JS)
    visualizer({
      filename: 'bundle-stats.html',
      open: false, // pon en true si quieres verlo automáticamente tras build
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

        // ✅ CACHÉ EFICIENTE: Archivos estáticos + API
        runtimeCaching: [
          // 📦 Archivos estáticos (JS/CSS) → cache-first
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
          // 🌐 API (actualiza en segundo plano)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/inventario/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
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
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],

  // 🧠 OPTIMIZACIÓN DE BUILD PARA MÓVIL
  build: {
    minify: 'esbuild',       // ✅ Compila y minifica rápido
    target: 'es2017',        // ✅ Compatible con navegadores móviles modernos
    sourcemap: false,
    cssMinify: true,
    chunkSizeWarningLimit: 600,
  },

  // 💨 COMPRESIÓN EN DESARROLLO (para probar rendimiento real)
  server: {
    compress: true,
  },
})
