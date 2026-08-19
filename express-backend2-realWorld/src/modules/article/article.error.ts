import { AppError } from "../../errors/app.error.js";

export class ArticleNotFoundError extends AppError {
  constructor() {
    super(
      'ARTICLE_NOT_FOUND',
      404,
      '文章不存在'
    )
  }
}