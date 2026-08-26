import {profileRepository} from './profile.repository.js'

import {ProfileOutput} from './profile.dto.js'

import {UserUnauthrized} from './profile.error.js'


interface ProfileService {
  getProfile(currentUserId:number,username:string):Promise<ProfileOutput|null>
  follow(currentUserId:number ,following_id:number):Promise<boolean>
  unfollow(currentUserId:number,following_id:number):Promise<boolean>
}

export const profileService:ProfileService = {
  async getProfile(currentUserId:number,username:string):Promise<ProfileOutput|null>{
    const userId = await profileRepository.findUserByUsername(username)
    
    if(!userId){
      return null
    }
    const profile = await profileRepository.getProfile(currentUserId,username)

    return profile
  },
  async follow(currentUserId:number ,following_id:number):Promise<boolean>{
    if(currentUserId === following_id){
      throw new UserUnauthrized()
    }
    
    return profileRepository.follow(currentUserId,following_id)
  },
  async unfollow(currentUserId:number,following_id:number):Promise<boolean>{
    return profileRepository.unfollow(currentUserId,following_id)
  }

}