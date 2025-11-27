import { UseMutateFunction } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

/**
 * Custom hook for form management with Zod validation and React Query integration
 * 
 * This hook provides a unified interface for form handling by combining:
 * 1. React Hook Form for form state management
 * 2. Zod for schema validation
 * 3. React Query mutations for data submission
 * 
 * Purpose: Simplify form implementation with consistent validation and submission patterns
 * 
 * Key Features:
 * 1. Automatic form validation using Zod schemas
 * 2. Integration with React Query mutations
 * 3. Form state management (register, watch, reset)
 * 4. Error handling and display
 * 5. Default values support for form initialization
 * 
 * How it works:
 * 1. Accepts a Zod schema for validation rules
 * 2. Configures React Hook Form with Zod resolver
 * 3. Provides form submission handler that triggers mutations
 * 4. Returns form utilities for component integration
 * 
 * Integration:
 * - Used by all form components in the application
 * - Connects to React Query mutations for data operations
 * - Provides consistent error handling across forms
 * - Supports default values for edit forms
 * 
 * @param schema - Zod schema for form validation
 * @param mutation - React Query mutation function for form submission
 * @param defaultValues - Optional default values for form initialization
 * @returns Object containing form utilities and validation errors
 */
const useZodForm = <T extends z.ZodTypeAny>(
  schema: T,
  mutation: UseMutateFunction,
  defaultValues?: z.infer<T>
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const onFormSubmit = handleSubmit(async (values) => mutation(values))

  return { register, watch, reset, onFormSubmit, errors, control }
}
export default useZodForm
