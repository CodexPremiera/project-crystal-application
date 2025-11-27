import React from 'react'
import { getWorkSpaces, getWorkspaceMemberCount, getWorkspaceOwner, getWorkspaceMembers } from '@/actions/workspace'
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { Users } from '@/components/icons/user'
import DashboardInviteSection from '@/components/global/dashboard-invite-section'
import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import OwnerCard from "@/components/global/users/owner-card";
import UserCard from "@/components/global/users/user-card";

type Props = {
  params: Promise<{ workspaceid: string }>
}

/**
 * Workspace Users Management Page
 * 
 * This page displays workspace member information and management tools.
 * It shows the current workspace members, their roles, and provides
 * invitation functionality for workspace collaboration.
 * 
 * Purpose: Provide workspace member management interface
 * 
 * How it works:
 * 1. Prefetches workspace data and member count for performance
 * 2. Displays current workspace members and their information
 * 3. Provides invitation functionality for adding new members
 * 4. Shows member count and workspace type information
 * 
 * Page Features:
 * - Workspace member list and information
 * - Member count display
 * - Invitation functionality for PUBLIC workspaces
 * - Workspace type-specific content (PERSONAL vs PUBLIC)
 * - Clean, organized layout for member management
 * 
 * Data Management:
 * - Prefetches workspace data for immediate display
 * - Prefetches member count for accurate information
 * - Uses React Query for efficient data caching
 * - Provides hydration boundary for SSR optimization
 * 
 * Integration:
 * - Used for workspace member management
 * - Connects to workspace and user management systems
 * - Integrates with invitation and collaboration features
 * - Part of workspace navigation and user management
 * 
 * @param params - Contains the workspaceId from the URL route (must be awaited)
 * @returns JSX element with workspace users management interface
 */
const Page = async ({ params }: Props) => {
  const { workspaceid } = await params
  const query = new QueryClient()
  
  // Get current user for comparison
  const currentUserData = await currentUser()
  
  // Create a serializable copy of the user data
  const user = currentUserData ? {
    id: currentUserData.id
  } : null
  
  // Prefetch workspace data to check type
  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkSpaces(),
  })
  
  // Get workspace data to check if it's PERSONAL
  const workspaceData = await getWorkSpaces()
  const workspace = workspaceData.data as { workspace: Array<{ id: string; name: string; type: string }> } | undefined
  
  const currentWorkspace = workspace?.workspace.find(
    (item) => item.id === workspaceid
  )
  
  // Redirect to 404 if workspace is PERSONAL
  if (currentWorkspace?.type === 'PERSONAL') {
    notFound()
  }
  
  // Get workspace owner information using server action
  const workspaceOwnerData = await getWorkspaceOwner(workspaceid)
  
  // Create a serializable copy of the workspace owner data
  const workspaceOwner = workspaceOwnerData.status === 200 ? {
    User: workspaceOwnerData.data?.User ? {
      firstname: workspaceOwnerData.data.User.firstname,
      lastname: workspaceOwnerData.data.User.lastname,
      image: workspaceOwnerData.data.User.image,
      clerkId: workspaceOwnerData.data.User.clerkId,
    } : null
  } : null
  
  // Get workspace members (excluding owner)
  const workspaceMembersData = await getWorkspaceMembers(workspaceid)
  
  // Create a serializable copy of the workspace members data
  const workspaceMembers = workspaceMembersData.status === 200 ? workspaceMembersData.data : []
  
  await query.prefetchQuery({
    queryKey: ['workspace-member-count', workspaceid],
    queryFn: () => getWorkspaceMemberCount(workspaceid),
  })
  
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="mt-6">
        <div className="flex w-full justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Workspace Members</h1>
              <p className="text-muted-foreground">
                Manage workspace members and permissions
              </p>
            </div>
          </div>
          
          <DashboardInviteSection 
            workspaceId={workspaceid}
          />
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Current Members</h2>
          </div>
          
          <div className="space-y-4">
            <OwnerCard workspaceOwner={workspaceOwner} user={user} />
            
            {/* Render workspace members */}
            {workspaceMembers && workspaceMembers.length > 0 ? (
              workspaceMembers.map((member, index) => (
                <UserCard 
                  key={member.User?.clerkId || index} 
                  workspaceMember={member} 
                  user={user}
                  workspaceId={workspaceid}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No additional members yet</p>
                <p className="text-sm">Invite users to collaborate on this workspace</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Page