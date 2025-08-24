import { z } from 'zod'

/**
 * Workspace Creation Validation Schema
 * 
 * This Zod schema defines the validation rules for creating a new workspace.
 * It ensures that the workspace data meets the application's requirements
 * before allowing the creation process to proceed.
 * 
 * Validation Rules:
 * - name: Must be a non-empty string (required field)
 * - Provides clear error messages for validation failures
 * 
 * Usage: Used by the useZodForm hook to validate workspace creation forms
 * and provide real-time feedback to users about input validity.
 */
export const workspaceSchema = z.object({
  // Workspace name validation - must be provided and not empty
  name: z.string().min(1, { message: 'Workspace name cannot be empty' }),
})