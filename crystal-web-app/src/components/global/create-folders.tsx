'use client'
import FolderPlusDuotine from '@/components/icons/folder-plus-duotone'
import { Button } from '@/components/ui/button'
import { useCreateFolders } from '@/hooks/useCreateFolders'
import React from 'react'

/**
 * Create Folders Button Component
 * 
 * Simple button that triggers folder creation in a workspace.
 * Shows as a dark button with folder icon and "Create A folder" text.
 * 
 * Appearance:
 * - Dark button with folder-plus icon
 * - Text: "Create A folder"
 * - Rounded corners with padding
 * - Gray text on dark background
 * 
 * Special Behavior:
 * - Only appears in workspaces where user has permission
 * - Triggers immediate folder creation (no confirmation)
 * - Shows loading state during creation
 * 
 * Used in:
 * - Workspace folder management pages
 * - Folder creation interfaces
 */

type Props = { workspaceId: string }

const CreateFolders = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId)
  return (
    <Button
      onClick={onCreateNewFolder}
      className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl"
    >
      <FolderPlusDuotine />
      Create A folder
    </Button>
  )
}

export default CreateFolders
