export interface Profile {
  id:number
  username:string
  image:string|null
  bio:string|null
  following:number
  createdAt:Date
}

export interface User {
  id:number
}