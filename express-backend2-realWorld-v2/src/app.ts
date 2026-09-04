import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {errorHandler} from './middleware/error-handler.js'
import {profileRouter} from './modules/profile/profile.route.js'

import {createArticleModule} from './modules/article/article.module.js'
import { createUserModule } from './modules/user/user.module.js'
import { createTagModule } from './modules/tag/tag.module.js'

import {pool} from './database/pool.js'


const app = express()

app.use(express.json())

app.use(cors())


app.use('/api/users', createUserModule(pool))
app.use('/api/articles', createArticleModule(pool))
app.use('/api/tags', createTagModule(pool))
app.use('/api/profiles', profileRouter)

app.use(errorHandler)

// 检查通过后，才开始接收请求
try {
  await pool.query('SELECT 1')
} catch (error) {
  console.error('数据库连接失败：', error)
  await pool.end()
  throw error
}

app.listen(3000, () => {
  console.log('server running')
})