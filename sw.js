
const CACHE_NAME = 'guida-pergola-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/icon-128.png',
  '/icon-192.png',
  '/icon-512.png',
  '/logo_app.png'
];

// Installazione: salva tutto in cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Attivazione: pulizia cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first + fallback index.html
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        // Se la richiesta fallisce e si tratta di una pagina navigabile, restituiamo index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
