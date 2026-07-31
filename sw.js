const CACHE_NAME = 'shradhanjali-cache-v8';

// Static resources to cache immediately on installation
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './404.html',
  './assets/daisyui.css',
  './manifest.json',
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  // Only the default frame + its picker thumbnails are needed for first paint;
  // the other full-size frame overlays are cached on demand by the fetch handler.
  './frames/frame-classic.webp',
  './frames/thumb/classic.webp',
  './frames/thumb/gold-ring.webp',
  './frames/thumb/marigold.webp',
  './frames/thumb/pearl.webp',
  './frames/thumb/lotus.webp',
  './frames/thumb/silver.webp',
  './frames/thumb/rose-gold.webp',
  './sample-photo-male.webp',
  './sample-photo-female.webp',
  // Third-party
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Rozha+One&family=Tiro+Devanagari+Marathi:ital,wght@0,400;0,700;1,400&display=swap'
];

// Install Event - Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets or fetch from network and dynamically cache them
self.addEventListener('fetch', (event) => {
  // Only handle local HTTP/HTTPS requests (ignores chrome-extension or file schemes)
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('https://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache but fetch in background to revalidate (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => { /* Ignore background fetch errors (e.g. offline) */ });
        
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Dynamically cache valid network responses for fonts or subsequent files
        if (networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Fallback for document requests when fully offline
        if (event.request.mode === 'navigate') {
          // Serve the language page matching the requested path when offline,
        // falling back to the Marathi root.
        const p = new URL(event.request.url).pathname;
        const m = p.match(/^\/([a-z]{2})\/?$/);
        return caches.match(m ? `/${m[1]}/index.html` : '/index.html')
          .then((r) => r || caches.match('/index.html'));
        }
        throw err;
      });
    })
  );
});
