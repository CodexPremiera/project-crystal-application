import { editVideoInfoSchema } from '@/components/forms/edit-video/schema'
import useZodForm from './useZodForm'
import { useMutationData } from './useMutationData'
import { editVideoInfo } from '@/actions/workspace'

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
  // Set up mutation for video editing with cache invalidation
  const { mutate, isPending } = useMutationData(
    ['edit-video'],
    (data: { title: string; description: string }) =>
      editVideoInfo(videoId, data.title, data.description),
    'preview-video' // Invalidate preview-video cache after update
  )
  
  // Initialize form with validation and submission logic
  const { errors, onFormSubmit, register } = useZodForm(
    editVideoInfoSchema,
    mutate,
    {
      title,
      description,
    }
  )

  return { onFormSubmit, register, errors, isPending }
}
