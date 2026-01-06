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
import { leaveWorkspace } from '@/actions/workspace';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

/**
 * LeaveWorkspaceModal Component
 * 
 * Confirmation dialog for leaving a workspace (for non-owners).
 * 
 * Features:
 * - Confirmation dialog with workspace details
 * - Server action integration for leaving workspace
 * - Redirect to dashboard after successfully leaving
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Function to close the modal
 * @param workspaceId - ID of the workspace to leave
 * @param workspaceName - Name of the workspace to leave
 */
function LeaveWorkspaceModal({ isOpen, onClose, workspaceId, workspaceName }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLeaveWorkspace = async () => {
    setIsLoading(true);
    
    try {
      const result = await leaveWorkspace(workspaceId);
      
      if (result.status === 200) {
        onClose();
        router.push('/dashboard');
      } else {
        console.error(result.data);
      }
    } catch (error) {
      console.error('Error leaving workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Workspace</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave <strong>&quot;{workspaceName}&quot;</strong>?
            <br />
            <br />
            You will lose access to all content in this workspace.
            You can be re-invited by the workspace owner if needed.
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
            onClick={handleLeaveWorkspace}
            disabled={isLoading}
          >
            {isLoading ? 'Leaving...' : 'Leave Workspace'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveWorkspaceModal;

