// modules/user/user.error.ts

import { AppError } from '../../errors/app-error.js'

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super(
      '该邮箱已被注册',
      'EMAIL_ALREADY_EXISTS',
      409
    )
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(
      '用户不存在',
      'USER_NOT_FOUND',
      404
    )
  }
}

export class UserDisabledError extends AppError {
  constructor() {
    super(
      '用户已被禁用',
      'USER_DISABLED',
      403
    )
  }
}