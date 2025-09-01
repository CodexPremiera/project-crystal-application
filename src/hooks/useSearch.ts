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
  
  // React Query integration for data fetching
  const { refetch, isFetching } = useQueryData(
    [key, debounce],
    async ({ queryKey }) => {
      if (type === 'USERS') {
        // Call server action to search for users
        const users = await searchUsers(queryKey[1] as string)
        if (users.status === 200) setOnUsers(users.data)
      }
    },
    false
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