'use client'

import { cn, extractWorkspaceIdFromPath } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, {useRef, useState} from 'react'
import Loader from "@/components/global/loader/loader";
import { Folder as FolderIcon, Link2, Edit3, Trash2 } from 'lucide-react';
import {useMutationData, useMutationDataState} from "@/hooks/useMutationData";
import {renameFolders} from "@/actions/workspace";
import {Input} from "@/components/ui/input";
import { MutationFunction } from '@tanstack/react-query'
import { useVideoDragSafe } from "@/components/global/videos/video-drag-context";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useDeleteFolder } from "@/hooks/useDeleteFolder";
import { toast } from 'sonner';
import EditFolderNameForm from '@/components/forms/edit-folder/edit-folder-name';

/**
 * Folder Component
 * 
 * Interactive folder card with rename functionality and navigation.
 * Shows as a clickable card with folder name, video count, and rename capability.
 * 
 * Appearance:
 * - Card layout with folder name and video count
 * - Folder icon on the right
 * - Hover effects with background color change
 * - Clickable area for navigation
 * 
 * Special Behavior:
 * - Double-click on name to rename (shows input field)
 * - Click anywhere else to navigate to folder
 * - Shows optimistic updates during rename
 * - Loading state during rename operation
 * - Optimistic rendering for new folders
 * 
 * Used in:
 * - Workspace folder listings
 * - Folder management interfaces
 * - Navigation components
 */

type Props = {
  name: string
  id: string
  optimistic?: boolean
  count?: number
}

function Folder({ id, name, optimistic, count }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const folderCardRef = useRef<HTMLDivElement | null>(null)
  const pathName = usePathname()
  const router = useRouter()
  const [onRename, setOnRename] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const dragContext = useVideoDragSafe()
  
  const workspaceId = extractWorkspaceIdFromPath(pathName) || ''
  
  const { deleteFolder, isDeleting } = useDeleteFolder(id, workspaceId)
  
  const Rename = () => setOnRename(true)
  const Renamed = () => setOnRename(false)
  
  const onCopyLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard/${workspaceId}/folder/${id}`
    )
    toast('Copied', {
      description: 'Folder link copied to clipboard',
    })
  }
  
  //optimistic
  const { mutate, isPending } = useMutationData(
    ['rename-folders'],
    ((data: { name: string }) => renameFolders(id, data.name)) as MutationFunction<unknown, unknown>,
    'workspace-folders',
    Renamed
  )
  
  const { latestVariables } = useMutationDataState(['rename-folders'])
  
  const handleFolderClick = () => {
    router.push(`${pathName}/folder/${id}`)
  }
  
  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()
    Rename();
    //Rename functionality
  }
  
  const updateFolderName = () => {
    if (inputRef.current && folderCardRef.current) {
      if (inputRef.current.value) {
        mutate({ name: inputRef.current.value, id })
      } else Renamed()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const videoId = e.dataTransfer.getData('videoId')
    if (videoId && dragContext) {
      await dragContext.moveVideoToFolder(videoId, id)
    }
  }
  
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            onClick={handleFolderClick}
            ref={folderCardRef}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              optimistic && 'opacity-60',
              isDragOver && 'border-primary bg-primary/10',
              'flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]'
            )}
          >
            <Loader state={isPending}>
              <div className="flex flex-col gap-[1px]">
                {onRename ? (
                  <Input
                    onBlur={() => {updateFolderName()}}
                    autoFocus
                    placeholder={name}
                    className="!border-none !text-base w-full !outline-none text-neutral-300 !bg-transparent !p-0 !m-0"
                    ref={inputRef}
                  />
                ) : (
                  <p
                    onClick={(e) => e.stopPropagation()}
                    className="text-neutral-300"
                    onDoubleClick={handleNameDoubleClick}
                  >
                    {latestVariables &&
                    latestVariables.status === 'pending' &&
                    (latestVariables.variables as { id: string; name: string }).id === id
                      ? (latestVariables.variables as { id: string; name: string }).name
                      : name}
                  </p>
                )}
                <span className="text-sm text-neutral-500">{count || 0} videos</span>
              </div>
            </Loader>
            <FolderIcon className="text-primary/50"/>
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent>
          <ContextMenuItem onClick={onCopyLink}>
            <Link2 size={16} />
            Copy Link
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setRenameDialogOpen(true)}>
            <Edit3 size={16} />
            Rename
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
          >
            <Trash2 size={16} />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Folder
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#9D9D9D]">
              Are you sure you want to delete &quot;{name}&quot;? This action cannot be undone.
              All videos in this folder will be permanently deleted.
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
              onClick={() => deleteFolder(undefined)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Folder'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent showCloseButton={false}>
          <EditFolderNameForm
            folderId={id}
            name={name}
            onSuccess={() => setRenameDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Folder;