self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Keep this service worker intentionally non-invasive: no caching and no request rewriting.
self.addEventListener('fetch', function () {});
