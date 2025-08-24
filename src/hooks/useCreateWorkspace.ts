import { useMutationData } from './useMutationData'
import {createWorkspace} from "@/actions/workspace";
import useZodForm from "@/hooks/useZodForm";
import {workspaceSchema} from "@/components/forms/workspace-form/schema";

/**
 * useCreateWorkspace Hook
 * 
 * This custom hook orchestrates the entire workspace creation process by combining:
 * - Form validation (Zod schema)
 * - Form state management (React Hook Form)
 * - API mutation (React Query)
 * - Error handling and loading states
 * 
 * The hook provides a clean interface for components to handle workspace creation
 * without needing to manage the complexity of form validation, API calls, and state.
 * 
 * @returns Object containing form functions and state:
 * - register: Function to register form inputs
 * - onFormSubmit: Function to handle form submission
 * - errors: Form validation errors
 * - isPending: Loading state during API call
 */
export const useCreateWorkspace = () => {
  // Set up the API mutation for creating a workspace
  // This handles the actual server call and manages loading/error states
  const {mutate, isPending} = useMutationData(
    ['create-workspace'], // Query key for caching
    (data: { name: string }) => createWorkspace(data.name), // API function
    'user-workspaces' // Query to invalidate after successful creation
  )
  
  // Set up form validation and submission using Zod schema
  // This combines React Hook Form with Zod validation and connects to the mutation
  const {errors, onFormSubmit, register} = useZodForm(workspaceSchema, mutate);
  
  // Return all necessary form functions and state for components to use
  return {errors, onFormSubmit, register, isPending};
}