'use client'

import React from 'react';
import {useQueryData} from "@/hooks/useQueryData";
import {getAllUserVideos} from "@/actions/workspace";
import {VideosProps} from "@/types/index.type";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import {cn} from "@/lib/utils";
import VideoCard from "@/components/global/videos/video-card";

/**
 * Videos Container Component
 * 
 * This component serves as the main container for displaying video collections within workspaces.
 * It handles data fetching, layout management, and renders individual video cards in a responsive grid.
 * 
 * Key Responsibilities:
 * 1. Fetches video data using React Query with workspace/folder context
 * 2. Manages responsive grid layout for video cards
 * 3. Handles empty state when no videos are available
 * 4. Provides consistent header with video icon and title
 * 
 * Data Flow:
 * - Receives folderId, videosKey, and workspaceId as props
 * - Uses useQueryData hook to fetch videos from getAllUserVideos action
 * - Maps through video data to render individual VideoCard components
 * - Passes workspace context to each VideoCard for navigation
 * 
 * Layout Behavior:
 * - Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop, 4 on xl, 5 on 2xl
 * - Shows loading state while fetching data
 * - Displays "No videos in workspace" message when no videos found
 * 
 * Integration:
 * - Works with VideoCard components for individual video display
 * - Integrates with workspace actions for data fetching
 * - Uses React Query for caching and state management
 * 
 * @param folderId - The ID of the folder to fetch videos from (can be workspace ID for root videos)
 * @param videosKey - Unique key for React Query caching
 * @param workspaceId - The workspace ID for navigation context
 */
type Props = {
  folderId: string
  videosKey: string
  workspaceId: string
}

function Videos({ folderId, videosKey, workspaceId }: Props) {
  // Fetch video data using React Query with automatic caching and refetching
  const { data: videoData } = useQueryData([videosKey], () =>
    getAllUserVideos(folderId)
  )
  
  const { status: videosStatus, data: videos } = videoData as VideosProps
  
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Header section with video icon and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#BdBdBd] text-xl">Videos</h2>
        </div>
      </div>
      
      {/* Video grid section with responsive layout */}
      <section
        className={cn(
          videosStatus !== 200
            ? 'p-5'
            : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
        )}
      >
        {videosStatus === 200 ? (
          // Render video cards when data is available
          videos.map((video) => (
            <VideoCard
              key={video.id}
              workspaceId={workspaceId}
              {...video}
            />
          ))
        ) : (
          // Show empty state when no videos found
          <p className="text-[#BDBDBD]"> No videos in workspace</p>
        )}
      </section>
    </div>
  )
}

export default Videos;