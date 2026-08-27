import type{ ProfileRow,UserRow } from './profile.mapper.js';
import {toProfile,toUser} from './profile.mapper.js'
import {pool} from '../../database/pool.js'
import type { Profile,User } from './profile.entity.js';
import {ResultSetHeader,RowDataPacket} from 'mysql2'

interface UserIdRow extends RowDataPacket {
  id:number
}

export interface ProfileRepository { 
  getProfile(currentUserId:number,username:string):Promise<Profile|null>
  follow(currentUserId:number ,following_id:number):Promise<void>
  unfollow(currentUserId:number,following_id:number):Promise<void>
  findUserByUsername(username:string):Promise<number|null>
  findUserById(id:number):Promise<number|null>
  followingList(userId:number):Promise<Profile[]>
  followedList(userId:number):Promise<Profile[]>

}

export const profileRepository:ProfileRepository = {
  async findUserByUsername(username:string):Promise<number|null>{
    const [rows] = await pool.execute<UserIdRow[]>(
      `
      SELECT id FROM users WHERE username=?
      `,
      [username]
    )
    return rows[0] ? rows[0].id : null
  },
  async findUserById(id:number):Promise<number|null>{
    const [rows] = await pool.execute<UserIdRow[]>(
      `
      SELECT id FROM users WHERE id=?
      `,
      [id]
    )
    return rows[0] ? rows[0].id : null
  },
  async getProfile(currentUserId:number,username:string):Promise<Profile|null>{
    const [rows] = await pool.execute<ProfileRow[]>(
      `
      SELECT users.id,users.username,users.image,users.bio,users.created_at,
      EXISTS(
        SELECT 1 FROM follows
        WHERE follows.follower_id=?
        AND follows.following_id=users.id
      ) AS following
      FROM users
      WHERE users.username=?
      LIMIT 1
      `,
      [currentUserId,username]
    )
    return rows[0] ? toProfile(rows[0]) : null
  },
  async follow(currentUserId:number,following_id:number):Promise<void>{ 
    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT IGNORE INTO follows(follower_id,following_id) VALUES(?,?)
      `,
      [currentUserId,following_id]
    )
  },
  async unfollow(currentUserId:number,following_id:number):Promise<void>{ 
    const [result] = await pool.execute<ResultSetHeader>(
       `
      DELETE FROM follows
      WHERE follower_id=?
      AND following_id=?
      `,
      [currentUserId,following_id]
    )
  },
  //关注列表
  async followingList(userId:number):Promise<Profile[]>{ 
    const [rows] = await pool.execute<ProfileRow[]>(
      `
      SELECT 
        users.id,
        users.username,
        users.image,
        users.bio,
        users.created_at,
        1 AS following
      FROM follows
      JOIN users ON follows.following_id=users.id
      WHERE follows.follower_id=?
      `,
      [userId]
    )
    return rows.map(toProfile)
  },
  //粉丝列表
  async followedList(userId:number):Promise<Profile[]>{ 
    const [rows] = await pool.execute<ProfileRow[]>(
      `
      SELECT 
        users.id,
        users.username,
        users.image,
        users.bio,
        users.created_at,
        EXISTS(
				  SELECT 1 from follows WHERE follows.following_id=users.id AND follows.follower_id=?
				) AS following
      FROM follows
      JOIN users ON follows.follower_id=users.id
      WHERE follows.following_id=?
      `,
      [userId,userId]
    )
    	
    return rows.map(toProfile)
  }
}