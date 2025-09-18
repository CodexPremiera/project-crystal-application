import { z } from 'zod'
export const editVideoInfoSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Video title must have at least 5 characters' }),
  description: z.string().min(100, {
    message: 'Video description must have at least 100 characters',
  }),
})
