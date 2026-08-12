import { Router } from 'express'
import { create } from './user.controller.js'

export const userRouter = Router()

userRouter.post('/create', create)