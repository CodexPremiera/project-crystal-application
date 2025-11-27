'use client'

import { useQueryData } from '@/hooks/useQueryData'
import { getWorkSpaces, getWorkspaceMemberCount } from '@/actions/workspace'
import { WorkSpaceProps } from '@/types/index.type'
import InviteWorkspaceModal from './invite-workspace-modal'
import { Users } from '@/components/icons/user'

/**
 * Dashboard Invite Section Component
 * 
 * A client component that displays user count and invite functionality.
 * Uses React Query to fetch workspace data and conditionally renders
 * the invite modal based on workspace type and user subscription.
 * 
 * Appearance:
 * - User count display with icon
 * - Invite button (if conditions are met)
 * - Rounded container with proper spacing
 * 
 * Special Behavior:
 * - Fetches workspace data using React Query
 * - Only shows invite functionality for PUBLIC workspaces with PRO subscription
 * - Displays current user count
 * 
 * Used in:
 * - Dashboard workspace pages
 * - Workspace management interfaces
 */

type Props = {
  workspaceId: string
}

const DashboardInviteSection = ({ workspaceId }: Props) => {
  const { data } = useQueryData(['user-workspaces'], getWorkSpaces)
  const { data: memberCountData } = useQueryData(
    ['workspace-member-count', workspaceId], 
    () => getWorkspaceMemberCount(workspaceId)
  )
  
  const { data: workspace } = data as WorkSpaceProps
  const memberCount = (memberCountData as any)?.data || 0
  
  const currentWorkspace = workspace?.workspace.find(
    item => item.id === workspaceId
  )

  // Show "only you" for PERSONAL workspaces, member count for PUBLIC workspaces
  const displayText = currentWorkspace?.type === 'PERSONAL' ? '1' : memberCount

  return (
    <div className="flex items-center bg-secondary text-secondary-foreground/80 shadow-xs rounded-full py-2 px-4 gap-3">
      <div className="flex items-center gap-2">
        <div>
          <Users size={20} />
        </div>
        <span>{displayText}</span>
      </div>
      <InviteWorkspaceModal 
        workspaceId={workspaceId}
        currentWorkspace={currentWorkspace ? {
          type: currentWorkspace.type === 'PERSONAL' ? 'PRIVATE' : currentWorkspace.type
        } : undefined}
      />
    </div>
  )
}

export default DashboardInviteSection
