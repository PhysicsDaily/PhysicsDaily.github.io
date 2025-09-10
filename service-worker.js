// Basic cache-first service worker for Physics Daily
const CACHE_NAME = 'pd-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/global.css',
  '/assets/js/global.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});