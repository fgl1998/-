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
export class CommentNotFoundError extends AppError {
  constructor() {
    super(
      'COMMENT_NOT_FOUND',
      404,
      '评论不存在'
    )
  }
}