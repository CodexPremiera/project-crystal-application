import React from 'react';
import Loader from '../loader/loader';
import CardMenu from "@/components/global/videos/video-card-menu";
import {Dot, Share2, User} from "lucide-react";
import { Avatar } from '@radix-ui/react-avatar';
import {AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import CopyLink from "@/components/global/videos/copy-link";

/**
 * Video Card Component
 * 
 * This component represents an individual video item in the workspace grid.
 * It displays video metadata, thumbnail, user information, and provides interactive actions.
 * 
 * Key Features:
 * 1. Video thumbnail with hover controls (move and copy link)
 * 2. Video metadata display (title, creator, creation date)
 * 3. Interactive actions through CardMenu and CopyLink components
 * 4. Navigation to video detail page on click
 * 5. Responsive design with hover effects
 * 
 * Visual Elements:
 * - Video thumbnail with aspect-video ratio
 * - User avatar with fallback icon
 * - Video title and creator information
 * - Time-based creation date display
 * - Hover-activated action buttons
 * 
 * Interactive Behavior:
 * - Hover reveals action buttons (move and copy link)
 * - Click navigates to video detail page
 * - Action buttons trigger modal forms and clipboard operations
 * 
 * Data Integration:
 * - Receives video data from parent Videos component
 * - Integrates with workspace navigation system
 * - Connects to video management actions through child components
 * 
 * @param User - Video creator information (firstname, lastname, image)
 * @param id - Unique video identifier
 * @param Folder - Folder information if video is in a folder
 * @param createdAt - Video creation timestamp
 * @param title - Video title
 * @param source - Video source URL for thumbnail
 * @param processing - Video processing status
 * @param workspaceId - Current workspace context for navigation
 */
type Props = {
  User: {
    firstname: string | null
    lastname: string | null
    image: string | null
  } | null
  id: string
  Folder: {
    id: string
    name: string
  } | null
  createdAt: Date
  title: string | null
  source: string
  processing: boolean
  workspaceId: string
}

function VideoCard(props: Props) {
  // Calculate days since video creation for display
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )
  
  return (
    <Loader
      className="bg-[#171717] flex justify-center items-center border-[1px] border-[rgb(37,37,37)] rounded-xl"
      state={false}
    >
      {/* Main video card container with hover effects */}
      <div className=" group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
        {/* Action buttons that appear on hover */}
        <div className="absolute top-3 right-3 z-50 gap-x-3 hidden group-hover:flex">
          {/* Move video to different folder/workspace */}
          <CardMenu
            currentFolderName={props.Folder?.name}
            videoId={props.id}
            currentWorkspace={props.workspaceId}
            currentFolder={props.Folder?.id}
          />
          {/* Copy video share link to clipboard */}
          <CopyLink
            className="p-[5px] h-5 bg-hover:bg-transparent bg-[#252525]"
            videoId={props.id}
          />
        </div>
        
        {/* Clickable link to video detail page */}
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
        >
          {/* Video thumbnail with metadata preload */}
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video border-[1px] border-[#252525] rounded-xl opacity-50 z-20"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
            />
          </video>
          
          {/* Video metadata section */}
          <div className="px-6 py-3 flex flex-col gap-4-2 z-20">
            {/* Video title */}
            <h2 className="text-lg font-semibold text-[#BDBDBD]">
              {props.title}
            </h2>
            
            {/* Creator information and creation date */}
            <div className="flex gap-x-3 items-center mt-4 w-full mb-3">
              {/* User avatar with fallback */}
              <Avatar className="!rounded-full w-10 !overflow-hidden">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              
              {/* Creator name and time information */}
              <div className="w-full flex flex-col">
                <p className="capitalize text-sm text-[#BDBDBD]">
                  {props.User?.firstname} {props.User?.lastname}
                </p>
                <p className="text-[#6d6b6b] text-sm flex">
                  {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
}

export default VideoCard;