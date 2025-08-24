import { UseMutateFunction } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z, { ZodSchema } from 'zod'

/**
 * useZodForm Hook
 * 
 * A reusable custom hook that combines React Hook Form with Zod validation.
 * This hook provides a standardized way to handle form validation, submission,
 * and state management across the application.
 * 
 * Key Features:
 * - Automatic form validation using Zod schemas
 * - Integration with React Hook Form for state management
 * - Seamless connection to React Query mutations
 * - Type-safe form handling with TypeScript
 * - Error handling and form reset capabilities
 * 
 * @param schema - Zod schema for form validation
 * @param mutation - React Query mutation function to call on form submission
 * @param defaultValues - Optional default values for form fields
 * @returns Object containing form functions and state
 */
const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  // Set up React Hook Form with Zod validation resolver
  // This handles all form state, validation, and submission logic
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema), // Connect Zod validation to React Hook Form
    defaultValues: { ...defaultValues }, // Set initial form values
  })
  
  // Create form submission handler that calls the mutation function
  // This automatically validates the form data before submission
  const onFormSubmit = handleSubmit(async (values) => mutation({ ...values }))
  
  // Return all necessary form functions and state for components to use
  return { register, watch, reset, onFormSubmit, errors }
}

export default useZodForm