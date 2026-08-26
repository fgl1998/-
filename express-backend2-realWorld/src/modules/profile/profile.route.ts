import { Router } from "express";
import {getProfile,follow,unfollow} from './profile.controller.js'
import {validateBody} from '../../middleware/validate.js'
import {GetProfileSchema,FollowSchema} from './profile.schema.js'
import { authMiddleware } from "../../middleware/auth.middleware.js"

export const profileRouter = Router();

profileRouter.post('/get',authMiddleware,validateBody(GetProfileSchema),getProfile)
profileRouter.post('/follow',authMiddleware,validateBody(FollowSchema),follow)
profileRouter.post('/unfollow',authMiddleware,validateBody(FollowSchema),unfollow)
