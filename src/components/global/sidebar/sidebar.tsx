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
import {usePathname, useRouter} from 'next/navigation';
import {Separator} from "@radix-ui/react-menu";
import {userQueryData} from "@/hooks/useQueryData";
import {getWorkSpaces} from "@/actions/workspace";
import {NotificationProps, WorkSpaceProps} from "@/types/index.type";
import Modal from "@/components/global/modal";
import {PlusCircle} from "lucide-react";
import Search from "@/components/global/search";
import {MENU_ITEMS} from "@/constants/constants";
import SidebarItem from "@/components/global/sidebar/sidebar-item";
import {getNotifications} from "@/actions/user";
import WorkspacePlaceholder from "@/components/global/sidebar/workspace-placeholder";

type Props = {
  activeWorkspaceId: string;
};

export default function Sidebar({ activeWorkspaceId }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  
  const {data, isFetched} = userQueryData(['user-workspaces'], getWorkSpaces);
  
  const menuItems = MENU_ITEMS({workspaceId: activeWorkspaceId});
  
  const {data: notifications} = userQueryData(
    ["user-notifications"],
    getNotifications
  )
  
  const {data: workspace} = data as WorkSpaceProps;
  const {data: count} = notifications as NotificationProps;
  
  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  }
  
  const currentWorkspace = workspace?.workspace.find(item => item.id === activeWorkspaceId);
  
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
            {workspace.workspace.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                className="text-neutral-400 hover:bg-neutral-800"
              >
                {item.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
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
      {currentWorkspace?.type==="PUBLIC" && workspace.subscription?.plan === "PRO" && (
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
      )}
      
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map(item => (
            <SidebarItem
              key={item.title}
              href={item.href}
              icon={item.icon}
              title={item.title}
              selected={pathName === item.href}
              notifications={
                (item.title === "Notifications" &&
                  count._count &&
                  count._count.notification)
                || 0
              }
            />
          ))}
        </ul>
      </nav>
      
      <Separator className="w-4/5" />
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspaces</p>
      
      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px] cursor-pointer">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspace.subscription?.plan === 'FREE'
              ? 'Upgrade to create workspaces'
              : 'No Workspaces'}
          </p>
        </div>
      )}
      
      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer scrollbar-minimal">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    key={item.name}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )
          }
          {workspace.members.length > 0 &&
            workspace.members.map(
              (item) =>
                item.Workspace &&
                item.Workspace.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.Workspace.id}`}
                    selected={
                      pathName === `/dashboard/${item.Workspace.id}`
                    }
                    title={item.Workspace.name}
                    notifications={0}
                    key={item.Workspace.id}
                    icon={
                      <WorkspacePlaceholder>
                        {item.Workspace.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )
          }
        </ul>
      </nav>
    </div>
  );
}