// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 1. IMPORTAR el plugin de PWA
import { VitePWA } from 'vite-plugin-pwa' 

// Definimos el color principal de la aplicación para el navegador y el ícono
const themeColor = '#007bff'; 

export default defineConfig({
  plugins: [
    react(),
    // 2. CONFIGURACIÓN DEL PLUGIN PWA
    VitePWA({
      registerType: 'autoUpdate', // El Service Worker se actualizará automáticamente
      // Incluye los archivos estáticos que necesitan estar en el caché inicial (debes tenerlos en /public)
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'], 

      // Configuración de Workbox (Estrategias de caching)
      workbox: {
        // Almacena en caché todos los archivos generados por Vite (JS, CSS, HTML, etc.)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        
        runtimeCaching: [
            // Estrategia de Caching para las llamadas a tu API REST
            {
              // Asegúrate que esta ruta coincida con el prefijo que usa tu servidor Node.js/Express
              urlPattern: ({ url }) => url.pathname.startsWith('/api/inventario/'),
              // Usamos StaleWhileRevalidate: sirve del caché inmediatamente, luego actualiza en segundo plano. 
              // Esto hace que la app sea rápida, pero mantiene los datos relativamente frescos.
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // Cacha por 7 días
                },
              },
            },
        ],
      },
      
      // Manifiesto PWA (Define cómo se verá la app cuando se instale)
      manifest: {
        name: 'Inventario Hospitalario',
        short_name: 'InvHospital',
        description: 'Sistema de Trazabilidad y Caducidades para Farmacia Hospitalaria',
        theme_color: themeColor,
        background_color: '#ffffff',
        display: 'standalone', // Hace que se vea como una app nativa
        icons: [
          // Debes crear estos íconos y colocarlos en la carpeta 'public'
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
            purpose: 'maskable'
          }
        ]
      }
    }),
  ],
})