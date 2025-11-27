import React from 'react'
import Modal from '../modal'
import { Button } from '@/components/ui/button'
import { EditDuotone } from '@/components/icons/editDuotone'
import EditVideoForm from '@/components/forms/edit-video'

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

const EditVideo = ({ description, title, videoId }: Props) => {
  return (
    <Modal
      title="Edit video details"
      description="You can update your video details here!"
      trigger={
        <Button variant={'ghost'}>
          <EditDuotone />
        </Button>
      }
    >
      <EditVideoForm
        videoId={videoId}
        title={title}
        description={description}
      />
    </Modal>
  )
}

export default EditVideo
