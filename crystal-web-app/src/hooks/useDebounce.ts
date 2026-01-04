import { useState, useEffect } from 'react'

/**
 * useDebounce Hook
 * 
 * Delays updating a value until after a specified delay has passed
 * since the last change. Useful for search inputs to prevent
 * excessive API calls while the user is typing.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

