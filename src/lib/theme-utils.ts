/**
 * Standardized theme utilities for FuseFoundry
 * This ensures consistent theming ac// Helper to create consistent button variants
export const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  const base = "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  switch (variant) {
    case 'primary':
      return cn(base, "bg-molten hover:bg-molten/90 text-white focus:ring-molten")
    case 'secondary':
      return cn(base, "bg-catalyst hover:bg-catalyst/90 text-forge focus:ring-catalyst")
    case 'outline':
      return cn(base, "border border-border bg-background hover:bg-accent", themeColors.text.primary, "focus:ring-molten")
    default:
      return base
  }
}ents
 */

import { cn } from "@/lib/utils"

// Standardized color classes for consistent theming
export const themeColors = {
  // Page backgrounds
  page: {
    bg: "bg-background",
    text: "text-foreground"
  },
  
  // Card backgrounds and borders
  card: {
    bg: "bg-card",
    border: "border-border",
    text: "text-card-foreground",
    textMuted: "text-muted-foreground"
  },
  
  // Headers and important text
  heading: {
    primary: "text-foreground",
    secondary: "text-muted-foreground"
  },
  
  // Body text with proper contrast
  text: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    muted: "text-muted-foreground",
    light: "text-muted-foreground/60"
  },
  
  // Interactive elements
  interactive: {
    hover: "hover:bg-accent",
    active: "active:bg-accent/80",
    focus: "focus:ring-2 focus:ring-molten"
  },
  
  // Brand colors that work in both themes
  brand: {
    primary: "text-molten",
    secondary: "text-catalyst",
    accent: "text-spark"
  }
} as const

// Utility functions for common theme patterns
export const getCardClasses = (variant: 'default' | 'elevated' | 'bordered' = 'default') => {
  const base = cn(
    themeColors.card.bg,
    themeColors.card.text,
    "transition-colors duration-200"
  )
  
  switch (variant) {
    case 'elevated':
      return cn(base, "shadow-lg dark:shadow-gray-900/20")
    case 'bordered':
      return cn(base, "border", themeColors.card.border)
    default:
      return base
  }
}

export const getTextClasses = (variant: 'primary' | 'secondary' | 'muted' | 'heading' = 'primary') => {
  switch (variant) {
    case 'heading':
      return themeColors.heading.primary
    case 'secondary':
      return themeColors.text.secondary
    case 'muted':
      return themeColors.text.muted
    default:
      return themeColors.text.primary
  }
}

export const getInteractiveClasses = () => {
  return cn(
    themeColors.interactive.hover,
    themeColors.interactive.focus,
    "transition-colors duration-200"
  )
}

// Helper to create consistent button variants
export const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  const base = "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  switch (variant) {
    case 'primary':
      return cn(base, "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white focus:ring-blue-500")
    case 'secondary':
      return cn(base, "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white focus:ring-gray-500")
    case 'outline':
      return cn(base, "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700", themeColors.text.primary, "focus:ring-blue-500")
    default:
      return base
  }
}
