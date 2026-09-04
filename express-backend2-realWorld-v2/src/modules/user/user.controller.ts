import type{ Request,Response,NextFunction} from 'express'
import type { UserService } from './user.service.js'
import { UserUnauthrized } from '../../errors/common.error.js'


export class UserController { 
  private readonly userService:UserService
  constructor(userService:UserService){
    this.userService = userService
  }
  create = async(req:Request,res:Response,next:NextFunction)=>{
    const input = req.body
    try {
      const user = await this.userService.create(input)
      return res.status(201).json({
        success: true,
        code: 'USER_CREATED',
        message: '用户创建成功',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  login = async(req:Request,res:Response,next:NextFunction)=>{
    const input = req.body
    try {
      const user = await this.userService.login(input)
      return res.status(200).json({
        success: true,
        code: 'USER_LOGIN_SUCCESS',
        message: '用户登录成功',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  getUser = async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.userId

    if(!userId){
      throw new UserUnauthrized()
    }
    try {
      const user = await this.userService.getUser(userId)
      return res.status(200).json({
        success: true,
        code: 'USER_FETCHED',
        message: '用户获取成功',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  updateUser = async(req:Request,res:Response,next:NextFunction)=>{ 
    const userId = req.userId
    const input = req.body
    if(!userId){
      throw new UserUnauthrized()
    }
    try {
      const user = await this.userService.updateUserById(userId,input)
      return res.status(200).json({
        success: true,
        code: 'USER_UPDATED',
        message: '用户更新成功',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
}