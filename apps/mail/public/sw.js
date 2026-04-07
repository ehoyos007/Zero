// SwipeInbox Service Worker — minimal for PWA installability
// Does NOT cache email data (privacy). Only caches app shell.

const CACHE_NAME = 'swipeinbox-shell-v1';

const SHELL_ASSETS = [
  '/',
  '/swipe',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache same-origin GET requests for app shell
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never cache API calls or email data
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(request).catch(() => caches.match(request)),
  );
});
