"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleSelectEdit = (e: Event) => {
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  const handleSelectDelete = (e: Event) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <DropdownMenuItem 
        className="h-fit" 
        onSelect={handleSelectEdit}
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
      
      <DropdownMenuItem 
        className="h-fit" 
        onSelect={handleSelectDelete}
        onPointerDown={(e) => e.preventDefault()}
      >
        <Button
          variant="ghost"
          className="rounded-full gap-3 !p-0 !pl-1 !pr-2 text-[#eeeeee] hover:text-red-500 hover:bg-red-500/10"
          onClick={handleDeleteClick}
        >
          <TrashBin />
          <span>Delete</span>
        </Button>
      </DropdownMenuItem>
      
      <EditWorkspaceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        workspaceId={workspaceId}
        currentName={workspaceName}
      />
      
      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
      />
    </>
  );
}

export default WorkspaceActions;
