import type { RequestHandler } from 'express'
import { z } from 'zod'
import { userService } from '../services/user.service.js'
import { AppError } from '../utils/app-error.js'

const createUserSchema = z.object({
  name: z.string().trim().min(2, '用户名至少需要2个字符'),
  email: z.string().email('邮箱格式不正确')
})

export const getUserList: RequestHandler = (_req, res) => {
  const users = userService.findAll()

  res.json({
    code: 0,
    message: '查询成功',
    data: users
  })
}

export const getUserById: RequestHandler = (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, '用户ID不正确')
  }

  const user = userService.findById(id)

  if (!user) {
    throw new AppError(404, '用户不存在')
  }

  res.json({
    code: 0,
    message: '查询成功',
    data: user
  })
}

export const createUser: RequestHandler = (req, res) => {
  const result = createUserSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      code: 400,
      message: '参数校验失败',
      errors: result.error.issues
    })
    return
  }

  const user = userService.create(result.data)

  res.status(201).json({
    code: 0,
    message: '创建成功',
    data: user
  })
}

export const deleteUser: RequestHandler = (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, '用户ID不正确')
  }

  const removed = userService.remove(id)

  if (!removed) {
    throw new AppError(404, '用户不存在')
  }

  res.json({
    code: 0,
    message: '删除成功',
    data: null
  })
}