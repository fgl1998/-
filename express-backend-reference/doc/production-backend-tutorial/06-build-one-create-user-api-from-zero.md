# 第 6 章：从零手写一个完整接口——创建用户

这是一篇可以独立阅读的入门教程。你不需要先看前五章，也不要一上来照着完整参考项目抄。我们只完成一个接口：

```http
POST /api/v1/users
```

这个接口看起来很小，但会完整经过：路由、参数校验、Controller、Service、Repository、MySQL、统一响应和错误处理。只要真正理解并亲手写完这一条链路，以后写查询、修改、删除接口时，主要工作就是替换业务规则和 SQL。

> 学习方式：请在你自己的简单 Express 项目里手动创建文件、手动输入代码。本文代码是一份完整参考答案，不要求你复制覆盖现有项目。

---

## 1. 先看终点：我们到底要做什么

### 1.1 接口契约

接口契约就是前端和后端提前约定好的“通信规则”。写代码前先把它固定下来，否则写到 Service 时还不知道应该返回什么。

请求方法和地址：

```text
POST /api/v1/users
```

请求头：

```http
Content-Type: application/json
```

合法请求体：

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

业务规则：

- `name` 去掉首尾空格后，长度必须在 2～50 个字符之间；
- `email` 必须是合法邮箱；
- 邮箱保存前去掉首尾空格并转为小写；
- 一个邮箱只能创建一个用户；
- ID 和创建时间由数据库生成，客户端不能指定。

成功响应使用 HTTP `201 Created`：

```json
{
  "success": true,
  "code": "USER_CREATED",
  "message": "用户创建成功",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "createdAt": "2026-08-03T08:00:00.000Z"
  }
}
```

参数错误使用 HTTP `400 Bad Request`：

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "请求参数校验失败",
  "details": [
    {
      "path": "body.email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

邮箱重复使用 HTTP `409 Conflict`：

```json
{
  "success": false,
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "该邮箱已被使用",
  "details": null
}
```

未知异常使用 HTTP `500 Internal Server Error`，不能把 SQL、密码或错误堆栈返回给前端：

```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "服务器内部错误",
  "details": null
}
```

### 1.2 运行顺序和编写顺序不是一回事

请求真正到达服务器后，从外向内运行：

```text
HTTP 请求
  ↓
Route：匹配 POST /
  ↓
Validate Middleware：校验并清洗参数
  ↓
Controller：读取参数，调用用例，选择 HTTP 201
  ↓
Service：判断邮箱是否重复
  ↓
Repository 接口：描述 Service 需要的数据能力
  ↓
MysqlUserRepository：执行手写 SQL
  ↓
MySQL：保存数据并生成 ID、创建时间
```

但从零编写时，建议从内向外：

```text
需求与接口契约
  ↓
数据库表和公共基础设施
  ↓
Entity、Schema、DTO
  ↓
Repository 接口、Mapper、MySQL 实现
  ↓
Service
  ↓
Controller
  ↓
Route、Module、App、Server
  ↓
测试
```

原因很简单：Controller 依赖 Service，Service 又依赖 Repository。先写被依赖的东西，编辑器会更容易提示你下一层需要什么。

---

## 2. 准备项目和依赖

以下命令都在你的项目根目录执行，也就是包含 `package.json` 的目录。

### 2.1 安装运行时依赖

```powershell
npm install express mysql2 zod dotenv
```

它们的用途：

- `express`：接收 HTTP 请求、注册中间件和路由；
- `mysql2`：连接 MySQL；我们使用它的 Promise API 和 `?` 参数占位符；
- `zod`：运行时校验客户端真正传来的 JSON；
- `dotenv`：开发时把 `.env` 文件内容加载到 `process.env`。

TypeScript 类型只能在编译时帮助开发者。客户端传来的 JSON 在运行时没有 TypeScript 类型，所以仍然必须用 Zod。

### 2.2 安装开发依赖

```powershell
npm install -D typescript tsx @types/node @types/express vitest supertest @types/supertest
```

- `typescript`：类型检查和编译；
- `tsx`：开发阶段直接运行 TypeScript；
- `vitest`：运行单元测试；
- `supertest`：直接向内存里的 Express App 发送请求，不必占用真实端口；
- `@types` 开头的包：为 JavaScript 库补充 TypeScript 类型。

### 2.3 package.json 脚本

把 `package.json` 的 `type` 设置成 `module`，并在 `scripts` 中准备这些命令：

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

这里不是要求你删除 `package.json` 里的 `name`、`version`、`dependencies` 等字段，只是展示要确认存在的字段。不要把上面的小片段直接覆盖整个文件。

### 2.4 TypeScript 配置

新建或修改 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

为什么 TypeScript 源文件中的相对导入写 `.js`：

```ts
import { AppError } from '../../shared/errors/app-error.js'
```

因为 `NodeNext` 模拟 Node.js 的 ESM 规则。当前文件虽然是 `.ts`，但编译后的真实文件是 `.js`，Node 最终要加载 `.js`。这是初学者最容易困惑的地方之一。

### 2.5 最终目录

你将手动创建这些文件：

```text
express-backend/
├─ .env
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ vitest.config.ts
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  │  └─ env.ts
│  ├─ database/
│  │  ├─ mysql.ts
│  │  └─ migrations/
│  │     └─ 001_create_users.sql
│  ├─ middlewares/
│  │  ├─ error.middleware.ts
│  │  └─ validate.middleware.ts
│  ├─ shared/
│  │  ├─ errors/
│  │  │  └─ app-error.ts
│  │  └─ http/
│  │     └─ api-response.ts
│  └─ modules/
│     └─ user/
│        ├─ user.controller.ts
│        ├─ user.dto.ts
│        ├─ user.entity.ts
│        ├─ user.mapper.ts
│        ├─ user.module.ts
│        ├─ user.mysql-repository.ts
│        ├─ user.repository.ts
│        ├─ user.route.ts
│        ├─ user.schema.ts
│        └─ user.service.ts
└─ tests/
   ├─ api/
   │  └─ user.api.test.ts
   ├─ helpers/
   │  └─ fake-user.repository.ts
   └─ unit/
      └─ user.service.test.ts
```

---

## 3. 第一步：环境变量和 MySQL 表

### 3.1 为什么密码不写进代码

开发、测试、生产的数据库地址不同。代码应该只描述“需要哪些配置”，具体值放进环境变量。

新建 `.env.example`，它可以提交到 Git，用来告诉其他开发者需要哪些变量：

```dotenv
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=replace_me
DB_NAME=express_backend
DB_CONNECTION_LIMIT=10
```

复制一份为 `.env`，再填入你电脑上的真实密码：

```powershell
Copy-Item .env.example .env
```

`.env` 必须加入 `.gitignore`：

```gitignore
node_modules/
dist/
.env
```

### 3.2 校验环境变量

新建 `src/config/env.ts`：

```ts
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().trim().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().trim().min(1),
  DB_CONNECTION_LIMIT: z.coerce.number().int().positive().max(100).default(10)
})

export type AppEnv = z.infer<typeof envSchema>

export function loadEnv(
  source: Record<string, string | undefined>
): AppEnv {
  return envSchema.parse(source)
}
```

逐段理解：

- `process.env` 里的所有值本质上都是字符串或 `undefined`；
- `z.coerce.number()` 会把字符串 `"3000"` 转为数字 `3000`；
- `positive()` 拒绝 0 和负数；
- 没写 `DB_USER` 或 `DB_NAME` 时，程序在启动阶段立即报错；
- `AppEnv` 从 Schema 自动推导，不用再维护一份可能过期的接口；
- 函数接收 `source`，而不是在模块顶层直接读取 `process.env`，所以以后更容易测试。

检查点：故意删掉 `.env` 中的 `DB_NAME`，启动应直接失败。恢复后再继续。

### 3.3 创建数据库和表

先登录 MySQL：

```powershell
mysql -u root -p
```

在 MySQL 客户端执行：

```sql
CREATE DATABASE IF NOT EXISTS express_backend
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

新建 `src/database/migrations/001_create_users.sql`：

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
```

回到 PowerShell，把 SQL 文件执行到指定数据库：

```powershell
mysql -u root -p express_backend < src/database/migrations/001_create_users.sql
```

每一列的目的：

- `id`：数据库自增主键，客户端不能上传；
- `name`：最大 50，与 Zod 的最大长度保持一致；
- `email`：最大 255，并通过唯一索引防止重复；
- `created_at`：数据库生成创建时间，精确到毫秒；
- `InnoDB`：支持事务和行锁；
- `utf8mb4`：能正确保存中文和 Emoji。

为什么 Service 判断重复后，数据库还必须有唯一索引？因为两个并发请求可能同时查询到“不存在”，然后同时插入。只有数据库唯一索引能在最后一刻保证数据不会重复。

### 3.4 创建连接池

新建 `src/database/mysql.ts`：

```ts
import mysql, { type Pool } from 'mysql2/promise'
import type { AppEnv } from '../config/env.js'

type DatabaseEnv = Pick<
  AppEnv,
  | 'DB_HOST'
  | 'DB_PORT'
  | 'DB_USER'
  | 'DB_PASSWORD'
  | 'DB_NAME'
  | 'DB_CONNECTION_LIMIT'
>

export function createDatabase(env: DatabaseEnv): Pool {
  return mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: env.DB_CONNECTION_LIMIT,
    charset: 'utf8mb4',
    timezone: 'Z',
    supportBigNumbers: true
  })
}

export async function checkDatabaseConnection(pool: Pool): Promise<void> {
  await pool.query('SELECT 1')
}
```

不要为每个请求调用 `createConnection()`。连接握手有成本，连接池会复用连接。`Pool` 是类型，所以使用 `import type`，编译后不会产生多余导入。

---

## 4. 第二步：先准备所有接口都会使用的公共能力

### 4.1 AppError：让可预期错误带上状态码

新建 `src/shared/errors/app-error.ts`：

```ts
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown = null
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

普通 `Error` 只有 message，不知道应该返回 400、409 还是 500。`AppError` 表示程序已经预料到的应用错误：

```ts
new AppError(409, 'EMAIL_ALREADY_EXISTS', '该邮箱已被使用')
```

`code` 是给前端程序判断的稳定标识，`message` 是给人看的文本。前端不应通过比较中文提示来判断错误类型。

### 4.2 统一成功响应

新建 `src/shared/http/api-response.ts`：

```ts
import type { Response } from 'express'

export interface SuccessResponse<T> {
  code: string
  message: string
  data: T
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  response: SuccessResponse<T>
): Response {
  return res.status(statusCode).json({
    success: true,
    code: response.code,
    message: response.message,
    data: response.data
  })
}
```

`T` 是泛型。创建用户时，`T` 是 `UserOutput`；如果以后删除接口返回 `null`，`T` 就是 `null`。统一封装可以避免有的接口叫 `msg`，有的接口叫 `message`。

### 4.3 参数校验中间件

新建 `src/middlewares/validate.middleware.ts`：

```ts
import type { RequestHandler } from 'express'
import type { z } from 'zod'
import { AppError } from '../shared/errors/app-error.js'

function normalizeIssues(issues: z.core.$ZodIssue[]) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message
  }))
}

export function validate<T>(schema: z.ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    })

    if (!result.success) {
      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          '请求参数校验失败',
          normalizeIssues(result.error.issues)
        )
      )
      return
    }

    res.locals.validated = result.data
    next()
  }
}
```

这里最重要的是 `safeParse`：

- 成功时不会只告诉 TypeScript“它可能合法”，而是得到真正校验和清洗后的 `result.data`；
- 失败时调用 `next(error)`，Express 会跳过普通中间件，直接进入全局错误中间件；
- 校验结果放在 `res.locals.validated`，Controller 不再读取未经验证的 `req.body`；
- 成功和失败两个分支最后都只调用一次 `next`。

常见错误是失败后忘记 `return`。那样代码还会继续执行第二次 `next()`，导致响应重复。

### 4.4 全局错误中间件

新建 `src/middlewares/error.middleware.ts`：

```ts
import type { ErrorRequestHandler } from 'express'
import { AppError } from '../shared/errors/app-error.js'

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
      success: false,
      code: error.code,
      message: error.message,
      details: error.details
    })
    return
  }

  console.error('未处理的请求异常', error)

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误',
    details: null
  })
}
```

错误中间件必须有四个参数，即使 `_req` 没用也要保留，否则 Express 不会把它识别为错误处理中间件。

`AppError` 可以安全返回给客户端；未知错误只在服务端记录，客户端统一看到 500。生产项目可把 `console.error` 换成 Pino，并增加 `requestId`，但不影响这一接口的分层原理。

---

## 5. 第三步：定义 User 的四种数据形态

初学者常把数据库行、请求体和响应体全都叫 `User`。短期省了几个文件，长期会让数据库字段、业务对象和公开字段互相污染。

### 5.1 Entity：应用内部理解的用户

新建 `src/modules/user/user.entity.ts`：

```ts
export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}
```

Entity 不导入 Express，也不导入 mysql2。它是 Service 和 Repository 共同理解的内部对象。内部时间使用 `Date`，便于比较和计算。

### 5.2 Schema：检查外部世界传来的数据

新建 `src/modules/user/user.schema.ts`：

```ts
import { z } from 'zod'

const emptyObjectSchema = z.object({}).default({})

export const createUserRequestSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, '用户名至少需要2个字符')
      .max(50, '用户名不能超过50个字符'),
    email: z
      .string()
      .trim()
      .email('邮箱格式不正确')
      .toLowerCase()
  }),
  params: emptyObjectSchema,
  query: emptyObjectSchema
})
```

这个 Schema 校验整个请求，而不只是 body。以后路径参数和查询参数也能采用同一个中间件。

输入：

```json
{
  "name": "  张三  ",
  "email": " ZhangSan@Example.COM "
}
```

通过 Schema 后：

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

这说明 Schema 不只“检查”，还完成确定性的输入清洗。

### 5.3 DTO：把 Schema 结果变成 TypeScript 类型

新建 `src/modules/user/user.dto.ts`：

```ts
import type { z } from 'zod'
import type { createUserRequestSchema } from './user.schema.js'

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>
export type CreateUserDto = CreateUserRequest['body']

export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}
```

三个名字的区别：

- `CreateUserRequest`：完整的 `{ body, params, query }`；Controller 使用；
- `CreateUserDto`：只包含合法 body；Service 使用；
- `UserOutput`：允许公开给客户端的用户；日期已经是 JSON 友好的字符串。

不要让 Service 接收 Express `Request`。否则 Service 会和 HTTP 框架绑死，也很难直接写单元测试。

### 5.4 Row：MySQL 真正返回的字段

数据库列是 `created_at`，内部 Entity 是 `createdAt`，两者需要 Mapper 转换。下一节会定义 `UserRow`。

---

## 6. 第四步：Repository 接口、Mapper 和手写 SQL

### 6.1 Repository 接口只描述“需要什么”

新建 `src/modules/user/user.repository.ts`：

```ts
import type { User } from './user.entity.js'

export interface CreateUserRecord {
  name: string
  email: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserRecord): Promise<User>
}

export class DuplicateUserEmailError extends Error {
  constructor() {
    super('User email already exists')
    this.name = 'DuplicateUserEmailError'
  }
}
```

Repository 接口没有 SQL，也没有 HTTP 状态码。它只是 Service 提出的数据需求：

- 根据邮箱找用户；
- 创建用户。

`Promise<User | null>` 表示异步查询后，要么找到 `User`，要么正常地找不到。Repository 不把“找不到”自动解释成 404，因为 404 是 HTTP 和业务层的语义。

`DuplicateUserEmailError` 表示数据库唯一索引冲突，但它也不携带 409。Service 会把数据层错误翻译成业务错误。

### 6.2 Mapper 负责 Row、Entity、Output 的转换

新建 `src/modules/user/user.mapper.ts`：

```ts
import type { UserOutput } from './user.dto.js'
import type { User } from './user.entity.js'

export interface UserRow {
  id: number | string
  name: string
  email: string
  created_at: Date | string
}

export function toUser(row: UserRow): User {
  const id = Number(row.id)
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at
      : new Date(row.created_at)

  if (!Number.isSafeInteger(id)) {
    throw new Error(`用户ID超出JavaScript安全整数范围：${String(row.id)}`)
  }

  if (Number.isNaN(createdAt.getTime())) {
    throw new Error(`数据库返回了无效时间：${String(row.created_at)}`)
  }

  return {
    id,
    name: row.name,
    email: row.email,
    createdAt
  }
}

export function toUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  }
}
```

转换关系：

```text
MySQL UserRow
  created_at
      ↓ toUser
内部 User
  createdAt: Date
      ↓ toUserOutput
公开 UserOutput
  createdAt: ISO string
```

为什么不直接 `res.json(row)`？数据库以后可能增加 `password_hash` 或内部审计字段。公开响应类型和 Mapper 是防止敏感字段意外泄漏的一道边界。

### 6.3 MySQL Repository：所有 SQL 集中在这里

新建 `src/modules/user/user.mysql-repository.ts`：

```ts
import type {
  Pool,
  ResultSetHeader,
  RowDataPacket
} from 'mysql2/promise'
import type { User } from './user.entity.js'
import { toUser, type UserRow } from './user.mapper.js'
import {
  DuplicateUserEmailError,
  type CreateUserRecord,
  type UserRepository
} from './user.repository.js'

interface MysqlUserRow extends RowDataPacket, UserRow {}

interface MysqlErrorLike {
  code?: unknown
}

function isDuplicateEntry(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as MysqlErrorLike).code === 'ER_DUP_ENTRY'
  )
}

export class MysqlUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<MysqlUserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    )

    return rows[0] ? toUser(rows[0]) : null
  }

  private async findById(id: number): Promise<User | null> {
    const [rows] = await this.pool.execute<MysqlUserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    return rows[0] ? toUser(rows[0]) : null
  }

  async create(input: CreateUserRecord): Promise<User> {
    let result: ResultSetHeader

    try {
      const [insertResult] = await this.pool.execute<ResultSetHeader>(
        'INSERT INTO users(name, email) VALUES (?, ?)',
        [input.name, input.email]
      )
      result = insertResult
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new DuplicateUserEmailError()
      }
      throw error
    }

    const user = await this.findById(result.insertId)

    if (!user) {
      throw new Error(`创建用户后无法读取记录：${result.insertId}`)
    }

    return user
  }
}
```

逐步理解 `findByEmail`：

1. `execute` 把 SQL 和参数分开传给 mysql2；
2. SQL 中的 `?` 对应数组里的 `email`；
3. mysql2 会正确处理引号，不能把客户端字符串直接拼进 SQL；
4. `rows[0]` 可能不存在，所以返回 `null`；
5. 找到时通过 `toUser` 转为 Entity。

错误写法：

```ts
const sql = `SELECT id FROM users WHERE email = '${email}'`
```

这是 SQL 注入风险。无论你认为 email 已经校验得多严格，Repository 都应坚持使用占位符。

逐步理解 `create`：

1. 执行参数化 `INSERT`；
2. 成功后从 `ResultSetHeader.insertId` 得到数据库生成的 ID；
3. 用私有 `findById` 再读一次，拿到数据库生成的 `created_at`；
4. MySQL 错误码为 `ER_DUP_ENTRY` 时，转换为 Repository 自己的错误；
5. 连接断开等未知错误原样抛出，最后由全局错误中间件返回 500。

为什么 `findById` 是 `private`？当前 Service 的创建用例不需要公开“根据 ID 查用户”的能力，它只是 MySQL 实现在插入后的内部步骤。

---

## 7. 第五步：Service 只写业务逻辑

新建 `src/modules/user/user.service.ts`：

```ts
import { AppError } from '../../shared/errors/app-error.js'
import type { CreateUserDto, UserOutput } from './user.dto.js'
import { toUserOutput } from './user.mapper.js'
import {
  DuplicateUserEmailError,
  type UserRepository
} from './user.repository.js'

function emailAlreadyExists(): AppError {
  return new AppError(
    409,
    'EMAIL_ALREADY_EXISTS',
    '该邮箱已被使用'
  )
}

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: CreateUserDto): Promise<UserOutput> {
    const existingUser = await this.repository.findByEmail(input.email)

    if (existingUser) {
      throw emailAlreadyExists()
    }

    try {
      const createdUser = await this.repository.create(input)
      return toUserOutput(createdUser)
    } catch (error) {
      if (error instanceof DuplicateUserEmailError) {
        throw emailAlreadyExists()
      }
      throw error
    }
  }
}
```

Service 的输入是已经通过 Zod 的 `CreateUserDto`，输出是公开的 `UserOutput`。它没有导入 Express，也没有导入 mysql2。

运行步骤：

1. 先查询 email 是否存在，为正常重复请求提供友好提示；
2. 不存在时调用 Repository 创建；
3. 把 Entity 转为输出 DTO；
4. 如果插入阶段遇到唯一索引冲突，也翻译为同一个 409；
5. 其他异常继续抛出。

为什么要处理两次重复？考虑两个请求：

```text
请求 A：findByEmail → null
请求 B：findByEmail → null
请求 A：INSERT → 成功
请求 B：INSERT → ER_DUP_ENTRY
```

预检查改善常规体验，唯一索引解决并发正确性，两者不能互相替代。

“Service 只写业务”不代表 Service 完全不知道错误状态。这里的 `AppError(409)` 是应用对 HTTP 的轻量适配。大型项目也可以让 Service 抛纯业务错误，再由 Controller 层映射；对当前规模而言，统一 `AppError` 更容易学习和维护。

检查点：打开 `user.service.ts` 搜索 `express`、`mysql2` 和 SQL 关键字，都不应该出现。

---

## 8. 第六步：Controller 只控制 HTTP

新建 `src/modules/user/user.controller.ts`：

```ts
import type { RequestHandler } from 'express'
import { sendSuccess } from '../../shared/http/api-response.js'
import type { CreateUserRequest } from './user.dto.js'
import type { UserService } from './user.service.js'

export interface UserController {
  create: RequestHandler
}

export function createUserController(
  service: UserService
): UserController {
  return {
    create: async (_req, res) => {
      const { body } = res.locals.validated as CreateUserRequest
      const user = await service.create(body)

      sendSuccess(res, 201, {
        code: 'USER_CREATED',
        message: '用户创建成功',
        data: user
      })
    }
  }
}
```

Controller 只做三件事：

1. 从 `res.locals.validated` 读取已经校验的输入；
2. 调用 `service.create(body)`；
3. 选择 HTTP 201 和响应文案。

它不应该：

- 调用 Zod；
- 判断邮箱是否重复；
- 写 SQL；
- 创建数据库连接；
- 在每个接口中复制一份 `try/catch`。

为什么没有 `try/catch`？当前使用 Express 5，异步 Handler 返回的 Promise 被拒绝后，会自动把错误交给全局错误中间件。如果使用 Express 4，需要额外的 async 包装器。

为什么参数名是 `_req`？这个 Handler 不读取原始 Request，但函数签名仍需要保留它；下划线表示“我知道它存在，但这里故意不用”。

---

## 9. 第七步：Route 声明地址，Module 组装依赖

### 9.1 Route

新建 `src/modules/user/user.route.ts`：

```ts
import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware.js'
import type { UserController } from './user.controller.js'
import { createUserRequestSchema } from './user.schema.js'

export function createUserRouter(controller: UserController): Router {
  const router = Router()

  router.post(
    '/',
    validate(createUserRequestSchema),
    controller.create
  )

  return router
}
```

同一个请求会按注册顺序执行：

```text
validate(createUserRequestSchema)
  ↓ 成功才 next()
controller.create
```

Route 中只写 `/`，因为 `/api/v1/users` 会在 `app.ts` 统一挂载。组合后才是完整地址 `/api/v1/users/`。

### 9.2 Module：手动依赖注入

新建 `src/modules/user/user.module.ts`：

```ts
import type { Router } from 'express'
import { createUserController } from './user.controller.js'
import type { UserRepository } from './user.repository.js'
import { createUserRouter } from './user.route.js'
import { UserService } from './user.service.js'

export function createUserModule(repository: UserRepository): Router {
  const service = new UserService(repository)
  const controller = createUserController(service)
  return createUserRouter(controller)
}
```

这就是最简单、最透明的依赖注入：

```text
Repository → Service → Controller → Router
```

Service 没有自己 `new MysqlUserRepository()`，所以测试时可以传 Fake Repository，生产时可以传 MySQL Repository。未来换 ORM 时，只要新实现仍满足 `UserRepository`，Service 不必重写。

---

## 10. 第八步：把模块挂进 App，再启动 Server

### 10.1 App 只创建 Express 应用

新建 `src/app.ts`：

```ts
import express, { type Router } from 'express'
import { errorHandler } from './middlewares/error.middleware.js'

export function createApp(userRouter: Router) {
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json({ limit: '1mb' }))
  app.use('/api/v1/users', userRouter)
  app.use(errorHandler)

  return app
}
```

中间件顺序非常重要：

1. `express.json()` 必须在路由前，否则 `req.body` 还是 `undefined`；
2. 业务 Router 在中间；
3. 错误中间件必须最后注册，才能接住前面传来的错误。

`createApp` 不调用 `listen`，测试就可以直接拿到 App，不需要真的打开 3000 端口。

### 10.2 Server 是生产依赖的组合根

新建 `src/server.ts`：

```ts
import 'dotenv/config'
import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import {
  checkDatabaseConnection,
  createDatabase
} from './database/mysql.js'
import { createUserModule } from './modules/user/user.module.js'
import { MysqlUserRepository } from './modules/user/user.mysql-repository.js'

async function main(): Promise<void> {
  const env = loadEnv(process.env)
  const pool = createDatabase(env)

  await checkDatabaseConnection(pool)

  const repository = new MysqlUserRepository(pool)
  const userRouter = createUserModule(repository)
  const app = createApp(userRouter)

  app.listen(env.PORT, () => {
    console.log(`服务已启动：http://localhost:${env.PORT}`)
  })
}

main().catch((error: unknown) => {
  console.error('服务启动失败', error)
  process.exitCode = 1
})
```

它按顺序完成：

1. `dotenv/config` 先把 `.env` 加载进 `process.env`；
2. Zod 校验环境变量；
3. 创建 MySQL Pool；
4. 执行 `SELECT 1`，数据库不可用时不启动一个“看似正常”的服务；
5. 创建真实 MySQL Repository；
6. 依次组装 Service、Controller、Router；
7. 创建 App；
8. 最后监听端口。

`server.ts` 可以知道所有具体实现，因为它的职责就是组装。Service 仍然只知道 Repository 接口。

---

## 11. 第九步：第一次运行和手工调用

### 11.1 先做类型检查

```powershell
npm run typecheck
```

如果看到 `.ts` 文件的相对导入要求扩展名，检查是否都写成了 `.js`。如果提示某个类没有实现接口，先比较方法名、参数类型和返回值。

### 11.2 启动开发服务器

```powershell
npm run dev
```

预期输出：

```text
服务已启动：http://localhost:3000
```

常见启动错误：

- `ECONNREFUSED`：MySQL 没启动或端口写错；
- `Access denied`：用户名或密码错误；
- `Unknown database`：还没创建数据库；
- `Table 'users' doesn't exist`：还没执行 Migration；
- `EADDRINUSE`：3000 端口已经被其他程序占用。

### 11.3 成功请求

另开一个 PowerShell 窗口：

```powershell
$body = @{
  name = '  张三  '
  email = ' ZhangSan@Example.COM '
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:3000/api/v1/users' `
  -ContentType 'application/json' `
  -Body $body
```

你应该看到 `success` 为 `true`，名字首尾空格消失，邮箱变成小写。

此时完整运行链路是：

```text
Invoke-RestMethod
→ express.json
→ POST 路由
→ Zod 校验与清洗
→ Controller
→ Service.findByEmail
→ SELECT
→ Service.create
→ INSERT
→ SELECT by id
→ Row 转 Entity
→ Entity 转 UserOutput
→ Controller 返回 201
```

### 11.4 参数错误请求

```powershell
$body = @{
  name = 'A'
  email = 'not-an-email'
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:3000/api/v1/users' `
  -ContentType 'application/json' `
  -Body $body
```

PowerShell 会把 400 显示为错误。重点是服务器响应中的 `VALIDATION_ERROR`。这次请求不会进入 Controller、Service，更不会执行 SQL。

### 11.5 邮箱重复请求

把成功请求原样再执行一次。第二次应返回 HTTP 409 和 `EMAIL_ALREADY_EXISTS`。如果返回 500：

1. 检查数据库是否真的有 `uq_users_email`；
2. 检查 `isDuplicateEntry` 是否比较 `ER_DUP_ENTRY`；
3. 检查 Service 是否捕获 `DuplicateUserEmailError`；
4. 检查错误中间件是否最后注册。

---

## 12. 第十步：不连接数据库也能测试 Service

### 12.1 为什么要 Fake Repository

Service 单元测试只验证业务规则。若每次测试都连接 MySQL，测试会慢、数据难清理，也无法精确模拟并发唯一键冲突。

新建 `tests/helpers/fake-user.repository.ts`：

```ts
import type { User } from '../../src/modules/user/user.entity.js'
import {
  DuplicateUserEmailError,
  type CreateUserRecord,
  type UserRepository
} from '../../src/modules/user/user.repository.js'

export class FakeUserRepository implements UserRepository {
  public readonly users: User[]
  public failNextCreateWithDuplicate = false
  private nextId: number

  constructor(seed: User[] = []) {
    this.users = Array.from(seed)
    this.nextId =
      seed.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async create(input: CreateUserRecord): Promise<User> {
    if (this.failNextCreateWithDuplicate) {
      this.failNextCreateWithDuplicate = false
      throw new DuplicateUserEmailError()
    }

    const user: User = {
      id: this.nextId,
      name: input.name,
      email: input.email,
      createdAt: new Date('2026-08-03T08:00:00.000Z')
    }

    this.nextId += 1
    this.users.push(user)
    return user
  }
}
```

Fake 不是生产数据库的复制品，只需要实现 `UserRepository` 契约。固定时间能让断言稳定。

### 12.2 Service 测试

新建 `tests/unit/user.service.test.ts`：

```ts
import { describe, expect, it } from 'vitest'
import { AppError } from '../../src/shared/errors/app-error.js'
import type { User } from '../../src/modules/user/user.entity.js'
import { UserService } from '../../src/modules/user/user.service.js'
import { FakeUserRepository } from '../helpers/fake-user.repository.js'

async function expectAppError(
  action: () => Promise<unknown>,
  code: string,
  statusCode: number
): Promise<void> {
  try {
    await action()
    throw new Error('Expected action to throw AppError')
  } catch (error) {
    expect(error).toBeInstanceOf(AppError)
    expect(error).toMatchObject({ code, statusCode })
  }
}

describe('UserService.create', () => {
  it('创建用户并返回公开响应模型', async () => {
    const repository = new FakeUserRepository()
    const service = new UserService(repository)

    await expect(
      service.create({
        name: '张三',
        email: 'zhangsan@example.com'
      })
    ).resolves.toEqual({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      createdAt: '2026-08-03T08:00:00.000Z'
    })
  })

  it('邮箱已经存在时返回业务冲突', async () => {
    const seed: User[] = [
      {
        id: 1,
        name: '原用户',
        email: 'same@example.com',
        createdAt: new Date('2026-08-01T08:00:00.000Z')
      }
    ]
    const service = new UserService(new FakeUserRepository(seed))

    await expectAppError(
      () =>
        service.create({
          name: '新用户',
          email: 'same@example.com'
        }),
      'EMAIL_ALREADY_EXISTS',
      409
    )
  })

  it('并发导致唯一键冲突时仍返回相同业务冲突', async () => {
    const repository = new FakeUserRepository()
    repository.failNextCreateWithDuplicate = true
    const service = new UserService(repository)

    await expectAppError(
      () =>
        service.create({
          name: '并发用户',
          email: 'race@example.com'
        }),
      'EMAIL_ALREADY_EXISTS',
      409
    )
  })
})
```

这三个测试分别证明：

- 正常创建和 Entity → Output 转换正确；
- 预查询发现重复时返回 409；
- 插入时才发生唯一键冲突，也返回相同 409。

---

## 13. 第十一步：从 HTTP 入口测试整条链路

### 13.1 Vitest 配置

新建 `vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    clearMocks: true,
    restoreMocks: true
  }
})
```

### 13.2 API 测试

新建 `tests/api/user.api.test.ts`：

```ts
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../src/app.js'
import { createUserModule } from '../../src/modules/user/user.module.js'
import { FakeUserRepository } from '../helpers/fake-user.repository.js'

function createTestApp() {
  const repository = new FakeUserRepository()
  const userRouter = createUserModule(repository)
  return createApp(userRouter)
}

describe('POST /api/v1/users', () => {
  it('校验、清洗参数并创建用户', async () => {
    const response = await request(createTestApp())
      .post('/api/v1/users')
      .send({
        name: '  张三  ',
        email: ' ZhangSan@Example.COM '
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      success: true,
      code: 'USER_CREATED',
      message: '用户创建成功',
      data: {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        createdAt: '2026-08-03T08:00:00.000Z'
      }
    })
  })

  it('参数错误时在进入 Controller 前返回 400', async () => {
    const response = await request(createTestApp())
      .post('/api/v1/users')
      .send({
        name: 'A',
        email: 'wrong'
      })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      success: false,
      code: 'VALIDATION_ERROR',
      message: '请求参数校验失败'
    })
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'body.name' }),
        expect.objectContaining({ path: 'body.email' })
      ])
    )
  })

  it('相同邮箱第二次创建时返回 409', async () => {
    const app = createTestApp()

    await request(app)
      .post('/api/v1/users')
      .send({ name: '张三', email: 'same@example.com' })

    const response = await request(app)
      .post('/api/v1/users')
      .send({ name: '李四', email: 'same@example.com' })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      success: false,
      code: 'EMAIL_ALREADY_EXISTS',
      message: '该邮箱已被使用',
      details: null
    })
  })
})
```

Supertest 不会启动 `server.ts`，所以不会读取 `.env`、连接 MySQL或占用 3000 端口。它使用真实 Route、Validate、Controller、Service 和错误中间件，只把最底层 Repository 换成 Fake。

执行：

```powershell
npm run typecheck
npm test
```

两条命令都通过后，再验证生产代码：

```powershell
npm run build
npm start
```

---

## 14. 一段代码到底应该放在哪一层

写新需求时，可以用下面的问题判断。

| 代码内容 | 应放位置 | 原因 |
|---|---|---|
| `POST /` 对应哪个处理器 | Route | HTTP 地址映射 |
| name 长度、email 格式 | Schema | 外部输入合法性 |
| 读取已校验 body、返回 201 | Controller | HTTP 控制 |
| 邮箱不能重复 | Service | 业务规则 |
| Service 需要 `findByEmail` | Repository 接口 | 数据能力契约 |
| `SELECT`、`INSERT`、占位符 | MySQL Repository | 持久化实现 |
| `created_at` 转 `createdAt` | Mapper | 边界模型转换 |
| 数据库连接地址和连接池 | config/database | 基础设施 |
| 所有错误的 JSON 结构 | Error Middleware | 横切的 HTTP 行为 |
| 把真实实现组装起来 | Module/Server | 依赖注入和启动 |

一个实用判断：如果把 HTTP 换成消息队列，这段代码是否仍然成立？如果成立，它大概率属于 Service；如果它讨论状态码、Header、Request、Response，大概率属于 Controller 或 Middleware。

---

## 15. 出错时按这一顺序排查

不要随机修改所有层。按请求路径从外向内检查：

### 15.1 请求根本进不来

- 地址是不是 `/api/v1/users`；
- 方法是不是 POST；
- `Content-Type` 是不是 `application/json`；
- App 是否执行了 `express.json()`；
- Router 是否挂载到 `/api/v1/users`。

### 15.2 总是返回 400

- 打印或测试客户端真正发送的 JSON；
- 检查字段名是否正好是 `name`、`email`；
- 检查 Schema 的 body/params/query 结构；
- 不要让 Controller 又读取未经清洗的 `req.body`。

### 15.3 Controller 执行了但 Service 没反应

- `await service.create(body)` 是否写了 `await`；
- Module 创建的 Controller 是否拿到同一个 Service；
- Router 注册的是否是 `controller.create`。

### 15.4 数据库报错

- 先用 MySQL 客户端确认能登录；
- 执行 `SELECT DATABASE()` 确认数据库；
- 执行 `SHOW CREATE TABLE users` 确认表和唯一索引；
- 检查 SQL 字段名是 `created_at`，不是 `createdAt`；
- 检查所有外部参数是否通过 `?` 传入。

### 15.5 返回了 500，但你期望 409

- 查看服务端控制台里的原始错误；
- 检查 MySQL 错误是否为 `ER_DUP_ENTRY`；
- 检查 Repository 是否转成 `DuplicateUserEmailError`；
- 检查 Service 是否转成 `AppError(409)`；
- 检查错误中间件是否位于 App 最后。

### 15.6 返回成功但字段格式不对

- Repository 是否调用 `toUser`；
- Service 是否调用 `toUserOutput`；
- Controller 是否返回 Service 的结果，而不是数据库 Row；
- 时间是否通过 `toISOString()` 转成字符串。

---

## 16. 以后写任何接口都复用这张清单

拿到一个新接口需求时，按顺序手写：

1. **写契约**：方法、URL、请求、成功响应、错误响应；
2. **写业务规则**：哪些只是格式校验，哪些是真正业务判断；
3. **改数据库**：是否需要新表、列、索引，先写 Migration；
4. **写 Schema**：只接收允许的 body、params、query；
5. **推导 DTO**：不要重复手写和 Schema 冲突的输入类型；
6. **写 Entity/Output**：内部模型和公开响应分开；
7. **写 Repository 接口**：只列 Service 真正需要的方法；
8. **写 Mapper 和 Repository 实现**：SQL 参数化，数据库错误转换；
9. **先写 Service**：业务规则不导入 Express/mysql2；
10. **再写 Controller**：读取合法输入、调用 Service、选择状态码；
11. **写 Route**：方法 + 路径 + 校验 + Controller；
12. **组装 Module/App/Server**：测试用 Fake，生产用 MySQL；
13. **写三类测试**：成功、合法的业务失败、非法参数；
14. **运行验证**：typecheck、test、build、手工请求。

查询接口的变化主要是 Repository 写 `SELECT`，Service 处理“查不到”和分页，Controller 返回 200。修改接口会增加路径 ID Schema、更新规则和 `UPDATE`。删除接口会增加存在性或影响行数判断。分层顺序不变。

---

## 17. 最后复述一次完整流程

你亲手完成的不是十几个互不相关的文件，而是一条明确的数据流水线：

```text
客户端原始 JSON
→ Schema：验证并清洗
→ CreateUserDto：可信输入
→ Controller：进入创建用户用例
→ Service：执行邮箱不可重复规则
→ UserRepository：抽象数据能力
→ MysqlUserRepository：参数化 SELECT/INSERT
→ UserRow：数据库形态
→ User：内部 Entity
→ UserOutput：公开形态
→ Controller：HTTP 201
→ 统一 JSON 响应
```

判断自己是否真的学会，不要看能否背出目录，而要看能否回答这些问题：

- 为什么不能只靠 TypeScript 校验请求？
- 为什么 Controller 不直接查询 MySQL？
- 为什么 Service 依赖 Repository 接口而不是 MySQL 类？
- 为什么预查询重复后仍要数据库唯一索引？
- 为什么不能把数据库 Row 直接返回给前端？
- 为什么 App 和 Server 要拆开？
- 为什么 Service 测试不需要启动 MySQL？

这些问题都能用自己的话解释，并能不看答案重新写出这条创建链路时，你就已经掌握了完整接口的核心流程。
