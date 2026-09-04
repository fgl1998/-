import { AppError } from "../../errors/app.error.js";

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super(
      'EMAIL_ALREADY_EXISTS',
      409,
      '该邮箱已被注册',
    )
  }
}
export class UsernameAlreadyExistsError extends AppError {
  constructor() {
    super(
      'USERNAME_ALREADY_EXISTS',
      409,
      '用户名已被使用',
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

export class UserDisabledError extends AppError {
  constructor() {
    super(
      'USER_DISABLED',
      403,
      '用户已被禁用'
    )
  }
}
export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      403,
      '用户名或者密码错误'
    )
  }
}