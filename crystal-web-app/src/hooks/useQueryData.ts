import {
  Enabled,
  QueryFunction,
  QueryKey,
  useQuery,
} from '@tanstack/react-query'

/**
 * Custom React Query Hook for Data Fetching (READ operations)
 * 
 * This hook provides a simplified interface for React Query's useQuery hook,
 * specifically designed for data fetching operations in the application.
 * It abstracts away the complexity of React Query configuration and provides
 * a consistent set of return values for UI state management.
 * 
 * Purpose: Fetch and cache data from the server (GET requests)
 * 
 * Key Features:
 * 1. Simplified API - Only requires essential parameters (queryKey, queryFn, enabled)
 * 2. Consistent Return Values - Always returns the same set of properties
 * 3. Type Safety - Leverages TypeScript for type-safe query operations
 * 4. Loading States - Provides multiple loading state indicators
 * 5. Refetch Capability - Allows manual data refetching
 * 6. Automatic Caching - Stores fetched data for performance and offline access
 * 
 * @param queryKey - Unique identifier for the query cache (string, array, or object)
 * @param queryFn - Function that returns a promise with the data to fetch (GET request)
 * @param enabled - Optional boolean to control when the query should execute
 * 
 * @returns Object containing:
 *   - data: The fetched data (undefined while loading)
 *   - isPending: Boolean indicating if this is the first load (no cached data)
 *   - isFetched: Boolean indicating if the query has been fetched at least once
 *   - refetch: Function to manually trigger a data refetch
 *   - isFetching: Boolean indicating if a fetch is currently in progress
 * 
 * @example
 * ```tsx
 * // Fetch workspace folders (READ operation)
 * const { data, isPending, isFetched, refetch, isFetching } = useQueryData(
 *   ['workspace-folders', workspaceId],
 *   () => getWorkspaceFolders(workspaceId),
 *   !!workspaceId
 * )
 * 
 * if (isPending) return <LoadingSpinner />
 * if (!data) return <NoDataMessage />
 * 
 * return (
 *   <div>
 *     {data.map(folder => <Folder key={folder.id} {...folder} />)}
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * )
 * ```
 */
export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  enabled?: Enabled
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled,
  })
  
  return { data, isPending, isFetched, refetch, isFetching }
}