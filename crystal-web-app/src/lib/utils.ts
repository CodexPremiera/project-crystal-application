import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility Functions Library
 * 
 * This file contains common utility functions used throughout the application
 * for styling, string manipulation, and other helper operations.
 */

/**
 * Combines and merges CSS classes using clsx and tailwind-merge
 * 
 * This function provides a robust way to conditionally combine CSS classes
 * while resolving Tailwind CSS conflicts. It's essential for dynamic
 * styling throughout the application.
 * 
 * Purpose: Provide safe CSS class combination with Tailwind conflict resolution
 * 
 * How it works:
 * 1. Uses clsx to handle conditional class logic
 * 2. Uses tailwind-merge to resolve Tailwind CSS conflicts
 * 3. Returns a single string of merged classes
 * 4. Handles undefined, null, and boolean values gracefully
 * 
 * Features:
 * - Conditional class application
 * - Tailwind CSS conflict resolution
 * - Type-safe class value handling
 * - Optimized for performance
 * 
 * Integration:
 * - Used throughout the application for dynamic styling
 * - Essential for component styling and theming
 * - Integrates with Tailwind CSS framework
 * - Part of the styling system infrastructure
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged and resolved CSS class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncates strings to a specified length with ellipsis
 * 
 * This utility function provides consistent string truncation
 * for displaying long text in UI components with proper
 * length limits and visual indicators.
 * 
 * Purpose: Provide consistent string truncation for UI display
 * 
 * How it works:
 * 1. Slices string to specified length (default 30 characters)
 * 2. Appends ellipsis (...) to indicate truncation
 * 3. Handles edge cases and provides fallback length
 * 
 * Features:
 * - Configurable truncation length
 * - Consistent ellipsis formatting
 * - Safe string handling
 * - Default length fallback
 * 
 * Integration:
 * - Used by UI components for text display
 * - Essential for responsive design
 * - Part of text formatting utilities
 * - Helps maintain consistent UI appearance
 * 
 * @param string - The string to truncate
 * @param slice - Optional length limit (defaults to 30)
 * @returns Truncated string with ellipsis
 */
export const truncateString = (string: string, slice?: number) => {
  return string.slice(0, slice || 30) + '...'
}
