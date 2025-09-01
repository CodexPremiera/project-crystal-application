import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import React from 'react'
import CreateWorkspace from "@/components/global/create-workspace";
import Folders from "@/components/global/folders/folders";
import CreateFolders from "@/components/global/create-folders";
import {getAllUserVideos, getWorkspaceFolders} from '@/actions/workspace';
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";

type Props = {
  params: { workspaceId: string }
}

/**
 * Dashboard Page Component
 * 
 * This is the main workspace dashboard page that displays content for a specific workspace.
 * It provides navigation between different content types (Videos, Archive) and includes
 * workspace management features like creating new workspaces.
 * 
 * Page Features:
 * - Tab navigation between Videos and Archive sections
 * - Workspace creation button for PRO users
 * - Dynamic routing based on workspaceId parameter
 * - Clean, organized layout for workspace content
 * 
 * @param params - Contains the workspaceId from the URL route (must be awaited)
 */
const Page = async ({ params: { workspaceId } }: Props) => {
  const query = new QueryClient()
  
  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId),
  })
  
  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceId),
  })
  
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
            <div className="flex gap-x-3">
              <CreateWorkspace />
              <CreateFolders workspaceId={workspaceId} />
            </div>
          </div>
          <section className="py-9">
            <TabsContent value="videos">
              <Folders workspaceId={workspaceId} />
            </TabsContent>
          </section>
        </Tabs>
      </div>
    </HydrationBoundary>
  )
}

export default Page