'use client'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { useQueryData } from '@/hooks/useQueryData'
import { getVideoComments } from '@/actions/user'
import {VideoCommentProps} from "@/types/index.type";
import CommentForm from "@/components/forms/comment-form";
import CommentCard from "@/components/global/comment-card";

/**
 * Comments Component
 * 
 * Tab content for video comments.
 * Shows comment form and list of comments for a video.
 * 
 * Appearance:
 * - Comment form at the top
 * - List of comment cards below
 * - Empty state when no comments exist
 * - Rounded container with proper spacing
 * - Scrollable content area
 * 
 * Special Behavior:
 * - Fetches video comments using React Query
 * - Shows loading state while fetching
 * - Displays comment form for new comments
 * - Renders comment cards with replies
 * - Shows empty state with icon when no comments
 * 
 * Used in:
 * - Video preview pages (Comments tab)
 * - Video comment sections
 */

type Props = {
  author: string
  videoId: string
}

const Comments = ({ author, videoId }: Props) => {
  const { data } = useQueryData(['video-comments'], () =>
    getVideoComments(videoId)
  )

  const { data: comments } = data as VideoCommentProps
  const hasComments = comments && comments.length > 0

  return (
    <TabsContent
      value="Comments"
      className="rounded-xl flex flex-col gap-y-5"
    >
      <CommentForm
        author={author}
        videoId={videoId}
      />
      {hasComments ? (
        comments.map((comment) => (
          <CommentCard
            comment={comment.comment}
            key={comment.id}
            author={{
              image: comment.User?.image ?? '',
              firstname: comment.User?.firstname ?? 'Unknown',
              lastname: comment.User?.lastname ?? 'User',
            }}
            videoId={videoId}
            reply={comment.reply}
            commentId={comment.id}
            createdAt={comment.createdAt}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="p-4 rounded-full bg-surface-overlay text-text-disabled">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-text-tertiary text-lg font-medium">No comments yet</p>
            <p className="text-text-disabled text-sm mt-1">
              Be the first to leave a comment
            </p>
          </div>
        </div>
      )}
    </TabsContent>
  )
}

export default Comments
