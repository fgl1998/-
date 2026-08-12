import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { userRouter } from './modules/user/user.route.js'
import {errorHandler} from './modules/user/error-handler.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors())

app.use('/users', userRouter)

app.use(errorHandler)

app.listen(3000, () => {
  console.log('server running')
})