// Service Worker for QR Menu PWA
const CACHE_NAME = 'qr-menu-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/logo-dark.jpg',
  '/assets/logo-white.jpg',
  '/assets/logo-main.jpg',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache (for API calls)
  networkFirst: ['api', 'supabase'],
  // Cache first, fallback to network (for static assets)
  cacheFirst: ['fonts', 'images', 'assets', '.jpg', '.png', '.svg', '.woff', '.woff2'],
  // Stale while revalidate (for HTML pages)
  staleWhileRevalidate: ['.html', '.js', '.css'],
};

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Determine cache strategy
  const strategy = getCacheStrategy(url.pathname + url.search);

  if (strategy === 'networkFirst') {
    event.respondWith(networkFirst(request));
  } else if (strategy === 'cacheFirst') {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Get cache strategy for URL
function getCacheStrategy(path) {
  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (path.includes(pattern)) return 'networkFirst';
  }
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (path.includes(pattern)) return 'cacheFirst';
  }
  return 'staleWhileRevalidate';
}

// Network first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match(OFFLINE_URL);
      if (offlineResponse) return offlineResponse;
    }

    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Failed to fetch:', request.url);
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => {
      if (request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
    });

  return cached || fetchPromise;
}

// Background sync for offline analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const offlineData = await cache.match('offline-analytics');

    if (offlineData) {
      const data = await offlineData.json();
      // Send to server when online
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      // Clear offline data
      await cache.delete('offline-analytics');
    }
  } catch (error) {
    console.error('[SW] Failed to sync analytics:', error);
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Yeni bir bildirim var!',
    icon: '/assets/logo-dark.jpg',
    badge: '/assets/logo-dark.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Menüyü Gör' },
      { action: 'close', title: 'Kapat' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('QR Menü', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker loaded');
