"use client"

import React, { useState } from 'react';
import Loader from '../loader/loader';
import { User, Move, Link2 } from "lucide-react";
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from 'sonner';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ChangeVideoLocation from "@/components/forms/change-video-location/video-location-form";

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
 * 4. Provides right-click context menu for actions (move, copy link)
 * 5. Links to video preview page for detailed viewing
 * 6. Handles loading states and processing indicators
 * 
 * Interactive Features:
 * - Right-click context menu for video actions (when isAdvanced is true)
 * - Move video to different workspace/folder
 * - Copy link functionality for sharing
 * - Click navigation to video preview
 * - Processing state indicators
 * 
 * @param props.isAdvanced - Optional prop to show/hide context menu actions. Defaults to true.
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
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt!.getTime()) / (24 * 60 * 60 * 1000)
  )
  
  const onCopyLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${props.id}`
    )
    toast('Copied', {
      description: 'Link successfully copied',
    })
  }
  
  return (
    <Loader
      className="bg-[#171717] flex justify-center items-center border-[1px] border-[rgb(37,37,37)] rounded-xl"
      state={false}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
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
        </ContextMenuTrigger>
        
        {props.isAdvanced !== false && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setMoveDialogOpen(true)}>
              <Move size={16} />
              Move to...
            </ContextMenuItem>
            <ContextMenuItem onClick={onCopyLink}>
              <Link2 size={16} />
              Copy Link
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
      
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent>
          <ChangeVideoLocation
            videoId={props.id}
            currentWorkSpace={props.workspaceId}
            onSuccess={() => setMoveDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Loader>
  );
}

export default VideoCard;
