"use client";

import React from 'react';
import Image from "next/image";
import {usePathname} from 'next/navigation';
import {Separator} from "@radix-ui/react-menu";
import {useQueryData} from "@/hooks/useQueryData";
import {getWorkSpaces} from "@/actions/workspace";
import {NotificationProps, WorkSpaceProps} from "@/types/index.type";
import {Menu} from "lucide-react";
import {MENU_ITEMS} from "@/constants/constants";
import SidebarItem from "@/components/global/sidebar/sidebar-item";
import {getNotifications} from "@/actions/user";
import WorkspacePlaceholder from "@/components/global/sidebar/workspace-placeholder";
import GlobalCard from "@/components/global/global-card";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import Infobar from "@/components/global/infobar";
import {useDispatch} from "react-redux";
import {WORKSPACES} from "@/redux/slices/workspaces";
import PaymentButton from "@/components/global/payment-button";
import CreateWorkspace from "@/components/global/create-workspace";

type Props = {
  activeWorkspaceId: string;
};

/**
 * Main Sidebar Component
 * 
 * This component serves as the primary navigation interface for the dashboard,
 * providing workspace selection, navigation menu, user information, and
 * subscription management. It includes responsive design with mobile support
 * and integrates with Redux for state management.
 * 
 * Purpose: Provide comprehensive navigation and workspace management interface
 * 
 * How it works:
 * 1. Fetches user workspaces and notifications using React Query
 * 2. Manages workspace selection with dropdown interface
 * 3. Displays navigation menu items based on current workspace
 * 4. Shows user profile information and subscription status
 * 5. Provides mobile-responsive design with collapsible sidebar
 * 6. Integrates with Redux for global state management
 * 
 * Key Features:
 * - Workspace selection and switching
 * - Navigation menu with active state indication
 * - User profile display with subscription information
 * - Notification system integration
 * - Mobile-responsive design with sheet component
 * - Payment button for subscription upgrades
 * - Search functionality integration
 * 
 * State Management:
 * - Uses React Query for data fetching and caching
 * - Integrates with Redux for workspace state
 * - Manages local state for UI interactions
 * - Handles workspace switching and navigation
 * 
 * Integration:
 * - Used by dashboard layout for navigation
 * - Connects to workspace and user data systems
 * - Integrates with payment and subscription systems
 * - Part of global navigation and user management
 * 
 * @param activeWorkspaceId - Currently selected workspace ID
 * @returns JSX element with complete sidebar navigation interface
 */
export default function Sidebar({ activeWorkspaceId }: Props) {
  // TODO: Add the upgrade functionality
  // const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch()
  
  /**
   * Data Fetching with React Query (useQuery)
   * 
   * This component demonstrates multiple useQuery patterns for fetching different
   * types of data. Each query is cached independently and provides efficient
   * data management across the application.
   * 
   * Query Patterns:
   * 1. User Workspaces: Fetches user's owned and member workspaces
   * 2. Notifications: Fetches user's notification data
   * 3. Each query uses unique query keys for independent caching
   * 4. Data is automatically shared across components using the same keys
   */
  const {data, isFetched} = useQueryData(['user-workspaces'], getWorkSpaces);
  
  const {data: notifications} = useQueryData(
    ["user-notifications"],
    getNotifications
  )
  
  const {data: workspace} = (data || { data: { workspace: [], members: [] } }) as WorkSpaceProps;
  const {data: count} = (notifications || { data: { _count: { notification: 0 } } }) as NotificationProps;
  
  const currentWorkspace = workspace?.workspace.find(
    item => item.id === activeWorkspaceId
  );
  
  const menuItems = MENU_ITEMS({workspaceId: activeWorkspaceId, currentWorkspace});
  
  if (isFetched && workspace) {
    dispatch(WORKSPACES({ workspaces: workspace.workspace }))
  }
  
  const SidebarSection = (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-3 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image
          src="/crystal-logo.svg"
          height={32}
          width={32}
          alt="logo"
        />
        <p className="text-2xl">Crystal</p>
      </div>
      
      <p className="w-full text-[#9D9D9D] font-bold mt-16">Menu</p>
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
      <div className="flex flex-col items-center gap-2 overflow-hidden w-full">
        <div className="flex gap-3 items-center h-fit justify-between w-full">
          <p className="h-fit text-[#9D9D9D] font-bold">Workspaces</p>
          <CreateWorkspace />
        </div>
        
        {workspace.workspace.length === 1 && workspace.members.length === 0 && (
          <div className="w-full mt-[-10px] cursor-pointer">
            <p className="text-[#3c3c3c] font-medium text-sm">
              {workspace.subscription?.plan === 'FREE'
                ? 'Upgrade to create workspaces'
                : 'No Workspaces'}
            </p>
          </div>
        )}
        
       
        
        {currentWorkspace && (
          <div className="flex flex-col gap-2 w-full h-fit">
            <SidebarItem
              href={`/dashboard/${currentWorkspace.id}`}
              selected={pathName === `/dashboard/${currentWorkspace.id}`}
              title={currentWorkspace.name}
              notifications={0}
              key={currentWorkspace.name}
              icon={
                <WorkspacePlaceholder>
                  {currentWorkspace.name.charAt(0)}
                </WorkspacePlaceholder>
              }
            />
          </div>
        )}
        
        <nav className="w-full gap-2">
          <hr className="w-full my-2"/>
          <ul className="h-[300px] overflow-auto overflow-x-hidden scrollbar-minimal">
            {workspace.workspace.length > 0 &&
              workspace.workspace.map(
                (item) =>
                  item !== currentWorkspace && (
                    <SidebarItem
                      href={`/dashboard/${item.id}`}
                      selected={pathName === `/dashboard/${item.id}`}
                      title={item.name}
                      notifications={0}
                      key={item.id}
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
                  item.WorkSpace &&
                  item.WorkSpace.type !== "PERSONAL" && (
                    <SidebarItem
                      href={`/dashboard/${item.WorkSpace.id}`}
                      selected={
                        pathName === `/dashboard/${item.WorkSpace.id}`
                      }
                      title={item.WorkSpace.name}
                      notifications={0}
                      key={item.WorkSpace.id}
                      icon={
                        <WorkspacePlaceholder>
                          {item.WorkSpace.name.charAt(0)}
                        </WorkspacePlaceholder>
                      }
                    />
                  )
              )
            }
          </ul>
        </nav>
      </div>
      
      <Separator className="w-4/5"/>
      {workspace.subscription?.plan === 'FREE' && (
        <GlobalCard
          title="Upgrade to Pro"
          description=" Unlock AI features like transcription, AI summary, and more."
          footer={<PaymentButton />}
        />
      )}
    </div>
  );
  
  return (
    <div className="full">
      <Infobar />
      
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger
            asChild
            className="ml-2"
          >
            <Button
              variant={'ghost'}
              className="mt-[2px]"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={'left'}
            className="p-0 w-fit h-full"
          >
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block h-full">
        {SidebarSection}
      </div>
    </div>
  )
}