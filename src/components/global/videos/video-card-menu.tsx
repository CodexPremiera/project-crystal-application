import React from 'react'
import Modal from '../modal'
import { Move } from 'lucide-react'
import ChangeVideoLocation from "@/components/forms/change-video-location/video-location-form";

/**
 * Video Card Menu Component
 * 
 * This component provides a modal interface for moving videos between folders and workspaces.
 * It acts as a bridge between the video card UI and the video location change form.
 * 
 * Key Functionality:
 * 1. Renders a move icon that triggers a modal when clicked
 * 2. Opens a modal containing the ChangeVideoLocation form
 * 3. Passes current video context to the form component
 * 4. Provides visual feedback through the move icon
 * 
 * User Flow:
 * - User hovers over video card to reveal action buttons
 * - Clicks move icon to open modal
 * - Modal displays current location and available destinations
 * - User selects new location and confirms transfer
 * 
 * Integration Points:
 * - Receives video context from parent VideoCard component
 * - Integrates with Modal component for overlay display
 * - Connects to ChangeVideoLocation form for actual video movement
 * - Uses workspace and folder data for location options
 * 
 * Visual Design:
 * - Move icon with consistent styling
 * - Modal overlay with form content
 * - Responsive design that works on all screen sizes
 * 
 * @param videoId - Unique identifier of the video to be moved
 * @param currentWorkspace - ID of the workspace where video currently resides
 * @param currentFolder - ID of the folder where video currently resides (optional)
 * @param currentFolderName - Display name of the current folder (optional)
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
      title="Move to new Workspace/Folder"
      description="This action cannot be undone. This will permanently delete your
  account and remove your data from our servers."
      trigger={
        <Move
          size={20}
          fill="#4f4f4f"
          className="text-[#4f4f4f]"
        />
      }
    >
      {/* Video location change form within modal */}
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
