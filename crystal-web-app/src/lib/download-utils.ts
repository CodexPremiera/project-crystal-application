/**
 * Video Download Utilities
 * 
 * This module provides utilities for downloading video files from the application.
 * It handles the download process, file naming, and user experience for video downloads.
 * 
 * Key Features:
 * 1. Direct download from CloudFront URLs
 * 2. Proper file naming with video titles
 * 3. Fallback handling for missing titles
 * 4. Error handling for download failures
 * 5. User feedback during download process
 * 
 * How it works:
 * 1. Constructs the full video URL from CloudFront
 * 2. Creates a temporary anchor element for download
 * 3. Sets appropriate filename based on video title
 * 4. Triggers the download and cleans up resources
 * 5. Provides user feedback on success/failure
 * 
 * @param videoUrl - The full URL to the video file
 * @param videoTitle - The title of the video for filename
 * @param videoId - The unique identifier for fallback naming
 * @returns Promise that resolves when download is initiated
 */

/**
 * Downloads a video file from the provided URL
 * 
 * This function handles the complete download process including:
 * - URL construction and validation
 * - File naming with proper extensions
 * - Fetching the file as a blob for proper download
 * - Download initiation and cleanup
 * - Error handling and user feedback
 * 
 * @param videoUrl - The full URL to the video file
 * @param videoTitle - The title of the video for filename
 * @param videoId - The unique identifier for fallback naming
 * @returns Promise that resolves when download is initiated
 */
export const downloadVideo = async (
  videoUrl: string,
  videoTitle: string | null,
  videoId: string
): Promise<void> => {
  try {
    // Validate URL
    if (!videoUrl) {
      throw new Error('Video URL is required')
    }

    // Create filename from title or use video ID as fallback
    const sanitizedTitle = videoTitle 
      ? videoTitle.replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
      : `video-${videoId}`
    
    const filename = `${sanitizedTitle}.webm`

    try {
      // Method 1: Try to fetch as blob (preferred method)
      const response = await fetch(videoUrl, {
        method: 'GET',
        headers: {
          'Accept': 'video/webm,video/*,*/*',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`)
      }

      // Create blob from response
      const blob = await response.blob()
      
      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob)

      // Create temporary anchor element for download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      link.style.display = 'none'
      
      // Add to DOM, trigger download, then remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the object URL
      URL.revokeObjectURL(blobUrl)
      
      console.log(`Download initiated for: ${filename}`)
      
    } catch (fetchError) {
      console.warn('Fetch method failed, trying direct download:', fetchError)
      
      // Method 2: Fallback to direct download (may redirect to video)
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = filename
      link.target = '_blank'
      link.style.display = 'none'
      
      // Add to DOM, trigger download, then remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log(`Direct download initiated for: ${filename}`)
    }
    
  } catch (error) {
    console.error('Error downloading video:', error)
    throw new Error('Failed to download video')
  }
}

/**
 * Constructs the full video URL from CloudFront
 * 
 * This function builds the complete URL for video download by combining
 * the CloudFront base URL with the video source filename.
 * 
 * @param videoSource - The video source filename from database
 * @returns The complete video URL for download
 */
export const getVideoDownloadUrl = (videoSource: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL
  if (!baseUrl) {
    throw new Error('CloudFront URL not configured')
  }
  
  return `${baseUrl}/${videoSource}`
}

/**
 * Downloads a video with proper error handling and user feedback
 * 
 * This is the main function to use for downloading videos. It handles
 * the complete process including URL construction, download initiation,
 * and error handling with user feedback.
 * 
 * @param videoSource - The video source filename from database
 * @param videoTitle - The title of the video for filename
 * @param videoId - The unique identifier for fallback naming
 * @returns Promise that resolves when download is initiated
 */
export const downloadVideoFile = async (
  videoSource: string,
  videoTitle: string | null,
  videoId: string
): Promise<void> => {
  try {
    // Try API route first (server-side download)
    try {
      const apiUrl = `/api/video/${videoId}/download`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'video/webm,video/*,*/*',
        },
      })
      
      if (response.ok) {
        // Create blob from response
        const blob = await response.blob()
        
        // Create filename
        const sanitizedTitle = videoTitle 
          ? videoTitle.replace(/[^a-zA-Z0-9\s-_]/g, '').trim()
          : `video-${videoId}`
        const filename = `${sanitizedTitle}.webm`
        
        // Create object URL from blob
        const blobUrl = URL.createObjectURL(blob)

        // Create temporary anchor element for download
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        link.style.display = 'none'
        
        // Add to DOM, trigger download, then remove
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the object URL
        URL.revokeObjectURL(blobUrl)
        
        console.log(`API download initiated for: ${filename}`)
        return
      }
    } catch (apiError) {
      console.warn('API download failed, trying direct CloudFront:', apiError)
    }
    
    // Fallback to direct CloudFront download
    const videoUrl = getVideoDownloadUrl(videoSource)
    await downloadVideo(videoUrl, videoTitle, videoId)
    
  } catch (error) {
    console.error('Error in downloadVideoFile:', error)
    throw error
  }
}
