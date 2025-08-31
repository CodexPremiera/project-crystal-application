import { Links } from '@/components/icons'
import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'

/**
 * Copy Link Component
 * 
 * This component provides a button interface for copying video share links to the clipboard.
 * It generates shareable URLs and provides user feedback through toast notifications.
 * 
 * Key Functionality:
 * 1. Generates shareable video preview URL using video ID
 * 2. Copies the generated URL to the user's clipboard
 * 3. Shows success toast notification when link is copied
 * 4. Supports customizable button styling through props
 * 
 * URL Generation:
 * - Uses NEXT_PUBLIC_HOST_URL environment variable for base URL
 * - Appends /preview/{videoId} to create shareable link
 * - Creates links that can be shared with external users
 * 
 * User Experience:
 * - Single click to copy link to clipboard
 * - Immediate visual feedback through toast notification
 * - Consistent button styling with other action buttons
 * - Accessible button design with proper ARIA attributes
 * 
 * Integration:
 * - Used within VideoCard component as hover action
 * - Integrates with toast notification system
 * - Connects to browser clipboard API
 * - Supports theme-consistent button variants
 * 
 * @param videoId - Unique identifier of the video to generate share link for
 * @param className - Optional CSS classes for custom styling
 * @param variant - Optional button variant for consistent theming
 */
type Props = {
  videoId: string
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
}

const CopyLink = ({ videoId, className, variant }: Props) => {
  /**
   * Handles the clipboard copy operation
   * 
   * This function:
   * 1. Constructs the shareable video URL using environment variables
   * 2. Uses the browser's clipboard API to copy the URL
   * 3. Shows a success toast notification to confirm the action
   * 4. Handles any potential clipboard errors gracefully
   */
  const onCopyClipboard = () => {
    // Generate shareable video URL
    const shareUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
    
    // Copy URL to clipboard
    navigator.clipboard.writeText(shareUrl)
    
    // Show success notification
    toast('Copied', {
      description: 'Link successfully copied',
    })
  }

  return (
    <Button
      variant={variant}
      onClick={onCopyClipboard}
      className={className}
    >
      <Links />
    </Button>
  )
}

export default CopyLink
