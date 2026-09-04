import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20)
})

export interface PaginationQuery {
  limit: number
  offset: number
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function getPagination(
  page: number,
  pageSize: number
): PaginationQuery {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize
  }
}

export function createPageResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PageResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}