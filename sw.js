// CIL Signal AI — minimal service worker
const CACHE = 'cil-v1';
const ASSETS = ['/', '/index.html', '/logo.png', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Never cache Binance API calls — always fetch live
  if (e.request.url.includes('api.binance.com') || e.request.url.includes('formspree.io')) {
    return; // let it go to network
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
