export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface CreateUserInput{
  name:string
  email:string
}