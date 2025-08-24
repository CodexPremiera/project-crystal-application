import React from 'react'
import {getNotifications, onAuthenticateUser} from '@/actions/user'
import { verifyAccessToWorkspace, getWorkspaceFolders, getAllUserVideos, getWorkSpaces } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import {HydrationBoundary, QueryClient} from '@tanstack/react-query'
import {dehydrate} from "@tanstack/query-core";
import Sidebar from "@/components/global/sidebar/sidebar";
import GlobalHeader from "@/components/global/global-header";

/**
 * Dashboard Workspace Layout Component
 * 
 * This layout component handles workspace-level authentication and access control.
 * It ensures that:
 * 1. Users are authenticated
 * 2. Users have access to the requested workspace
 * 3. Users are redirected to appropriate pages based on their access level
 * 
 * This layout wraps all workspace-specific pages and provides security at the route level.
 */

type Props = {
  params: Promise<{ workspaceId: string }> // Workspace ID from the URL parameter
  children: React.ReactNode // Child components to render
}

const Layout = async ({ params, children }: Props) => {
  const { workspaceId } = await params
  // Step 1: Authenticate user and get their data
  const auth = await onAuthenticateUser()
  
  // Step 2: Check if user has any workspaces
  if (!auth.user?.workspace) redirect('/auth/sign-in')
  if (!auth.user.workspace.length) redirect('/auth/sign-in')
  
  // Step 3: Verify user has access to the requested workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId)
  
  // Step 4: If user doesn't have access, redirect to their default workspace
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  }
  
  // Step 5: If workspace data is missing, don't render anything
  if (!hasAccess.data?.workspace) return null
  
  const query = new QueryClient()
  
  await query.prefetchQuery({
    queryKey:['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId),
  })
  await query.prefetchQuery({
    queryKey:['user-videos'],
    queryFn: () => getAllUserVideos(workspaceId),
  })
  await query.prefetchQuery({
    queryKey:['user-workspaces'],
    queryFn: () => getWorkSpaces(),
  })
  await query.prefetchQuery({
    queryKey:['user-notifications'],
    queryFn: () => getNotifications(),
  })
  
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAccess.data.workspace}/>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout;