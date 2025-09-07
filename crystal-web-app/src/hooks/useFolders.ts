import { useAppSelector } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useMutationData } from './useMutationData'
import { getWorkspaceFolders, moveVideoLocation } from '@/actions/workspace'
import useZodForm from './useZodForm'
import { moveVideoSchema } from '@/components/forms/change-video-location/schema'

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
 * @returns Object containing form functions, data, and loading states
 */
export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
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
  
  // use mutation data optimistic
  const { mutate, isPending } = useMutationData(
    ['change-video-location'],
    (data: { folder_id?: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id || '')
  )
  // use zod form
  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideoSchema,
    mutate,
    { folder_id: undefined, workspace_id: currentWorkspace }
  )
  
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
    const workspace = watch(async (value: any) => {
      if (value.workspace_id) await fetchFolders(value.workspace_id)
    })
    
    return () => workspace.unsubscribe()
  }, [watch])
  
  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  }
}
