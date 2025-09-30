'use client'

import { useQueryData } from '@/hooks/useQueryData'
import { getWorkSpaces } from '@/actions/workspace'
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
  userCount: number
}

const DashboardInviteSection = ({ workspaceId, userCount }: Props) => {
  const { data } = useQueryData(['user-workspaces'], getWorkSpaces)
  const { data: workspace } = data as WorkSpaceProps
  
  const currentWorkspace = workspace?.workspace.find(
    item => item.id === workspaceId
  )

  return (
    <div className="flex items-center bg-secondary text-secondary-foreground/80 shadow-xs rounded-full py-2 px-4 gap-3">
      <div className="flex items-center gap-2">
        <div>
          <Users size={20} />
        </div>
        <span>10</span>
      </div>
      <InviteWorkspaceModal 
        workspaceId={workspaceId}
        currentWorkspace={currentWorkspace}
      />
    </div>
  )
}

export default DashboardInviteSection
