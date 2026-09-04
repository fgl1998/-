export interface AppErrorOptions {
  statusCode: number
  code: string
  message: string
  details?: unknown
  cause?: unknown
}

export class AppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly details?: unknown

  constructor(options: AppErrorOptions) {
    super(options.message, {
      cause: options.cause,
    })

    this.name = new.target.name
    this.statusCode = options.statusCode
    this.code = options.code
    this.details = options.details

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace?.(this, new.target)
  }
}