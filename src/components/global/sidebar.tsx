"use client";

import React from 'react';
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import {Separator} from "@radix-ui/react-menu";
import {userQueryData} from "@/hooks/useQueryData";
import {getWorkSpaces} from "@/actions/workspace";
import {WorkSpaceProps} from "@/types/index.type";
import Modal from "@/components/global/modal";
import {PlusCircle} from "lucide-react";
import Search from "@/components/global/search";

type Props = {
  activeWorkspaceId: string;
};

export default function Sidebar({ activeWorkspaceId }: Props) {
  const router = useRouter();
  
  const {data, isFetched} = userQueryData(['user-workspaces'], getWorkSpaces);
  
  const {data: workspaces} = data as WorkSpaceProps;
  
  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  }
  
  return (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image
          src="/favicon.ico"
          height={40}
          width={40}
          alt="logo"
        />
        <p className="text-2xl">Opal</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace">Select a workspace</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspaces.workspace.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                className="text-neutral-400 hover:bg-neutral-800"
              >
                {item.name}
              </SelectItem>
            ))}
            {workspaces.members.length > 0 &&
              workspaces.members.map(
                (workspace) =>
                  workspace.Workspace && (
                    <SelectItem
                      value={workspace.Workspace.id}
                      key={workspace.Workspace.id}
                    >
                      {workspace.Workspace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Modal
        trigger={
          <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
            <PlusCircle
              size={15}
              className="text-neutral-800/90 fill-neutral-500"
            />
            <span className="text-neutral-400 font-semibold text-xs">
                Invite To Workspace
            </span>
        </span>
        }
        title="Invite To Workspace"
        description="Invite other users to your workspace"
      >
        <Search workspaceId={activeWorkspaceId} />
      </Modal>
    </div>
  );
}