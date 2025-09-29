import { createFolder } from '@/actions/workspace'
import { useMutationData } from './useMutationData'

/**
 * Custom hook for creating new folders within a workspace
 * 
 * This hook provides a streamlined interface for folder creation operations:
 * 1. Wraps the createFolder server action with React Query mutation capabilities
 * 2. Handles optimistic updates and cache invalidation automatically
 * 3. Provides a simple function to trigger folder creation with default values
 * 4. Integrates with the global mutation system for consistent error handling
 * 
 * Purpose: Enable users to create new folders within their workspaces with
 * automatic UI updates and proper error handling.
 * 
 * How it works:
 * - Uses useMutationData to wrap the createFolder server action
 * - Provides onCreateNewFolder function that creates folders with default "Untitled" name
 * - Automatically invalidates workspace-folders cache to refresh folder list
 * - Handles loading states and error notifications through the mutation system
 * 
 * @param workspaceId - The UUID of the workspace where the folder will be created
 * @returns Object containing onCreateNewFolder function to trigger folder creation
 */
export const useCreateFolders = (workspaceId: string) => {
  /**
   * Simple Mutation Pattern with React Query
   * 
   * This demonstrates the simplest useMutation pattern for creating new data.
   * The mutation automatically handles cache invalidation to refresh the
   * folder list after successful creation.
   * 
   * How it works:
   * 1. Executes createFolder server action with workspaceId
   * 2. Automatically invalidates 'workspace-folders' cache
   * 3. Triggers refetch of folder list to show new folder
   * 4. Provides loading states and error handling
   * 5. Enables optimistic updates for immediate UI feedback
   * 
   * Cache Invalidation:
   * - Invalidates 'workspace-folders' query after successful creation
   * - Triggers automatic refetch of folder list
   * - Ensures UI reflects the latest server state
   * - Prevents stale data from being displayed
   */
  const { mutate } = useMutationData(
    ['create-folder'], // Unique mutation key for tracking
    () => createFolder(workspaceId), // Server action to execute
    'workspace-folders' // Query key to invalidate after successful creation
  )

  /**
   * Creates a new folder with default settings
   * 
   * This function triggers the folder creation process:
   * 1. Calls the mutate function with default folder data
   * 2. Uses "Untitled" as the default folder name
   * 3. Provides an optimistic ID for immediate UI feedback
   * 4. The actual folder creation happens on the server via createFolder action
   */
  const onCreateNewFolder = () =>
    mutate({ name: 'Untitled', id: 'optimitsitc--id' })
  
  return { onCreateNewFolder }
}
