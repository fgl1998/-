import {Request,Response,NextFunction} from 'express'

import { verify } from '../utils/jwt.js'

import {UserUnauthrized,TokenInvalid} from '../errors/common.error.js'

export function authMiddleware(req:Request,res:Response,next:NextFunction){
  const authorization = req.headers.authorization
  if(!authorization){
    throw new UserUnauthrized()
  }
  const [type,token] = authorization.split(' ')
  if(type !== 'Bearer'||!token){
    throw new UserUnauthrized()
  }

  try {
    const payload = verify(token)
    req.userId = payload.id
    next()
  } catch (error) {
    throw new TokenInvalid()
  }
}