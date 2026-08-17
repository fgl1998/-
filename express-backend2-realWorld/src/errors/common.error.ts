import { AppError } from "./app.error.js";

export class UserUnauthrized extends AppError { 
  constructor() {
    super(
      'UNAUTHORIZED',
      403,
      '未授权'
    )
  }
}
export class TokenInvalid extends AppError { 
  constructor() {
    super(
      'INVALID_TOKEN',
      403,
      '登录状态已失效'
    )
  }
}