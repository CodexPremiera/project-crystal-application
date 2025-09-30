import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import React from 'react'
import CreateWorkspace from "@/components/global/create-workspace";
import Folders from "@/components/global/folders/folders";
import CreateFolders from "@/components/global/create-folders";
import {getAllUserVideos, getWorkspaceFolders, getWorkSpaces} from '@/actions/workspace';
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Like} from "@/components/icons";
import {Download, MoreHorizontal} from "lucide-react";
import CopyLink from "@/components/global/videos/copy-link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import RichLink from "@/components/global/videos/rich-link";
import {truncateString} from "@/lib/utils";
import DeleteVideoConfirmation from "@/components/global/videos/delete-video-confirmation";
import {TrashBin} from "@/components/icons/trash-bin";
import {EditDuotone} from "@/components/icons/editDuotone";
import {Users} from "@/components/icons/user";
import DashboardInviteSection from "@/components/global/dashboard-invite-section";
import WorkspaceActions from "@/components/global/workspace/workspace-actions";

type Props = {
  params: Promise<{ workspaceid: string }>
}

/**
 * Main Workspace Dashboard Page
 * 
 * This is the primary dashboard page for workspace content management.
 * It provides a comprehensive interface for viewing and organizing videos
 * within a specific workspace, including folder management and content
 * organization features.
 * 
 * Purpose: Provide main workspace interface for video and folder management
 * 
 * How it works:
 * 1. Prefetches workspace folders and videos for performance
 * 2. Provides tabbed interface for content organization
 * 3. Includes workspace creation functionality for PRO users
 * 4. Displays folder structure and video content
 * 5. Offers content creation and management tools
 * 
 * Page Features:
 * - Tab navigation between Videos and Archive sections
 * - Workspace creation button for PRO users
 * - Dynamic routing based on workspaceId parameter
 * - Clean, organized layout for workspace content
 * - Folder management and organization tools
 * - Video browsing and management interface
 * 
 * Data Management:
 * - Prefetches workspace folders for immediate display
 * - Prefetches user videos for content browsing
 * - Uses React Query for efficient data caching
 * - Provides hydration boundary for SSR optimization
 * 
 * Integration:
 * - Used as main workspace dashboard interface
 * - Connects to workspace and video management systems
 * - Integrates with folder organization features
 * - Part of workspace navigation and content management
 * 
 * @param params - Contains the workspaceId from the URL route (must be awaited)
 * @returns JSX element with workspace dashboard interface
 */
const Page = async ({ params }: Props) => {
  const { workspaceid } = await params
  const query = new QueryClient()
  
  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceid),
  })
  
  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceid),
  })
  
  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkSpaces(),
  })
  
  // Get workspace data to extract the current workspace name
  const workspaceData = await getWorkSpaces()
  const workspace = workspaceData.data as any
  
  const currentWorkspace = workspace?.workspace.find(
    (item: any) => item.id === workspaceid
  )
  
  const workspaceName = currentWorkspace?.name || 'Unknown Workspace'
  
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div>
        <Tabs
          defaultValue="videos"
          className="mt-6"
        >
          <div className="flex w-full justify-between items-center">
            <TabsList className="bg-transparent gap-2 pl-0">
              <TabsTrigger
                className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
                value="videos"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="archive"
                className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              >
                Archive
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end gap-2 items-center">
              <DashboardInviteSection 
                workspaceId={workspaceid}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='rounded-full' variant="secondary" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="gap-1">
                  <WorkspaceActions 
                    workspaceId={workspaceid}
                    workspaceName={workspaceName}
                  />
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      className="rounded-full gap-3 !p-0 !pl-1 !pr-2 text-[#eeeeee] hover:text-red-500 hover:bg-red-500/10"
                    >
                      <TrashBin />
                      <span>Delete</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <section className="py-9">
            <TabsContent value="videos">
              <Folders workspaceId={workspaceid} />
            </TabsContent>
          </section>
        </Tabs>
      </div>
    </HydrationBoundary>
  )
}

export default Page