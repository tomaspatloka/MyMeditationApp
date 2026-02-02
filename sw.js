// Service Worker for Meditation PWA
const CACHE_NAME = 'meditation-v1.0.0';
const AUDIO_CACHE = 'meditation-audio-v1';

// Files to precache on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/timer.css',
  './css/breathing.css',
  './js/app.js',
  './js/timer.js',
  './js/audio.js',
  './js/breathing.js',
  './js/storage.js',
  './js/i18n.js',
  './locales/cs.json',
  './locales/en.json'
];

// Install event - precache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Audio files: Cache-first with network fallback
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(cache => {
        return cache.match(event.request).then(cached => {
          if (cached) {
            console.log('[SW] Serving audio from cache:', url.pathname);
            return cached;
          }

          // Not in cache, fetch from network
          console.log('[SW] Fetching audio from network:', url.pathname);
          return fetch(event.request).then(response => {
            // Cache the response for future use
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(error => {
            console.error('[SW] Audio fetch failed:', error);
            return new Response('Audio not available', { status: 503 });
          });
        });
      })
    );
    return;
  }

  // Static assets: Cache-first
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          console.log('[SW] Serving from cache:', url.pathname);
          return cached;
        }

        // Not in cache, fetch from network
        console.log('[SW] Fetching from network:', url.pathname);
        return fetch(event.request).then(response => {
          // Cache successful responses
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        }).catch(error => {
          console.error('[SW] Fetch failed:', error);

          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting message received');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_AUDIO') {
    console.log('[SW] Caching audio:', event.data.url);
    event.waitUntil(
      caches.open(AUDIO_CACHE).then(cache => {
        return cache.add(event.data.url);
      })
    );
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing all caches');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync for analytics (if needed in future)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-sessions') {
    console.log('[SW] Background sync triggered');
    // Could sync meditation data to cloud here
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'Čas na meditaci';
  const options = {
    body: data.body || 'Připomenutí denní meditace',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'meditation-reminder',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

console.log('[SW] Service Worker loaded');
