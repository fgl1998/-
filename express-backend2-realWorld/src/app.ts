import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {errorHandler} from './middleware/error-handler.js'
import {userRouter} from './modules/user/user.route.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/users', userRouter)

app.use(errorHandler)

app.listen(3000, () => {
  console.log('server running')
})