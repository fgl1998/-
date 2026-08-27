import {z} from 'zod'
import {PaginationSchema} from '../../utils/pagination.js'

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

export const DetailArticleSchema = z.object({
  slug: z.string().trim().min(1).max(100),
})

export type detailArticleInput = z.infer<typeof DetailArticleSchema>

export const UpdateArticleSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().min(1).max(100).optional(),
  body: z.string().trim().min(1).optional(),
  tags: z.string().trim().min(1).max(100).optional(),
  articleId: z.number().int().positive(),
}).refine(
  data => Object.keys(data).length > 1,
  {
    message: '至少需要提供一个需要修改的字段'
  }
)
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>


export const ArticleDeleteByArticleIdSchema = z.object({
  articleId: z.number().int().positive(),
})

export const ArticleFavoriteSchema = z.object({
  articleId: z.number().int().positive(),
})

export const CommentsCerateSchema = z.object({
  articleId: z.number().int().positive(),
  body: z.string().trim().min(1),
})

export type CommentsCerateInput = z.infer<typeof CommentsCerateSchema>

export const CommentListSchema = z.object({
  articleId: z.number().int().positive(),
})

export const CommentDeleteSchema = z.object({
  commentId: z.number().int().positive(),
})


export const ArticleListSchema = PaginationSchema.extend({
  tag: z.string().trim().min(1).max(100).optional(),
  author: z.string().trim().min(1).max(100).optional(),
})

export type ArticleListInput = z.infer<typeof ArticleListSchema>

export type ArticleListFilter = Omit<
  ArticleListInput,
  'page' | 'pageSize'
>