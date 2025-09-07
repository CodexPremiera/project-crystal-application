import { Button } from '@/components/ui/button'

import React from 'react'
import Loader from "@/components/global/loader/loader";
import {useCreateWorkspace} from "@/hooks/useCreateWorkspace";
import FormGenerator from "@/components/forms/form-generator";

/**
 * Workspace Creation Form Component
 * 
 * This component provides a form interface for creating new workspaces
 * in the application. It integrates with the workspace creation system
 * and provides validation, loading states, and user feedback.
 * 
 * Purpose: Enable users to create new workspaces with proper validation
 * 
 * How it works:
 * 1. Uses useCreateWorkspace hook for form management and submission
 * 2. Integrates with FormGenerator for consistent input styling
 * 3. Provides loading states during workspace creation
 * 4. Handles form validation and error display
 * 5. Submits workspace creation request to server
 * 
 * Features:
 * - Form validation using Zod schemas
 * - Loading states with disabled submit button
 * - Error message display for validation failures
 * - Consistent styling with application theme
 * - Integration with workspace creation system
 * 
 * Integration:
 * - Used by workspace creation modals and pages
 * - Connects to workspace creation hooks and actions
 * - Integrates with form validation system
 * - Part of workspace management functionality
 * 
 * @returns JSX element with workspace creation form
 */
const WorkspaceForm = () => {
  const { errors, isPending, onFormSubmit, register } = useCreateWorkspace()
  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-3"
    >
      <FormGenerator
        register={register}
        name="name"
        placeholder={'Workspace Name'}
        label="Name"
        errors={errors}
        inputType="input"
        type="text"
      />
      <Button
        className="text-sm w-full mt-2"
        type="submit"
        disabled={isPending}
      >
        <Loader state={isPending}>Create Workspace</Loader>
      </Button>
    </form>
  )
}

export default WorkspaceForm
