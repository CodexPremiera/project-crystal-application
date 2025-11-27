'use client'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import React from 'react'
import FormGenerator from "@/components/forms/form-generator";
import Loader from "@/components/global/loader/loader";
import {useVideoComment} from "@/hooks/useVideo";
import { FieldValues, UseFormRegister } from 'react-hook-form'

type Props = {
  videoId: string
  commentId?: string
  author: string
  close?: () => void
}

/**
 * Comment Form Component
 * 
 * This component provides a form interface for creating comments and replies
 * on videos. It supports both top-level comments and nested replies, with
 * appropriate placeholder text and submission handling.
 * 
 * Purpose: Enable users to comment on videos and reply to existing comments
 * 
 * How it works:
 * 1. Uses useVideoComment hook for form management and submission
 * 2. Integrates with FormGenerator for consistent input styling
 * 3. Provides contextual placeholder text based on comment type
 * 4. Handles both comment creation and reply functionality
 * 5. Shows loading states during comment submission
 * 
 * Comment Types:
 * - Top-level comments: When commentId is undefined
 * - Replies: When commentId is provided (reply to existing comment)
 * 
 * Features:
 * - Dynamic placeholder text based on comment type
 * - Form validation and error handling
 * - Loading states with send button animation
 * - Integration with comment submission system
 * - Consistent styling with application theme
 * 
 * Integration:
 * - Used by video preview and comment display components
 * - Connects to video commenting system
 * - Integrates with form validation and submission
 * - Part of video interaction and engagement features
 * 
 * @param videoId - ID of the video being commented on
 * @param commentId - Optional ID of parent comment for replies
 * @param author - Name of the comment author for placeholder text
 * @param close - Optional callback function for form closure
 * @returns JSX element with comment creation form
 */
const CommentForm = ({ author, videoId, commentId }: Props) => {
  const { errors, isPending, onFormSubmit, register } = useVideoComment(
    videoId,
    commentId
  )

  return (
    <form
      className="relative w-full"
      onSubmit={onFormSubmit}
    >
      <FormGenerator
        register={register as unknown as UseFormRegister<FieldValues>}
        errors={errors}
        placeholder={`Respond to ${author}...`}
        name="comment"
        inputType="input"
        lines={8}
        type="text"
      />
      <Button
        className="p-0 bg-transparent absolute top-[1px] right-3 hover:bg-transparent "
        type="submit"
      >
        <Loader state={isPending}>
          <Send
            className="text-white/50 cursor-pointer hover:text-white/80"
            size={18}
          />
        </Loader>
      </Button>
    </form>
  )
}

export default CommentForm
