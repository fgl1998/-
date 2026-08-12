import { Router } from 'express'
import { create } from './user.controller.js'

import {validateBody} from '../../middleware/validate.js'

import {createUserSchema} from './user.schema.js'

export const userRouter = Router()

userRouter.post('/create',validateBody(createUserSchema), create)