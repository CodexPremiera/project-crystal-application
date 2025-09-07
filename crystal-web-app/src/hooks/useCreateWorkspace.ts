import { createWorkspace } from '@/actions/workspace'
import { useMutationData } from './useMutationData'
import useZodForm from './useZodForm'
import { workspaceSchema } from '@/components/forms/workspace-form/schema'

/**
 * Custom hook for creating new workspaces
 * 
 * This hook provides a complete interface for workspace creation functionality,
 * combining form validation, state management, and API integration for creating
 * new workspaces in the application.
 * 
 * Key Features:
 * 1. Form validation using Zod schemas
 * 2. React Hook Form integration for state management
 * 3. React Query mutation for API calls
 * 4. Automatic cache invalidation after successful creation
 * 5. Loading states and error handling
 * 
 * Form Validation:
 * - Workspace name: Required field with validation rules
 * - Real-time validation with error messages
 * 
 * Data Flow:
 * 1. Form submission triggers validation
 * 2. Valid data is sent to createWorkspace action
 * 3. Database is updated with new workspace
 * 4. Cache is invalidated to refresh workspace list
 * 5. Success/error notifications are shown
 * 
 * Integration:
 * - Connects to workspace actions for data persistence
 * - Uses React Query for optimistic updates
 * - Integrates with form validation system
 * - Provides consistent error handling
 * 
 * @returns Object containing form functions, validation errors, and loading state
 */
export const useCreateWorkspace = () => {
  const { mutate, isPending } = useMutationData(
    ['create-workspace'],
    (data: { name: string }) => createWorkspace(data.name),
    'user-workspaces'
  )

  const { errors, onFormSubmit, register } = useZodForm(workspaceSchema, mutate)
  return { errors, onFormSubmit, register, isPending }
}
