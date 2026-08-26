import {profileService} from './profile.service.js'
import type{Request,Response,NextFunction} from 'express'
import { UserUnauthrized } from '../../errors/common.error.js'

export async function getProfile(req:Request,res:Response,next:NextFunction){ 
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }    
    const profile =await profileService.getProfile(req.userId,input.username)
    
    return res.status(200).json({
      success: true,
      code: 'PROFILE_GET',
      data: profile
    })
  } catch (error) {
    next(error)
  }
}

export async function follow(req:Request,res:Response,next:NextFunction){ 
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }    

    const result =await profileService.follow(req.userId,input.followingId)
    
    return res.status(200).json({
      success: true,
      code: 'PROFILE_FOLLOW',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

export async function unfollow(req:Request,res:Response,next:NextFunction){ 
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }    
    const result =await profileService.unfollow(req.userId,input.followingId)
    return res.status(200).json({
      success: true,
      code: 'PROFILE_UNFOLLOW',
      data: result
    })
  }catch (error) {
    next(error)
  }
}
