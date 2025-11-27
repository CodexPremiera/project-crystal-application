'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

/**
 * Theme Provider Component
 * 
 * Wrapper component that provides theme context to the application.
 * Enables dark/light mode switching and theme persistence.
 * 
 * Appearance:
 * - Invisible wrapper component
 * - No visual elements
 * - Provides theme context to children
 * 
 * Special Behavior:
 * - Enables theme switching throughout app
 * - Persists theme preference in localStorage
 * - Provides theme context to all children
 * - Handles system theme detection
 * 
 * Used in:
 * - Root layout (global theme provider)
 * - Theme switching functionality
 * - Dark/light mode support
 */

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
