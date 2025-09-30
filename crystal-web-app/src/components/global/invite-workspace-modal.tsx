'use client'

import React from 'react'
import Modal from '@/components/global/modal'
import Search from '@/components/global/search'
import { useQueryData } from '@/hooks/useQueryData'
import { getWorkSpaces } from '@/actions/workspace'
import {Button} from "@/components/ui/button";

/**
 * Invite Workspace Modal Component
 * 
 * A modal that allows users to invite others to their workspace.
 * Shows as a button with plus icon and "Invite To Workspace" text.
 * Opens a modal with user search functionality for inviting users.
 * 
 * Appearance:
 * - Dark button with plus circle icon
 * - Text: "Invite To Workspace"
 * - Opens modal with search interface
 * - Only visible for PUBLIC workspaces with PRO subscription
 * 
 * Special Behavior:
 * - Only renders for PUBLIC workspaces
 * - Only visible to PRO subscription users
 * - Modal contains user search functionality
 * - Responsive design with proper hover states
 * - Handles conditional rendering internally
 * 
 * Used in:
 * - Workspace sidebar
 * - Workspace management interfaces
 */

type Props = {
  workspaceId: string
  currentWorkspace?: {
    type: 'PUBLIC' | 'PRIVATE'
  }
}

const InviteWorkspaceModal = ({ workspaceId, currentWorkspace }: Props) => {
  const { data } = useQueryData(['user-workspaces'], getWorkSpaces)
  
  // Extract subscription plan from the fetched data
  const { data: plan } = data as {
    status: number
    data: {
      subscription: {
        plan: 'PRO' | 'FREE'
      } | null
    }
  }

  // Only render if workspace is PUBLIC and user has PRO subscription
  if (currentWorkspace?.type !== 'PUBLIC' || plan?.subscription?.plan !== 'PRO') {
    return null
  }

  return (
    <Modal
      trigger={
        <div className="border-l-2 !border-neutral-700 pl-2">
          <Button variant="ghost" className="!px-1 !py-0 h-fit !hover:bg-neutral-100">
            <span>Invite users</span>
          </Button>
        </div>
      }
      title="Invite To Workspace"
      description="Invite other users to your workspace"
    >
      <Search workspaceId={workspaceId} />
    </Modal>
  )
}

export default InviteWorkspaceModal
