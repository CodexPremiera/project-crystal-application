import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import React from 'react'
import FolderInfo from "@/components/global/folders/folder-info";
import Videos from "@/components/global/videos/videos";

type Props = {
  params: Promise<{
    folder: string // Changed from folderId to match [folder] dynamic route
    workspaceId: string
  }>
}

const page = async ({ params }: Props) => {
  const { folder, workspaceId } = await params
  const query = new QueryClient()
  
  // Prefetch folder videos data
  await query.prefetchQuery({
    queryKey: ['folder-videos'],
    queryFn: () => getAllUserVideos(folder), // Use folder as folderId
  })
  
  // Prefetch folder info data
  await query.prefetchQuery({
    queryKey: ['folder-info'],
    queryFn: () => getFolderInfo(folder), // Use folder as folderId
  })
  
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo folderId={folder} />
      <Videos
        workspaceId={workspaceId}
        folderId={folder}
        videosKey="folder-videos"
      />
    </HydrationBoundary>
  )
}

export default page
