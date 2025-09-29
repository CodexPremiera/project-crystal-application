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
 * This layout component provides workspace-level authentication, access control,
 * and data prefetching for all workspace-specific pages. It ensures security
 * and performance by handling authentication, workspace access verification,
 * and data preparation before rendering child components.
 * 
 * Purpose: Provide secure workspace access with data prefetching and layout structure
 * 
 * How it works:
 * 1. Authenticates user and retrieves user data
 * 2. Verifies user has workspaces and redirects if none exist
 * 3. Checks user access to the requested workspace
 * 4. Redirects to default workspace if access denied
 * 5. Prefetches workspace data for performance
 * 6. Renders sidebar and header with workspace context
 * 7. Provides hydrated data to child components
 * 
 * Security Features:
 * - User authentication verification
 * - Workspace access control
 * - Automatic redirection for unauthorized access
 * - Workspace ownership and membership validation
 * 
 * Performance Features:
 * - Data prefetching with React Query
 * - Hydration boundary for SSR optimization
 * - Query client setup for caching
 * - Efficient data loading patterns
 * 
 * Layout Structure:
 * - Sidebar navigation with workspace context
 * - Global header with dynamic content
 * - Child component rendering area
 * - Responsive design considerations
 * 
 * Integration:
 * - Used by all workspace-specific dashboard pages
 * - Connects to authentication and workspace systems
 * - Provides data context to child components
 * - Essential for workspace security and navigation
 * 
 * @param params - Promise containing workspaceId from URL parameters
 * @param children - Child components to render within the workspace layout
 * @returns JSX element with workspace layout and security controls
 */
type Props = {
  params: Promise<{ workspaceid: string }> // Workspace ID from the URL parameter
  children: React.ReactNode // Child components to render
}

const Layout = async ({ params, children }: Props) => {
  const { workspaceid } = await params
  // Step 1: Authenticate user and get their data
  const auth = await onAuthenticateUser()
  
  // Step 2: Check if user has any workspaces
  if (!auth.user?.workspace) redirect('/auth/sign-in')
  if (!auth.user.workspace.length) redirect('/auth/sign-in')
  
  // Step 3: Verify user has access to the requested workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceid)
  
  // Step 4: If user doesn't have access, redirect to their default workspace
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  }
  
  // Step 5: If workspace data is missing, don't render anything
  if (!hasAccess.data?.workspace) return null
  
  // Create QueryClient instance for server-side data prefetching
  const query = new QueryClient()
  
  /**
   * Server-Side Data Prefetching with React Query
   * 
   * This section prefetches all essential data on the server before rendering
   * the workspace layout. This approach provides several benefits:
   * 
   * 1. Performance: Data is available immediately when components mount
   * 2. SEO: Server-rendered content with actual data
   * 3. User Experience: No loading states for critical data
   * 4. Caching: Data is cached and shared across components
   * 
   * How prefetchQuery works:
   * - Executes server actions on the server before component rendering
   * - Stores fetched data in React Query cache
   * - Makes data immediately available to client components
   * - Eliminates the need for client-side data fetching
   * 
   * Data Prefetched:
   * - Workspace folders: For navigation and organization
   * - User videos: For video display and management
   * - User workspaces: For workspace switching and navigation
   * - User notifications: For notification display and management
   */
  await query.prefetchQuery({
    queryKey:['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceid),
  })
  await query.prefetchQuery({
    queryKey:['user-videos'],
    queryFn: () => getAllUserVideos(workspaceid),
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
      <div className="flex h-screen">
        <Sidebar activeWorkspaceId={workspaceid} />
        <main className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <GlobalHeader workspace={hasAccess.data.workspace} />
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </HydrationBoundary>
  );
}

export default Layout;