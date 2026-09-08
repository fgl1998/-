import { tool } from 'langchain'
import { z } from 'zod'

import type { RealWorldClient } from '../../../clients/realworld.client.js'

const ToolInputSchema = z.object({
  slug: z.string(),
})
export interface SecureToolContext {
  token: string
  currentUserId: number
}
const ArticleDetailSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  body: z.string(),
  author_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  author_username: z.string(),
  author_bio: z.string().nullable(),
  author_image: z.string().nullable(),
  following: z.number(),
  favorited: z.number(),
  favorites_count: z.number(),
  tags: z.array(z.object({
    tag_id: z.number(),
    tag_name: z.string(),
    article_id: z.number(),
  })),
})

const GetArticleDetailToolResponssSchema = z.union([
  ArticleDetailSchema,

  z
    .object({
      data: ArticleDetailSchema,
    })
    .transform((response) => response.data),
])

export interface CreateGetArticleDetailTool extends SecureToolContext {
  realWorldClient: RealWorldClient
}
export function createGetArticleDetailTool(
  options: CreateGetArticleDetailTool
) { 
  const { realWorldClient, token,currentUserId } = options
  
  return tool(
    async ({slug})=>{
      const response = await realWorldClient.request({
        path: '/api/articles/detail',
        method: 'POST',
        token,
        body: {
          slug,
          currentUserId
        }
      })
      const detail = GetArticleDetailToolResponssSchema.parse(response)
      return JSON.stringify(detail)
    },
    {
      name: 'get-article-detail',
      schema: ToolInputSchema,
      description: `
        获取一篇已经确定的文章的完整内容。

        只有在已经通过其他工具获得准确 slug 后使用。
        适合读取标题、简介、正文、标签和文章统计信息。
        不要使用该工具搜索文章，也不要猜测 slug。
        `.trim()
    }
  )
}