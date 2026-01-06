/**
 * Workspace Service Module
 * 
 * Provides database operations for workspace management.
 * These are pure database operations without authentication checks,
 * designed to be used with the server helper wrappers.
 */

import { client } from "@/lib/prisma"

export const WorkspaceService = {
  /**
   * Verifies if a user has access to a workspace (owner or member)
   */
  async verifyAccess(workspaceId: string, clerkId: string) {
    return client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          { User: { clerkId } },
          { members: { every: { User: { clerkId } } } },
        ],
      },
    })
  },

  /**
   * Gets all workspaces for a user (owned + member of)
   */
  async getAllForUser(clerkId: string) {
    return client.user.findUnique({
      where: { clerkId },
      select: {
        subscription: { select: { plan: true } },
        workspace: { select: { id: true, name: true, type: true } },
        members: {
          select: {
            WorkSpace: { select: { id: true, name: true, type: true } },
          },
        },
      },
    })
  },

  /**
   * Gets folders for a workspace with video count
   */
  async getFolders(workspaceId: string) {
    return client.folder.findMany({
      where: { workSpaceId: workspaceId },
      include: {
        _count: { select: { videos: true } },
      },
    })
  },

  /**
   * Gets folder information by ID
   */
  async getFolderInfo(folderId: string) {
    return client.folder.findUnique({
      where: { id: folderId },
      select: {
        name: true,
        createdAt: true,
        _count: { select: { videos: true } },
      },
    })
  },

  /**
   * Creates a new folder in a workspace
   */
  async createFolder(workspaceId: string, name: string) {
    return client.folder.create({
      data: {
        name,
        workSpaceId: workspaceId,
      },
    })
  },

  /**
   * Renames a folder
   */
  async renameFolder(folderId: string, name: string) {
    return client.folder.update({
      where: { id: folderId },
      data: { name },
    })
  },

  /**
   * Deletes a folder
   */
  async deleteFolder(folderId: string) {
    return client.folder.delete({
      where: { id: folderId },
    })
  },

  /**
   * Creates a new workspace
   */
  async create(userId: string, name: string) {
    return client.workSpace.create({
      data: {
        name,
        type: 'PUBLIC',
        User: { connect: { id: userId } },
      },
    })
  },

  /**
   * Updates workspace name
   */
  async updateName(workspaceId: string, name: string) {
    return client.workSpace.update({
      where: { id: workspaceId },
      data: { name },
    })
  },

  /**
   * Deletes a workspace
   */
  async delete(workspaceId: string) {
    return client.workSpace.delete({
      where: { id: workspaceId },
    })
  },

  /**
   * Gets member count for a workspace
   */
  async getMemberCount(workspaceId: string) {
    const workspace = await client.workSpace.findUnique({
      where: { id: workspaceId },
      select: {
        _count: { select: { members: true } },
      },
    })
    return (workspace?._count.members || 0) + 1 // +1 for owner
  },

  /**
   * Gets all members of a workspace
   */
  async getMembers(workspaceId: string) {
    return client.member.findMany({
      where: { workSpaceId: workspaceId },
      include: {
        User: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            image: true,
          },
        },
      },
    })
  },

  /**
   * Adds a member to a workspace
   */
  async addMember(workspaceId: string, userId: string) {
    return client.member.create({
      data: {
        workSpaceId: workspaceId,
        userId,
      },
    })
  },

  /**
   * Removes a member from a workspace
   */
  async removeMember(workspaceId: string, userId: string) {
    return client.member.deleteMany({
      where: {
        workSpaceId: workspaceId,
        userId,
      },
    })
  },
}

