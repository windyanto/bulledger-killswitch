// NO-CACHE service worker — always fetches from network
// This prevents the dashboard from ever serving stale files

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  // Delete ALL existing caches on activation
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Always go to the network — never use cache
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request));
});
