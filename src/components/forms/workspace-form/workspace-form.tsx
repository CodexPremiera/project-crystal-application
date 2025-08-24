import { useCreateWorkspace } from '@/hooks/useCreateWorkspace'
import React from 'react'
import FormGenerator from "@/components/forms/form-generator";

/**
 * WorkspaceForm Component
 * 
 * This component renders the actual form interface for creating a new workspace.
 * It uses the useCreateWorkspace hook to handle all form logic, validation, and submission.
 * 
 * Form Features:
 * - Single input field for workspace name
 * - Real-time validation using Zod schema
 * - Error display for invalid inputs
 * - Loading state during form submission
 * - Automatic form submission handling
 * 
 * The form is designed to be simple and focused - users only need to provide
 * a workspace name to create a new PUBLIC workspace (for PRO users only).
 */
const WorkspaceForm = () => {
  // Get all form functionality from the custom hook
  // This includes form registration, validation, submission, and error handling
  const { errors, isPending, onFormSubmit, register } = useCreateWorkspace()
  
  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-3"
    >
      {/* Workspace Name Input Field */}
      <FormGenerator
        register={register}
        name="name"
        placeholder={'Workspace Name'}
        label="Workspace Name"
        errors={errors}
        inputType="input"
        type="text"
      />
    </form>
  )
}

export default WorkspaceForm;