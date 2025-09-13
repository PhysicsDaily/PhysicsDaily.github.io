// Basic cache-first service worker for Physics Daily
const CACHE_NAME = 'pd-v13';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/global.css',
  '/assets/css/header-fixed.css',
  '/assets/css/auth-styles.css',
  '/assets/css/progress-tracker.css',
  '/assets/js/global.js',
  '/assets/js/header-loader.js',
  '/assets/js/auth-navigation.js',
  '/assets/js/firebase-config.js',
  '/assets/js/auth-manager.js',
  '/assets/js/auth-ui.js',
  '/assets/js/progress-tracker.js',
  '/assets/js/gamification.js',
  '/assets/partials/header.html',
  '/assets/partials/footer.html',
  '/assets/js/footer-loader.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Cache-first for same-origin GETs, network fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, respClone)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});