"use client"

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TrashBin } from "@/components/icons/trash-bin"
import { useDeleteVideo } from '@/hooks/useDeleteVideo'

/**
 * Delete Video Confirmation Component
 *
 * This component provides a secure and user-friendly interface for video deletion
 * with proper confirmation dialogs and authorization checks. It ensures users
 * understand the consequences of their action before proceeding.
 *
 * Key Features:
 * 1. Confirmation dialog to prevent accidental deletions
 * 2. Clear warning about permanent data loss
 * 3. Loading states during deletion process
 * 4. Automatic navigation after successful deletion
 * 5. Consistent styling with application design
 *
 * User Experience:
 * - Clear warning about permanent deletion
 * - Two-step confirmation process
 * - Visual feedback during deletion
 * - Graceful error handling
 *
 * Security:
 * - Server-side authorization verification
 * - Prevents unauthorized deletion attempts
 * - Validates user ownership before deletion
 *
 * @param videoId - Unique identifier of the video to delete
 * @param videoTitle - Title of the video for confirmation display
 * @param redirectPath - Optional path to redirect after successful deletion
 */
type Props = {
  videoId: string
  videoTitle: string
  redirectPath?: string
}

function DeleteVideoConfirmation({ videoId, videoTitle, redirectPath }: Props) {
  const { deleteVideo, isDeleting } = useDeleteVideo(videoId, redirectPath)
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full gap-3 !p-0 !pl-1 !pr-2 text-[#eeeeee] hover:text-red-500 hover:bg-red-500/10"
          disabled={isDeleting}
        >
          <TrashBin />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete Video
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#9D9D9D]">
            Are you sure you want to delete &quot;{videoTitle}&quot;? This action cannot be undone.
            All comments and associated data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-[#333] text-white hover:bg-[#444] border-[#555]"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteVideo(undefined)}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Video'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteVideoConfirmation