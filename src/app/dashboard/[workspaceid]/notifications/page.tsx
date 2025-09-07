'use client'

import { getNotifications } from '@/actions/user'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

  return (
    <div className="flex flex-col">
      {notification.notification.map((n) => (
        <div
          key={n.id}
          className="border-2 flex gap-x-3 items-center rounded-lg p-3"
        >
          <Avatar>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{n.content}</p>
        </div>
      ))}
    </div>
  )
}

export default Notifications
