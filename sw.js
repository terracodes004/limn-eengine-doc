const CACHE_NAME = 'limn-engine-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './bugTrackerSystem.js',
  './manifest.json',
  './img/logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(file => 
          cache.add(file).catch(err => console.warn('Could not cache:', file, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
