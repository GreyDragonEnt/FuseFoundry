# FuseFoundry Theme System

## Overview
This document outlines the standardized theme system for FuseFoundry, ensuring consistent dark/light mode support and text contrast across all components.

## Core Components

### 1. ThemeProvider (`src/components/ThemeProvider.tsx`)
- **Purpose**: Manages global theme state with SSR-safe hydration
- **Features**: 
  - Uses `fusefoundry-theme` localStorage key for persistence
  - Provides `theme`, `isDark`, `isLight`, `setTheme`, `toggleTheme`, `mounted` values
  - Defaults to dark mode for brand consistency
  - SSR-safe with `useThemeSafe()` hook

### 2. Theme Utilities (`src/lib/theme-utils.ts`)
- **Purpose**: Standardized utility functions and classes for consistent theming
- **Exports**:
  - `themeColors`: Predefined color classes for different UI elements
  - `getCardClasses()`: Consistent card styling with variants
  - `getTextClasses()`: Proper text contrast for different text types
  - `getInteractiveClasses()`: Hover/focus states
  - `getButtonClasses()`: Button variants with proper theming

### 3. Layout Configuration (`src/app/layout.tsx`)
- **Features**:
  - SSR-safe theme script with error handling
  - `suppressHydrationWarning` to prevent theme-related warnings
  - Base body classes for smooth theme transitions

## Theme Colors Reference

### Page/Background Colors
```typescript
themeColors.page.bg        // "bg-white dark:bg-gray-900"
themeColors.page.text      // "text-gray-900 dark:text-gray-100"
```

### Card Colors
```typescript
themeColors.card.bg         // "bg-white dark:bg-gray-800"
themeColors.card.border     // "border-gray-200 dark:border-gray-700"
themeColors.card.text       // "text-gray-900 dark:text-gray-100"
themeColors.card.textMuted  // "text-gray-600 dark:text-gray-300"
```

### Text Colors (High Contrast)
```typescript
themeColors.text.primary    // "text-gray-900 dark:text-gray-100"
themeColors.text.secondary  // "text-gray-700 dark:text-gray-300"
themeColors.text.muted      // "text-gray-600 dark:text-gray-400"
themeColors.text.light      // "text-gray-500 dark:text-gray-500"
```

### Heading Colors
```typescript
themeColors.heading.primary   // "text-gray-900 dark:text-white"
themeColors.heading.secondary // "text-gray-700 dark:text-gray-200"
```

### Interactive States
```typescript
themeColors.interactive.hover  // "hover:bg-gray-50 dark:hover:bg-gray-800"
themeColors.interactive.active // "active:bg-gray-100 dark:active:bg-gray-700"
themeColors.interactive.focus  // "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
```

### Brand Colors
```typescript
themeColors.brand.primary   // "text-blue-600 dark:text-blue-400"
themeColors.brand.secondary // "text-purple-600 dark:text-purple-400"
themeColors.brand.accent    // "text-green-600 dark:text-green-400"
```

## Utility Functions

### Card Styling
```typescript
getCardClasses('default')  // Basic card styling
getCardClasses('elevated') // Card with shadow
getCardClasses('bordered') // Card with border
```

### Text Styling
```typescript
getTextClasses('primary')   // High contrast body text
getTextClasses('secondary') // Secondary text
getTextClasses('muted')     // Muted/subtle text
getTextClasses('heading')   // Heading text
```

### Button Styling
```typescript
getButtonClasses('primary')   // Primary action button
getButtonClasses('secondary') // Secondary button
getButtonClasses('outline')   // Outline button
```

### Interactive Elements
```typescript
getInteractiveClasses() // Hover, focus, and transition classes
```

## Best Practices

### 1. Always Use Theme Utilities
❌ **Don't**: `className="text-gray-500 dark:text-gray-400"`
✅ **Do**: `className={getTextClasses('muted')}`

### 2. Consistent Card Patterns
```typescript
<div className={cn(
  getCardClasses('bordered'),
  getInteractiveClasses(),
  "additional-custom-classes"
)}>
```

### 3. Text Contrast
- Use `getTextClasses('heading')` for important headings
- Use `getTextClasses('primary')` for body text
- Use `getTextClasses('secondary')` for less important text
- Use `getTextClasses('muted')` for subtle text

### 4. SSR-Safe Theme Usage
```typescript
const { theme, mounted } = useTheme()

// Wait for hydration before showing theme-dependent content
if (!mounted) return <div>Loading...</div>

return (
  <div className={getCardClasses()}>
    Content with proper theming
  </div>
)
```

## Component Standardization

### Updated Components
✅ **ThemeProvider**: Core theme management
✅ **CaseStudyCard**: Uses new theme utilities
✅ **PWAInstallPrompt**: Standardized theming
✅ **Layout**: SSR-safe theme initialization
✅ **ProcessTimeline**: Updated to use theme utilities
✅ **Cart**: Updated to use theme utilities
✅ **FeatureGrid**: Using theme utilities
✅ **HeroSection**: Using theme utilities
✅ **Navbar**: Using theme utilities
✅ **Footer**: Using theme utilities

## Configuration

### localStorage Keys
- `fusefoundry-theme`: Current theme ('light' | 'dark')
- `fusefoundry-pwa-dismissed`: PWA prompt dismissal timestamp
- `fusefoundry-pwa-last-shown`: PWA prompt last shown timestamp

### Default Behavior
- **Default theme**: Dark mode (brand preference)
- **Hydration**: SSR-safe with fallback values
- **Persistence**: Automatic localStorage sync
- **Performance**: Optimized with CSS custom properties

## Troubleshooting

### Hydration Mismatch
- Ensure `suppressHydrationWarning` is set on `<html>` tag
- Use `mounted` state before rendering theme-dependent content
- Use `useThemeSafe()` for components that might render during SSR

### Text Contrast Issues
- Always use `getTextClasses()` instead of manual Tailwind classes
- Test both light and dark modes
- Ensure sufficient contrast ratios (4.5:1 minimum)

### Performance
- Theme utilities are optimized with CSS custom properties
- Transitions are consistent across all interactive elements
- Minimal rerenders with proper context usage

## Migration Guide

### From Old System
1. Replace manual `text-gray-*` classes with `getTextClasses()`
2. Replace manual card classes with `getCardClasses()`
3. Update theme hook usage from `isDark` to `theme`
4. Use standardized localStorage keys

### Example Migration
```typescript
// Before
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// After
<div className={getCardClasses()}>
  <h1 className={getTextClasses('heading')}>Title</h1>
  <p className={getTextClasses('primary')}>Content</p>
</div>
```

## Testing

### Manual Testing Checklist
- [ ] Theme toggles work correctly
- [ ] Page reload preserves theme
- [ ] No hydration errors in console
- [ ] Proper contrast in both themes
- [ ] Smooth transitions between themes
- [ ] PWA install prompt uses correct theme
- [ ] All cards have consistent styling

### Automated Testing
- Theme persistence tests
- Component rendering tests
- Accessibility contrast tests
- SSR/hydration tests
