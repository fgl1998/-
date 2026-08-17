export interface User {
  id:number
  username:string
  email:string
  bio:string
  image:string
  password_hash:string
  createdAt:Date
  updatedAt:Date
}

export interface Login{
  username:string
  password:string
}