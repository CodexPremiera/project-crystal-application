import { useState } from 'react'
import { toast } from 'sonner'

/**
 * useDownloadFolder Hook
 * 
 * This custom hook provides a complete interface for folder download functionality,
 * including loading states, error handling, and user feedback. It manages the
 * download process for creating and downloading a ZIP file of all videos in a folder.
 * 
 * Key Features:
 * 1. Download state management (loading, success, error)
 * 2. Error handling with user feedback
 * 3. Toast notifications for download status
 * 4. Progress indication during ZIP creation
 * 5. Clean API for folder download operations
 * 
 * Data Flow:
 * 1. User clicks download button
 * 2. Hook sets loading state and shows progress toast
 * 3. Calls folder download API route
 * 4. API creates ZIP with all videos
 * 5. Downloads ZIP file to user's device
 * 6. Shows success/error feedback
 * 
 * @param folderId - The folder's unique identifier
 * @param folderName - The folder name for the ZIP filename
 * @returns Object containing download function and loading state
 */
export const useDownloadFolder = (folderId: string, folderName: string) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadFolder = async (): Promise<void> => {
    if (isDownloading) return
    
    setIsDownloading(true)
    
    const loadingToast = toast.loading('Preparing download...', {
      description: 'Creating ZIP file with all videos. This may take a moment.'
    })
    
    try {
      const response = await fetch(`/api/folder/${folderId}/download`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Download failed')
      }
      
      // Get the blob from the response
      const blob = await response.blob()
      
      // Create filename
      const sanitizedName = folderName
        ? folderName.replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
        : `folder-${folderId}`
      const filename = `${sanitizedName}.zip`
      
      // Create download link
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(blobUrl)
      
      toast.dismiss(loadingToast)
      toast.success('Download started', {
        description: 'Your folder download has been initiated'
      })
      
    } catch (error) {
      console.error('Folder download error:', error)
      
      toast.dismiss(loadingToast)
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Unable to download folder. Please try again.'
      })
      
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    downloadFolder,
    isDownloading
  }
}

