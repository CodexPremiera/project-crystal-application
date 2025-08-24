import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {ErrorMessage} from "@hookform/error-message";
import {Textarea} from "@/components/ui/textarea";

/**
 * FormGenerator Component
 * 
 * A flexible, reusable component that generates different types of form inputs
 * based on the provided configuration. It handles input rendering, validation,
 * and error display in a consistent way across the application.
 * 
 * Supported Input Types:
 * - input: Standard text inputs (text, email, password, number)
 * - select: Dropdown selection menus
 * - textarea: Multi-line text areas
 * 
 * Features:
 * - Automatic error message display
 * - Consistent styling across all input types
 * - Integration with React Hook Form
 * - Accessible labels and error handling
 * - Customizable styling and behavior
 * 
 * @param inputType - Type of input to render ('input', 'select', 'textarea')
 * @param options - Array of options for select inputs
 * @param label - Display label for the input field
 * @param placeholder - Placeholder text for the input
 * @param register - React Hook Form register function
 * @param name - Field name for form registration
 * @param errors - Form validation errors
 * @param type - HTML input type (for input fields)
 * @param lines - Number of lines for textarea
 */
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
  // Render different input types based on the inputType prop
  switch (inputType) {
    case 'input':
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D] items-start"
          htmlFor={`input-${label}`}
        >
          {label && label}
          {/* Standard input field with React Hook Form integration */}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-themeGray text-themeTextGray"
            {...register(name)}
          />
          {/* Display validation errors below the input */}
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
          className="flex flex-col gap-2 items-start"
        >
          {label && label}
          {/* Dropdown select field with provided options */}
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
          {/* Display validation errors below the select */}
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
          className="flex flex-col gap-2 items-start"
          htmlFor={`input-${label}`}
        >
          {label && label}
          {/* Multi-line textarea field */}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`input-${label}`}
            placeholder={placeholder}
            {...register(name)}
            rows={lines}
          />
          {/* Display validation errors below the textarea */}
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
      break;
  }
}

export default FormGenerator