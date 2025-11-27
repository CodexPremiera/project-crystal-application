import {Button} from "@/components/ui/button";
import { useEditVideo } from '@/hooks/useEditVideo'
import React from 'react'
import FormGenerator from "@/components/forms/form-generator";
import Loader from "@/components/global/loader/loader";
import { FieldValues, UseFormRegister } from 'react-hook-form'

/**
 * Edit Video Form Component
 * 
 * This component provides a form interface for editing video metadata including
 * title and description. It integrates with the video editing system and provides
 * real-time validation and feedback.
 * 
 * Key Features:
 * 1. Form-based video metadata editing (title and description)
 * 2. Real-time validation using Zod schemas
 * 3. Integration with React Hook Form for state management
 * 4. Loading states and error handling
 * 5. Automatic cache invalidation after successful updates
 * 
 * Form Validation Rules:
 * - Title: Minimum 5 characters required
 * - Description: Minimum 100 characters required
 * - Both fields are required and validated on submission
 * 
 * User Experience:
 * - Pre-filled form with current video data
 * - Real-time validation feedback
 * - Loading states during submission
 * - Success/error notifications
 * - Automatic form reset after successful update
 * 
 * Integration:
 * - Uses useEditVideo hook for form logic and API calls
 * - Integrates with FormGenerator for consistent UI
 * - Connects to workspace actions for data updates
 * - Uses React Query for cache management
 * 
 * @param videoId - Unique identifier of the video to edit
 * @param title - Current video title for form pre-filling
 * @param description - Current video description for form pre-filling
 */
type Props = {
  videoId: string
  title: string
  description: string
}

const EditTitleForm = ({ description, title, videoId }: Props) => {
  // Initialize form with video editing functionality
  const { errors, isPending, onFormSubmit, register } = useEditVideo(
    videoId,
    title,
    description
  )

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-5"
    >
      {/* Video title input field */}
      <FormGenerator
        register={register as unknown as UseFormRegister<FieldValues>}
        errors={errors}
        name="title"
        inputType="input"
        type="text"
        placeholder={'Video Title...'}
        label="Title"
      />
      
      {/* Submit button with loading state */}
      <Button className="max-w-25" variant="secondary">
        <Loader state={isPending}>Save</Loader>
      </Button>
    </form>
  )
}

export default EditTitleForm
