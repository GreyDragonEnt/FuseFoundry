'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service Worker: Not supported')
      return
    }

    const registerSW = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        })

        console.log('Service Worker: Registered successfully', registration)

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('Service Worker: New version available')
                
                // Show update notification
                if (window.confirm('A new version of the app is available. Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })

        // Check for existing service worker updates
        registration.update()

      } catch (error) {
        console.error('Service Worker: Registration failed', error)
      }
    }

    // Register immediately if page is already loaded
    if (document.readyState === 'complete') {
      registerSW()
    } else {
      // Wait for page load to avoid blocking initial render
      window.addEventListener('load', registerSW)
    }

    // Handle messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATE_AVAILABLE') {
        if (window.confirm('App update available. Refresh now?')) {
          window.location.reload()
        }
      }
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('load', registerSW)
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [])

  // This component doesn't render anything
  return null
}
