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
import { getNotifications, acceptInvite, declineInvite, cancelInvite } from '@/actions/user'
import Link from 'next/link'

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
      id: string
      senderId: string | null
      receiverId: string | null
      workSpaceId: string | null
      accepted: boolean
      isActive: boolean
      WorkSpace: {
        name: string
      } | null
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
  
  const { data: notifications } = useQueryData(
    ['user-notifications'],
    getNotifications
  )

  const { mutate: handleAccept, isPending: isAccepting } = useMutationData(
    ['accept-invite'],
    (inviteId: string) => acceptInvite(inviteId),
    'user-notifications'
  )

  const { mutate: handleDecline, isPending: isDeclining } = useMutationData(
    ['decline-invite'],
    (inviteId: string) => declineInvite(inviteId),
    'user-notifications'
  )

  const { mutate: handleCancel, isPending: isCancelling } = useMutationData(
    ['cancel-invite'],
    (inviteId: string) => cancelInvite(inviteId),
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
  const notificationCount = notificationList.length

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
      // If current user is the sender, show receiver's avatar
      if (n.userId === invite.senderId) {
        return invite.receiver
      }
      // If current user is the receiver, show sender's avatar
      return invite.sender
    }
    return n.Actor
  }

  const isInviteSender = (n: NotificationData) => {
    if (n.type === 'INVITE' && n.NotificationInvite?.Invite) {
      return n.userId === n.NotificationInvite.Invite.senderId
    }
    return false
  }

  const isActiveInvite = (n: NotificationData) => {
    if (n.type === 'INVITE' && n.NotificationInvite?.Invite) {
      return n.NotificationInvite.Invite.isActive && !n.NotificationInvite.Invite.accepted
    }
    return false
  }

  const getInviteId = (n: NotificationData) => {
    return n.NotificationInvite?.Invite?.id || null
  }

  const getInviteStatus = (n: NotificationData) => {
    if (n.type === 'INVITE' && n.NotificationInvite?.Invite) {
      const invite = n.NotificationInvite.Invite
      if (invite.accepted) return 'accepted'
      if (!invite.isActive) return 'inactive'
      return 'pending'
    }
    return null
  }

  const getWorkspaceName = (n: NotificationData) => {
    if (n.type === 'INVITE' && n.NotificationInvite?.Invite?.WorkSpace) {
      return n.NotificationInvite.Invite.WorkSpace.name
    }
    return 'a workspace'
  }

  const getVideoLink = (n: NotificationData) => {
    if (n.Video?.workSpaceId && n.Video?.id) {
      return `/dashboard/${n.Video.workSpaceId}/video/${n.Video.id}`
    }
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex items-center justify-center rounded-full h-10 w-10 p-0 cursor-pointer hover:bg-surface-secondary/50 transition-colors"
        >
          <Bell width={24} height={24} />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
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
                const isSender = isInviteSender(n)
                const workspaceName = getWorkspaceName(n)
                const inviteId = getInviteId(n)
                const inviteStatus = getInviteStatus(n)
                const showInviteActions = isActiveInvite(n)
                
                const NotificationContent = (
                  <div
                    className="flex gap-3 items-start px-4 py-3 transition-colors hover:bg-surface-secondary/80"
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
                        {n.type === 'INVITE' && isSender ? (
                          <>
                            <span className="text-text-secondary">You invited </span>
                            <span className="font-semibold">{actorName}</span>
                            <span className="text-text-secondary"> to join </span>
                            <span className="font-medium">{workspaceName}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">{actorName}</span>
                            {' '}
                            <span className="text-text-secondary">
                              {n.type === 'VIDEO_VIEW' && 'viewed your video'}
                              {n.type === 'VIDEO_LIKE' && 'liked your video'}
                              {n.type === 'VIDEO_UPLOAD' && 'uploaded a new video'}
                              {n.type === 'INVITE' && `invites you to join `}
                            </span>
                            {n.type === 'INVITE' && (
                              <span className="font-medium">{workspaceName}</span>
                            )}
                            {n.Video?.title && (
                              <>
                                {' '}
                                <span className="font-medium">
                                  &quot;{n.Video.title}&quot;
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {formatDate(n.createdAt)}
                        {n.type === 'INVITE' && inviteStatus === 'accepted' && (
                          <span className="ml-2 text-green-500">• Accepted</span>
                        )}
                        {n.type === 'INVITE' && inviteStatus === 'inactive' && !n.NotificationInvite?.Invite?.accepted && (
                          <span className="ml-2 text-text-muted">• {isSender ? 'Cancelled' : 'Declined'}</span>
                        )}
                      </p>
                      
                      {/* Invite action buttons */}
                      {showInviteActions && inviteId && (
                        <div className="flex gap-2 mt-2">
                          {isSender ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleCancel(inviteId)
                              }}
                              disabled={isCancelling}
                            >
                              {isCancelling ? 'Cancelling...' : 'Cancel Invite'}
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-brand hover:bg-brand/90"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleAccept(inviteId)
                                }}
                                disabled={isAccepting || isDeclining}
                              >
                                {isAccepting ? 'Accepting...' : 'Accept'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDecline(inviteId)
                                }}
                                disabled={isAccepting || isDeclining}
                              >
                                {isDeclining ? 'Declining...' : 'Decline'}
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
                
                if (videoLink) {
                  return (
                    <Link 
                      key={n.id} 
                      href={videoLink}
                      onClick={() => setOpen(false)}
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

