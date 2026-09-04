declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number
        token: string
      }
    }
  }
}

export {}