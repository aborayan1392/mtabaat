// Generated simple cache-first Service Worker
const CACHE_NAME = 'pwa-gen-cache-' + 1767821871348;
const CORE_ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-72x72.png",
  "icon-96x96.png",
  "icon-128x128.png",
  "icon-144x144.png",
  "icon-152x152.png",
  "icon-192x192.png",
  "icon-256x256.png",
  "icon-384x384.png",
  "icon-512x512.png"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    (async () => {
      // Network-first for HTML/documents
      if (isHtmlRequest(req)) {
        try {
          const netRes = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, netRes.clone());
          return netRes;
        } catch (e) {
          const cached = await caches.match(req);
          return cached || caches.match('index.html');
        }
      }

      // Cache-first for static assets
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const netRes = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, netRes.clone());
        return netRes;
      } catch (e) {
        return caches.match('index.html');
      }
    })()
  );
});
