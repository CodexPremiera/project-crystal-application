import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'crystal-recent-searches'
const MAX_RECENT_SEARCHES = 10

/**
 * useRecentSearches Hook
 * 
 * Manages recent search history in localStorage.
 * Provides functions to add, remove, and clear search history.
 * Limited to 10 most recent searches.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setRecentSearches(parsed)
          }
        } catch {
          // Invalid JSON, reset
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }, [])

  // Save to localStorage whenever recentSearches changes
  const saveToStorage = useCallback((searches: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
    }
  }, [])

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    setRecentSearches(prev => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase())
      // Add to beginning, limit to max
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== query)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches
  }
}

