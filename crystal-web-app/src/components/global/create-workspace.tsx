"use client"

import React from 'react';
import Modal from "@/components/global/modal";
import {getWorkSpaces} from "@/actions/workspace";
import {useQueryData} from "@/hooks/useQueryData";
import {Button} from "@/components/ui/button";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "@/components/forms/workspace-form";

/**
 * CreateWorkspace Component
 *
 * This component provides the entry point for workspace creation in the application.
 * It renders a button that opens a modal containing the workspace creation form.
 *
 * Key Features:
 * - Fetches user's subscription plan to check workspace creation permissions
 * - Only PRO users can create additional workspaces (beyond their default personal workspace)
 * - Opens a modal with descriptive text about workspace functionality
 * - Renders the WorkspaceForm component inside the modal
 *
 * Usage: Typically placed in dashboard pages where users can create new workspaces
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
          <Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine />
            Create Workspace
          </Button>
        }
      >
        {/* Render the workspace creation form inside the modal */}
        <WorkspaceForm />
      </Modal>
    )
}

export default CreateWorkspace;