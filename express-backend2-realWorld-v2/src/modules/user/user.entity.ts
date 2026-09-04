export interface User {
  id:number
  username:string
  email:string
  bio:string|null
  image:string|null
  password_hash:string
  createdAt:Date
  updatedAt:Date
}

export interface Login{
  username:string
  password:string
}