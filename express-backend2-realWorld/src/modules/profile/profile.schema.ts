import {z} from 'zod'

const GetProfileSchema = z.object({
  username: z.string().min(1).max(20),
  currentUserId: z.number().min(1)
})

export type GetProfileSchemaType = z.infer<typeof GetProfileSchema>