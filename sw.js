const CACHE_NAME = 'limn-engine-v50;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './about.html',
  './advance.html',
  './alien.html',
  './ballgame.html',
  './beginner.html',
  './download.html',
  './intermidate.html',
  './limn-engine-docs.html',
  './reference.html',
  './tutorial.html',
  './test8.html',
  './test9.html',
  './test11.html',
  './test15.html',
  './10x.html',
  './inbox.html',
  './settings.html',
  './epic.js',
  './script.js',
  './bugTrackerSystem.js',
  './head.js',
  './style.css',
  './manifest.json',
  './sitemap.xml',
  './img/logo.png',
  './editor/',
  './editor/index.html',
  './editor/function.js',
  './editor/script.js',
  './editor/style.css',
  './editor/jquery-3.7.1.min.js',
  './editor/tcjsgame-v2.js',
  './editor/tcjsgame-v3.js',
  './editor/epic.js'
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
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse;
      });

      return cachedResponse || fetchPromise.catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
