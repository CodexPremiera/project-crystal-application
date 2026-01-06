import React from 'react'
import { notFound } from 'next/navigation'
import Folders from "@/components/global/folders/folders";
import {getAllUserVideos, getWorkspaceFolders, getWorkSpaces} from '@/actions/workspace';
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
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
 * 1. Starts non-blocking prefetch for workspace folders and videos
 * 2. Fetches workspace name (only blocking operation needed for render)
 * 3. Renders page immediately with minimal blocking
 * 4. Components load progressively as data becomes available
 * 
 * Page Features:
 * - Workspace actions dropdown with management options
 * - Invitation section for workspace collaboration
 * - Dynamic routing based on workspaceId parameter
 * - Clean, organized layout for workspace content
 * - Folder management and organization tools
 * - Video browsing and management interface
 * 
 * Data Management:
 * - Non-blocking prefetch for folders and videos (fast render)
 * - Minimal blocking fetch for workspace name (required for UI)
 * - Uses React Query for efficient data caching
 * - Provides hydration boundary for SSR optimization
 * - Components show loading states while data loads
 * - Progressive data streaming from server
 * 
 * Performance:
 * - Page renders immediately after workspace name loads
 * - Content areas show loading states during data fetch
 * - Optimized for fast Time to Interactive (TTI)
 * - Background data prefetching for smooth UX
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
  
  // Start non-blocking prefetch queries in background
  query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceid),
  })
  
  query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceid),
  })
  
  query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkSpaces(),
  })
  
  // Only await workspace data needed for initial render (workspace name)
  const workspaceData = await getWorkSpaces()
  const workspace = workspaceData.data as { 
    workspace: Array<{ id: string; name: string; type: string }>
    members: Array<{ WorkSpace: { id: string; name: string; type: string } | null }>
  } | undefined
  
  // Check owned workspaces first, then member workspaces
  const ownedWorkspace = workspace?.workspace.find(
    (item) => item.id === workspaceid
  )
  const memberWorkspace = workspace?.members.find(
    (item) => item.WorkSpace?.id === workspaceid
  )?.WorkSpace
  
  const currentWorkspace = ownedWorkspace || memberWorkspace
  const isOwner = !!ownedWorkspace
  
  // Check if workspace exists
  if (!currentWorkspace) {
    notFound()
  }
  
  const workspaceName = currentWorkspace.name
  const workspaceType = currentWorkspace.type
  
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div>
        <div className="flex w-full justify-between items-end">
          <article className="flex flex-col gap-2">
            <span className="text-text-muted text-xs">
              {workspaceType.toUpperCase()} WORKSPACE
            </span>
            <h1 className="text-4xl font-bold">
              {workspaceName}
            </h1>
          </article>
          
          <div className="flex justify-end gap-2 items-end">
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
                  isOwner={isOwner}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <section className="py-9">
          <Folders workspaceId={workspaceid} />
        </section>
      </div>
    </HydrationBoundary>
  )
}

export default Page