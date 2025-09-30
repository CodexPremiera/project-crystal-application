'use client'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { useCreateFolders } from '@/hooks/useCreateFolders'
import React from 'react'
import {Add} from "@/components/icons/add";

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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button onClick={onCreateNewFolder} variant="ghost" className='rounded-full'>
          <Add />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="right" className="text-xs py-2 px-3 flex w-fit">
        <p>Create a new folder</p>
      </HoverCardContent>
    </HoverCard>
  )
}

export default CreateFolders
