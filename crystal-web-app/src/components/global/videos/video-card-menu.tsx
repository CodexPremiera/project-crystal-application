import React from 'react'
import Modal from '../modal'
import { Move } from 'lucide-react'
import ChangeVideoLocation from "@/components/forms/change-video-location/video-location-form";

/**
 * Video Card Menu Component
 * 
 * Button that opens modal for moving video to different workspace/folder.
 * Shows as a button with move icon that opens location change form.
 * 
 * Appearance:
 * - Button with move icon
 * - Opens modal with move form
 * - Gray move icon
 * - Minimal button styling
 * 
 * Special Behavior:
 * - Opens modal with video location change form
 * - Pre-fills form with current location
 * - Shows available workspaces and folders
 * - Moves video after form submission
 * 
 * Used in:
 * - Video card hover actions
 * - Video management interfaces
 * - Workspace organization tools
 */

type Props = {
  videoId: string
  currentWorkspace?: string
  currentFolder?: string
  currentFolderName?: string
}

const CardMenu = ({
                    videoId,
                    currentFolder,
                    currentFolderName,
                    currentWorkspace,
                  }: Props) => {
  return (
    <Modal
      className="flex items-center cursor-pointer gap-x-2"
      trigger={
        <Move
          size={20}
          fill="#4f4f4f"
          className="text-[#4f4f4f]"
        />
      }
    >
      <ChangeVideoLocation
        currentFolder={currentFolder}
        currentWorkSpace={currentWorkspace}
        videoId={videoId}
        currentFolderName={currentFolderName}
      />
    </Modal>
  )
}

export default CardMenu
