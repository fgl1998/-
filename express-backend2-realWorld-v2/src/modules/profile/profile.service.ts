import {profileRepository} from './profile.repository.js'

import {ProfileOutput} from './profile.dto.js'

import {CannotFollowSelfError} from './profile.error.js'

import {UserNotFoundError} from '../../errors/common.error.js'



interface ProfileService {
  getProfile(currentUserId:number,username:string):Promise<ProfileOutput|null>
  follow(currentUserId:number ,following_id:number):Promise<{following:true}>
  unfollow(currentUserId:number,following_id:number):Promise<{following:false}>
  followingList(userId:number):Promise<ProfileOutput[]>
  followedList(userId:number):Promise<ProfileOutput[]>
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
  async follow(currentUserId:number ,following_id:number):Promise<{following:true}>{
    if(currentUserId === following_id){
      throw new CannotFollowSelfError()
    }
    const targetUser = await profileRepository.findUserById(following_id)
    if(!targetUser){
      throw new UserNotFoundError()
    }
    
    await profileRepository.follow(currentUserId,following_id)
    return {following:true}
  },
  async unfollow(currentUserId:number,following_id:number):Promise<{following:false}>{
    const targetUser = await profileRepository.findUserById(following_id)
    if(!targetUser){
      throw new UserNotFoundError()
    }
    await profileRepository.unfollow(currentUserId,following_id)
    return {following:false}
  },
  async followingList(userId:number):Promise<ProfileOutput[]>{ 
    return await profileRepository.followingList(userId)
  },
  async followedList(userId:number):Promise<ProfileOutput[]>{ 
    return await profileRepository.followedList(userId)
  }

}