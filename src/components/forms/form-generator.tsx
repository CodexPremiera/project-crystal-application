import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  type?: 'text' | 'email' | 'password' | 'number'
  inputType: 'select' | 'input' | 'textarea'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder: string
  register: UseFormRegister<any>
  name: string
  errors: FieldErrors<FieldValues>
  lines?: number
}

/**
 * Form Generator Component
 * 
 * This component provides a unified interface for generating different types
 * of form inputs throughout the application. It supports text inputs, textareas,
 * and select dropdowns with consistent styling, validation, and error handling.
 * 
 * Purpose: Standardize form input creation with consistent styling and validation
 * 
 * How it works:
 * 1. Accepts configuration props for input type and behavior
 * 2. Renders appropriate input component based on inputType
 * 3. Integrates with React Hook Form for validation and state management
 * 4. Displays validation errors using ErrorMessage component
 * 5. Applies consistent styling across all input types
 * 
 * Input Types:
 * - Input: Standard text inputs with various types (text, email, password, number)
 * - Textarea: Multi-line text inputs with configurable rows
 * - Select: Dropdown selection with options array
 * 
 * Features:
 * - Automatic error message display
 * - Consistent styling and theming
 * - React Hook Form integration
 * - Accessibility support with proper labels
 * - Configurable placeholder and label text
 * 
 * Integration:
 * - Used by all form components throughout the application
 * - Connects to React Hook Form validation system
 * - Integrates with UI component library
 * - Essential for consistent form user experience
 * 
 * @param inputType - Type of input to render (input, textarea, select)
 * @param type - HTML input type for text inputs
 * @param options - Array of options for select inputs
 * @param label - Label text for the input field
 * @param placeholder - Placeholder text for the input
 * @param register - React Hook Form register function
 * @param name - Field name for form registration
 * @param errors - Form validation errors object
 * @param lines - Number of lines for textarea inputs
 * @returns JSX element with appropriate form input
 */
const FormGenerator = ({
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  type,
  lines,
}: Props) => {
  switch (inputType) {
    case 'input':
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-themeGray text-themeTextGray"
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )
    case 'select':
      return (
        <Label
          htmlFor={`select-${label}`}
          className="flex flex-col gap-2"
        >
          {label && label}
          <select
            id={`select-${label}`}
            className="w-full bg-transparent border-[1px] p-3 rounded-lg"
            {...register(name)}
          >
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="dark:bg-muted"
                >
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    case 'textarea':
      return (
        <Label
          className="flex flex-col gap-2"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`input-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === 'Required' ? '' : message}
              </p>
            )}
          />
        </Label>
      )

    default:
      break
  }
}

export default FormGenerator
