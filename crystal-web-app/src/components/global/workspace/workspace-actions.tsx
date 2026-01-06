"use client";

import React, { useState } from 'react';
import { EditDuotone } from "@/components/icons/editDuotone";
import { TrashBin } from "@/components/icons/trash-bin";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import EditWorkspaceModal from "./edit-workspace-modal";
import DeleteWorkspaceModal from "./delete-workspace-modal";
import LeaveWorkspaceModal from "./leave-workspace-modal";

interface Props {
  workspaceId: string;
  workspaceName: string;
  isOwner: boolean;
}

/**
 * WorkspaceActions Component
 * 
 * Client component that handles workspace action buttons and modals.
 * Shows different actions based on whether user is owner or member.
 * 
 * Features:
 * - Edit workspace modal trigger (owner only)
 * - Delete workspace modal trigger (owner only)
 * - Leave workspace modal trigger (member only)
 * 
 * @param workspaceId - ID of the workspace
 * @param workspaceName - Current name of the workspace
 * @param isOwner - Whether the current user owns this workspace
 */
function WorkspaceActions({ workspaceId, workspaceName, isOwner }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  return (
    <>
      {isOwner && (
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault();
          setIsEditModalOpen(true);
        }}>
          <EditDuotone />
          Edit
        </DropdownMenuItem>
      )}
      
      {isOwner ? (
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
      ) : (
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            setIsLeaveModalOpen(true);
          }}
          className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Leave
        </DropdownMenuItem>
      )}
      
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
      
      <LeaveWorkspaceModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
      />
    </>
  );
}

export default WorkspaceActions;
