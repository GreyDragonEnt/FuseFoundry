// FuseFoundry Service Worker
// Handles caching, offline functionality, and PWA features

const CACHE_NAME = 'fusefoundry-v1.0.0'
const STATIC_CACHE_NAME = 'fusefoundry-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'fusefoundry-dynamic-v1.0.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/about',
  '/services',
  '/ai-athena',
  '/foundry-method',
  '/case-studies',
  '/contact',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated successfully')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Serve from cache
            return cachedResponse
          }
          
          // Network fallback
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone()
                caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return networkResponse
            })
            .catch(() => {
              // Offline fallback - serve cached home page
              return caches.match('/')
            })
        })
    )
    return
  }

  // Handle static asset requests
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.url.includes('/_next/static/')) {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          return fetch(request)
            .then((networkResponse) => {
              // Cache successful responses
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone()
                caches.open(STATIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return networkResponse
            })
        })
    )
    return
  }

  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache successful API responses for short time
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return networkResponse
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request)
        })
    )
    return
  }
})

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(
      // Handle offline form submissions when back online
      handleOfflineFormSubmissions()
    )
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'New update from FuseFoundry',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'fusefoundry-notification',
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/icon-192x192.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'FuseFoundry', options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Handle offline form submissions
async function handleOfflineFormSubmissions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const requests = await cache.keys()
    
    for (const request of requests) {
      if (request.url.includes('/api/contact') && request.method === 'POST') {
        try {
          await fetch(request)
          await cache.delete(request)
          console.log('Service Worker: Offline form submission sent')
        } catch (error) {
          console.log('Service Worker: Failed to send offline form submission:', error)
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Error handling offline submissions:', error)
  }
}

// Cache size management
async function limitCacheSize(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    
    if (keys.length > maxItems) {
      const itemsToDelete = keys.slice(0, keys.length - maxItems)
      for (const key of itemsToDelete) {
        await cache.delete(key)
      }
    }
  } catch (error) {
    console.error('Service Worker: Error limiting cache size:', error)
  }
}

// Periodic cache cleanup
setInterval(() => {
  limitCacheSize(DYNAMIC_CACHE_NAME, 50)
  limitCacheSize(STATIC_CACHE_NAME, 100)
}, 300000) // Every 5 minutes
