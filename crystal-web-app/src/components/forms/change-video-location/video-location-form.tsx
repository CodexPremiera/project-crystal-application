import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useMoveVideos } from '@/hooks/useFolders'
import React from 'react'
import Loader from "@/components/global/loader/loader";

/**
 * Change Video Location Form Component
 * 
 * Form for moving videos between workspaces and folders.
 * Shows current location and dropdowns for selecting new location.
 * 
 * Appearance:
 * - Current location display at top
 * - Workspace dropdown selector
 * - Folder dropdown selector (if folders exist)
 * - Transfer button at bottom
 * - Loading skeleton for folder loading
 * 
 * Special Behavior:
 * - Shows current workspace and folder
 * - Loads available workspaces and folders
 * - Handles workspaces with no folders
 * - Shows loading state while fetching folders
 * - Moves video after form submission
 * 
 * Used in:
 * - Video management modals
 * - Workspace organization interfaces
 * - Video location change workflows
 */

type Props = {
  videoId: string
  currentFolder?: string
  currentWorkSpace?: string
  currentFolderName?: string
}

const ChangeVideoLocation = ({
                               videoId,
                               currentFolder,
                               currentWorkSpace,
                             }: Props) => {
  const {
    register,
    isPending,
    onFormSubmit,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkSpace!)
  
  const folder = folders.find((f) => f.id === currentFolder)
  const workspace = workspaces.find((f) => f.id === currentWorkSpace)
  
  return (
    <form
      className="flex flex-col gap-y-5"
      onSubmit={onFormSubmit}
    >
      <div className="boder-[1px] rounded-xl p-5">
        <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : 'This video has no folder'}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="text-xs text-[#a4a4a4]">To</h2>
        <Label className="flex-col gap-y-2 flex w-full items-start">
          <p className="text-xs w-full">Workspace</p>
          <select
            className="rounded-xl text-base bg-transparent w-full"
            {...register('workspace_id')}
          >
            {workspaces.map((space) => (
              <option
                key={space.id}
                className="text-[#a4a4a4]"
                value={space.id}
              >
                {space.name}
              </option>
            ))}
          </select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2 w-full items-start">
            <p className="text-xs">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                {...register('folder_id')}
                className="rounded-xl bg-transparent text-base w-full"
              >
                {isFolders.map((folder, key) =>
                  key === 0 ? (
                    <option
                      className="text-[#a4a4a4]"
                      key={folder.id}
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  ) : (
                    <option
                      className="text-[#a4a4a4]"
                      key={folder.id}
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  )
                )}
              </select>
            ) : (
              <p className="text-[#a4a4a4] text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button>
        <Loader
          state={isPending}
          color="#000"
        >
          Transfer
        </Loader>
      </Button>
    </form>
  )
}

export default ChangeVideoLocation

