/**
 * Invite Service Module
 * 
 * Provides database operations for workspace invitation management.
 * These are pure database operations without authentication checks,
 * designed to be used with the server helper wrappers.
 */

import { client } from "@/lib/prisma"

export const InviteService = {
  /**
   * Creates a new workspace invitation
   */
  async create(senderId: string, receiverId: string, workspaceId: string) {
    return client.invite.create({
      data: {
        senderId,
        receiverId,
        workSpaceId: workspaceId,
      },
    })
  },

  /**
   * Finds an active invitation by ID
   */
  async findById(inviteId: string) {
    return client.invite.findUnique({
      where: { id: inviteId },
      include: {
        WorkSpace: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
    })
  },

  /**
   * Checks if a pending invitation exists for a user to a workspace
   */
  async findPending(receiverId: string, workspaceId: string) {
    return client.invite.findFirst({
      where: {
        receiverId,
        workSpaceId: workspaceId,
        accepted: false,
        isActive: true,
      },
    })
  },

  /**
   * Accepts an invitation
   */
  async accept(inviteId: string) {
    return client.invite.update({
      where: { id: inviteId },
      data: {
        accepted: true,
        isActive: false,
      },
    })
  },

  /**
   * Declines/deactivates an invitation
   */
  async decline(inviteId: string) {
    return client.invite.update({
      where: { id: inviteId },
      data: {
        isActive: false,
      },
    })
  },

  /**
   * Gets all pending invitations for a user
   */
  async getPendingForUser(receiverId: string) {
    return client.invite.findMany({
      where: {
        receiverId,
        accepted: false,
        isActive: true,
      },
      include: {
        WorkSpace: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
    })
  },
}


