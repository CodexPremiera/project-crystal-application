import { editVideoInfoSchema } from '@/components/forms/edit-video/schema'
import useZodForm from './useZodForm'
import { useMutationData } from './useMutationData'
import { editVideoInfo } from '@/actions/workspace'
import { MutationFunction, UseMutateFunction } from '@tanstack/react-query'

/**
 * useEditVideo Hook
 * 
 * This custom hook provides a complete interface for video editing functionality,
 * combining form validation, state management, and API integration for updating
 * video metadata.
 * 
 * Key Features:
 * 1. Form validation using Zod schemas
 * 2. React Hook Form integration for state management
 * 3. React Query mutation for API calls
 * 4. Automatic cache invalidation after successful updates
 * 5. Loading states and error handling
 * 
 * Form Validation:
 * - Title: Minimum 5 characters required
 * - Description: Minimum 100 characters required
 * - Real-time validation with error messages
 * 
 * Data Flow:
 * 1. Form submission triggers validation
 * 2. Valid data is sent to editVideoInfo action
 * 3. Database is updated with new video metadata
 * 4. Cache is invalidated to refresh video data
 * 5. Success/error notifications are shown
 * 
 * Integration:
 * - Connects to workspace actions for data persistence
 * - Uses React Query for optimistic updates
 * - Integrates with form validation system
 * - Provides consistent error handling
 * 
 * @param videoId - Unique identifier of the video to edit
 * @param title - Current video title for form initialization
 * @param description - Current video description for form initialization
 * @returns Object containing form functions and state
 */
export const useEditVideo = (
  videoId: string,
  title: string,
  description: string
) => {
  /**
   * Mutation with Specific Cache Invalidation
   * 
   * This demonstrates how to use React Query mutations with targeted cache
   * invalidation for specific data that needs to be refreshed after updates.
   * 
   * How it works:
   * 1. Executes editVideoInfo server action with updated video data
   * 2. Automatically invalidates 'preview-video' cache
   * 3. Triggers refetch of video preview data to show updates
   * 4. Provides loading states and error handling
   * 5. Enables optimistic updates for immediate UI feedback
   * 
   * Targeted Cache Management:
   * - Invalidates 'preview-video' query after successful update
   * - Triggers automatic refetch of video preview data
   * - Ensures video preview reflects the latest changes
   * - Prevents stale video data from being displayed
   */
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    ((data: { title: string; description: string }) =>
      editVideoInfo(videoId, data.title, data.description)) as MutationFunction<unknown, unknown>,
    'preview-video' // Invalidate preview-video cache after update
  )
  
  // Initialize form with validation and submission logic
  const { errors, onFormSubmit, register } = useZodForm(
    editVideoInfoSchema,
    mutate as UseMutateFunction,
    {
      title,
      description,
    }
  )

  return { onFormSubmit, register, errors, isPending }
}
