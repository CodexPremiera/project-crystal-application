import { getUserProfile, getVideoComments } from '@/actions/user'
import { getPreviewVideo } from '@/actions/workspace'
import VideoPreview from "@/components/global/videos/video-preview";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import React from 'react'


type Props = {
  params: {
    videoId: string
  }
}

/**
 * Workspace Video Viewing Page
 * 
 * This page provides a dedicated interface for viewing videos within a
 * workspace context. It includes video player, comments, and interaction
 * features specifically designed for workspace-based video viewing and
 * collaboration.
 * 
 * Purpose: Provide workspace-specific video viewing interface with collaboration features
 * 
 * How it works:
 * 1. Prefetches video data, user profile, and comments for performance
 * 2. Renders VideoPreview component with workspace context
 * 3. Provides hydration boundary for SSR optimization
 * 4. Handles video-specific routing within workspace
 * 5. Enables workspace-based video collaboration
 * 
 * Features:
 * - Video player with full playback controls
 * - Comment system with workspace context
 * - User profile integration for comment attribution
 * - Video metadata display and management
 * - Workspace-specific video interactions
 * - Responsive design for various screen sizes
 * 
 * Data Management:
 * - Prefetches video information for immediate display
 * - Prefetches user profile for comment functionality
 * - Prefetches video comments for interaction features
 * - Uses React Query for efficient data caching
 * - Optimized for workspace collaboration
 * 
 * Workspace Integration:
 * - Video viewing within workspace context
 * - Workspace-specific commenting and collaboration
 * - Integration with workspace video management
 * - Part of workspace video sharing features
 * 
 * User Experience:
 * - Seamless video viewing within workspace
 * - Collaborative commenting and interaction
 * - Workspace-aware video features
 * - Consistent with workspace design
 * 
 * Integration:
 * - Used for workspace video viewing and collaboration
 * - Connects to workspace video management system
 * - Integrates with user profile and authentication
 * - Part of workspace video sharing and collaboration
 * 
 * @param params - Contains videoId from URL parameters
 * @returns JSX element with workspace video viewing interface
 */
const VideoPage = async ({ params: { videoId } }: Props) => {
  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['preview-video'],
    queryFn: () => getPreviewVideo(videoId),
  })

  await query.prefetchQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  })

  await query.prefetchQuery({
    queryKey: ['video-comments'],
    queryFn: () => getVideoComments(videoId),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <VideoPreview videoId={videoId} />
    </HydrationBoundary>
  )
}

export default VideoPage
