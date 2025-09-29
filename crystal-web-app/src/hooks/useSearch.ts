import React, {useEffect, useState} from "react";
import {useQueryData} from "@/hooks/useQueryData";
import {searchUsers} from "@/actions/user";

/**
 * Custom hook for managing user search functionality with debouncing
 * 
 * This hook provides a complete search experience with:
 * 1. Real-time input handling with debounced API calls
 * 2. Loading states for better UX
 * 3. Integration with React Query for data fetching
 * 4. Automatic cleanup of search results when query is empty
 * 
 * @param key - Unique identifier for React Query cache
 * @param type - Type of search (currently supports 'USERS')
 * @returns Object containing search state and handlers
 */
export const useSearch = (key: string, type: 'USERS') => {
  // Current search input value
  const [query, setQuery] = useState('')
  // Debounced version of query (used for API calls)
  const [debounce, setDebounce] = useState('')
  // Search results from API
  const [onUsers, setOnUsers] = useState<
    | {
    id: string
    subscription: {
      plan: 'PRO' | 'FREE'
    } | null
    firstname: string | null
    lastname: string | null
    image: string | null
    email: string | null
  }[]
    | undefined
  >(undefined)
  
  /**
   * Handles search input changes
   * Updates the query state immediately for responsive UI
   */
  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  
  // Debounce mechanism: delays API calls by 1 second after user stops typing
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query)
    }, 1000)
    return () => clearTimeout(delayInputTimeoutId);
  }, [query])
  
  /**
   * React Query Integration for Search Data Fetching
   * 
   * This demonstrates how to use React Query with debounced search functionality.
   * The query is disabled by default and only executes when triggered manually,
   * providing efficient search with debouncing to prevent excessive API calls.
   * 
   * How it works:
   * 1. Query is disabled by default (enabled: false)
   * 2. Only executes when manually triggered via refetch()
   * 3. Uses debounced query as part of the query key for cache management
   * 4. Automatically caches search results for performance
   * 5. Provides loading states during search execution
   * 
   * Query Key Strategy:
   * - Uses [key, debounce] for unique cache entries per search term
   * - Different search terms get separate cache entries
   * - Enables efficient cache management for search results
   */
  const { refetch, isFetching } = useQueryData(
    [key, debounce],
    async ({ queryKey }) => {
      if (type === 'USERS') {
        // Call server action to search for users
        const users = await searchUsers(queryKey[1] as string)
        if (users.status === 200) setOnUsers(users.data)
      }
    },
    false // Disabled by default - only executes when manually triggered
  )
  
  // Trigger search when debounced query changes
  useEffect(() => {
    if (debounce) {
      // Execute search when we have a debounced query
      refetch()
    } else {
      // Clear results when query is empty
      setOnUsers(undefined)
    }
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      debounce
    }
  }, [debounce, refetch])
  
  return { onSearchQuery, query, isFetching, onUsers }
}