import { getFolderVideos, getFolderInfo } from '@/actions/workspace'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import React from 'react'
import Videos from "@/components/global/videos/videos";

type Props = {
  params: Promise<{
    folder: string // Changed from folderId to match [folder] dynamic route
    workspaceid: string
  }>
}

/**
 * Folder Content Management Page
 * 
 * This page provides a dedicated interface for viewing and managing videos
 * within a specific folder. It displays folder information, video count,
 * and all videos contained within the folder with full management capabilities.
 * 
 * Purpose: Provide folder-specific video management and viewing interface
 * 
 * How it works:
 * 1. Extracts folder ID and workspace ID from URL parameters
 * 2. Prefetches folder information and video data for performance
 * 3. Renders folder information component with metadata
 * 4. Displays videos component with folder-specific filtering
 * 5. Provides hydration boundary for SSR optimization
 * 
 * Folder Features:
 * - Folder name and metadata display
 * - Video count and statistics
 * - Folder-specific video listing
 * - Video management within folder context
 * - Folder organization and navigation
 * 
 * Data Management:
 * - Prefetches folder videos for immediate display
 * - Prefetches folder information and metadata
 * - Uses React Query for efficient data caching
 * - Optimized for folder-specific content
 * 
 * Video Management:
 * - Display all videos within the folder
 * - Video editing and management tools
 * - Folder-specific video operations
 * - Integration with workspace video system
 * 
 * User Experience:
 * - Clear folder information and context
 * - Organized video display within folder
 * - Easy navigation and management
 * - Consistent with workspace design
 * 
 * Integration:
 * - Used for folder-based video organization
 * - Connects to workspace and folder management systems
 * - Integrates with video management components
 * - Part of workspace content organization
 * 
 * @param params - Contains folder ID and workspace ID from URL parameters
 * @returns JSX element with folder content management interface
 */
const page = async ({ params }: Props) => {
  const { folder, workspaceid } = await params
  const query = new QueryClient()
  
  // Prefetch folder videos data
  await query.prefetchQuery({
    queryKey: ['folder-videos'],
    queryFn: () => getFolderVideos(folder),
  })
  
  // Prefetch folder info data
  await query.prefetchQuery({
    queryKey: ['folder-info'],
    queryFn: () => getFolderInfo(folder), // Use folder as folderId
  })
  
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <Videos
        workspaceId={workspaceid}
        folderId={folder}
        videosKey="folder-videos"
        isFolderView={true}
      />
    </HydrationBoundary>
  )
}

export default page
