'use client'

import { getNotifications } from '@/actions/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQueryData } from '@/hooks/useQueryData'
import { User } from 'lucide-react'
import React from 'react'

/**
 * User Notifications Page
 * 
 * This page displays all notifications for the current user, including
 * workspace invitations, video view notifications, and other system
 * alerts. It provides a centralized location for users to view and
 * manage their notification history.
 * 
 * Purpose: Display and manage user notifications in a centralized interface
 * 
 * How it works:
 * 1. Uses useQueryData hook to fetch user notifications
 * 2. Displays notifications in a list format with avatars
 * 3. Shows notification content and metadata
 * 4. Handles empty state when no notifications exist
 * 5. Provides real-time notification updates
 * 
 * Notification Types:
 * - Workspace invitations from other users
 * - Video first-view notifications
 * - System alerts and updates
 * - Collaboration notifications
 * 
 * Features:
 * - Real-time notification fetching
 * - User avatar display for each notification
 * - Notification content and context
 * - Empty state handling
 * - Responsive notification list
 * 
 * User Experience:
 * - Centralized notification management
 * - Clear notification content display
 * - Easy-to-scan notification list
 * - Visual indicators with avatars
 * 
 * Integration:
 * - Connects to user notification system
 * - Uses React Query for data fetching
 * - Integrates with user profile system
 * - Part of user communication features
 * 
 * @returns JSX element with user notifications interface
 */
const Notifications = () => {
  const { data: notifications } = useQueryData(
    ['user-notifications'],
    getNotifications
  )

  const { data: notification, status } = notifications as {
    status: number
    data: {
      notification: {
        id: string
        userId: string | null
        content: string
        createdAt: Date | string
        NotificationInvite: {
          Invite: {
            senderId: string | null
            receiverId: string | null
            sender: {
              image: string | null
              firstname: string | null
              lastname: string | null
            } | null
            receiver: {
              image: string | null
              firstname: string | null
              lastname: string | null
            } | null
          } | null
        } | null
      }[]
    }
  }

  if (status !== 200) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>No Notification</p>
      </div>
    )
  }

  const formatDate = (date: Date | string) => {
    const daysAgo = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (24 * 60 * 60 * 1000)
    )
    return daysAgo === 0 ? 'Today' : `${daysAgo}d ago`
  }

  return (
    <div className="flex flex-col gap-y-3">
      {notification.notification.map((n) => {
        const isWorkspaceInvite = n.NotificationInvite !== null
        const invite = n.NotificationInvite?.Invite
        
        let avatarUser = null
        if (isWorkspaceInvite && invite && n.userId) {
          if (n.userId === invite.senderId) {
            avatarUser = invite.receiver
          } else if (n.userId === invite.receiverId) {
            avatarUser = invite.sender
          }
        }

        return (
          <div
            key={n.id}
            className="border-2 flex gap-x-3 items-center rounded-lg p-3"
          >
            <Avatar>
              {isWorkspaceInvite && avatarUser?.image ? (
                <AvatarImage src={avatarUser?.image} />
              ) : null}
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1">
              <p>{n.content}</p>
              <p className="text-[#6d6b6b] text-sm">{formatDate(n.createdAt)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Notifications
