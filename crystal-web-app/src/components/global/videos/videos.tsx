'use client'

import React from 'react';
import {useQueryData} from "@/hooks/useQueryData";
import {getAllUserVideos, getFolderVideos} from "@/actions/workspace";
import {VideosProps} from "@/types/index.type";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import {cn} from "@/lib/utils";
import VideoCard from "@/components/global/videos/video-card";

type Props = {
  folderId: string
  videosKey: string
  workspaceId: string
  isFolderView?: boolean
}

function Videos({ folderId, videosKey, workspaceId, isFolderView = false }: Props) {
  /**
   * Data Fetching with React Query (useQuery)
   * 
   * This component demonstrates how to fetch and cache video data using React Query.
   * The videos are automatically cached and shared across components that use the
   * same query key, providing efficient data management.
   * 
   * How it works:
   * 1. Fetches videos using either getFolderVideos or getAllUserVideos based on context
   * 2. For folder views: fetches videos within the specific folder
   * 3. For workspace views: fetches only unfiled videos (not in any folder)
   * 4. Caches data with the provided videosKey for component-specific caching
   * 5. Provides loading states and error handling
   * 
   * Query Key Strategy:
   * - Uses dynamic videosKey for component-specific caching
   * - Different keys allow separate caching for different video contexts
   * - Enables efficient cache management across the application
   * 
   * Progressive Loading:
   * - Component renders immediately even if data isn't ready
   * - Shows loading state until data is available
   * - Prevents destructuring errors during initial load
   */
  const { data: videoData } = useQueryData([videosKey], () =>
    isFolderView ? getFolderVideos(folderId) : getAllUserVideos(workspaceId)
  )
  
  const { status: videosStatus, data: videos } = (videoData || {
    status: 404,
    data: []
  }) as VideosProps
  
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#BdBdBd] text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          videosStatus !== 200
            ? 'p-5'
            : 'grid grid-cols-1 gap-10 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
        )}
      >
        {videosStatus === 200 ? (
          videos.map((video) => (
            <VideoCard
              key={video.id}
              workspaceId={workspaceId}
              {...video}
            />
          ))
        ) : (
          <p className="text-[#BDBDBD]"> No videos in workspace</p>
        )}
      </section>
    </div>
  )
}

export default Videos;