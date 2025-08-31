import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import React from 'react'
import CreateWorkspace from "@/components/global/create-workspace";
import Folders from "@/components/global/folders/folders";
import CreateFolders from "@/components/global/create-folders";

type Props = {
  params: Promise<{ workspaceId: string }>
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
export default async function Page ({ params }: Props) {
  const { workspaceId } = await params
  
  return (
    <div>
      {/* Main content tabs for workspace navigation */}
      <Tabs
        defaultValue="videos"
        className="mt-6"
      >
        {/* Header section with tabs and action buttons */}
        <div className="flex w-full justify-between items-center">
          {/* Tab navigation for different content types */}
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              value="videos"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              value="archive">Archive</TabsTrigger>
          </TabsList>
          
          {/* Action buttons section */}
          <div className="flex gap-x-3">
            {/* Workspace creation button - only visible to PRO users */}
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
  )
}