import { tool } from 'langchain'
import { z } from 'zod'

import type { RealWorldClient } from '../../../clients/realworld.client.js'

const SearchArticlesInputSchema = z.object({
  keyword: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .describe('文章搜索关键词，用于匹配文章内容'),

  page: z
    .number()
    .int()
    .min(1)
    .default(1)
    .describe('页码，从1开始'),

  pageSize: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(10)
    .describe('每页文章数量，最多20条'),
})

const AuthorSchema = z
  .object({
    username: z.string(),

    bio: z
      .string()
      .nullable()
      .optional(),

    image: z
      .string()
      .nullable()
      .optional(),
  })
  .passthrough()

const TagSchema = z
  .object({
    tag_name: z.string(),
    article_id: z.number().int(),
    tag_id: z.number().int(),

  })
  .passthrough()

const ArticleSchema = z.object({
  id: z.number().int().positive(),

  title: z.string(),

  description: z.string(),

  body: z.string(),

  slug: z.string(),

  author: AuthorSchema,

  tags: z.array(TagSchema),

  favorited: z.number(),

  favoritesCount: z
    .number()
    .int()
    .nonnegative(),

  createdAt: z.string(),

  updatedAt: z.string(),
})

const ArticlePageSchema = z.object({
  items: z.array(ArticleSchema),

  total: z
    .number()
    .int()
    .nonnegative(),

  page: z
    .number()
    .int()
    .min(1),

  pageSize: z
    .number()
    .int()
    .min(1),

  totalPages: z
    .number()
    .int()
    .nonnegative(),
})

const ArticleListResponseSchema = z.union([
  ArticlePageSchema,

  z
    .object({
      data: ArticlePageSchema,
    })
    .transform((response) => response.data),
])

export interface CreateSearchArticlesToolOptions {
  realWorldClient: RealWorldClient
  token: string
}

// 为什么 Tool 是工厂函数
// 我们没有直接导出：
// export const searchArticlesTool = tool(...)
// 原因是不同 HTTP 请求对应不同用户：每次 Agent 请求都创建当前用户专属的一组 Tool，避免串 Token。
export function createSearchArticlesTool(
  options: CreateSearchArticlesToolOptions,
) {
  const { realWorldClient, token } = options

  return tool(
    async ({ keyword, page, pageSize }) => {
      const response = await realWorldClient.request({
        path: '/api/articles/list',
        method: 'POST',
        token,

        body: {
          page,
          pageSize,

          // Agent内部使用keyword，
          // RealWorld接口使用keyWord。
          keyWord: keyword,
        },
      })

      const articlePage =
        ArticleListResponseSchema.parse(response.data)
        
      const result = {
        items: articlePage.items.map((article) => {
          return {
            id: article.id,
            slug: article.slug,
            title: article.title,
            description: article.description,

            author: {
              username: article.author.username,
            },

            tags: article.tags.map((tag) => tag.name),

            favorited: article.favorited === 1,
            favoritesCount: article.favoritesCount,

            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
          }
        }),

        pagination: {
          total: articlePage.total,
          page: articlePage.page,
          pageSize: articlePage.pageSize,
          totalPages: articlePage.totalPages,
        },
      }

      console.log(result,'result');
      

      return JSON.stringify(result)
    },
    {
      name: 'search_articles',

      description:
        '搜索或分页查询RealWorld文章。用户询问文章列表、查找包含某个关键词的文章、最近有哪些文章时使用。该工具只返回文章摘要，不返回文章正文。',

      schema: SearchArticlesInputSchema,
    },
  ) 
}