/**
 * Comment Service Module
 * 
 * Provides database operations for comment management.
 * These are pure database operations without authentication checks,
 * designed to be used with the server helper wrappers.
 */

import { client } from "@/lib/prisma"

export const CommentService = {
  /**
   * Gets all comments for a video with replies
   */
  async getForVideo(videoId: string) {
    return client.comment.findMany({
      where: {
        OR: [{ videoId }, { commentId: videoId }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })
  },

  /**
   * Creates a new top-level comment on a video
   */
  async createOnVideo(videoId: string, userId: string, comment: string) {
    return client.video.update({
      where: { id: videoId },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    })
  },

  /**
   * Creates a reply to an existing comment
   */
  async createReply(commentId: string, videoId: string, userId: string, comment: string) {
    return client.comment.update({
      where: { id: commentId },
      data: {
        reply: {
          create: {
            comment,
            userId,
            videoId,
          },
        },
      },
    })
  },

  /**
   * Deletes a comment
   */
  async delete(commentId: string) {
    return client.comment.delete({
      where: { id: commentId },
    })
  },
}


