import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'
import {Code} from "@/components/icons/code";

/**
 * Rich Link Component
 * 
 * This component generates and copies embedded HTML code for videos that can be
 * pasted into other websites or applications. It creates a rich preview with
 * video thumbnail, title, and description.
 * 
 * Key Features:
 * 1. Generates HTML embed code with video preview
 * 2. Copies both plain text and HTML formats to clipboard
 * 3. Creates clickable links that redirect to video preview page
 * 4. Includes video thumbnail with proper styling
 * 5. Provides user feedback through toast notifications
 * 
 * Generated HTML Structure:
 * - Clickable link wrapper with video preview URL
 * - Video title as heading
 * - Video description as paragraph
 * - Embedded video player with source
 * - Responsive styling for different contexts
 * 
 * Clipboard Integration:
 * - Uses modern Clipboard API for rich content copying
 * - Supports both text/plain and text/html formats
 * - Handles multiple data types in single clipboard operation
 * 
 * @param title - Video title for the embedded preview
 * @param id - Video ID for generating preview URL
 * @param source - Video source URL for the embedded player
 * @param description - Video description for the preview
 */
type Props = { title: string; id: string; source: string; description: string }

const RichLink = ({ description, id, source, title }: Props) => {
  /**
   * Generates and copies embedded HTML code to clipboard
   * 
   * This function:
   * 1. Creates HTML embed code with video preview
   * 2. Generates both plain text and HTML clipboard items
   * 3. Copies content to clipboard using modern API
   * 4. Shows success notification to user
   */
  const copyRichText = () => {
    const originalTitle = title
    // Generate HTML embed code with video preview
    const thumbnail = `<a style="display: flex; flex-direction: column; gap: 10px" href="${process.env.NEXT_PUBLIC_HOST_URL}/preview/${id}">
    <h3 style="text-decoration: none; color: black; margin: 0;">${originalTitle}</h3>
    <p style="text-decoration: none; color: black; margin: 0;">${description}</p>
    <video
        width="320"
        style="display: block"
        >
            <source
                type="video/webm"
                src="${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${source}"
            />
        </video>
    </a>`
    
    // Create clipboard items for different formats
    const thumbnailBlob = new Blob([thumbnail], { type: 'text/html' })
    const blobTitle = new Blob([originalTitle], { type: 'text/plain' })
    const data = [
      new ClipboardItem({
        ['text/plain']: blobTitle,
        ['text/html']: thumbnailBlob,
      }),
    ]
    
    // Copy to clipboard and show success notification
    navigator.clipboard.write(data).then(() => {
      return toast('Embedded Link Copied', {
        description: 'Successfully copied embedded link',
      })
    })
  }
  
  return (
    <Button
      onClick={copyRichText}
      className="rounded-full gap-3 !p-0 !pl-1 !pr-2"
      variant="ghost"
    >
      <Code />
      <span className="text-[#eeeeee]">Get embedded code</span>
    </Button>
  )
}

export default RichLink
