'use client'

import { getNotifications } from '@/actions/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQueryData } from '@/hooks/useQueryData'
import { User, Eye, Heart, Upload, UserPlus } from 'lucide-react'
import Link from 'next/link'
// import { useParams } from 'next/navigation'
import React from 'react'

type NotificationType = 'INVITE' | 'VIDEO_VIEW' | 'VIDEO_LIKE' | 'VIDEO_UPLOAD'

type NotificationData = {
  id: string
  userId: string | null
  content: string
  type: NotificationType
  createdAt: Date | string
  Actor: {
    id: string
    image: string | null
    firstname: string | null
    lastname: string | null
  } | null
  Video: {
    id: string
    title: string | null
    source: string
    workSpaceId: string | null
  } | null
  NotificationInvite: {
    Invite: {
      senderId: string | null
      receiverId: string | null
      workSpaceId: string | null
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
}

/**
 * User Notifications Page
 * 
 * Displays all notifications in a standardized social-media-style layout.
 * Each notification shows an avatar, action description, and timestamp.
 * 
 * Notification Types:
 * - VIDEO_VIEW: "[Avatar] John Doe viewed your video 'Title'"
 * - VIDEO_LIKE: "[Avatar] Jane Smith liked your video 'Title'"
 * - VIDEO_UPLOAD: "[Avatar] Mike Johnson uploaded 'Title'"
 * - INVITE: "[Avatar] Sarah Lee invited you to workspace"
 * 
 * Features:
 * - Social-media-style layout with avatars
 * - Type-specific icons for visual identification
 * - Clickable video notifications linking to the video
 * - Relative timestamps (Today, 1d ago, etc.)
 * - Empty state handling
 */
const Notifications = () => {
  // const params = useParams()
  // const workspaceId = params.workspaceid as string
  
  const { data: notifications } = useQueryData(
    ['user-notifications'],
    getNotifications
  )

  const { data: notification, status } = notifications as {
    status: number
    data: {
      notification: NotificationData[]
    }
  }

  if (status !== 200 || !notification?.notification?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full gap-4">
        <div className="rounded-full bg-surface-secondary p-6">
          <User className="h-8 w-8 text-text-muted" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-text-primary">No notifications yet</h3>
          <p className="text-text-muted text-sm mt-1">
            When someone views, likes, or shares your videos, you&#39;ll see it here.
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date | string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffWeeks < 4) return `${diffWeeks}w ago`
    return notifDate.toLocaleDateString()
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'VIDEO_VIEW':
        return <Eye className="h-3.5 w-3.5" />
      case 'VIDEO_LIKE':
        return <Heart className="h-3.5 w-3.5 text-red-400" />
      case 'VIDEO_UPLOAD':
        return <Upload className="h-3.5 w-3.5" />
      case 'INVITE':
        return <UserPlus className="h-3.5 w-3.5" />
      default:
        return null
    }
  }

  const getActorInfo = (n: NotificationData) => {
    if (n.type === 'INVITE' && n.NotificationInvite?.Invite) {
      const invite = n.NotificationInvite.Invite
      if (n.userId === invite.senderId) {
        return invite.receiver
      }
      return invite.sender
    }
    return n.Actor
  }

  const getVideoLink = (n: NotificationData) => {
    if (n.Video?.workSpaceId && n.Video?.id) {
      return `/dashboard/${n.Video.workSpaceId}/video/${n.Video.id}`
    }
    return null
  }

  return (
    <div className="flex flex-col gap-2 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      
      <div className="flex flex-col gap-1">
        {notification.notification.map((n) => {
          const actor = getActorInfo(n)
          const actorName = actor 
            ? [actor.firstname, actor.lastname].filter(Boolean).join(' ') || 'Someone'
            : 'Someone'
          const videoLink = getVideoLink(n)
          const icon = getNotificationIcon(n.type)
          
          const NotificationContent = (
            <div
              className={`
                flex gap-3 items-start p-4 rounded-xl transition-colors
                bg-surface-secondary/50 hover:bg-surface-secondary
                ${videoLink ? 'cursor-pointer' : ''}
              `}
            >
              <div className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-background">
                  {actor?.image ? (
                    <AvatarImage src={actor.image} alt={actorName} />
                  ) : null}
                  <AvatarFallback className="bg-brand/10 text-brand">
                    {actorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {icon && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-surface-primary p-1 ring-2 ring-background">
                    {icon}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-text-primary leading-relaxed">
                  <span className="font-semibold">{actorName}</span>
                  {' '}
                  <span className="text-text-secondary">
                    {n.type === 'VIDEO_VIEW' && 'viewed your video'}
                    {n.type === 'VIDEO_LIKE' && 'liked your video'}
                    {n.type === 'VIDEO_UPLOAD' && 'uploaded a new video'}
                    {n.type === 'INVITE' && 'invited you to a workspace'}
                  </span>
                  {n.Video?.title && (
                    <>
                      {' '}
                      <span className="font-medium text-text-primary">
                        &#34;{n.Video.title}&#34;
                      </span>
                    </>
                  )}
                </p>
                <p className="text-text-muted text-sm mt-1">
                  {formatDate(n.createdAt)}
                </p>
              </div>
            </div>
          )
          
          if (videoLink) {
            return (
              <Link key={n.id} href={videoLink}>
                {NotificationContent}
              </Link>
            )
          }
          
          return <div key={n.id}>{NotificationContent}</div>
        })}
      </div>
    </div>
  )
}

export default Notifications
