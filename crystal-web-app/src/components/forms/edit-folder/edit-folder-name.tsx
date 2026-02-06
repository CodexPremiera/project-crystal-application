'use client'

import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Loader from "@/components/global/loader/loader"
import React, { useState } from 'react'
import { useMutationData } from '@/hooks/useMutationData'
import { renameFolders } from '@/actions/workspace'
import { MutationFunction } from '@tanstack/react-query'

/**
 * Edit Folder Name Form Component
 * 
 * This component provides a form interface for editing folder name.
 * It integrates with the folder rename system and provides feedback.
 * 
 * Features:
 * - Simple form with folder name input
 * - Loading states during submission
 * - Automatic cache invalidation after successful update
 * - Closes modal on successful save
 * 
 * @param folderId - Unique identifier of the folder to edit
 * @param name - Current folder name for form pre-filling
 * @param onSuccess - Callback to close the modal after successful save
 */
type Props = {
  folderId: string
  name: string
  onSuccess?: () => void
}

const EditFolderNameForm = ({ folderId, name, onSuccess }: Props) => {
  const [folderName, setFolderName] = useState(name)
  
  const { mutate: renameFolder, isPending } = useMutationData(
    ['rename-folders'],
    ((data: { name: string }) => renameFolders(folderId, data.name)) as MutationFunction<unknown, unknown>,
    'folder-info',
    onSuccess
  )
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (folderName.trim() && folderName !== name) {
      renameFolder({ name: folderName.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
      <Input
        id="folder-name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Folder name..."
        disabled={isPending}
      />
      
      <div className="flex w-full mt-4 justify-end gap-x-4">
        <DialogClose asChild>
          <Button
            className="text-sm mt-2 w-fit self-start bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out px-3 py-2"
            variant="ghost"
            type="button"
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          className="text-sm mt-2 w-fit self-start bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out px-3 py-2"
          variant="ghost"
          type="submit"
          disabled={isPending}
        >
          <Loader state={isPending}>Save</Loader>
        </Button>
      </div>
    </form>
  )
}

export default EditFolderNameForm

