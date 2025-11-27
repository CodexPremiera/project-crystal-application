"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { removeUserFromWorkspace } from '@/actions/workspace';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  memberName: string;
  memberClerkId: string;
}

/**
 * DeleteUserModal Component
 * 
 * Confirmation dialog for removing a user from a workspace.
 * Uses shadcn dialog for consistent UI and proper accessibility.
 * 
 * Features:
 * - Confirmation dialog with user details
 * - Server action integration for user removal
 * - Success/error handling with toast notifications
 * - Page refresh after successful removal
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Function to close the modal
 * @param workspaceId - ID of the workspace
 * @param memberName - Name of the member to remove
 * @param memberClerkId - Clerk ID of the member to remove
 */
function DeleteUserModal({ isOpen, onClose, workspaceId, memberName, memberClerkId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemoveUser = async () => {
    setIsLoading(true);
    
    try {
      const result = await removeUserFromWorkspace(workspaceId, memberClerkId);
      
      if (result.status === 200) {
        console.log(result.data);
        onClose();
        router.refresh(); // Refresh the page to update the members list
      } else {
        console.error(result.data);
      }
    } catch (error) {
      console.error('Error removing user:', error);
      console.error('Failed to remove user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove User from Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{memberName}</strong> from this workspace? 
            They will lose access to all workspace content and will need to be re-invited to regain access.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveUser}
            disabled={isLoading}
          >
            {isLoading ? 'Removing...' : 'Remove User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserModal;
