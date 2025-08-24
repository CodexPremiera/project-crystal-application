import {
  MutationFunction,
  MutationKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Custom hook for handling data mutations with automatic feedback and cache management
 * 
 * This hook wraps React Query's useMutation to provide:
 * 1. Automatic toast notifications on success/error
 * 2. Query cache invalidation after mutations
 * 3. Loading states for UI feedback
 * 4. Optional success callback execution
 * 
 * @param mutationKey - Unique identifier for the mutation
 * @param mutationFn - Function that performs the mutation (API call)
 * @param queryKey - Optional query key to invalidate after mutation
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