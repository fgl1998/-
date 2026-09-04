import { AppError } from "./app.error.js";

export class UserUnauthrized extends AppError { 
  constructor() {
    super(
      'UNAUTHORIZED',
      401,
      '未登录'
    )
  }
}
export class TokenInvalid extends AppError { 
  constructor() {
    super(
      'INVALID_TOKEN',
      401,
      '登录状态已失效'
    )
  }
}
export class ForbiddenError extends AppError { 
  constructor() {
    super(
      'ForbiddenError',
      403,
      '未授权'
    )
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(
      'USER_NOT_FOUND',
      404,
      '用户不存在'
    )
  }
}