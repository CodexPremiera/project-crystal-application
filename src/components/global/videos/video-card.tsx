import React from 'react';
import Loader from '../loader/loader';
import CardMenu from "@/components/global/videos/video-card-menu";
import {Dot, Share2, User} from "lucide-react";
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
  createdAt: Date
  title: string | null
  source: string
  processing: boolean
  workspaceId: string
}

function VideoCard(props: Props) {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  )
  
  return (
    <Loader
      className="bg-[#171717] flex justify-center items-center border-[1px] border-[rgb(37,37,37)] rounded-xl"
      state={false}
    >
      <div className=" group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
        <div className="absolute top-3 right-3 z-50 gap-x-3 hidden group-hover:flex">
          <CardMenu
            currentFolderName={props.Folder?.name}
            videoId={props.id}
            currentWorkspace={props.workspaceId}
            currentFolder={props.Folder?.id}
          />
          <CopyLink
            className="p-[5px] h-5 bg-hover:bg-transparent bg-[#252525]"
            videoId={props.id}
          />
        </div>
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