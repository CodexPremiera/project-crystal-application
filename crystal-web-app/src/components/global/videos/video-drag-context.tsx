'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { moveVideoLocation } from '@/actions/workspace'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type VideoDragContextType = {
  isDragging: boolean
  draggedVideoId: string | null
  workspaceId: string
  startDrag: (videoId: string) => void
  endDrag: () => void
  moveVideoToFolder: (videoId: string, folderId: string) => Promise<void>
}

const VideoDragContext = createContext<VideoDragContextType | null>(null)

type VideoDragProviderProps = {
  children: React.ReactNode
  workspaceId: string
}

/**
 * Video Drag Provider
 * 
 * Provides drag and drop context for moving videos to folders.
 * Tracks drag state and handles the move operation when a video
 * is dropped onto a folder.
 * 
 * Features:
 * - Tracks which video is being dragged
 * - Provides isDragging state for visual feedback
 * - Handles moveVideoLocation action on drop
 * - Invalidates cache to refresh folder counts
 * 
 * @param workspaceId - Current workspace ID for move operations
 * @param children - Child components that can use drag context
 */
export function VideoDragProvider({ children, workspaceId }: VideoDragProviderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const startDrag = useCallback((videoId: string) => {
    setIsDragging(true)
    setDraggedVideoId(videoId)
    document.body.classList.add('dragging-video')
  }, [])

  const endDrag = useCallback(() => {
    setIsDragging(false)
    setDraggedVideoId(null)
    document.body.classList.remove('dragging-video')
  }, [])

  const moveVideoToFolder = useCallback(async (videoId: string, folderId: string) => {
    try {
      const result = await moveVideoLocation(videoId, workspaceId, folderId)
      
      if (result.status === 200) {
        toast('Success', { description: 'Video moved successfully' })
      } else {
        toast('Error', { description: result.data || 'Failed to move video' })
      }
      
      // Invalidate caches to refresh UI
      await queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
      await queryClient.invalidateQueries({ queryKey: ['user-videos'] })
    } catch (error) {
      toast('Error', { description: 'Failed to move video' })
    }
  }, [workspaceId, queryClient])

  return (
    <VideoDragContext.Provider
      value={{
        isDragging,
        draggedVideoId,
        workspaceId,
        startDrag,
        endDrag,
        moveVideoToFolder,
      }}
    >
      {children}
    </VideoDragContext.Provider>
  )
}

/**
 * Hook to access video drag context
 * 
 * @returns Video drag context with drag state and move function
 * @throws Error if used outside of VideoDragProvider
 */
export function useVideoDrag() {
  const context = useContext(VideoDragContext)
  if (!context) {
    throw new Error('useVideoDrag must be used within a VideoDragProvider')
  }
  return context
}

/**
 * Hook to safely access video drag context
 * 
 * Returns null if used outside of VideoDragProvider instead of throwing.
 * Useful for components that may or may not be within a drag context.
 * 
 * @returns Video drag context or null if not available
 */
export function useVideoDragSafe() {
  return useContext(VideoDragContext)
}

