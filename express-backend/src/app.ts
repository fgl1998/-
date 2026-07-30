import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import { notFoundHandler } from './middlewares/not-found.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

// 允许 Vue 前端跨域访问
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

// 解析 application/json 请求体
app.use(
  express.json({
    limit: '1mb'
  })
)

// 健康检查接口
app.get('/health', (_req, res) => {
  res.json({
    code: 0,
    message: '服务运行正常',
    data: {
      time: new Date().toISOString()
    }
  })
})

// 用户模块路由
app.use('/api/users', userRouter)

// 顺序非常重要：必须放在正常路由后面
app.use(notFoundHandler)

// 错误处理中间件必须放在最后
app.use(errorHandler)

export default app