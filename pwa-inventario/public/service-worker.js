const CACHE_NAME = 'pwa-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/assets/logo192.png',
  '/assets/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of URLS_TO_CACHE) {
        try {
          await cache.add(url);
          console.log(`✅ Cacheado: ${url}`);
        } catch (err) {
          console.warn(`⚠️ No se pudo cachear: ${url}`, err);
        }
      }
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
