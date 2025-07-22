'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(true) // Default to dark mode
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      // Default to dark mode (either saved as 'dark' or no preference saved)
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Always provide the context, including mounted state for components that need it
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Safe hook for components that might render during SSR
export function useThemeSafe() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return safe defaults for SSR
    return { isDark: true, toggleTheme: () => {}, mounted: false }
  }
  return context
}
