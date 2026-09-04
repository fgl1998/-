import {Router} from 'express'
import type {UserController} from './user.controller.js'
import {validateBody} from '../../middleware/validate.js'
import {CreateUserSchema,LoginSchema,UpdateUserSchema} from './user.schema.js'
import {authMiddleware} from '../../middleware/auth.middleware.js'


export function createUserRouter(userController:UserController){
  const userRouter = Router() 

  userRouter.post('/create',validateBody(CreateUserSchema), userController.create)
  userRouter.post('/login',validateBody(LoginSchema), userController.login)
  userRouter.post('/getUser',authMiddleware, userController.getUser)
  userRouter.post('/updateUser',authMiddleware, validateBody(UpdateUserSchema), userController.updateUser)
  
  return userRouter
}
