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
import { deleteWorkspace } from '@/actions/workspace';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

/**
 * DeleteWorkspaceModal Component
 * 
 * Confirmation dialog for deleting a workspace.
 * Uses shadcn dialog for consistent UI and proper accessibility.
 * 
 * Features:
 * - Confirmation dialog with workspace details
 * - Server action integration for workspace deletion
 * - Success/error handling with console logging
 * - Redirect to dashboard after successful deletion
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Function to close the modal
 * @param workspaceId - ID of the workspace to delete
 * @param workspaceName - Name of the workspace to delete
 */
function DeleteWorkspaceModal({ isOpen, onClose, workspaceId, workspaceName }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteWorkspace = async () => {
    setIsLoading(true);
    
    try {
      const result = await deleteWorkspace(workspaceId);
      
      if (result.status === 200) {
        console.log(result.data);
        onClose();
        // Redirect to dashboard after successful deletion
        router.push('/dashboard');
      } else {
        console.error(result.data);
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
      console.error('Failed to delete workspace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>"{workspaceName}"</strong>? 
            This action cannot be undone and will permanently delete:
            <br />
            <br />
            • All workspace content and videos
            <br />
            • All folders and organization
            <br />
            • All workspace members and their access
            <br />
            • All comments and interactions
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
            onClick={handleDeleteWorkspace}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Workspace'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteWorkspaceModal;
