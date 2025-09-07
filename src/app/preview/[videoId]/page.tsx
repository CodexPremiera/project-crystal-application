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
 * Video Preview Page
 * 
 * This page provides a dedicated interface for viewing individual videos
 * with full functionality including video player, comments, and interaction
 * features. It serves as the main video viewing experience for the application.
 * 
 * Purpose: Provide comprehensive video viewing interface with comments and interactions
 * 
 * How it works:
 * 1. Prefetches video data, user profile, and comments for performance
 * 2. Renders VideoPreview component with complete video functionality
 * 3. Provides hydration boundary for SSR optimization
 * 4. Handles video-specific routing and data management
 * 
 * Features:
 * - Video player with full playback controls
 * - Comment system with replies and interactions
 * - User profile integration for comment attribution
 * - Video metadata display and management
 * - Responsive design for various screen sizes
 * 
 * Data Management:
 * - Prefetches video information for immediate display
 * - Prefetches user profile for comment functionality
 * - Prefetches video comments for interaction features
 * - Uses React Query for efficient data caching
 * 
 * Integration:
 * - Used for individual video viewing and interaction
 * - Connects to video management and commenting systems
 * - Integrates with user profile and authentication
 * - Part of video sharing and engagement features
 * 
 * @param params - Contains videoId from URL parameters
 * @returns JSX element with video preview interface
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
      <div className="px-10">
        <VideoPreview videoId={videoId} />
      </div>
    </HydrationBoundary>
  )
}

export default VideoPage
