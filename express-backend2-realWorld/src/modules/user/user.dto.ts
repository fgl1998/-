export interface UserOutput {
  id: number
  username: string
  email: string
  bio: string|null
  image: string|null
  createdAt: string
  updatedAt: string
}

export interface LoginOutput {
  user: UserOutput
  token: string
}