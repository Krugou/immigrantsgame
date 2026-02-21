// Minimal service worker placeholder created to satisfy tooling.
// Add your caching & offline logic here if needed.
self.addEventListener('install', (event) => {
  // skipWaiting to activate immediately during development
  self.skipWaiting && self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients && self.clients.claim && self.clients.claim();
});
const CACHE_NAME = 'immigrants-cache-v1';
const URLS_TO_CACHE = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      ),
  );
});
