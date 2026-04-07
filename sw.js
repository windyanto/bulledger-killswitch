const CACHE_NAME = 'bulledger-killswitch-v3';
const ASSETS = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) { e.respondWith(fetch(e.request)); return; }
  e.respondWith(fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, c)); return res; }).catch(() => caches.match(e.request)));
});
