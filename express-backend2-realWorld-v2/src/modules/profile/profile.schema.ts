import {z} from 'zod'

export const GetProfileSchema = z.object({
  username: z.string().min(1).max(20),
})

export type GetProfileSchemaType = z.infer<typeof GetProfileSchema>

export const FollowSchema = z.object({
  followingId: z.number().min(1),
})

export const FollowListSchema = z.object({
  userId: z.number().min(1),
})

export type FollowSchemaType = z.infer<typeof FollowSchema>