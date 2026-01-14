/**
 * Notification Service Module
 * 
 * Provides database operations for notification management.
 * These are pure database operations without authentication checks,
 * designed to be used with the server helper wrappers.
 */

import { client } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

/**
 * Notification select configuration for consistent data shape
 */
const notificationSelect = {
  id: true,
  userId: true,
  content: true,
  type: true,
  isRead: true,
  createdAt: true,
  Actor: {
    select: {
      id: true,
      image: true,
      firstname: true,
      lastname: true,
    },
  },
  Video: {
    select: {
      id: true,
      title: true,
      source: true,
      workSpaceId: true,
    },
  },
  NotificationInvite: {
    select: {
      Invite: {
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          workSpaceId: true,
          accepted: true,
          isActive: true,
          WorkSpace: {
            select: {
              name: true,
            },
          },
          sender: {
            select: {
              image: true,
              firstname: true,
              lastname: true,
            },
          },
          receiver: {
            select: {
              image: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      },
    },
  },
} as const

export const NotificationService = {
  /**
   * Gets all notifications for a user with full related data
   */
  async getAllForUser(userId: string) {
    return client.user.findUnique({
      where: { clerkId: userId },
      select: {
        notification: {
          orderBy: { createdAt: 'desc' },
          select: notificationSelect,
        },
        _count: { select: { notification: true } },
      },
    })
  },

  /**
   * Gets the count of unread notifications for a user
   */
  async getUnreadCount(dbUserId: string) {
    return client.notification.count({
      where: {
        userId: dbUserId,
        isRead: false,
      },
    })
  },

  /**
   * Marks all notifications as read for a user
   */
  async markAllAsRead(dbUserId: string) {
    return client.notification.updateMany({
      where: {
        userId: dbUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })
  },

  /**
   * Marks a single notification as read
   */
  async markAsRead(notificationId: string) {
    return client.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
  },

  /**
   * Creates a new notification
   */
  async create(data: {
    userId: string
    content: string
    type: NotificationType
    actorId?: string
    videoId?: string
  }) {
    return client.notification.create({
      data: {
        userId: data.userId,
        content: data.content,
        type: data.type,
        actorId: data.actorId,
        videoId: data.videoId,
      },
    })
  },

  /**
   * Deletes a notification
   */
  async delete(notificationId: string) {
    return client.notification.delete({
      where: { id: notificationId },
    })
  },
}


