# Express 后端项目入门教程（Node.js 20 + TypeScript）

> 适合人群：熟悉 JavaScript、Vue，但没有系统学习过 Node.js 后端的前端开发者。
>
> 最终目标：从零搭建一个能运行、能处理 CRUD 请求、带参数校验和统一异常处理的 Express 后端项目。

---

## 一、这套教程使用什么技术

本教程使用以下技术：

| 技术 | 用途 |
| --- | --- |
| Node.js 20 | JavaScript 服务端运行环境 |
| Express 5 | HTTP 后端框架 |
| TypeScript | 给 JavaScript 增加类型检查 |
| tsx | 开发环境运行 TypeScript，并监听文件变化 |
| Zod | 校验前端传来的参数 |
| cors | 解决 Vue 前端跨域访问问题 |
| dotenv | 从 `.env` 读取环境变量 |

### 为什么 Node.js 20 要使用 `tsx`

Node.js 20 不能像较新的 Node.js 版本那样直接执行普通 TypeScript 项目，因此不要这样启动：

```bash
node src/server.ts
```

本教程采用下面的方式：

```text
开发环境：tsx 直接运行 TypeScript
生产环境：tsc 编译成 JavaScript，再交给 Node.js 运行
```

对应命令是：

```bash
# 开发
npm run dev

# 编译
npm run build

# 运行编译结果
npm start
```

Express 5 要求 Node.js 18 或更高版本，因此 Node.js 20 可以正常使用 Express 5。

官方资料：

- [Express 安装文档](https://expressjs.com/en/starter/installing/)
- [Express 路由文档](https://expressjs.com/en/guide/routing/)
- [Express 中间件文档](https://expressjs.com/en/guide/using-middleware/)
- [Express 错误处理文档](https://expressjs.com/en/guide/error-handling/)

---

## 二、先理解 Express 项目在做什么

假设 Vue 前端发出下面的请求：

```http
GET http://localhost:3000/api/users/1
```

后端大概会按照下面的顺序处理：

```text
Vue 发起请求
    ↓
Express 接收请求
    ↓
中间件处理 JSON、跨域等通用逻辑
    ↓
Router 判断应该进入哪个接口
    ↓
Controller 获取参数、返回响应
    ↓
Service 执行业务逻辑
    ↓
返回 JSON 给 Vue
```

可以先这样类比：

| Express 概念 | 前端中的近似概念 |
| --- | --- |
| Router | `vue-router` |
| Middleware | 路由守卫、Axios 拦截器 |
| Controller | 页面中的事件处理函数 |
| Service | API 模块或业务逻辑模块 |
| `req` | 前端发给后端的请求 |
| `res` | 后端返回给前端的响应 |

Express 本身比较轻量，不会强制你使用某种目录结构。因此，我们需要自己约定项目分层。

---

## 三、准备开发环境

### 1. 检查 Node.js 版本

打开 PowerShell、CMD 或 VS Code 终端：

```bash
node -v
npm -v
```

Node.js 版本应该类似：

```text
v20.x.x
```

只要是 Node.js 20，就可以继续。

### 2. 推荐开发工具

- VS Code
- Apifox 或 Postman
- Git

Apifox/Postman 用来模拟前端发送 GET、POST、PUT、DELETE 请求，比一开始就写 Vue 页面更方便。

---

## 四、创建项目

在准备存放项目的位置打开终端：

```bash
mkdir express-backend
cd express-backend
```

初始化 npm：

```bash
npm init -y
```

执行后会生成：

```text
package.json
```

`package.json` 可以理解成项目说明书，它记录：

- 项目名称和版本
- 项目依赖
- 开发依赖
- 项目启动命令

---

## 五、安装项目依赖

### 1. 安装正式依赖

```bash
npm install express cors dotenv zod
```

这些依赖在项目运行时会被使用：

| 依赖 | 作用 |
| --- | --- |
| express | 创建 HTTP 服务和接口 |
| cors | 允许 Vue 项目跨域访问 |
| dotenv | 读取 `.env` 环境变量 |
| zod | 校验请求参数 |

### 2. 安装开发依赖

```bash
npm install --save-dev typescript tsx @types/node@20 @types/express @types/cors
```

这些依赖主要在开发和编译阶段使用：

| 依赖 | 作用 |
| --- | --- |
| typescript | TypeScript 编译器 |
| tsx | 开发时直接运行 `.ts` 文件 |
| @types/node@20 | Node.js 20 类型声明 |
| @types/express | Express 类型声明 |
| @types/cors | cors 类型声明 |

### 3. 正式依赖和开发依赖的区别

安装正式依赖：

```bash
npm install 包名
```

依赖会进入：

```json
"dependencies": {}
```

安装开发依赖：

```bash
npm install --save-dev 包名
```

依赖会进入：

```json
"devDependencies": {}
```

简单记忆：

```text
项目运行必须有 → dependencies
开发、编译、测试才需要 → devDependencies
```

---

## 六、配置 package.json

执行下面的命令：

```bash
npm pkg set type=module
npm pkg set scripts.dev="tsx watch src/server.ts"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/server.js"
```

执行完成后，`package.json` 中应该出现：

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

不要直接把上面这小段覆盖到整个 `package.json`，因为安装依赖后，文件里还有 `dependencies` 和 `devDependencies`。

命令含义：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发环境启动，修改代码后自动重启 |
| `npm run typecheck` | 只进行类型检查，不生成文件 |
| `npm run build` | 把 `src` 编译到 `dist` |
| `npm start` | 运行编译后的 JavaScript |

---

## 七、创建 TypeScript 配置

在项目根目录新建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

主要配置：

| 配置 | 含义 |
| --- | --- |
| `target` | 编译后的 JavaScript 语法版本 |
| `module` | 使用 Node.js ESM 模块规则 |
| `rootDir` | TypeScript 源代码目录 |
| `outDir` | 编译后的 JavaScript 输出目录 |
| `strict` | 开启严格类型检查 |
| `sourceMap` | 调试时可以定位到 TypeScript 源码 |

---

## 八、创建项目目录

在 VS Code 中创建下面的目录和文件：

```text
express-backend
├─ src
│  ├─ controllers
│  │  └─ user.controller.ts
│  ├─ middlewares
│  │  ├─ error.middleware.ts
│  │  └─ not-found.middleware.ts
│  ├─ routes
│  │  └─ user.route.ts
│  ├─ services
│  │  └─ user.service.ts
│  ├─ utils
│  │  └─ app-error.ts
│  ├─ app.ts
│  └─ server.ts
├─ .env
├─ .gitignore
├─ package.json
└─ tsconfig.json
```

每层负责的内容：

| 目录 | 职责 |
| --- | --- |
| routes | 定义接口地址和请求方法 |
| controllers | 接收参数并返回响应 |
| services | 编写业务逻辑 |
| middlewares | 编写中间件 |
| utils | 放置通用工具 |

---

## 九、配置环境变量

创建根目录下的 `.env`：

```env
PORT=3000
NODE_ENV=development
```

环境变量通常用于保存：

- 服务端口
- 数据库地址
- 数据库密码
- JWT 密钥
- 第三方 API Key

创建 `.gitignore`：

```gitignore
node_modules
dist
.env
*.log
```

`.env` 中以后可能包含密码，因此通常不能提交到 Git。

---

## 十、编写后端代码

### 1. 自定义业务异常

创建 `src/utils/app-error.ts`：

```typescript
export class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}
```

以后遇到“用户不存在”“参数不正确”等业务问题，就可以主动抛出异常：

```typescript
throw new AppError(404, '用户不存在')
```

这里的 `404` 是 HTTP 状态码。

---

### 2. 编写 User Service

创建 `src/services/user.service.ts`：

```typescript
export interface User {
  id: number
  name: string
  email: string
}

export interface CreateUserInput {
  name: string
  email: string
}

export type UpdateUserInput = Partial<CreateUserInput>

const users: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com'
  }
]

let nextId = 3

export const userService = {
  findAll(): User[] {
    return users
  },

  findById(id: number): User | undefined {
    return users.find((user) => user.id === id)
  },

  create(input: CreateUserInput): User {
    const user: User = {
      id: nextId++,
      ...input
    }

    users.push(user)

    return user
  },

  update(id: number, input: UpdateUserInput): User | undefined {
    const user = users.find((item) => item.id === id)

    if (!user) {
      return undefined
    }

    Object.assign(user, input)

    return user
  },

  remove(id: number): boolean {
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) {
      return false
    }

    users.splice(index, 1)

    return true
  }
}
```

这里暂时使用数组模拟数据库。

需要注意：

```text
服务器一旦重启，新增和修改的数据就会丢失。
```

这是正常现象。等学会 Express 的基础结构后，再接入 MySQL。

---

### 3. 编写 User Controller

创建 `src/controllers/user.controller.ts`：

```typescript
import type { RequestHandler } from 'express'
import { z } from 'zod'
import { userService } from '../services/user.service.js'
import { AppError } from '../utils/app-error.js'

const createUserSchema = z.object({
  name: z.string().trim().min(2, '用户名至少需要2个字符'),
  email: z.string().email('邮箱格式不正确')
})

const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '至少需要传入一个要修改的字段'
  })

function parseUserId(value: string): number {
  const id = Number(value)

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, '用户ID不正确')
  }

  return id
}

export const getUserList: RequestHandler = (_req, res) => {
  const users = userService.findAll()

  res.json({
    code: 0,
    message: '查询成功',
    data: users
  })
}

export const getUserById: RequestHandler = (req, res) => {
  const id = parseUserId(req.params.id)
  const user = userService.findById(id)

  if (!user) {
    throw new AppError(404, '用户不存在')
  }

  res.json({
    code: 0,
    message: '查询成功',
    data: user
  })
}

export const createUser: RequestHandler = (req, res) => {
  const result = createUserSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      code: 400,
      message: '参数校验失败',
      errors: result.error.issues
    })
    return
  }

  const user = userService.create(result.data)

  res.status(201).json({
    code: 0,
    message: '创建成功',
    data: user
  })
}

export const updateUser: RequestHandler = (req, res) => {
  const id = parseUserId(req.params.id)
  const result = updateUserSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      code: 400,
      message: '参数校验失败',
      errors: result.error.issues
    })
    return
  }

  const user = userService.update(id, result.data)

  if (!user) {
    throw new AppError(404, '用户不存在')
  }

  res.json({
    code: 0,
    message: '修改成功',
    data: user
  })
}

export const deleteUser: RequestHandler = (req, res) => {
  const id = parseUserId(req.params.id)
  const removed = userService.remove(id)

  if (!removed) {
    throw new AppError(404, '用户不存在')
  }

  res.json({
    code: 0,
    message: '删除成功',
    data: null
  })
}
```

#### 为什么 TypeScript 文件导入时要写 `.js`

注意下面的代码：

```typescript
import { userService } from '../services/user.service.js'
```

虽然源文件是：

```text
user.service.ts
```

但是我们的项目使用：

```json
"module": "NodeNext"
```

TypeScript 编译后，文件会变成：

```text
user.service.js
```

Node.js 的 ESM 模式要求相对导入路径包含最终文件扩展名，因此这里必须写 `.js`。

如果写成下面这样：

```typescript
import { userService } from '../services/user.service'
```

开发环境有时看起来能运行，但编译后可能出现找不到模块的问题。

记忆方法：

```text
本地 TypeScript 文件互相导入时，使用编译后的 .js 路径。
```

---

### 4. 编写 User Router

创建 `src/routes/user.route.ts`：

```typescript
import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUserList,
  updateUser
} from '../controllers/user.controller.js'

const userRouter = Router()

userRouter.get('/', getUserList)
userRouter.get('/:id', getUserById)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
```

这里定义了五个接口：

| 请求方法 | 地址 | 作用 |
| --- | --- | --- |
| GET | `/api/users` | 查询全部用户 |
| GET | `/api/users/:id` | 根据 ID 查询用户 |
| POST | `/api/users` | 新增用户 |
| PUT | `/api/users/:id` | 修改用户 |
| DELETE | `/api/users/:id` | 删除用户 |

---

### 5. 编写 404 中间件

创建 `src/middlewares/not-found.middleware.ts`：

```typescript
import type { RequestHandler } from 'express'
import { AppError } from '../utils/app-error.js'

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new AppError(
      404,
      `接口不存在：${req.method} ${req.originalUrl}`
    )
  )
}
```

如果用户访问了不存在的接口，请求最终就会进入这里。

---

### 6. 编写全局异常处理中间件

创建 `src/middlewares/error.middleware.ts`：

```typescript
import type { ErrorRequestHandler } from 'express'
import { AppError } from '../utils/app-error.js'

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
      data: null
    })
    return
  }

  console.error(error)

  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  })
}
```

全局异常处理的价值是：

```text
Controller 不需要在每个接口中重复编写 try/catch 和错误响应。
```

Express 5 对返回 Promise 的异步路由支持更好。以后在 Controller 里使用 `async/await` 时，Promise 抛出的异常会自动交给错误处理中间件。

---

### 7. 创建 Express 应用

创建 `src/app.ts`：

```typescript
import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import { notFoundHandler } from './middlewares/not-found.middleware.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8080'
    ]
  })
)

app.use(
  express.json({
    limit: '1mb'
  })
)

app.get('/health', (_req, res) => {
  res.json({
    code: 0,
    message: '服务运行正常',
    data: {
      time: new Date().toISOString()
    }
  })
})

app.use('/api/users', userRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
```

#### 中间件顺序为什么重要

Express 会按照代码从上到下执行中间件。

正确顺序：

```text
cors
  ↓
express.json
  ↓
业务路由
  ↓
404 中间件
  ↓
错误处理中间件
```

如果把 404 中间件放在业务路由之前，那么所有请求都会直接被判断为 404。

---

### 8. 启动 HTTP 服务

创建 `src/server.ts`：

```typescript
import 'dotenv/config'
import app from './app.js'

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`服务器启动成功：http://localhost:${port}`)
})
```

为什么分成 `app.ts` 和 `server.ts`？

```text
app.ts：负责配置 Express 应用
server.ts：负责监听端口、启动服务器
```

这样以后编写自动化测试时，可以直接导入 `app`，不必重复启动端口。

---

## 十一、启动项目

执行：

```bash
npm run dev
```

正常情况下，终端会显示：

```text
服务器启动成功：http://localhost:3000
```

浏览器访问：

```text
http://localhost:3000/health
```

应该返回：

```json
{
  "code": 0,
  "message": "服务运行正常",
  "data": {
    "time": "2026-01-01T00:00:00.000Z"
  }
}
```

只要这个接口可以访问，就说明：

- Node.js 能正常工作
- Express 能正常启动
- `.env` 能正常读取
- 端口监听成功

---

## 十二、使用 Apifox 测试接口

### 1. 查询全部用户

请求方法：

```text
GET
```

请求地址：

```text
http://localhost:3000/api/users
```

### 2. 根据 ID 查询用户

```text
GET http://localhost:3000/api/users/1
```

### 3. 新增用户

请求方法：

```text
POST
```

请求地址：

```text
http://localhost:3000/api/users
```

Body 选择 JSON：

```json
{
  "name": "王五",
  "email": "wangwu@example.com"
}
```

### 4. 修改用户

```text
PUT http://localhost:3000/api/users/1
```

请求体：

```json
{
  "name": "新的用户名"
}
```

### 5. 删除用户

```text
DELETE http://localhost:3000/api/users/1
```

---

## 十三、必须分清的三种请求参数

### 1. 路径参数 `params`

请求：

```http
GET /api/users/10
```

获取参数：

```typescript
req.params.id
```

这里的 `10` 表示某个具体用户的 ID。

### 2. 查询参数 `query`

请求：

```http
GET /api/users?page=1&pageSize=10
```

获取参数：

```typescript
req.query.page
req.query.pageSize
```

查询参数适合：

- 分页
- 搜索
- 筛选
- 排序

### 3. 请求体 `body`

请求：

```http
POST /api/users
```

请求体：

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

获取参数：

```typescript
req.body.name
req.body.email
```

请求体适合传递新增、修改时的复杂数据。

---

## 十四、Vue 前端如何调用

在 Vue 项目中安装 Axios：

```bash
npm install axios
```

创建 `src/api/user.ts`：

```typescript
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000
})

export function getUserList() {
  return request.get('/api/users')
}

export function getUserById(id: number) {
  return request.get(`/api/users/${id}`)
}

export function createUser(data: {
  name: string
  email: string
}) {
  return request.post('/api/users', data)
}

export function updateUser(
  id: number,
  data: {
    name?: string
    email?: string
  }
) {
  return request.put(`/api/users/${id}`, data)
}

export function deleteUser(id: number) {
  return request.delete(`/api/users/${id}`)
}
```

Vue 页面中调用：

```typescript
import { getUserList } from '@/api/user'

async function loadUsers() {
  const response = await getUserList()

  console.log(response.data.data)
}
```

这里的两层 `data`：

```typescript
response.data.data
```

分别表示：

```text
第一层 data：Axios 返回的响应体
第二层 data：后端统一响应结构中的业务数据
```

---

## 十五、类型检查、编译和生产运行

### 1. 类型检查

```bash
npm run typecheck
```

如果没有任何输出，通常表示类型检查通过。

### 2. 编译项目

```bash
npm run build
```

编译成功后会生成：

```text
dist
├─ controllers
├─ middlewares
├─ routes
├─ services
├─ utils
├─ app.js
└─ server.js
```

### 3. 运行编译结果

```bash
npm start
```

生产运行过程可以理解为：

```text
src 中的 TypeScript
    ↓ npm run build
dist 中的 JavaScript
    ↓ npm start
Node.js 20 执行 JavaScript
```

---

## 十六、常见错误

### 错误一：直接执行 TypeScript

错误命令：

```bash
node src/server.ts
```

Node.js 20 项目应该使用：

```bash
npm run dev
```

或者：

```bash
npm run build
npm start
```

### 错误二：Cannot use import statement outside a module

检查 `package.json` 是否包含：

```json
{
  "type": "module"
}
```

### 错误三：Cannot find module

检查本地文件导入路径是否使用 `.js`：

```typescript
import app from './app.js'
```

不要省略扩展名：

```typescript
import app from './app'
```

### 错误四：`req.body` 是 undefined

检查是否在路由之前注册：

```typescript
app.use(express.json())
```

并确保请求头是：

```http
Content-Type: application/json
```

### 错误五：前端提示 CORS 跨域

确认后端允许了前端的实际地址：

```typescript
cors({
  origin: 'http://localhost:5173'
})
```

Vue CLI 常见端口是 `8080`，Vite 常见端口是 `5173`。

### 错误六：接口一直处于等待状态

中间件必须选择其中一种方式结束当前处理：

```typescript
res.json(...)
```

或者把请求交给下一个中间件：

```typescript
next()
```

如果既不响应，也不调用 `next()`，请求就会一直等待。

### 错误七：端口被占用

可能看到：

```text
EADDRINUSE: address already in use :::3000
```

可以先把 `.env` 改成其他端口：

```env
PORT=3001
```

然后重新运行：

```bash
npm run dev
```

---

## 十七、你现在真正学会了什么

完成本教程后，你应该能够理解：

1. Node.js 是 JavaScript 的服务端运行环境。
2. Express 用来接收 HTTP 请求并返回响应。
3. Router 负责匹配请求方法和请求地址。
4. Controller 负责接收参数、调用业务逻辑、返回响应。
5. Service 负责业务处理，以后也会负责调用数据库层。
6. Middleware 负责跨域、JSON 解析、鉴权、日志和异常处理。
7. Node.js 20 开发 TypeScript 时可以用 `tsx`，生产环境用 `tsc` 编译。
8. `params`、`query`、`body` 是三种不同的请求参数来源。

最重要的请求链路是：

```text
请求
→ 中间件
→ Router
→ Controller
→ Service
→ JSON 响应
```

---

## 十八、下一阶段怎么学

不要一开始就同时加入 MySQL、Redis、JWT、文件上传和 Agent。建议按照下面的顺序学习：

### 第一阶段：Express 基础

- GET、POST、PUT、DELETE
- params、query、body
- Router
- Middleware
- 错误处理

### 第二阶段：数据库

- MySQL 基础
- Prisma ORM
- 用户 CRUD 数据持久化
- 分页和模糊搜索

### 第三阶段：登录权限

- 密码加密
- JWT 登录
- 登录鉴权中间件
- 角色和权限

### 第四阶段：工程能力

- 日志
- 配置管理
- 单元测试
- API 文档
- Docker 部署

### 第五阶段：Agent 后端

在 Express 基础稳定之后，再加入：

- 大模型 API
- 流式输出
- LangChain.js
- Function Calling / Tool Calling
- 对话历史
- RAG 知识库

Express 负责提供 HTTP 接口，LangChain.js 负责组织模型、提示词、工具和工作流。两者不是竞争关系，而是不同层次的技术。

---

## 十九、30 秒复盘

```text
Node.js 20 负责运行服务端 JavaScript。
Express 负责接收请求、匹配路由、返回响应。
开发环境用 tsx 运行 TypeScript。
生产环境先用 tsc 编译，再用 Node.js 运行 dist。

请求链路：
中间件 → Router → Controller → Service → Response

三种参数：
params 是路径参数
query 是查询参数
body 是请求体
```

