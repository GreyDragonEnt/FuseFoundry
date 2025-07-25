'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Standardized theme types
export type Theme = 'light' | 'dark'

// Extend window interface for theme
declare global {
  interface Window {
    __INITIAL_THEME__?: Theme
  }
}

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  isLight: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Force dark mode permanently - no client-side manipulation needed since it's set server-side
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Just set mounted flag, no DOM manipulation to avoid hydration issues
    setMounted(true)
    
    // Ensure localStorage consistency but don't manipulate DOM classes
    if (typeof window !== 'undefined') {
      localStorage.setItem('fusefoundry-theme', 'dark')
    }
  }, [])

  const setTheme = () => {
    // No-op function since theme is locked to dark
  }

  const toggleTheme = () => {
    // No-op function since theme is locked to dark
  }

  const value = {
    theme: 'dark' as Theme,
    isDark: true,
    isLight: false,
    setTheme,
    toggleTheme,
    mounted
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Safe hook for SSR - returns safe defaults during server-side rendering
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return { 
      theme: 'dark' as Theme, 
      isDark: true, 
      isLight: false,
      setTheme: () => {}, 
      toggleTheme: () => {}, 
      mounted: false 
    }
  }
  return context
}
