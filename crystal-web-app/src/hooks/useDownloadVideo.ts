import { useState } from 'react'
import { downloadVideoFile } from '@/lib/download-utils'
import { toast } from 'sonner'

/**
 * useDownloadVideo Hook
 * 
 * This custom hook provides a complete interface for video download functionality,
 * including loading states, error handling, and user feedback. It manages the
 * download process and provides a clean API for components to use.
 * 
 * Key Features:
 * 1. Download state management (loading, success, error)
 * 2. Error handling with user feedback
 * 3. Toast notifications for download status
 * 4. Clean API for video download operations
 * 5. Proper file naming and URL construction
 * 
 * Data Flow:
 * 1. User clicks download button
 * 2. Hook sets loading state
 * 3. Constructs download URL from video source
 * 4. Initiates download with proper filename
 * 5. Shows success/error feedback to user
 * 6. Resets loading state
 * 
 * Error Handling:
 * - Network errors during download
 * - Invalid video URLs
 * - Missing video sources
 * - User feedback for all error states
 * 
 * @param videoSource - The video source filename from database
 * @param videoTitle - The title of the video for filename
 * @param videoId - The unique identifier for fallback naming
 * @returns Object containing download function and loading state
 */
export const useDownloadVideo = (
  videoSource: string,
  videoTitle: string | null,
  videoId: string
) => {
  const [isDownloading, setIsDownloading] = useState(false)

  /**
   * Downloads the video file with proper error handling
   * 
   * This function handles the complete download process including:
   * - Loading state management
   * - URL construction and validation
   * - Download initiation
   * - Error handling with user feedback
   * - Success notifications
   * 
   * How it works:
   * 1. Sets loading state to prevent multiple downloads
   * 2. Constructs download URL from video source
   * 3. Initiates download with proper filename
   * 4. Shows success toast notification
   * 5. Resets loading state
   * 6. Handles errors gracefully with user feedback
   */
  const downloadVideo = async (): Promise<void> => {
    if (isDownloading) return // Prevent multiple simultaneous downloads
    
    setIsDownloading(true)
    
    // Show loading notification
    const loadingToast = toast.loading('Preparing download...', {
      description: 'Fetching video file...'
    })
    
    try {
      await downloadVideoFile(videoSource, videoTitle, videoId)
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success('Download started', {
        description: 'Your video download has been initiated'
      })
      
    } catch (error) {
      console.error('Download error:', error)
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast)
      toast.error('Download failed', {
        description: 'Unable to download video. Please try again.'
      })
      
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    downloadVideo,
    isDownloading
  }
}
