import { userService } from "./user.service.js";
import {type CreateUserInput} from "./user.dto.js";
import type{Request,Response,NextFunction } from "express"

import {validate} from './test.zod.js'
interface CreateUserBody{
  name:unknown
  email:unknown
}

export async function create(req:Request,res:Response,next:NextFunction){
  //参数校验其实可以用中间件+zod等工具实现，直接写在controller层很难写很难看

  // const result = validate(req.body)
  // if (!result.success) {
  //   const errors = result.error.issues.map(issue => ({
  //     field: issue.path.join('.'),   // "name" 或 "email"
  //     message: issue.message,        // "Invalid email"
  //   }))

  //   return res.status(400).json({
  //     success: false,
  //     code: 'INVALID_PARAMS',
  //     message: errors.map(e => `${e.field}: ${e.message}`).join('; '),
  //   })
  // }

  // const body = req.body as CreateUserBody
  // const rowName=body.name
  // const rowEmail=body.email
  // if(typeof rowName !== 'string'){
  //   res.status(400).json({
  //     success:false,
  //     code:'INVALID_NAME',
  //     message:'name 必须是字符串'
  //   })
  //   return
  // }
  // if(typeof rowEmail !== 'string'){
  //     return res.status(400).json({
  //     success:false,
  //     code:'INVALID_EMAIL',
  //     message:'email 必须是字符串'
  //   })
  // }
  // const input:CreateUserInput = {
  //   name:rowName.trim(),
  //   email:rowEmail.trim().toLowerCase()
  // }

  const input:CreateUserInput = req.body

  try {
    const user = await userService.create(input)
    return res.status(201).json({
      success:true,
      code: 'USER_CREATED',
      message: '用户创建成功',
      data:user
    })
  } catch (error) {
    next(error)
  }
}



