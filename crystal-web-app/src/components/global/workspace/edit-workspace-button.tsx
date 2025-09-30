"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { EditDuotone } from "@/components/icons/editDuotone";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import EditWorkspaceModal from "./edit-workspace-modal";

interface Props {
  workspaceId: string;
  workspaceName: string;
}

/**
 * EditWorkspaceButton Component
 * 
 * Client component that handles workspace action buttons and modals.
 * Manages the state for edit workspace modal and triggers the appropriate actions.
 * 
 * Features:
 * - Edit workspace modal trigger
 * - State management for modal visibility
 * - Integration with workspace editing functionality
 * 
 * @param workspaceId - ID of the workspace
 * @param workspaceName - Current name of the workspace
 */
function EditWorkspaceButton({ workspaceId, workspaceName }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleSelect = (e: Event) => {
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <DropdownMenuItem 
        className="h-fit" 
        onSelect={handleSelect}
        onPointerDown={(e) => e.preventDefault()}
      >
        <Button
          variant="ghost"
          className="rounded-full gap-3 !p-0 !pl-1 !pr-2 text-[#eeeeee] hover:text-red-500 hover:bg-red-500/10"
          onClick={handleEditClick}
        >
          <EditDuotone />
          <span>Edit</span>
        </Button>
      </DropdownMenuItem>
      
      <EditWorkspaceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        workspaceId={workspaceId}
        currentName={workspaceName}
      />
    </>
  );
}

export default EditWorkspaceButton;
