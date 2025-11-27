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
 * and non-blocking data prefetching for all workspace-specific pages. It ensures
 * security while optimizing for fast initial render by not blocking on data loading.
 * 
 * Purpose: Provide secure workspace access with optimized loading performance
 * 
 * How it works:
 * 1. Authenticates user and retrieves user data (blocking, for security)
 * 2. Verifies user has workspaces and redirects if none exist (blocking, for security)
 * 3. Checks user access to the requested workspace (blocking, for security)
 * 4. Redirects to default workspace if access denied (blocking, for security)
 * 5. Starts non-blocking data prefetching in background
 * 6. Renders layout immediately - no waiting for data!
 * 7. Components show loading states while data loads
 * 8. Provides hydrated data to child components as it becomes available
 * 
 * Security Features:
 * - User authentication verification (blocks render for security)
 * - Workspace access control (blocks render for security)
 * - Automatic redirection for unauthorized access
 * - Workspace ownership and membership validation
 * 
 * Performance Features:
 * - Non-blocking data prefetching for instant render
 * - Progressive loading with skeleton states
 * - Hydration boundary for SSR optimization
 * - Component-level loading indicators
 * - Streaming data delivery
 * - Fast Time to First Byte (TTFB)
 * 
 * Loading Behavior:
 * - Security checks complete first (required)
 * - Layout renders immediately after security passes
 * - loading.tsx shows during initial navigation
 * - Components display their own loading states
 * - Data progressively loads in background
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
   * Optimized Data Prefetching with React Query
   * 
   * This section uses a hybrid approach to data prefetching:
   * - Critical layout data (sidebar/navigation): Awaited for immediate render
   * - Page content data (folders/videos): Non-blocking background fetch
   * 
   * Benefits:
   * 1. Fast Render: Only waits for critical sidebar/navigation data
   * 2. Progressive Loading: Content loads in background with skeleton states
   * 3. Better UX: Layout appears quickly, content streams in progressively
   * 4. No Errors: Critical components have data they need on first render
   * 
   * How it works:
   * - Waits for user-workspaces and notifications (needed by Sidebar)
   * - Starts folders and videos fetch in background (used by page content)
   * - Layout renders immediately after critical data loads
   * - Page content shows loading states while data fetches
   * 
   * Data Strategy:
   * - User workspaces (BLOCKING): Required by Sidebar for workspace list
   * - User notifications (BLOCKING): Required by Sidebar for notification count
   * - Workspace folders (NON-BLOCKING): Used by page content, can load progressively
   * - User videos (NON-BLOCKING): Used by page content, can load progressively
   */
  
  // Critical data for Sidebar - must await to prevent errors
  await query.prefetchQuery({
    queryKey:['user-workspaces'],
    queryFn: () => getWorkSpaces(),
  })
  await query.prefetchQuery({
    queryKey:['user-notifications'],
    queryFn: () => getNotifications(),
  })
  
  // Non-critical content data - fetch in background for faster render
  query.prefetchQuery({
    queryKey:['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceid),
  })
  query.prefetchQuery({
    queryKey:['user-videos'],
    queryFn: () => getAllUserVideos(workspaceid),
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