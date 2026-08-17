export interface UserOutput {
  id: number
  username: string
  email: string
  bio: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface LoginOutput {
  user: UserOutput
  token: string
}