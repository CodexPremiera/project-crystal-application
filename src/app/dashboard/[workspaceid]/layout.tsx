import React from 'react'
import { onAuthenticateUser } from '@/actions/user'
import { verifyAccessToWorkspace } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import {
  QueryClient,
} from '@tanstack/react-query'

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
  params: { workspaceId: string } // Workspace ID from the URL parameter
  children: React.ReactNode // Child components to render
}

const Layout = async ({ params: { workspaceId }, children }: Props) => {
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
  
  // Step 6: User has access - render the workspace layout with children
  return <div>{children}</div>
}

export default Layout;