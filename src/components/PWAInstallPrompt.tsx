'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAInstallPromptProps {
  className?: string
}

export default function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'mobile' | 'desktop' | 'unknown'>('unknown')

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check for display-mode: standalone (PWA is installed)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }
      
      // Check for navigator.standalone (iOS Safari)
      if ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone) {
        setIsInstalled(true)
        return
      }
      
      // Check for document.referrer (Android)
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true)
        return
      }
    }

    // Detect platform
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        setPlatform('mobile')
      } else {
        setPlatform('desktop')
      }
    }

    checkIfInstalled()
    detectPlatform()

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      
      // Show prompt after a delay if not dismissed before
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed')
        const lastShown = localStorage.getItem('pwa-prompt-last-shown')
        const now = Date.now()
        
        // Don't show if dismissed recently (7 days)
        if (dismissed && now - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
          return
        }
        
        // Don't show if shown recently (1 day)
        if (lastShown && now - parseInt(lastShown) < 24 * 60 * 60 * 1000) {
          return
        }
        
        setShowPrompt(true)
        localStorage.setItem('pwa-prompt-last-shown', now.toString())
      }, 3000) // Show after 3 seconds
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      console.log('PWA: App was installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      
      // Wait for the user to respond
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt')
      } else {
        console.log('PWA: User dismissed the install prompt')
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('PWA: Error showing install prompt:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  const Icon = platform === 'mobile' ? Smartphone : Monitor

  return (
    <div className={cn(
      'fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-full duration-500',
      'md:left-auto md:right-4 md:max-w-md',
      className
    )}>
      <div className="card p-6 bg-white dark:bg-gray-800 border-molten/20 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-molten to-spark flex items-center justify-center">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-forge dark:text-white mb-2">
              Install FuseFoundry App
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Get faster access and work offline. Install our app for the best experience.
            </p>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleInstallClick}
                className="btn-primary text-sm px-4 py-2 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Install
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Dismiss install prompt"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Benefits list */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex items-center">
              <div className="w-1 h-1 bg-catalyst rounded-full mr-2" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-1 bg-catalyst rounded-full mr-2" />
              <span>Faster loading</span>
            </div>
            <div className="flex items-center">
              <div className="w-1 h-1 bg-catalyst rounded-full mr-2" />
              <span>Native app experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
