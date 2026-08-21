import { Router } from "express";
import {} from './profile.controller.js'
import {} from '../../middleware/validate.js'

export const profileRouter = Router();

profileRouter.post('/get')
profileRouter.post('/follow')
profileRouter.post('/unfollow')
