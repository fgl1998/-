import {profileRepository} from './profile.repository.js'

import {ProfileOutput} from './profile.dto.js'

import {UserUnauthrized} from './profile.error.js'

import {UserNotFoundError} from '../../errors/common.error.js'
import { th } from 'zod/v4/locales'


interface ProfileService {
  getProfile(currentUserId:number,username:string):Promise<ProfileOutput|null>
  follow(currentUserId:number ,following_id:number):Promise<{followed:true}>
  unfollow(currentUserId:number,following_id:number):Promise<{followed:false}>
}

export const profileService:ProfileService = {
  async getProfile(currentUserId:number,username:string):Promise<ProfileOutput|null>{
    const userId = await profileRepository.findUserByUsername(username)
    
    if(!userId){
      throw new UserNotFoundError()
    }
    const profile = await profileRepository.getProfile(currentUserId,username)

    return profile
  },
  async follow(currentUserId:number ,following_id:number):Promise<{followed:true}>{
    if(currentUserId === following_id){
      throw new UserUnauthrized()
    }
    const targetUser = await profileRepository.findUserById(following_id)
    if(!targetUser){
      throw new UserNotFoundError()
    }
    
    await profileRepository.follow(currentUserId,following_id)
    return {followed:true}
  },
  async unfollow(currentUserId:number,following_id:number):Promise<{followed:false}>{
    const targetUser = await profileRepository.findUserById(following_id)
    if(!targetUser){
      throw new UserNotFoundError()
    }
    await profileRepository.unfollow(currentUserId,following_id)
    return {followed:false}
  }

}