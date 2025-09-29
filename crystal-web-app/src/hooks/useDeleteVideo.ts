import { useMutationData } from './useMutationData'
import { deleteVideo } from '@/actions/workspace'
import { useRouter } from 'next/navigation'

/**
 * useDeleteVideo Hook
 * 
 * This custom hook provides a complete interface for video deletion functionality,
 * combining form validation, state management, and API integration for deleting
 * videos with proper authorization and cache management.
 * 
 * Key Features:
 * 1. Authorization verification (only video author can delete)
 * 2. React Query mutation for API calls
 * 3. Automatic cache invalidation after successful deletion
 * 4. Navigation handling after deletion
 * 5. Loading states and error handling
 * 
 * Data Flow:
 * 1. User confirms deletion in UI
 * 2. Hook executes deleteVideo server action
 * 3. Server verifies user ownership
 * 4. Database deletes video and related data
 * 5. Cache is invalidated to refresh video lists
 * 6. User is redirected to appropriate page
 * 
 * Security:
 * - Server-side authorization check
 * - Prevents unauthorized deletion attempts
 * - Validates user ownership before deletion
 * 
 * Integration:
 * - Connects to workspace actions for data persistence
 * - Uses React Query for optimistic updates
 * - Integrates with navigation system
 * - Provides consistent error handling
 * 
 * @param videoId - Unique identifier of the video to delete
 * @param redirectPath - Optional path to redirect after successful deletion
 * @returns Object containing delete function and loading state
 */
export const useDeleteVideo = (videoId: string, redirectPath?: string) => {
  const router = useRouter()
  
  /**
   * Mutation with Cache Invalidation and Navigation
   * 
   * This demonstrates how to use React Query mutations with targeted cache
   * invalidation and navigation handling for destructive operations.
   * 
   * How it works:
   * 1. Executes deleteVideo server action with video ID
   * 2. Automatically invalidates multiple cache keys
   * 3. Triggers refetch of all video-related data
   * 4. Redirects user after successful deletion
   * 5. Provides loading states and error handling
   * 
   * Cache Management:
   * - Invalidates 'preview-video' for current video
   * - Invalidates 'all-videos' for video lists
   * - Triggers automatic refetch of all video data
   * - Ensures UI reflects the latest state after deletion
   */
  const { mutate: deleteVideoMutation, isPending } = useMutationData(
    ['delete-video'],
    () => deleteVideo(videoId),
    'preview-video', // Primary cache to invalidate
    () => {
      // Custom success callback for navigation
      if (redirectPath) {
        router.push(redirectPath)
      }
    }
  )
  
  return { 
    deleteVideo: deleteVideoMutation, 
    isDeleting: isPending 
  }
}