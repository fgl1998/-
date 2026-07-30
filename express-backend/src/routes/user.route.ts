import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUserList
} from '../controllers/user.controller.js'

const userRouter = Router()

userRouter.get('/', getUserList)

userRouter.get('/:id', getUserById)

userRouter.post('/', createUser)

userRouter.delete('/:id', deleteUser)

export default userRouter