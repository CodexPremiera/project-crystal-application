/**
 * User Service Module
 * 
 * Provides database operations for user management.
 * These are pure database operations without authentication checks,
 * designed to be used with the server helper wrappers.
 */

import { client } from "@/lib/prisma"

export const UserService = {
  /**
   * Finds a user by their Clerk ID
   */
  async findByClerkId(clerkId: string) {
    return client.user.findUnique({
      where: { clerkId },
      include: {
        workspace: true,
      },
    })
  },

  /**
   * Finds a user by their email address
   */
  async findByEmail(email: string) {
    return client.user.findUnique({
      where: { email },
      include: {
        workspace: true,
      },
    })
  },

  /**
   * Gets user profile (minimal data for comments/attribution)
   */
  async getProfile(clerkId: string) {
    return client.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        image: true,
      },
    })
  },

  /**
   * Gets user subscription info
   */
  async getSubscription(clerkId: string) {
    return client.user.findUnique({
      where: { clerkId },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    })
  },

  /**
   * Gets user's first view notification preference
   */
  async getFirstViewPreference(clerkId: string) {
    return client.user.findUnique({
      where: { clerkId },
      select: { firstView: true },
    })
  },

  /**
   * Updates user's first view notification preference
   */
  async updateFirstViewPreference(clerkId: string, enabled: boolean) {
    return client.user.update({
      where: { clerkId },
      data: { firstView: enabled },
    })
  },

  /**
   * Creates a new user with all default relations
   */
  async create(data: {
    clerkId: string
    email: string
    firstname: string | null
    lastname: string | null
    image: string | null
  }) {
    return client.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        image: data.image,
        studio: { create: {} },
        subscription: { create: {} },
        workspace: {
          create: {
            name: `${data.firstname}'s Workspace`,
            type: 'PERSONAL',
          },
        },
      },
      include: {
        workspace: true,
        subscription: { select: { plan: true } },
      },
    })
  },

  /**
   * Updates user's Clerk ID (for dev/prod migration)
   */
  async updateClerkId(email: string, newClerkId: string, userData: {
    firstname: string | null
    lastname: string | null
    image: string | null
  }) {
    return client.user.update({
      where: { email },
      data: {
        clerkId: newClerkId,
        firstname: userData.firstname,
        lastname: userData.lastname,
        image: userData.image,
      },
      include: {
        workspace: true,
        subscription: { select: { plan: true } },
      },
    })
  },

  /**
   * Searches for users by name or email
   */
  async search(query: string, excludeClerkId: string, workspaceId?: string) {
    const baseSelect = {
      id: true,
      subscription: {
        select: { plan: true },
      },
      firstname: true,
      lastname: true,
      image: true,
      email: true,
    }
    
    if (workspaceId) {
      return client.user.findMany({
        where: {
          OR: [
            { firstname: { contains: query } },
            { email: { contains: query } },
            { lastname: { contains: query } },
          ],
          NOT: [{ clerkId: excludeClerkId }],
        },
        select: {
          ...baseSelect,
          receiver: {
            where: {
              workSpaceId: workspaceId,
              isActive: true,
            },
            select: {
              id: true,
            },
          },
        },
      })
    }
    
    return client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkId: excludeClerkId }],
      },
      select: baseSelect,
    })
  },

  /**
   * Gets user ID by Clerk ID
   */
  async getDbUserId(clerkId: string) {
    const user = await client.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })
    return user?.id || null
  },
}


