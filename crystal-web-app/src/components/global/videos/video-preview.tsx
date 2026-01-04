"use client"

import React, {useEffect, useRef} from 'react';
import {useRouter} from "next/navigation";
import { useQueryData } from '@/hooks/useQueryData';
import {getPreviewVideo, recordVideoView, toggleVideoLike} from "@/actions/workspace";
import {VideoProps} from "@/types/index.type";
import { useMutationData } from '@/hooks/useMutationData';
import EditVideoTitle from "@/components/global/videos/edit/edit-video-title";
import EditVideoDesc from "@/components/global/videos/edit/edit-video-desc";
import CopyLink from "@/components/global/videos/copy-link";
import RichLink from "@/components/global/videos/rich-link";
import {truncateString} from "@/lib/utils";
import TabMenu from "@/components/global/tab-menu";
import AiTools from "@/components/global/video-tools/ai-tools";
import Comments from "@/components/global/video-tools/activities";
import VideoTranscript from "@/components/global/video-tools/video-transcript";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Like} from "@/components/icons/like";
import {Download, MoreHorizontal, Crown} from "lucide-react";
import DeleteVideoConfirmation from './delete-video-confirmation'
import { useDownloadVideo } from '@/hooks/useDownloadVideo'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Fetch video data with React Query caching
  const { data } = useQueryData(['preview-video'], () =>
    getPreviewVideo(videoId)
  )
  
  const { data: video, status, author } = data as VideoProps
  if (status !== 200) router.push('/')
  
  // Download functionality
  const { downloadVideo, isDownloading } = useDownloadVideo(
    video.source,
    video.title,
    videoId
  )
  
  // Like functionality
  const { mutate: toggleLike, isPending: isLiking } = useMutationData(
    ['toggle-video-like'],
    async () => await toggleVideoLike(videoId),
    'preview-video'
  )
  
  // Calculate days since video creation for display
  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )
  
  // Record video view and notify owner (for public workspaces)
  useEffect(() => {
    const trackView = async () => {
      await recordVideoView(videoId)
    }
    
    trackView()
  }, [videoId])
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-8">
      {/* Main content area - Video player and metadata */}
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        {/* Video header with title and edit controls */}
        <div>
          <div className="flex gap-x-5 items-center">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {/* Show edit button only for video author */}
            {author && (
              <EditVideoTitle
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            )}
          </div>
          {/* Creator info and creation date */}
          <span className="flex gap-x-3 mt-2">
            <p className="text-text-tertiary capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-text-muted">
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        
        {/* Video player with controls */}
        <video
          ref={videoRef}
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
            <p className="text-text-secondary text-semibold">Description</p>
            {/* Show edit button only for video author */}
            {author && (
              <EditVideoDesc
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            )}
          </div>
          <p className="text-text-tertiary text-lg text-medium">
            {video.description}
          </p>
        </div>
      </div>
      
      {/* Sidebar with sharing and download options */}
      <div className="lg:col-span-1 flex flex-col gap-y-20">
        <div className="flex justify-end gap-2 items-center">
          {/* Like button with count in a chip */}
          <Button
            variant="secondary"
            className="rounded-full pl-3 pr-6 flex"
            onClick={() => toggleLike(undefined)}
            disabled={isLiking}
          >
            <Like />
            <span>{video.likes ?? 0}</span>
          </Button>
          
          {/* Download button */}
          <Button
            variant="secondary"
            className="rounded-full pl-3 pr-6 flex"
            onClick={downloadVideo}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
          </Button>
          
          <CopyLink
            className="rounded-full"
            videoId={videoId}
            variant="secondary"
          />
          
          {/* More options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='rounded-full' variant="secondary" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="gap-1">
              <DropdownMenuItem>
                <RichLink
                  description={truncateString(video.description as string, 150)}
                  id={videoId}
                  source={video.source}
                  title={video.title as string}
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteVideoConfirmation
                  videoId={videoId}
                  videoTitle={video.title as string}
                  redirectPath="/dashboard"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          {video.User?.subscription?.plan === 'PRO' ? (
            <TabMenu
              defaultValue="Transcript"
              triggers={['Transcript', 'Comments']}
              prefix={
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-surface border border-brand-border">
                  <Crown className="h-4 w-4 text-brand" />
                  <span className="text-sm font-medium text-brand">PRO</span>
                </div>
              }
            >
              <VideoTranscript 
                transcript={video.summary!}
                segments={video.transcriptSegments}
                videoRef={videoRef}
              />
              <Comments
                author={video.User?.firstname as string}
                videoId={videoId}
              />
            </TabMenu>
          ) : (
            <TabMenu
              defaultValue="Transcript"
              triggers={['Transcript', 'Comments', 'AI Tools']}
            >
              <VideoTranscript 
                transcript={video.summary!}
                segments={video.transcriptSegments}
                videoRef={videoRef}
              />
              <Comments
                author={video.User?.firstname as string}
                videoId={videoId}
              />
              <AiTools
                videoId={videoId}
                trial={video.User?.trial ?? false}
                plan={video.User?.subscription?.plan ?? 'FREE'}
              />
            </TabMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPreview;