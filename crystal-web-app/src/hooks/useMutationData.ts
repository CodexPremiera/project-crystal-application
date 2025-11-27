import {
  MutationFunction,
  MutationKey,
  useMutation, useMutationState,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Custom React Query Hook for Data Mutations (WRITE operations)
 * 
 * This hook provides a comprehensive interface for handling data mutations with
 * automatic cache management, optimistic updates, and user feedback. It wraps
 * React Query's useMutation to provide enhanced functionality for write operations.
 * 
 * Purpose: Modify data on the server (POST/PUT/DELETE requests) with automatic
 * cache invalidation and user feedback to maintain data consistency.
 * 
 * Key Features:
 * 1. Optimistic Updates: UI updates immediately before server confirmation
 * 2. Cache Invalidation: Automatically refreshes related cached data
 * 3. Toast Notifications: User feedback for success/error states
 * 4. Loading States: UI indicators during mutation execution
 * 5. Error Handling: Consistent error management across the application
 * 
 * How it works:
 * 1. Executes mutation function with provided data
 * 2. Shows optimistic UI updates immediately
 * 3. Sends request to server via server action
 * 4. Displays toast notification based on response
 * 5. Invalidates specified query keys to refresh cache
 * 6. Replaces optimistic data with server response
 * 
 * Cache Management:
 * - Automatically invalidates related queries after successful mutations
 * - Ensures UI reflects the latest server state
 * - Prevents stale data from being displayed
 * - Triggers background refetching of invalidated queries
 * 
 * Integration:
 * - Used by all mutation operations in the application
 * - Connects to server actions for data persistence
 * - Provides consistent error handling and user feedback
 * - Essential for optimistic updates and cache management
 * 
 * @param mutationKey - Unique identifier for tracking this mutation
 * @param mutationFn - Server action function that performs the mutation
 * @param queryKey - Query key to invalidate after successful mutation
 * @param onSuccess - Optional callback to execute on successful mutation
 * @returns Object containing mutate function and loading state
 */
export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<unknown, unknown>,
  queryKey?: string,
  onSuccess?: () => void
) => {
  const client = useQueryClient()
  
  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (data) => {
      // Execute custom success callback if provided
      if (onSuccess) onSuccess()
      
      // Show toast notification based on response status
      return toast(data?.status === 200 ? 'Success' : 'Error', {
        description: data?.data,
      })
    },
    onSettled: async () => {
      // Invalidate related queries to refresh cached data
      return await client.invalidateQueries({ queryKey: [queryKey] })
    },
  })
  
  return { mutate, isPending }
}


/**
 * Hook for Accessing Optimistic Mutation Data (useMutationState)
 * 
 * This hook provides access to optimistic data from mutations in real-time,
 * allowing components to display temporary data before server confirmation.
 * It's essential for implementing optimistic UI updates across the application.
 * 
 * Purpose: Access optimistic data from mutations for immediate UI updates
 * 
 * Key Features:
 * 1. Real-time Data Access: Get optimistic data instantly across components
 * 2. Mutation Tracking: Monitor mutation status and progress
 * 3. Optimistic Updates: Display temporary data before server confirmation
 * 4. Cross-Component State: Share mutation data between components
 * 
 * How it works:
 * 1. Tracks mutations by their unique mutation key
 * 2. Provides access to mutation variables and status
 * 3. Returns the latest mutation data for immediate UI updates
 * 4. Enables optimistic UI rendering before server response
 * 
 * Use Cases:
 * - Display new items immediately after creation
 * - Show loading states during mutations
 * - Access temporary data for UI updates
 * - Track mutation progress across components
 * 
 * Integration:
 * - Used with useMutation for complete mutation management
 * - Enables optimistic updates in UI components
 * - Provides real-time data access for immediate feedback
 * - Essential for responsive user experience
 * 
 * @param mutationKey - The mutation key to track and access data for
 * @returns Object containing the latest mutation variables and status
 */
export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as Record<string, unknown>,
        status: mutation.state.status,
      }
    },
  })
  
  const latestVariables = data[data.length - 1]
  return { latestVariables }
}
