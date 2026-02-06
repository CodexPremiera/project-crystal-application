import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import React from 'react'
import Loader from "@/components/global/loader/loader";
import {useCreateWorkspace} from "@/hooks/useCreateWorkspace";
import FormGenerator from "@/components/forms/form-generator";
import { FieldValues, UseFormRegister } from 'react-hook-form'

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
        register={register as unknown as UseFormRegister<FieldValues>}
        name="name"
        placeholder={'Workspace Name'}
        errors={errors}
        inputType="input"
        type="text"
      />
      <div className="flex w-full mt-4 justify-end gap-x-4">
        <DialogClose asChild>
          <Button
            className="text-sm mt-2 w-fit self-start bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out px-3 py-2"
            variant="ghost"
            type="button"
            disabled={isPending}
          >
            <Loader state={isPending}>Cancel</Loader> 
          </Button>
        </DialogClose>
        <Button
          className="text-sm mt-2 w-fit self-start bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out px-3 py-2"
          variant="ghost"
          type="submit"
          disabled={isPending}
        >
          <Loader state={isPending}>Create Workspace</Loader> 
        </Button>
      </div>
    </form>
  )
}

export default WorkspaceForm
