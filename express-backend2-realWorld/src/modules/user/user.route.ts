import {Router} from 'express'
import {create,login,getUser,updateUser} from './user.controller.js'
import {validateBody} from '../../middleware/validate.js'
import {CreateUserSchema,LoginSchema,UpdateUserSchema} from './user.schema.js'
import {authMiddleware} from '../../middleware/auth.middleware.js'
export const userRouter = Router()

userRouter.post('/create',validateBody(CreateUserSchema), create)

userRouter.post('/login',validateBody(LoginSchema), login)
userRouter.post('/getUser',authMiddleware, getUser)
userRouter.post('/updateUser',authMiddleware, validateBody(UpdateUserSchema), updateUser)

userRouter.post('/user',validateBody(CreateUserSchema), create)
userRouter.get('/user',authMiddleware, getUser)
userRouter.patch('/user',authMiddleware, validateBody(UpdateUserSchema), updateUser)
userRouter.post('/user/login',validateBody(LoginSchema), login)