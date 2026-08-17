import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if(!JWT_SECRET){
  throw new Error('JWT_SECRET is not defined')
}

export interface JwtPayload { 
  id: number
}

export function sign(payload: JwtPayload): string { 
  if(!JWT_SECRET){
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign(payload, JWT_SECRET,{
    expiresIn: '7d'
  })
}

export function verify(token: string): JwtPayload { 
  if(!JWT_SECRET){
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
