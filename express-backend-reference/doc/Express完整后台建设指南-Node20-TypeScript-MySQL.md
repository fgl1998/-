# Express 完整后台建设指南

> 技术栈：Node.js 20 + Express 5 + TypeScript + MySQL  
> 适合人群：熟悉 JavaScript、TypeScript、Vue，但缺少完整后端项目经验的前端开发者。

---

## 一、什么才算一个“完整后台”

一个能启动、能写 CRUD 的 Express 项目，只能算后端骨架。

一个相对完整、可以继续用于真实业务的后台，需要同时具备三部分：

```text
业务主链
路由 → 控制器 → 服务 → 数据访问 → MySQL

横向保障
参数校验 → 登录权限 → 异常处理 → 日志 → 安全防护

运行保障
健康检查 → 优雅关闭 → 测试 → 监控 → 部署
```

完整后台的目标不是“目录很多”，而是解决下面的问题：

1. 请求进来后，应该由谁处理？
2. 用户传错数据时，应该怎样拒绝？
3. 数据库出错时，怎样统一返回？
4. 怎样防止 SQL 注入和越权访问？
5. 出现线上问题时，怎样找到对应日志？
6. 服务关闭时，怎样安全释放数据库连接？
7. 修改代码后，怎样确认没有破坏原有功能？

---

## 二、后台机制总表

### 1. 基础必备机制

| 机制 | 解决的问题 |
| --- | --- |
| 配置管理 | 区分开发、测试、生产环境 |
| 模块分层 | 避免路由、业务、SQL 全写在一起 |
| MySQL 连接池 | 复用数据库连接 |
| Repository 数据层 | 隔离 SQL 和业务代码 |
| 数据库事务 | 多条 SQL 要么全部成功，要么全部失败 |
| 数据库迁移 | 记录表结构变化 |
| 参数校验 | 阻止非法输入进入业务代码 |
| 统一响应 | 让前端稳定处理接口结果 |
| 统一异常 | 集中处理业务错误和系统错误 |
| 404 处理 | 统一处理不存在的接口 |

### 2. 真实项目必备机制

| 机制 | 解决的问题 |
| --- | --- |
| 登录认证 | 判断当前用户是谁 |
| 权限校验 | 判断当前用户能做什么 |
| 日志系统 | 记录请求和异常 |
| 请求 ID | 串联一次请求产生的所有日志 |
| 安全响应头 | 降低常见 Web 安全风险 |
| 限流 | 防止接口被恶意高频调用 |
| 密码加密 | 避免数据库保存明文密码 |
| 敏感数据脱敏 | 防止身份证、手机号等信息泄漏 |
| API 文档 | 方便前后端联调 |
| 自动化测试 | 防止修改新功能时破坏旧功能 |

### 3. 生产环境必备机制

| 机制 | 解决的问题 |
| --- | --- |
| 健康检查 | 判断服务是否活着、依赖是否可用 |
| 优雅关闭 | 服务停止时完成现有请求并释放资源 |
| 进程守护 | 进程异常退出后自动恢复 |
| 反向代理 | 处理 HTTPS、压缩、静态资源等 |
| 监控告警 | 错误率或响应时间异常时及时通知 |
| 数据库备份 | 防止误操作或故障造成数据丢失 |
| CI/CD | 自动检查、构建和发布 |

### 4. 按业务选择的机制

| 机制 | 适用场景 |
| --- | --- |
| Redis | 缓存、验证码、登录状态、限流 |
| 消息队列 | 短信、邮件、耗时异步任务 |
| 定时任务 | 数据同步、过期数据清理 |
| 文件存储 | 头像、图片、附件上传 |
| WebSocket | 实时聊天、实时通知 |
| SSE | AI 流式回答 |
| 幂等机制 | 支付、订单、防重复提交 |
| 分布式锁 | 多个服务实例争抢同一资源 |
| 搜索引擎 | 大规模全文检索 |
| 向量数据库 | RAG 知识库 |

---

## 三、一次完整请求的处理链路

```text
Vue或小程序发送请求
        ↓
安全响应头、跨域、请求体解析
        ↓
生成 requestId、记录请求日志
        ↓
登录认证
        ↓
权限校验
        ↓
参数校验
        ↓
Router 匹配接口
        ↓
Controller 接收参数
        ↓
Service 执行业务规则
        ↓
Repository 执行参数化 SQL
        ↓
MySQL 连接池
        ↓
统一 JSON 响应
```

任何一层发生错误：

```text
throw AppError
        ↓
Express 错误处理中间件
        ↓
记录错误日志
        ↓
返回统一错误响应
```

---

## 四、推荐的项目目录

```text
express-backend
├─ src
│  ├─ config
│  │  ├─ env.ts
│  │  └─ index.ts
│  ├─ database
│  │  ├─ mysql.ts
│  │  ├─ transaction.ts
│  │  └─ migrations
│  ├─ errors
│  │  └─ app-error.ts
│  ├─ middlewares
│  │  ├─ authenticate.ts
│  │  ├─ authorize.ts
│  │  ├─ error-handler.ts
│  │  ├─ not-found.ts
│  │  ├─ request-id.ts
│  │  ├─ request-logger.ts
│  │  └─ validate.ts
│  ├─ modules
│  │  ├─ user
│  │  │  ├─ user.route.ts
│  │  │  ├─ user.controller.ts
│  │  │  ├─ user.service.ts
│  │  │  ├─ user.repository.ts
│  │  │  ├─ user.schema.ts
│  │  │  └─ user.types.ts
│  │  └─ auth
│  │     ├─ auth.route.ts
│  │     ├─ auth.controller.ts
│  │     ├─ auth.service.ts
│  │     └─ auth.schema.ts
│  ├─ types
│  │  └─ express.d.ts
│  ├─ utils
│  │  ├─ logger.ts
│  │  └─ response.ts
│  ├─ app.ts
│  └─ server.ts
├─ tests
│  ├─ unit
│  └─ integration
├─ .env
├─ .env.example
├─ .gitignore
├─ package.json
└─ tsconfig.json
```

### 为什么推荐按业务模块划分

初学项目经常使用：

```text
controllers
services
routes
```

项目变大后，查找一个用户功能需要在三个大目录之间来回跳转。

按模块划分后，用户相关代码都在：

```text
modules/user
```

更适合中大型项目继续扩展。

---

## 五、配置管理机制

### 1. `.env`

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=express_demo

JWT_SECRET=请替换为复杂随机字符串
JWT_EXPIRES_IN=2h
```

### 2. `.env.example`

这个文件可以提交到 Git，但不能放真实密码：

```env
NODE_ENV=development
PORT=3000

DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
JWT_EXPIRES_IN=2h
```

### 3. 校验环境变量

创建 `src/config/env.ts`：

```typescript
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().min(1),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('2h')
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('环境变量配置错误：', result.error.format())
  process.exit(1)
}

export const env = result.data
```

这样项目会在启动阶段发现配置错误，而不是等用户请求进来后才报错。

---

## 六、MySQL 连接机制

安装：

```bash
npm install mysql2
```

### 1. 使用连接池

创建 `src/database/mysql.ts`：

```typescript
import mysql from 'mysql2/promise'
import { env } from '../config/env.js'

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,

  charset: 'utf8mb4',
  timezone: '+08:00'
})

export async function checkDatabaseConnection(): Promise<void> {
  await pool.execute('SELECT 1')
}
```

不要在每一次请求中都创建一个新连接。

连接池的作用是：

```text
提前维护一组数据库连接
        ↓
请求需要查询时借出一个连接
        ↓
查询结束后归还连接
        ↓
后续请求继续复用
```

[MySQL2 连接池官方文档](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-pool)

### 2. 启动时检查数据库

```typescript
import { checkDatabaseConnection } from './database/mysql.js'

await checkDatabaseConnection()

console.log('MySQL 连接成功')
```

如果数据库连接失败，应阻止服务进入正常工作状态。

---

## 七、Repository 数据访问机制

不要把 SQL 直接写在 Controller 中。

### 错误示例

```typescript
router.get('/users', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM users')
  res.json(rows)
})
```

这个写法把下面几件事混在了一起：

- 路由匹配
- 参数处理
- 业务逻辑
- 数据库访问
- 响应处理

### 推荐写法

创建 `user.repository.ts`：

```typescript
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../../database/mysql.js'

export interface UserRow extends RowDataPacket {
  id: number
  name: string
  email: string
  created_at: Date
}

export const userRepository = {
  async findAll(): Promise<UserRow[]> {
    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        ORDER BY id DESC
      `
    )

    return rows
  },

  async findById(id: number): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
      `,
      [id]
    )

    return rows[0]
  },

  async create(name: string, email: string): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `
        INSERT INTO users(name, email)
        VALUES (?, ?)
      `,
      [name, email]
    )

    return result.insertId
  }
}
```

必须使用：

```sql
WHERE id = ?
```

禁止使用字符串拼接：

```typescript
// 存在 SQL 注入风险
const sql = `SELECT * FROM users WHERE id = ${id}`
```

[MySQL2 预处理语句官方文档](https://sidorares.github.io/node-mysql2/docs/examples/queries/prepared-statements)

---

## 八、数据库事务机制

假设创建订单时需要：

1. 插入订单；
2. 扣减商品库存；
3. 写入操作记录。

如果插入订单成功，但扣减库存失败，就会产生错误数据。

事务要求：

```text
全部成功 → commit
任意一步失败 → rollback
```

创建 `src/database/transaction.ts`：

```typescript
import type { PoolConnection } from 'mysql2/promise'
import { pool } from './mysql.js'

export async function withTransaction<T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const result = await callback(connection)

    await connection.commit()

    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
```

使用：

```typescript
await withTransaction(async (connection) => {
  await connection.execute(
    `
      INSERT INTO orders(user_id, product_id, amount)
      VALUES (?, ?, ?)
    `,
    [userId, productId, amount]
  )

  await connection.execute(
    `
      UPDATE products
      SET stock = stock - 1
      WHERE id = ? AND stock > 0
    `,
    [productId]
  )
})
```

`finally` 中必须释放连接：

```typescript
connection.release()
```

否则连接不会被归还，最终可能耗尽连接池。

---

## 九、数据库迁移机制

完整项目不能只依赖开发者手动创建数据表。

数据库迁移需要记录：

```text
001_create_users.sql
002_add_user_status.sql
003_create_orders.sql
```

每次表结构变化都形成一个可追踪的迁移记录。

可以选择：

- Prisma Migrate
- Knex Migration
- Drizzle Kit
- 自建 SQL migration

学习阶段可以先使用 `mysql2 + SQL migration`；需要提高开发效率时，再选择 ORM。

迁移机制解决：

- 新成员如何创建相同数据库；
- 测试环境如何同步表结构；
- 生产环境如何升级表结构；
- 表结构变化出了问题如何追踪。

---

## 十、参数校验机制

TypeScript 类型只存在于编译阶段，不能校验前端真正传来的数据。

即使 Controller 声明：

```typescript
interface CreateUserBody {
  name: string
  email: string
}
```

用户仍然可以传：

```json
{
  "name": 123,
  "email": false
}
```

因此需要 Zod：

```typescript
import { z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(30),
    email: z.string().trim().email()
  })
})
```

一个完整的校验机制需要覆盖：

- `req.params`
- `req.query`
- `req.body`
- 请求头
- 上传文件
- 环境变量

建议编写通用 `validate` 中间件，而不是每个 Controller 重复校验。

---

## 十一、统一异常机制

### 1. 自定义异常

创建 `src/errors/app-error.ts`：

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

业务代码中直接抛出：

```typescript
const user = await userRepository.findById(id)

if (!user) {
  throw new AppError(
    404,
    'USER_NOT_FOUND',
    '用户不存在'
  )
}
```

### 2. 常见错误类型

| HTTP状态码 | 错误类型 | 示例 |
| --- | --- | --- |
| 400 | 参数错误 | ID格式错误 |
| 401 | 未登录 | Token缺失或失效 |
| 403 | 无权限 | 普通用户访问管理员接口 |
| 404 | 资源不存在 | 用户不存在 |
| 409 | 数据冲突 | 手机号已绑定 |
| 429 | 请求过多 | 验证码发送过于频繁 |
| 500 | 系统错误 | 未知程序异常 |
| 502 | 上游错误 | 第三方接口调用失败 |
| 503 | 服务不可用 | 数据库暂时不可用 |

### 3. 全局错误处理中间件

```typescript
import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/app-error.js'

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      details: error.details,
      requestId: req.requestId
    })
    return
  }

  console.error(error)

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误',
    data: null,
    requestId: req.requestId
  })
}
```

Express 5 中，异步路由返回的 Promise 如果抛出异常，会自动进入错误处理中间件。

[Express 错误处理官方文档](https://expressjs.com/en/guide/error-handling/)

### 4. 生产环境不能返回的错误信息

不能把下面的信息返回给前端：

- 错误堆栈；
- 数据库密码；
- 完整 SQL；
- 服务器绝对路径；
- JWT 密钥；
- 第三方 API Key。

详细错误写入服务端日志，前端只接收安全、可理解的错误信息。

---

## 十二、统一响应机制

### 成功响应

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "操作成功",
  "data": {},
  "requestId": "req-abc123"
}
```

### 失败响应

```json
{
  "success": false,
  "code": "USER_NOT_FOUND",
  "message": "用户不存在",
  "data": null,
  "requestId": "req-abc123"
}
```

统一响应的意义：

- Axios 响应拦截器可以集中处理；
- 前端不需要猜测每个接口的数据结构；
- 错误码可以用于精确判断；
- requestId 可以用于排查日志。

注意：

```text
HTTP 状态码负责表达请求结果类型
业务 code 负责表达具体业务错误
```

不能所有接口无论成功失败都返回 HTTP 200。

---

## 十三、登录认证机制

认证解决：

```text
当前请求是谁发出的？
```

常见方式：

- 账号密码登录；
- 手机验证码登录；
- 微信小程序登录；
- JWT；
- Session。

登录成功后，认证中间件应该解析出：

```typescript
req.user = {
  id: 1001,
  role: 'admin'
}
```

典型 JWT 流程：

```text
用户提交登录信息
        ↓
后端校验身份
        ↓
签发 accessToken
        ↓
前端请求时携带 Token
        ↓
authenticate 中间件解析 Token
        ↓
将用户信息放入 req.user
```

完整认证还需要考虑：

- Token 过期；
- refreshToken；
- 用户退出登录；
- 用户被冻结；
- Token 被盗后的失效机制；
- 多设备登录策略。

---

## 十四、权限校验机制

授权解决：

```text
当前用户能不能执行这个操作？
```

例如：

```typescript
router.delete(
  '/users/:id',
  authenticate,
  requireRole('admin'),
  deleteUser
)
```

权限校验至少要考虑：

### 1. 角色权限

```text
admin：管理所有用户
user：只能使用普通功能
```

### 2. 数据权限

普通用户只能修改自己的资料：

```typescript
if (req.user.id !== targetUserId) {
  throw new AppError(
    403,
    'FORBIDDEN',
    '无权修改该用户'
  )
}
```

只判断“是否登录”是不够的，否则容易出现越权漏洞。

---

## 十五、日志与请求追踪机制

日志至少应该包含：

- requestId；
- 请求方法；
- 请求地址；
- HTTP 状态码；
- 响应耗时；
- 当前用户 ID；
- 错误堆栈；
- 第三方接口错误；
- 数据库错误。

不能记录：

- 明文密码；
- 手机验证码；
- 完整身份证号码；
- 完整 Token；
- 数据库密码；
- 第三方密钥。

### 请求 ID 中间件

```typescript
import { randomUUID } from 'node:crypto'
import type { RequestHandler } from 'express'

export const requestIdMiddleware: RequestHandler = (
  req,
  res,
  next
) => {
  const requestId = randomUUID()

  req.requestId = requestId
  res.setHeader('X-Request-ID', requestId)

  next()
}
```

因为 Express 默认的 `Request` 类型中没有 `requestId`，还需要创建
`src/types/express.d.ts`：

```typescript
declare global {
  namespace Express {
    interface Request {
      requestId: string
      user?: {
        id: number
        role: string
      }
    }
  }
}

export {}
```

并确认 `tsconfig.json` 的 `include` 能包含该文件：

```json
{
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}
```

日志库可以选择：

- Pino；
- Winston。

排查问题时，可以让前端提供 requestId，然后查询该请求对应的完整日志链路。

---

## 十六、安全机制

安装：

```bash
npm install helmet express-rate-limit
```

基础配置：

```typescript
import helmet from 'helmet'
import cors from 'cors'

app.disable('x-powered-by')
app.use(helmet())

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080'
    ],
    credentials: true
  })
)

app.use(
  express.json({
    limit: '1mb'
  })
)
```

真实项目还需要：

1. 使用 HTTPS；
2. 校验所有外部输入；
3. 使用参数化 SQL；
4. 登录和验证码接口限流；
5. 密码使用 bcrypt 或 Argon2 哈希；
6. 敏感字段脱敏；
7. 上传文件校验类型、扩展名和大小；
8. 不在错误响应中返回堆栈；
9. 定期执行 `npm audit`；
10. 限制请求体大小。

Express 官方建议生产环境使用 TLS、Helmet、输入校验、安全 Cookie、登录防暴力破解和依赖安全检查。

[Express 生产安全实践](https://expressjs.com/en/advanced/best-practice-security/)

---

## 十七、健康检查机制

### 1. 存活检查

只判断 Node.js 进程是否能够响应：

```typescript
app.get('/live', (_req, res) => {
  res.json({
    status: 'ok'
  })
})
```

### 2. 就绪检查

判断数据库等依赖是否可用：

```typescript
app.get('/ready', async (_req, res) => {
  await pool.execute('SELECT 1')

  res.json({
    status: 'ready',
    database: 'connected',
    timestamp: new Date().toISOString()
  })
})
```

可以理解为：

```text
/live：进程还活着吗？
/ready：现在可以接收真实请求吗？
```

---

## 十八、优雅关闭机制

直接终止进程可能造成：

- 正在执行的请求被中断；
- 数据库事务未完成；
- 数据库连接未释放；
- 消息队列任务未确认。

推荐流程：

```text
收到关闭信号
        ↓
停止接收新请求
        ↓
等待已有请求完成
        ↓
关闭 MySQL 连接池
        ↓
关闭 Redis、消息队列等资源
        ↓
退出进程
```

示例：

```typescript
import app from './app.js'
import { pool } from './database/mysql.js'
import { env } from './config/env.js'

const server = app.listen(env.PORT, () => {
  console.log(`服务启动：http://localhost:${env.PORT}`)
})

let shuttingDown = false

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) {
    return
  }

  shuttingDown = true

  console.log(`收到 ${signal}，开始关闭服务`)

  server.close(async () => {
    try {
      await pool.end()
      console.log('服务已安全关闭')
      process.exit(0)
    } catch (error) {
      console.error('关闭服务失败', error)
      process.exit(1)
    }
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
```

[Express 健康检查与优雅关闭](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown/)

---

## 十九、API 文档机制

API 文档至少需要说明：

- 接口地址；
- 请求方法；
- 是否需要登录；
- 请求头；
- params、query、body；
- 成功响应；
- 失败响应；
- 业务错误码。

可以选择：

- Apifox；
- Swagger / OpenAPI；
- Postman Collection。

对于个人项目，推荐先用 Apifox 管理接口；需要自动生成文档时，再引入 OpenAPI。

---

## 二十、测试机制

### 1. 单元测试

测试单个 Service 或工具函数：

```text
用户不存在时是否抛出 USER_NOT_FOUND？
邮箱重复时是否拒绝创建？
库存不足时是否拒绝下单？
```

### 2. 集成测试

测试完整 HTTP 请求链路：

```text
POST /api/users
        ↓
参数校验
        ↓
Service
        ↓
测试数据库
        ↓
返回 201
```

常用工具：

- Vitest 或 Jest；
- Supertest；
- 独立测试数据库。

重要接口应该测试：

- 正常成功；
- 参数错误；
- 未登录；
- 无权限；
- 数据不存在；
- 数据冲突；
- 数据库异常。

---

## 二十一、监控和部署机制

开发环境看到控制台错误还不够，生产环境需要关注：

- 每分钟请求量；
- 平均响应时间；
- 慢接口；
- HTTP 5xx 错误率；
- Node.js 内存；
- CPU 使用率；
- MySQL 连接数；
- 慢 SQL；
- 第三方接口失败率。

常见部署组合：

```text
用户
  ↓ HTTPS
Nginx / 云负载均衡
  ↓
Node.js Express
  ↓
MySQL / Redis
```

Express 官方生产实践还建议正确记录日志、避免同步阻塞函数、设置生产环境变量、使用自动重启机制、反向代理和负载均衡。

[Express 性能与可靠性实践](https://expressjs.com/en/advanced/best-practice-performance/)

---

## 二十二、Agent 后台需要增加什么

普通后台机制仍然全部需要，在此基础上增加 AI 专用能力。

### 1. SSE 流式输出

```text
用户提问
  ↓
后端调用大模型
  ↓
模型产生一个文本片段
  ↓
通过 SSE 立即发送给前端
```

### 2. 模型调用治理

需要处理：

- 调用超时；
- 用户取消；
- 有限次数重试；
- 模型限流；
- 多模型切换；
- 降级处理；
- Token 用量；
- 调用成本；
- 敏感内容过滤。

### 3. 对话持久化

MySQL 中通常需要：

```text
users
conversations
messages
model_usage
tool_calls
```

### 4. 长任务机制

文档解析、向量化、批量总结等任务不适合一直占用普通 HTTP 请求，可以放入任务队列。

### 5. RAG 知识库

需要：

- 文件上传；
- 文档解析；
- 文本切片；
- Embedding；
- 向量存储；
- 相似度检索；
- 引用来源；
- 数据权限隔离。

### 6. 工具调用安全

Agent 调用数据库、邮件、文件、搜索等工具时，需要：

- 工具白名单；
- 参数校验；
- 用户权限校验；
- 高风险操作确认；
- 工具调用日志；
- 超时和取消；
- 防止提示词注入扩大权限。

---

## 二十三、推荐依赖

### 基础

```bash
npm install express cors dotenv zod
```

### MySQL

```bash
npm install mysql2
```

### 安全

```bash
npm install helmet express-rate-limit
```

### 登录

```bash
npm install jsonwebtoken bcrypt
npm install --save-dev @types/jsonwebtoken @types/bcrypt
```

### 日志

```bash
npm install pino pino-http
```

### 测试

```bash
npm install --save-dev vitest supertest @types/supertest
```

不要一次性安装所有可选依赖。实现对应机制时再安装。

---

## 二十四、推荐实现顺序

### 第一阶段：能正确处理业务

1. 项目初始化；
2. 环境变量；
3. MySQL 连接池；
4. Router、Controller、Service、Repository；
5. 用户 CRUD；
6. 参数校验；
7. 统一异常；
8. 统一响应。

### 第二阶段：具备登录能力

1. 用户表；
2. 密码加密；
3. 登录接口；
4. JWT；
5. authenticate 中间件；
6. 角色和数据权限；
7. 登录限流。

### 第三阶段：具备工程能力

1. 结构化日志；
2. requestId；
3. API 文档；
4. 单元测试；
5. 集成测试；
6. 健康检查；
7. 优雅关闭；
8. Docker 和部署。

### 第四阶段：增加 Agent 功能

1. 大模型普通问答；
2. SSE 流式输出；
3. 对话记录；
4. Token 用量统计；
5. Tool Calling；
6. 文件上传；
7. RAG；
8. 长任务队列。

---

## 二十五、项目完成验收清单

### 项目结构

- [ ] 路由、控制器、服务、数据访问层职责分开
- [ ] 按业务模块组织代码
- [ ] 开发、测试、生产配置分离
- [ ] 存在 `.env.example`

### 数据库

- [ ] 使用连接池
- [ ] 使用参数化 SQL
- [ ] 复杂写操作使用事务
- [ ] 事务连接一定会释放
- [ ] 有数据库迁移机制
- [ ] 有索引设计
- [ ] 有备份方案

### 接口

- [ ] params、query、body 都经过校验
- [ ] 使用正确 HTTP 状态码
- [ ] 返回结构统一
- [ ] 有统一业务错误码
- [ ] 404 统一处理
- [ ] 未知异常统一处理

### 登录权限

- [ ] 密码不是明文保存
- [ ] Token 有过期时间
- [ ] 登录接口有限流
- [ ] 每个私有接口验证身份
- [ ] 重要接口验证角色和数据权限
- [ ] 不存在越权读取和越权修改

### 安全

- [ ] 使用 Helmet
- [ ] 关闭 `x-powered-by`
- [ ] CORS 限制具体来源
- [ ] 请求体设置大小限制
- [ ] 上传文件校验类型和大小
- [ ] 日志不包含敏感信息
- [ ] 错误响应不暴露堆栈和 SQL
- [ ] 定期检查依赖漏洞

### 运维

- [ ] 有 `/live`
- [ ] 有 `/ready`
- [ ] 支持优雅关闭
- [ ] 有自动重启机制
- [ ] 有错误监控
- [ ] 有慢接口和慢 SQL 监控
- [ ] 支持 HTTPS

### 测试与文档

- [ ] 有 API 文档
- [ ] 核心 Service 有单元测试
- [ ] 登录和权限有集成测试
- [ ] 关键 CRUD 有集成测试
- [ ] 部署前自动执行类型检查和测试

---

## 二十六、最终记忆

完整 Express 后台可以压缩为下面这句话：

```text
分层处理业务
+ MySQL连接池和事务
+ 参数校验和统一异常
+ 登录认证和权限控制
+ 日志、安全、健康检查
+ 测试、监控、部署
```

最核心的业务链路：

```text
Router
→ Controller
→ Service
→ Repository
→ MySQL
```

最核心的保障链路：

```text
参数校验
→ 登录权限
→ 统一异常
→ 日志追踪
→ 安全防护
```

判断一个后台是否完整，不要只看“能不能查数据库”，还要看：

```text
出错时能否正确处理
被攻击时能否有效防护
出问题时能否快速定位
关闭服务时能否安全退出
修改代码后能否自动验证
```
