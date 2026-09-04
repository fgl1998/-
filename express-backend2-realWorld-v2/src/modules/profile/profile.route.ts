import { Router } from "express";
import {getProfile,follow,unfollow,followedList,followingList} from './profile.controller.js'
import {validateBody} from '../../middleware/validate.js'
import {GetProfileSchema,FollowSchema,FollowListSchema} from './profile.schema.js'
import { authMiddleware } from "../../middleware/auth.middleware.js"

export const profileRouter = Router();

profileRouter.post('/get',authMiddleware,validateBody(GetProfileSchema),getProfile)
profileRouter.post('/follow',authMiddleware,validateBody(FollowSchema),follow)
profileRouter.post('/unfollow',authMiddleware,validateBody(FollowSchema),unfollow)
profileRouter.post('/followedList',validateBody(FollowListSchema),followedList)
profileRouter.post('/followingList',validateBody(FollowListSchema),followingList)
