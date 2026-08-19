import {z} from 'zod'

export const CreateArticleSchema = z.object({
  // authorId: z.number(),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(100),
  body: z.string().trim().min(1),
  tags: z.string().trim().min(1).max(100),
  // slug: z.string().trim().min(1).max(100),
})

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>

export type CreateArticleData = {
    authorId: number;
    title: string;
    description: string;
    body: string;
    slug: string;
    tags: string;
}

export const DeleteArticleSchema= z.object({
  slug: z.string().trim().min(1).max(100),
})
export type DeleteArticleInput = z.infer<typeof DeleteArticleSchema>

export const GetArticleByIdSchema = z.object({
  id: z.number().int().positive(),
})