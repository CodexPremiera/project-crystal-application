"use client"

import React from 'react';
import Loader from '../loader/loader';
import CardMenu from "@/components/global/videos/video-card-menu";
import { User } from "lucide-react";
import { Avatar } from '@radix-ui/react-avatar';
import {AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import CopyLink from "@/components/global/videos/copy-link";

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
  createdAt: Date | undefined | null
  title: string | null
  source: string
  processing: boolean
  workspaceId: string
  isAdvanced?: boolean
}

/**
 * Video Card Component
 * 
 * This component displays individual video items in a card format within
 * video grids and lists. It provides video metadata, user information,
 * interactive controls, and navigation to video details.
 * 
 * Purpose: Display video information in an interactive card format for browsing
 * 
 * How it works:
 * 1. Calculates time since video creation for display
 * 2. Shows video thumbnail with processing state indication
 * 3. Displays video metadata (title, creator, folder, date)
 * 4. Provides hover-activated action buttons (menu, copy link)
 * 5. Links to video preview page for detailed viewing
 * 6. Handles loading states and processing indicators
 * 
 * Interactive Features:
 * - Hover effects reveal action buttons (when isAdvanced is true)
 * - Video card menu for editing and management (when isAdvanced is true)
 * - Copy link functionality for sharing (when isAdvanced is true)
 * - Click navigation to video preview
 * - Processing state indicators
 * 
 * @param props.isAdvanced - Optional prop to show/hide action buttons (CardMenu and CopyLink). Defaults to true.
 * 
 * Data Display:
 * - Video thumbnail with processing overlay
 * - Video title and creator information
 * - Folder location and creation date
 * - User avatar and name display
 * - Time since creation calculation
 * 
 * Integration:
 * - Used by video grid and list components
 * - Connects to video management system
 * - Integrates with user profile system
 * - Part of video browsing and navigation
 * 
 * @param props - Video data object containing all video information
 * @returns JSX element with interactive video card
 */
function VideoCard(props: Props) {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt!.getTime()) / (24 * 60 * 60 * 1000)
  )
  
  return (
    <Loader
      className="bg-[#171717] flex justify-center items-center border-[1px] border-[rgb(37,37,37)] rounded-xl"
      state={false}
    >
      <div className=" group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
        {props.isAdvanced !== false && (
          <div className="absolute top-3 right-3 z-50 gap-x-3 hidden group-hover:flex">
            <CardMenu
              videoId={props.id}
              currentWorkspace={props.workspaceId}
            />
            <CopyLink
              className="p-[5px] h-5 bg-hover:bg-transparent bg-[#252525]"
              videoId={props.id}
            />
          </div>
        )}
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
        >
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video border-[1px] border-[#252525] rounded-xl opacity-50 z-20"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
            />
          </video>
          <div className="px-6 py-3 flex flex-col gap-4-2 z-20">
            <h2 className="text-lg font-semibold text-[#BDBDBD]">
              {props.title}
            </h2>
            <div className="flex gap-x-3 items-center mt-4 w-full mb-3">
              <Avatar className="!rounded-full w-10 !overflow-hidden">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
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