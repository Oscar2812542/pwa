import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// ==========================================================
// 🎯 REGISTRO DEL SERVICE WORKER (PWA)
// Esto activa el Service Worker generado por vite-plugin-pwa (Workbox)
// ==========================================================

// 🚨 CORRECCIÓN CLAVE PWA/DEV: Solo registra el Service Worker en modo de producción 
// para evitar el error de MIME Type que ocurre en el servidor de desarrollo (npm run dev).
if (process.env.NODE_ENV === 'production') {
    // 1. Verifica si el navegador soporta Service Workers
    if ('serviceWorker' in navigator) {
      // 2. Espera a que la página esté completamente cargada
      window.addEventListener('load', () => {
        // 3. Registra el Service Worker. VitePWA genera el archivo 'sw.js'
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('✅ Service Worker registrado con éxito:', registration);
            // Opcional: Notificar al usuario sobre la capacidad offline
          })
          .catch(registrationError => {
            console.error('❌ Fallo en el registro de Service Worker:', registrationError);
          });
      });
    }
    if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('Service Worker registrado:', reg.scope))
      .catch(err => console.error('Error registrando el SW:', err));
  });
}

}
