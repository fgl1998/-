import { AppError } from "../../errors/app.error.js";

export class TagNotFoundError extends AppError {
  constructor() {
    super(
      'TAG_NOT_FOUND',
      404,
      '标签不存在'
    )
  }
}