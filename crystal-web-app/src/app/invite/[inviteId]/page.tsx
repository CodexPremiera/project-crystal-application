import { acceptInvite } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: Promise<{
    inviteId: string
  }>
}

/**
 * Workspace Invitation Acceptance Page
 * 
 * This page handles the workspace invitation acceptance flow when users
 * click on invitation links sent via email. It processes the invitation,
 * verifies user authorization, and adds the user to the workspace.
 * 
 * Purpose: Process workspace invitation acceptance and user onboarding
 * 
 * How it works:
 * 1. Receives inviteId from URL parameters
 * 2. Calls acceptInvite action to process the invitation
 * 3. Verifies user authorization for the invitation
 * 4. Adds user to workspace if authorized
 * 5. Redirects based on processing result
 * 
 * Invitation Processing:
 * - Valid invitation: User added to workspace, redirect to auth callback
 * - Unauthorized access: Shows "Not Authorized" error page
 * - Invalid invitation: Redirects to sign-in page
 * - Missing user: Redirects to sign-in page
 * 
 * Authorization Checks:
 * - Verifies invitation belongs to current user
 * - Checks invitation validity and status
 * - Ensures user has permission to accept invitation
 * - Prevents unauthorized workspace access
 * 
 * Features:
 * - Workspace invitation processing
 * - User authorization verification
 * - Automatic workspace membership
 * - Error handling and user feedback
 * - Integration with authentication system
 * 
 * User Experience:
 * - Click invitation link from email
 * - Automatic processing of invitation
 * - Seamless workspace access upon acceptance
 * - Clear error messages for issues
 * 
 * Integration:
 * - Connects to workspace invitation system
 * - Uses user authentication and membership actions
 * - Part of workspace collaboration features
 * - Essential for team invitation workflow
 * 
 * @param params - URL parameters containing invitation ID
 * @param params.inviteId - Unique identifier of the workspace invitation
 * @returns JSX element with invitation result or redirect
 */
const Page = async ({ params }: Props) => {
  const { inviteId } = await params
  const invite = await acceptInvite(inviteId)

  if (invite.status === 404) return redirect('/auth/sign-in')

  if (invite?.status === 401) {
    return (
      <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
        <h2 className="text-6xl font-bold text-white">Not Authorized</h2>
        <p>You are not authorized to accept this invite</p>
      </div>
    )
  }

  if (invite?.status === 200) return redirect('/auth/callback')
}

export default Page
