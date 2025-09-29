'use client'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import { useQueryData } from '@/hooks/useQueryData'
import { getVideoComments } from '@/actions/user'
import {VideoCommentProps} from "@/types/index.type";
import CommentForm from "@/components/forms/comment-form";
import CommentCard from "@/components/global/comment-card";

/**
 * Activities Component
 * 
 * Tab content for video comments and activity feed.
 * Shows comment form and list of comments for a video.
 * 
 * Appearance:
 * - Comment form at the top
 * - List of comment cards below
 * - Rounded container with proper spacing
 * - Scrollable content area
 * 
 * Special Behavior:
 * - Fetches video comments using React Query
 * - Shows loading state while fetching
 * - Displays comment form for new comments
 * - Renders comment cards with replies
 * - Handles empty state when no comments
 * 
 * Used in:
 * - Video preview pages (Activity tab)
 * - Video comment sections
 * - Activity feed displays
 */

type Props = {
  author: string
  videoId: string
}

const Activities = ({ author, videoId }: Props) => {
  const { data } = useQueryData(['video-comments'], () =>
    getVideoComments(videoId)
  )

  const { data: comments } = data as VideoCommentProps


  return (
    <TabsContent
      value="Activity"
      className="rounded-xl flex flex-col gap-y-5"
    >
      <CommentForm
        author={author}
        videoId={videoId}
      />
      {comments?.map((comment) => (
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
      ))}
    </TabsContent>
  )
}

export default Activities
