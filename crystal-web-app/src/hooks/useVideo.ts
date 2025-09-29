import { createCommentSchema } from '@/components/forms/comment-form/schema'
import { useMutationData } from './useMutationData'
import { useQueryData } from './useQueryData'
import useZodForm from './useZodForm'
import { createCommentAndReply, getUserProfile } from '@/actions/user'

/**
 * Custom hook for managing video comments and replies
 * 
 * This hook provides comprehensive functionality for video commenting system,
 * including creating new comments, replying to existing comments, and managing
 * user profile data for comment attribution.
 * 
 * Key Features:
 * 1. Comment creation with form validation
 * 2. Reply functionality for nested conversations
 * 3. User profile integration for comment attribution
 * 4. Real-time cache invalidation after comment creation
 * 5. Form reset after successful submission
 * 
 * Data Flow:
 * 1. Fetches current user profile for comment attribution
 * 2. Validates comment form data using Zod schema
 * 3. Submits comment/reply to server via mutation
 * 4. Invalidates video comments cache to refresh UI
 * 5. Resets form for new comment input
 * 
 * Comment Types:
 * - Top-level comments: Created directly on videos
 * - Replies: Created as responses to existing comments
 * - Both types use the same validation and submission flow
 * 
 * Integration:
 * - Connects to user actions for profile and comment operations
 * - Uses React Query for data fetching and mutations
 * - Integrates with form validation system
 * - Provides consistent error handling and loading states
 * 
 * @param videoId - Unique identifier of the video for comment attribution
 * @param commentId - Optional ID for reply comments (undefined for top-level)
 * @returns Object containing form functions, validation errors, and loading state
 */
export const useVideoComment = (videoId: string, commentId?: string) => {
  const { data } = useQueryData(['user-profile'], getUserProfile)

  const { data: user } = data as {
    status: number
    data: { id: string; image: string }
  }
  /**
   * Mutation with Callback Pattern
   * 
   * This demonstrates how to use React Query mutations with custom callbacks
   * for additional functionality. The mutation handles comment creation and
   * automatically resets the form after successful submission.
   * 
   * How it works:
   * 1. Executes createCommentAndReply server action with comment data
   * 2. Automatically invalidates 'video-comments' cache
   * 3. Executes custom onSuccess callback to reset form
   * 4. Provides loading states and error handling
   * 5. Enables optimistic updates for immediate UI feedback
   * 
   * Callback Features:
   * - Custom onSuccess callback for form reset
   * - Automatic cache invalidation for comment refresh
   * - Error handling and user feedback
   * - Loading state management
   */
  const { isPending, mutate } = useMutationData(
    ['new-comment'],
    (data: { comment: string }) =>
      createCommentAndReply(user.id, data.comment, videoId, commentId),
    'video-comments',
    () => reset() // Custom callback to reset form after successful submission
  )

  const { register, onFormSubmit, errors, reset } = useZodForm(
    createCommentSchema,
    mutate
  )
  return { register, errors, onFormSubmit, isPending }
}
