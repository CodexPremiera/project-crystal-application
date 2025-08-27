import {
  MutationFunction,
  MutationKey,
  useMutation, useMutationState,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Custom hook for handling data mutations (WRITE operations)
 * 
 * This hook wraps React Query's useMutation to provide:
 * 1. Automatic toast notifications on success/error
 * 2. Query cache invalidation after mutations (keeps cache in sync)
 * 3. Loading states for UI feedback
 * 4. Optional success callback execution
 * 
 * Purpose: Modify data on the server (POST/PUT/DELETE requests) and automatically
 * refresh related cached data to maintain consistency.
 * 
 * @param mutationKey - Unique identifier for the mutation
 * @param mutationFn - Function that performs the mutation (API call)
 * @param queryKey - Optional query key to invalidate after successful mutation
 * @param onSuccess - Optional callback to execute on successful mutation
 * @returns Object containing mutation function and loading state
 */
export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
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
 * Hook to access mutation state and variables
 * 
 * This hook provides access to the current state of mutations,
 * useful for tracking mutation progress or accessing the latest
 * mutation variables across components.
 * 
 * @param mutationKey - The mutation key to track
 * @returns Object containing the latest mutation variables and status
 */
export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      }
    },
  })
  
  const latestVariables = data[data.length - 1]
  return { latestVariables }
}
