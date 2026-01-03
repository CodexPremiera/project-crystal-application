import { useAppSelector } from '@/redux/store'
import { useEffect, useState } from 'react'
import { getWorkspaceFolders, moveVideoLocation } from '@/actions/workspace'
import useZodForm from './useZodForm'
import { moveVideoSchema } from '@/components/forms/change-video-location/schema'
import { useMutation, useQueryClient, UseMutateFunction } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Custom hook for moving videos between workspaces and folders
 *
 * This hook provides comprehensive functionality for relocating videos within
 * the application's workspace structure. It handles both workspace-level and
 * folder-level moves with dynamic form updates and real-time data fetching.
 *
 * Key Features:
 * 1. Dynamic folder fetching based on selected workspace
 * 2. Form validation for move operations
 * 3. Real-time workspace and folder selection
 * 4. Integration with Redux for global state management
 * 5. Optimistic updates with cache invalidation
 *
 * Data Flow:
 * 1. Fetches available workspaces from Redux store
 * 2. Loads folders for the current workspace on mount
 * 3. Dynamically fetches folders when workspace selection changes
 * 4. Validates form data before submission
 * 5. Executes move operation via server action
 * 6. Updates cache to reflect changes
 *
 * Form Behavior:
 * - Workspace selection triggers folder refresh
 * - Folder dropdown updates based on selected workspace
 * - Form validation ensures proper data structure
 * - Loading states provide user feedback
 *
 * Integration:
 * - Uses Redux for workspace and folder state
 * - Connects to workspace actions for data operations
 * - Integrates with form validation system
 * - Provides mutation capabilities with error handling
 *
 * @param videoId - Unique identifier of the video to move
 * @param currentWorkspace - Current workspace ID for initial state
 * @param currentFolderId
 * @param onSuccess
 * @returns Object containing form functions, data, and loading states
 */
export const useMoveVideos = (videoId: string, currentWorkspace: string, currentFolderId: string, onSuccess?: () => void) => {
  // get state redux
  const { folders } = useAppSelector((state) => state.FolderReducer)
  const { workspaces } = useAppSelector((state) => state.WorkSpaceReducer)
  
  // fetching states
  const [isFetching, setIsFetching] = useState(false)
  // stat folders
  const [isFolders, setIsFolders] = useState<
    | ({
    _count: {
      videos: number
    }
  } & {
    id: string
    name: string
    createdAt: Date
    workSpaceId: string | null
  })[]
    | undefined
  >(undefined)
  
  const queryClient = useQueryClient()
  
  /**
   * Data Mutation with React Query (useMutation)
   * 
   * This demonstrates how to use React Query mutations for complex operations
   * like moving videos between workspaces and folders. The mutation provides
   * optimistic updates and automatic cache invalidation.
   * 
   * How it works:
   * 1. Executes moveVideoLocation server action with form data
   * 2. Provides optimistic updates for immediate UI feedback
   * 3. Automatically invalidates related queries after successful mutation
   * 4. Handles loading states and error notifications
   * 5. Integrates with form validation for data integrity
   * 
   * Mutation Features:
   * - Optimistic updates for responsive UI
   * - Automatic cache invalidation for multiple queries
   * - Error handling and user feedback
   * - Loading state management
   */
  const { mutate, isPending } = useMutation({
    mutationKey: ['change-video-location'],
    mutationFn: (data: { folder_id?: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id || ''),
    onSuccess: (data) => {
      if (onSuccess) onSuccess()
      
      const response = data as { status?: number; data?: string }
      toast(response?.status === 200 ? 'Success' : 'Error', {
        description: response?.data,
      })
    },
    onSettled: async () => {
      // Invalidate all video-related queries for immediate UI update
      await queryClient.invalidateQueries({ queryKey: ['folder-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['user-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
    },
  })
  // use zod form
  const { errors, onFormSubmit, watch, register, control } = useZodForm(
    moveVideoSchema,
      mutate as unknown as UseMutateFunction,
    { folder_id: currentFolderId || '', workspace_id: currentWorkspace }
  )
  
  // Track current form values to detect changes
  const watchedWorkspace = watch('workspace_id')
  const watchedFolder = watch('folder_id')
  
  // Check if there are any changes from the initial values
  const hasChanges = 
    watchedWorkspace !== currentWorkspace || 
    (watchedFolder || '') !== (currentFolderId || '')
  
  // fetch folders with a use effect
  const fetchFolders = async (workspace: string) => {
    setIsFetching(true)
    const folders = await getWorkspaceFolders(workspace)
    setIsFetching(false)
    setIsFolders(folders.data)
  }
  useEffect(() => {
    fetchFolders(currentWorkspace)
  }, [currentWorkspace])
  
  useEffect(() => {
    const workspace = watch(async (value) => {
      if (value.workspace_id) await fetchFolders(value.workspace_id)
    })
    
    return () => workspace.unsubscribe()
  }, [watch])
  
  return {
    onFormSubmit,
    errors,
    register,
    control,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
    hasChanges,
  }
}
