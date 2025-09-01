"use client"

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import { useQueryData } from '@/hooks/useQueryData';
import {getPreviewVideo, sendEmailForFirstView} from "@/actions/workspace";
import {VideoProps} from "@/types/index.type";
import EditVideo from "@/components/forms/edit-video";
import CopyLink from "@/components/global/videos/copy-link";
import RichLink from "@/components/global/videos/rich-link";
import {truncateString} from "@/lib/utils";
import {Download} from "lucide-react";
import TabMenu from "@/components/global/tab-menu";
import AiTools from "@/components/global/video-tools/ai-tools";
import Activities from "@/components/global/video-tools/activities";
import VideoTranscript from "@/components/global/video-tools/video-transcript";

/**
 * Video Preview Component
 * 
 * This component provides a comprehensive video viewing experience with editing capabilities,
 * sharing features, and first-view notifications. It serves as the main interface for
 * video playback and management in the preview mode.
 * 
 * Key Features:
 * 1. Video playback with full controls and metadata display
 * 2. Author-specific editing capabilities (title and description)
 * 3. Sharing functionality (copy link and embedded code)
 * 4. First-view email notifications for video creators
 * 5. Responsive design with sidebar layout
 * 6. Automatic view tracking and analytics
 * 
 * User Experience Flow:
 * - Video loads with metadata (title, creator, creation date)
 * - First view triggers email notification to creator
 * - Author sees edit buttons for title and description
 * - Sidebar provides sharing and download options
 * - Responsive layout adapts to different screen sizes
 * 
 * Data Integration:
 * - Fetches video data using React Query with caching
 * - Integrates with email notification system
 * - Connects to video editing actions
 * - Uses workspace actions for data management
 * 
 * @param videoId - Unique identifier of the video to preview
 */
type Props = {
  videoId: string
}

function VideoPreview({ videoId }: Props) {
  const router = useRouter()
  
  // Fetch video data with React Query caching
  const { data } = useQueryData(['preview-video'], () =>
    getPreviewVideo(videoId)
  )
  
  // Function to notify creator of first view
  const notifyFirstView = async () => await sendEmailForFirstView(videoId)
  
  const { data: video, status, author } = data as VideoProps
  if (status !== 200) router.push('/')
  
  // Calculate days since video creation for display
  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )
  
  // Handle first view notification
  useEffect(() => {
    if (video.views === 0) {
      notifyFirstView()
    }
    return () => {
      notifyFirstView()
    }
  }, [notifyFirstView, video.views])
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-5">
      {/* Main content area - Video player and metadata */}
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        {/* Video header with title and edit controls */}
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {/* Show edit button only for video author */}
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          {/* Creator info and creation date */}
          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9D9D9D] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        
        {/* Video player with controls */}
        <video
          preload="metadata"
          className="w-full aspect-video opacity-50 rounded-xl"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
          />
        </video>
        
        {/* Video description section */}
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="text-[#BDBDBD] text-semibold">Description</p>
            {/* Show edit button only for video author */}
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          <p className="text-[#9D9D9D] text-lg text-medium">
            {video.description}
          </p>
        </div>
      </div>
      
      {/* Sidebar with sharing and download options */}
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full bg-transparent px-10"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(video.description as string, 150)}
            id={videoId}
            source={video.source}
            title={video.title as string}
          />
          <Download className="text-[#4d4c4c]" />
        </div>
        <div>
          <TabMenu
            defaultValue="AI Tools"
            triggers={['AI Tools', 'Transcript', 'Activity']}
          >
            <AiTools
              videoId={videoId}
              trial={video.User?.trial ?? false}
              plan={video.User?.subscription?.plan ?? 'FREE'}
            />
            <VideoTranscript transcript={video.summary!} />
            <Activities
              author={video.User?.firstname as string}
              videoId={videoId}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  )
}

export default VideoPreview;