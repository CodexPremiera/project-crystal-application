"use client";

import React, { useState } from 'react';
import { EditDuotone } from "@/components/icons/editDuotone";
import { TrashBin } from "@/components/icons/trash-bin";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import EditWorkspaceModal from "./edit-workspace-modal";
import DeleteWorkspaceModal from "./delete-workspace-modal";

interface Props {
  workspaceId: string;
  workspaceName: string;
}

/**
 * WorkspaceActions Component
 * 
 * Client component that handles workspace action buttons and modals.
 * Manages the state for both edit and delete workspace modals.
 * 
 * Features:
 * - Edit workspace modal trigger
 * - Delete workspace modal trigger
 * - State management for both modals
 * - Integration with workspace management functionality
 * 
 * @param workspaceId - ID of the workspace
 * @param workspaceName - Current name of the workspace
 */
function WorkspaceActions({ workspaceId, workspaceName }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem onSelect={(e) => {
        e.preventDefault();
        setIsEditModalOpen(true);
      }}>
        <EditDuotone />
        Edit
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onSelect={(e) => {
          e.preventDefault();
          setIsDeleteModalOpen(true);
        }}
        className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
      >
        <TrashBin />
        Delete
      </DropdownMenuItem>
      
      <EditWorkspaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        workspaceId={workspaceId}
        currentName={workspaceName}
      />
      
      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
      />
    </>
  );
}

export default WorkspaceActions;
