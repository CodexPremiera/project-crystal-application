'use client'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React, {useRef, useState} from 'react'
import Loader from "@/components/global/loader/loader";
import { Folder as FolderIcon } from 'lucide-react';
import {useMutationData, useMutationDataState} from "@/hooks/useMutationData";
import {renameFolders} from "@/actions/workspace";
import {Input} from "@/components/ui/input";

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
  
  const Rename = () => setOnRename(true)
  const Renamed = () => setOnRename(false)
  
  //optimistic
  const { mutate, isPending } = useMutationData(
    ['rename-folders'],
    (data: { name: string }) => renameFolders(id, data.name),
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
  
  return (
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn(
        optimistic && 'opacity-60',
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
              latestVariables.variables.id === id
                ? latestVariables.variables.name
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