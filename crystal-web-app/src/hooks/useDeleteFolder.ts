import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFolder } from '@/actions/workspace'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * useDeleteFolder Hook
 * 
 * This custom hook provides a complete interface for folder deletion functionality,
 * combining state management, and API integration for deleting folders with proper
 * authorization and cache management.
 * 
 * Key Features:
 * 1. Authorization verification (only folder owner can delete)
 * 2. React Query mutation for API calls
 * 3. Automatic cache invalidation after successful deletion
 * 4. Navigation handling after deletion
 * 5. Loading states and error handling
 * 
 * Data Flow:
 * 1. User confirms deletion in UI
 * 2. Hook executes deleteFolder server action
 * 3. Server verifies user ownership
 * 4. Videos are unlinked from folder (moved to workspace root)
 * 5. Folder is deleted from database
 * 6. Cache is invalidated to refresh folder lists
 * 7. User is redirected to workspace
 * 
 * @param folderId - Unique identifier of the folder to delete
 * @param workspaceId - Workspace ID to redirect to after deletion
 * @returns Object containing delete function and loading state
 */
export const useDeleteFolder = (folderId: string, workspaceId: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const { mutate: deleteFolderMutation, isPending } = useMutation({
    mutationKey: ['delete-folder'],
    mutationFn: () => deleteFolder(folderId),
    onSuccess: (data) => {
      const response = data as { status?: number; data?: string }
      toast(response?.status === 200 ? 'Success' : 'Error', {
        description: response?.data,
      })
      
      if (response?.status === 200) {
        router.push(`/dashboard/${workspaceId}`)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
      await queryClient.invalidateQueries({ queryKey: ['folder-info'] })
      await queryClient.invalidateQueries({ queryKey: ['folder-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['user-videos'] })
    },
  })
  
  return { 
    deleteFolder: deleteFolderMutation, 
    isDeleting: isPending 
  }
}

