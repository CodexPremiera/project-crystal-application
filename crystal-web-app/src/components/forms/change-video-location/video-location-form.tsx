import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useMoveVideos } from '@/hooks/useFolders'
import React from 'react'
import Loader from "@/components/global/loader/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Controller } from 'react-hook-form';

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
  currentWorkSpace?: string
  currentFolderId?: string | null
  onSuccess?: () => void
}

const ChangeVideoLocation = ({
                               videoId,
                               currentWorkSpace,
                               currentFolderId,
                               onSuccess,
                             }: Props) => {
  const {
    control,
    isPending,
    onFormSubmit,
    workspaces,
    isFetching,
    isFolders,
    hasChanges,
  } = useMoveVideos(videoId, currentWorkSpace!, currentFolderId || '', onSuccess)
  
  return (
    <form
      className="flex flex-col gap-y-5"
      onSubmit={onFormSubmit}
    >
      <div className="flex flex-col gap-y-5 rounded-xl">
        <h2 className="text-xs text-[#a4a4a4]">Move video to</h2>
        <Label className="flex-col gap-y-2 flex w-full items-start">
          <p className="text-xs w-full">Workspace</p>
          <Controller
            name="workspace_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {workspaces.map((space) => (
                      <SelectItem key={space.id} value={space.id}>
                        {space.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2 w-full items-start">
            <p className="text-xs">Folder</p>
            <Controller
              name="folder_id"
              control={control}
              render={({ field }) => (
                <Select 
                  value={field.value || ''} 
                  onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none" className="text-[#a4a4a4]">
                        No folder
                      </SelectItem>
                      {isFolders && isFolders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Label>
        )}
      </div>
      <div className="flex w-full gap-3">
        <Button 
          className="max-w-40 flex-1"
          disabled={!hasChanges || isPending}
        >
          <Loader
            state={isPending}
            color="#000"
          >
            Transfer
          </Loader>
        </Button>
      </div>
    </form>
  )
}

export default ChangeVideoLocation

