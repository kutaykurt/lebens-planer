/**
 * Life OS Service Worker
 * Handles background notifications and offline caching.
 */

const CACHE_NAME = 'life-os-v2';
const DYNAMIC_CACHE = 'life-os-dynamic-v2';

// Assets to strictly precache (if static)
const PRECACHE_URLS = [
    '/',
    '/manifest.json',
    '/icons/icon-192.svg',
    '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
    // Skip waiting to activate immediately
    self.skipWaiting();

    // Precache critical assets
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Claim clients to start controlling them immediately
    event.waitUntil(clients.claim());

    // Cleanup old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Strategy: Stale-While-Revalidate for pages/assets, Network-First for API
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Ignore non-http (e.g. chrome-extension)
    if (!url.protocol.startsWith('http')) return;

    // Ignore nextjs development stuff
    if (url.pathname.includes('/_next/static/development') || url.pathname.includes('/_next/webpack-hmr')) {
        return;
    }

    // Network-First for API calls (if any) or critical real-time data
    // For this app, essentially everything is local (IndexedDB), so we care about serving the App Shell.

    // Stale-While-Revalidate for most resources
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // If invalid response, just return
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clone response to put in cache
                const responseToCache = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Network failed
                // If it's a navigation request (HTML page) and we don't have it in cache,
                // we could return a custom offline page (if we had one).
                // For Single Page Apps, often returning the index.html from cache works,
                // but Next.js has server rendering.
                // Since this PWA is mostly client-side logic after load (IndexedDB),
                // if we have the visited page in cache, it works.
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });

            return cachedResponse || fetchPromise;
        })
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('/');
        })
    );
});

// Basic push listener (if server push is ever added)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Life OS Update', message: 'Neuigkeiten in deinem Life OS!' };

    const options = {
        body: data.message,
        icon: '/icons/icon-192.svg',
        badge: '/icons/icon-192.svg',
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});
