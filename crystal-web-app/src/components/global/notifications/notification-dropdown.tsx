'use client'

import React from 'react'
import { Eye, Heart, Upload, UserPlus } from 'lucide-react'
import {Bell} from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQueryData } from '@/hooks/useQueryData'
import { useMutationData } from '@/hooks/useMutationData'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/user'
import Link from 'next/link'

type NotificationType = 'INVITE' | 'VIDEO_VIEW' | 'VIDEO_LIKE' | 'VIDEO_UPLOAD'

type NotificationData = {
  id: string
  userId: string | null
  content: string
  type: NotificationType
  isRead: boolean
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
 * NotificationDropdown Component
 * 
 * YouTube-style notification dropdown that appears in the header.
 * Shows a bell icon with unread count badge, and opens a popover
 * with the notification list on click.
 * 
 * Features:
 * - Bell icon with unread count badge (purple)
 * - Popover with scrollable notification list
 * - Hover highlight effect on notification cards
 * - Purple dot indicator for unread notifications
 * - Click to mark notification as read
 * - Mark all as read button
 */
export function NotificationDropdown() {
  const [open, setOpen] = React.useState(false)
  
  const { data: notifications, refetch } = useQueryData(
    ['user-notifications'],
    getNotifications
  )

  const { mutate: markAsRead } = useMutationData(
    ['mark-notification-read'],
    async (notificationId: string) => await markNotificationAsRead(notificationId),
    'user-notifications'
  )

  const { mutate: markAllAsRead } = useMutationData(
    ['mark-all-notifications-read'],
    async () => await markAllNotificationsAsRead(),
    'user-notifications'
  )

  const { data: notificationData, status } = notifications as {
    status: number
    data: {
      notification: NotificationData[]
      _count: { notification: number }
    }
  } || { status: 404, data: { notification: [], _count: { notification: 0 } } }

  const notificationList = notificationData?.notification || []
  const unreadCount = notificationList.filter(n => !n.isRead).length

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
        return <Eye className="h-3 w-3" />
      case 'VIDEO_LIKE':
        return <Heart className="h-3 w-3 text-red-400" />
      case 'VIDEO_UPLOAD':
        return <Upload className="h-3 w-3" />
      case 'INVITE':
        return <UserPlus className="h-3 w-3" />
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

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex items-center justify-center rounded-full h-10 w-10 p-0"
        >
          <Bell width={24} height={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[480px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-brand hover:text-brand"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {status !== 200 || notificationList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-16 w-16 text-text-muted mb-3" />
              <p className="text-text-muted text-sm text-center">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notificationList.map((n) => {
                const actor = getActorInfo(n)
                const actorName = actor 
                  ? [actor.firstname, actor.lastname].filter(Boolean).join(' ') || 'Someone'
                  : 'Someone'
                const videoLink = getVideoLink(n)
                const icon = getNotificationIcon(n.type)
                
                const NotificationContent = (
                  <div
                    className={`
                      flex gap-3 items-start px-4 py-3 transition-colors cursor-pointer
                      hover:bg-surface-secondary/80
                      ${!n.isRead ? 'bg-brand/5' : ''}
                    `}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        {actor?.image ? (
                          <AvatarImage src={actor.image} alt={actorName} />
                        ) : null}
                        <AvatarFallback className="bg-brand/10 text-brand text-sm">
                          {actorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {icon && (
                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-surface-primary p-1 ring-1 ring-background">
                          {icon}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary leading-snug">
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
                            <span className="font-medium">
                              &quot;{n.Video.title}&quot;
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                    
                    {!n.isRead && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="h-2 w-2 rounded-full bg-brand" />
                      </div>
                    )}
                  </div>
                )
                
                if (videoLink) {
                  return (
                    <Link 
                      key={n.id} 
                      href={videoLink}
                      onClick={() => {
                        handleNotificationClick(n)
                        setOpen(false)
                      }}
                    >
                      {NotificationContent}
                    </Link>
                  )
                }
                
                return <div key={n.id}>{NotificationContent}</div>
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

