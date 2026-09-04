import { AppError } from "../../errors/app.error.js";


export class UserUnauthrized extends AppError {
  constructor() {
    super('Unauthorized',401,'USER_UNAUTHRIZED' );
  }
}

export class CannotFollowSelfError extends AppError {
  constructor() {
    super(
      'CANNOT_FOLLOW_SELF',
      400,
      '不能关注自己'
    )
  }
}