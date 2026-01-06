/**
 * Video Service Module
 * 
 * Provides database operations for video management.
 * These are pure database operations without authentication checks,
 * designed to be used with the server helper wrappers.
 */

import { client } from "@/lib/prisma"

const videoSelectBase = {
  id: true,
  title: true,
  createdAt: true,
  source: true,
  processing: true,
  Folder: {
    select: {
      id: true,
      name: true,
    },
  },
  User: {
    select: {
      firstname: true,
      lastname: true,
      image: true,
    },
  },
} as const

const videoSelectFull = {
  id: true,
  title: true,
  description: true,
  source: true,
  views: true,
  likes: true,
  processing: true,
  summary: true,
  transcriptSegments: true,
  createdAt: true,
  User: {
    select: {
      firstname: true,
      lastname: true,
      image: true,
      clerkId: true,
      trial: true,
      subscription: {
        select: { plan: true },
      },
    },
  },
} as const

export const VideoService = {
  /**
   * Gets unfiled videos in a workspace (not in any folder)
   */
  async getUnfiledInWorkspace(workspaceId: string) {
    return client.video.findMany({
      where: {
        workSpaceId: workspaceId,
        folderId: null,
      },
      select: videoSelectBase,
      orderBy: { createdAt: 'asc' },
    })
  },

  /**
   * Gets all videos in a folder
   */
  async getInFolder(folderId: string) {
    return client.video.findMany({
      where: { folderId },
      select: videoSelectBase,
      orderBy: { createdAt: 'asc' },
    })
  },

  /**
   * Gets video preview data with full details
   */
  async getPreview(videoId: string) {
    return client.video.findUnique({
      where: { id: videoId },
      select: videoSelectFull,
    })
  },

  /**
   * Gets video with workspace info for permission checking
   */
  async getWithWorkspace(videoId: string) {
    return client.video.findUnique({
      where: { id: videoId },
      select: {
        id: true,
        workSpaceId: true,
        User: {
          select: { clerkId: true },
        },
      },
    })
  },

  /**
   * Updates video title
   */
  async updateTitle(videoId: string, title: string) {
    return client.video.update({
      where: { id: videoId },
      data: { title },
    })
  },

  /**
   * Updates video description
   */
  async updateDescription(videoId: string, description: string) {
    return client.video.update({
      where: { id: videoId },
      data: { description },
    })
  },

  /**
   * Updates video title and description
   */
  async updateTitleAndDescription(videoId: string, title: string, description: string) {
    return client.video.update({
      where: { id: videoId },
      data: { title, description },
    })
  },

  /**
   * Moves video to a different workspace/folder
   */
  async moveToLocation(videoId: string, workspaceId: string, folderId?: string) {
    return client.video.update({
      where: { id: videoId },
      data: {
        workSpaceId: workspaceId,
        folderId: folderId || null,
      },
    })
  },

  /**
   * Increments video view count
   */
  async incrementViews(videoId: string) {
    return client.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    })
  },

  /**
   * Toggles video like (increments or decrements)
   */
  async toggleLike(videoId: string, increment: boolean) {
    return client.video.update({
      where: { id: videoId },
      data: { likes: increment ? { increment: 1 } : { decrement: 1 } },
    })
  },

  /**
   * Deletes a video
   */
  async delete(videoId: string) {
    return client.video.delete({
      where: { id: videoId },
    })
  },
}

