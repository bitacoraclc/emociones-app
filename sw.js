const CACHE_VERSION = 'v3.1'; // ✅ CAMBIA ESTO CADA VEZ QUE ACTUALICES
const CACHE_NAME = `emociones-app-${CACHE_VERSION}`;
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // ✅ SALVAGUARDA: Los POST a tu webhook SIEMPRE van a red, nunca se cachean
  if (e.request.method === 'POST' || e.request.url.includes('script.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});