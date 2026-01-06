'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Clock, X, Video, Folder, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { quickSearch, QuickSearchResult } from '@/actions/search'
import Fuse from 'fuse.js'
import { cn, extractWorkspaceIdFromPath } from '@/lib/utils'

/**
 * SearchDropdown Component
 * 
 * YouTube-style search with real-time suggestions dropdown.
 * Shows recent searches on focus and fuzzy-matched results as user types.
 */

export function SearchDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<QuickSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  
  const debouncedQuery = useDebounce(query, 300)
  const { recentSearches, addRecentSearch, removeRecentSearch } = useRecentSearches()

  const currentWorkspaceId = extractWorkspaceIdFromPath(pathname)

  // Fetch results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await quickSearch(debouncedQuery)
        if (response.status === 200 && response.data) {
          // Apply Fuse.js for better fuzzy ranking
          const fuse = new Fuse(response.data, {
            keys: ['name'],
            threshold: 0.4,
            includeScore: true
          })
          const fuzzyResults = fuse.search(debouncedQuery)
          setResults(fuzzyResults.map(r => r.item))
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [results, recentSearches])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigate to search results or item
  const handleSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    addRecentSearch(searchQuery)
    setIsOpen(false)
    setQuery('')
    
    if (currentWorkspaceId) {
      router.push(`/dashboard/${currentWorkspaceId}/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Navigate to a specific result
  const handleResultClick = (result: QuickSearchResult) => {
    addRecentSearch(result.name)
    setIsOpen(false)
    setQuery('')

    switch (result.type) {
      case 'video':
        router.push(`/dashboard/${result.workspaceId}/video/${result.id}`)
        break
      case 'folder':
        router.push(`/dashboard/${result.workspaceId}/folder/${result.id}`)
        break
      case 'workspace':
        router.push(`/dashboard/${result.workspaceId}`)
        break
    }
  }

  // Handle recent search click
  const handleRecentClick = (search: string) => {
    handleSubmit(search)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.length >= 2 ? results : recentSearches
    const maxIndex = items.length - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < maxIndex ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : maxIndex))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          if (query.length >= 2 && results[highlightedIndex]) {
            handleResultClick(results[highlightedIndex])
          } else if (recentSearches[highlightedIndex]) {
            handleRecentClick(recentSearches[highlightedIndex])
          }
        } else {
          handleSubmit(query)
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-text-muted" />
      case 'folder':
        return <Folder className="h-4 w-4 text-text-muted" />
      case 'workspace':
        return <Building2 className="h-4 w-4 text-text-muted" />
      default:
        return <Search className="h-4 w-4 text-text-muted" />
    }
  }

  const showRecentSearches = isOpen && query.length < 2 && recentSearches.length > 0
  const showResults = isOpen && query.length >= 2
  const showDropdown = showRecentSearches || showResults

  return (
    <div className="relative w-full max-w-lg">
      {/* Search Input */}
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full">
        <Search size={25} className="text-text-muted" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="!bg-transparent border-none !px-0 !placeholder-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search for people, projects, tags & folders"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 hover:bg-surface-hover rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-surface-border rounded-xl shadow-xl overflow-hidden z-50"
        >
          {/* Recent Searches */}
          {showRecentSearches && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={search}
                  className={cn(
                    "flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
                    highlightedIndex === index ? "bg-surface-hover" : "hover:bg-surface-hover"
                  )}
                  onClick={() => handleRecentClick(search)}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-text-muted" />
                    <span className="text-text-secondary">{search}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRecentSearch(search)
                    }}
                    className="p-1 hover:bg-surface-border rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-text-muted" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div className="py-2 max-h-[350px] overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center text-text-muted">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
                    Results
                  </div>
                  {results.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                        highlightedIndex === index ? "bg-surface-hover" : "hover:bg-surface-hover"
                      )}
                      onClick={() => handleResultClick(result)}
                    >
                      {/* Thumbnail or Icon */}
                      {result.type === 'video' && result.thumbnail ? (
                        <div className="w-12 h-8 rounded overflow-hidden bg-surface-border flex-shrink-0">
                          <img
                            src={result.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-surface-border flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(result.type)}
                        </div>
                      )}
                      
                      {/* Name and Type */}
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary truncate">{result.name}</p>
                        <p className="text-xs text-text-muted capitalize">{result.type}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-4 py-8 text-center text-text-muted">
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}

          {/* Press Enter hint */}
          {query.length >= 2 && (
            <div className="px-4 py-2 border-t border-surface-border text-xs text-text-muted">
              Press <kbd className="px-1.5 py-0.5 bg-surface-border rounded text-text-tertiary">Enter</kbd> to search all results
            </div>
          )}
        </div>
      )}
    </div>
  )
}

