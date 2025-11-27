"use client"

import React from 'react';
import Modal from "@/components/global/modal";
import {getWorkSpaces} from "@/actions/workspace";
import {useQueryData} from "@/hooks/useQueryData";
import {Button} from "@/components/ui/button";
import WorkspaceForm from "@/components/forms/workspace-form";
import {Add} from "@/components/icons/add";

/**
 * Create Workspace Component
 * 
 * Button that opens a modal for creating new workspaces, but only for PRO users.
 * Shows as a button with workspace icon that opens a modal with creation form.
 * 
 * Appearance:
 * - Dark button with folder-plus icon
 * - Text: "Create Workspace"
 * - Opens modal with workspace creation form
 * - Modal has title, description, and form fields
 * 
 * Special Behavior:
 * - Only visible to PRO subscription users
 * - FREE users see nothing (component doesn't render)
 * - Modal closes automatically after successful creation
 * - Shows loading state during creation
 * 
 * Used in:
 * - Dashboard sidebar
 * - Workspace management pages
 */
function CreateWorkspace() {
  /**
   * Conditional Rendering with React Query (useQuery)
   * 
   * This component demonstrates how to use React Query for conditional rendering
   * based on user data. It fetches user workspace data to determine if the user
   * has permission to create additional workspaces.
   * 
   * How it works:
   * 1. Fetches user's workspace data using getWorkSpaces server action
   * 2. Caches the data with 'user-workspaces' query key
   * 3. Extracts subscription plan from the fetched data
   * 4. Conditionally renders workspace creation UI based on plan
   * 5. Only PRO users can create additional workspaces
   * 
   * Query Benefits:
   * - Automatic caching of user data
   * - Shared data across components using the same query key
   * - Efficient data management and loading states
   * - Real-time updates when user data changes
   */
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
  
  if (plan?.subscription?.plan === 'FREE')
    return (<></>)
  
  if (plan?.subscription?.plan === 'PRO')
    return (
      <Modal
        title="Create a Workspace"
        description="Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
        trigger={
          // Main trigger button that opens the workspace creation modal
          <Button variant="ghost" className='rounded-full'>
            <Add />
          </Button>
        }
      >
        {/* Render the workspace creation form inside the modal */}
        <WorkspaceForm />
      </Modal>
    )
}

export default CreateWorkspace;