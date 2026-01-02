'use client'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, {useRef, useState} from 'react'
import Loader from "@/components/global/loader/loader";
import { Folder as FolderIcon } from 'lucide-react';
import {useMutationData, useMutationDataState} from "@/hooks/useMutationData";
import {renameFolders} from "@/actions/workspace";
import {Input} from "@/components/ui/input";
import { MutationFunction } from '@tanstack/react-query'
import { useVideoDragSafe } from "@/components/global/videos/video-drag-context";

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
  const dragContext = useVideoDragSafe()
  
  const Rename = () => setOnRename(true)
  const Renamed = () => setOnRename(false)
  
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
  )
}

export default Folder;