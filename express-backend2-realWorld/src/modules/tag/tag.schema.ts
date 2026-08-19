import {z} from 'zod'

export const CreateTagSchema = z.object({
  name: z.string().trim().min(1).max(20)
})
export type CreateTagInput = z.infer<typeof CreateTagSchema>