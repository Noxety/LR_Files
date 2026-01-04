const CACHE_NAME = "pwa-cache-v1";
const OFFLINE_URL = "/offline";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/css/app.css",
  "/js/app.js"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || caches.match(OFFLINE_URL);
      })
    );
  }
});
