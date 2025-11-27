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
import { Input } from "@/components/ui/input";
import { editWorkspaceName } from '@/actions/workspace';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  currentName: string;
}

/**
 * EditWorkspaceModal Component
 * 
 * Modal dialog for editing workspace name.
 * Uses shadcn dialog for consistent UI and proper accessibility.
 * 
 * Features:
 * - Input field for new workspace name
 * - Form validation and error handling
 * - Server action integration for workspace update
 * - Page refresh after successful update
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Function to close the modal
 * @param workspaceId - ID of the workspace to edit
 * @param currentName - Current name of the workspace
 */
function EditWorkspaceModal({ isOpen, onClose, workspaceId, currentName }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [error, setError] = useState('');
  const router = useRouter();

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
      setError('');
    }
  }, [isOpen, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Workspace name cannot be empty');
      return;
    }
    
    if (newName.trim().length > 100) {
      setError('Workspace name must be less than 100 characters');
      return;
    }
    
    if (newName.trim() === currentName) {
      setError('New name must be different from current name');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await editWorkspaceName(workspaceId, newName.trim());
      
      if (result.status === 200) {
        console.log(result.data);
        onClose();
        router.refresh(); // Refresh the page to update the workspace name
      } else {
        setError(result.data);
      }
    } catch (error) {
      console.error('Error editing workspace:', error);
      setError('Failed to update workspace name. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewName(currentName);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Workspace Name</DialogTitle>
          <DialogDescription>
            Enter a new name for your workspace. This will be visible to all workspace members.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="workspace-name" className="text-sm font-medium">
              Workspace Name
            </label>
            <Input
              id="workspace-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter workspace name"
              disabled={isLoading}
              className={error ? 'border-destructive' : ''}
              maxLength={100}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !newName.trim() || newName.trim() === currentName}
            >
              {isLoading ? 'Updating...' : 'Update Name'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditWorkspaceModal;
