import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {errorHandler} from './middleware/error-handler.js'
import {userRouter} from './modules/user/user.route.js'
import {articleRouter} from './modules/article/article.route.js'


const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/users', userRouter)
app.use('/api/articles', articleRouter)

app.use(errorHandler)

app.listen(3000, () => {
  console.log('server running')
})