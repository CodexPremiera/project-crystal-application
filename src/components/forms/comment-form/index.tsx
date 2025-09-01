'use client'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import React from 'react'
import FormGenerator from "@/components/forms/form-generator";
import Loader from "@/components/global/loader/loader";
import {useVideoComment} from "@/hooks/useVideo";

type Props = {
  videoId: string
  commentId?: string
  author: string
  close?: () => void
}

const CommentForm = ({ author, videoId, close, commentId }: Props) => {
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
        register={register}
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
