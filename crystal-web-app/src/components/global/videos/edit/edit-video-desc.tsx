import React from 'react'
import { Button } from '@/components/ui/button'
import { EditDuotone } from '@/components/icons/editDuotone'
import Modal from "@/components/global/modal";
import EditDescForm from "@/components/forms/edit-video/edit-desc";

/**
 * Edit Video Component
 * 
 * Button that opens modal for editing video details.
 * Shows as a ghost button with edit icon that opens edit form.
 * 
 * Appearance:
 * - Ghost button with edit icon
 * - Opens modal with edit form
 * - Gray edit icon
 * - Minimal button styling
 * 
 * Special Behavior:
 * - Opens modal with video edit form
 * - Pre-fills form with current video data
 * - Only shows for video authors
 * - Closes modal after successful edit
 * 
 * Used in:
 * - Video card hover actions
 * - Video preview pages (for authors)
 * - Video management interfaces
 */

type Props = { title: string; description: string; videoId: string }

const EditVideoDesc = ({ description, title, videoId }: Props) => {
  return (
    <Modal
      trigger={
        <Button variant={'ghost'}>
          <EditDuotone />
        </Button>
      }
    >
      <EditDescForm
        videoId={videoId}
        title={title}
        description={description}
      />
    </Modal>
  )
}

export default EditVideoDesc
