# 第 7 章：先别管 10 个文件——用 6 个文件写通 User 接口

如果你打开生产版 `user` 目录，看到 10 个文件互相 import，脑子马上乱掉，这是正常反应。

问题不在于你不会写代码，而在于你同时接触了两件事：

1. 一次请求真正执行的主流程；
2. 生产项目为了长期维护而拆出的各种辅助边界。

这两件事不应该在第一遍同时学习。

这一章暂时不追求“拆得最细”，只追求两件事：

- 你能一直跟住 `POST /api/v1/users` 的执行路线；
- Controller、Service、Repository 三个核心职责仍然分开。

我们把生产版的 10 个 User 文件合并成 6 个：

```text
src/modules/user/
├─ user.types.ts
├─ user.schema.ts
├─ user.repository.ts
├─ user.service.ts
├─ user.controller.ts
└─ user.route.ts
```

> 这是一套学习结构，不是说生产版 10 文件是错的。等你可以不迷路地写通接口，再逐步拆分，理解会清晰很多。

---

## 1. 第一遍只记住 4 个核心文件

第一次阅读时，只打开下面四个文件：

```text
user.route.ts
user.controller.ts
user.service.ts
user.repository.ts
```

先不要主动打开 `user.types.ts` 和 `user.schema.ts`。

四个核心文件分别只回答一个问题：

| 文件 | 只问这一个问题 |
|---|---|
| `user.route.ts` | 哪个 HTTP 地址交给哪个 Controller？ |
| `user.controller.ts` | HTTP 参数怎么交给 Service，成功返回什么？ |
| `user.service.ts` | 这个业务允许还是不允许？ |
| `user.repository.ts` | MySQL 具体怎么查、怎么写？ |

另外两个辅助文件需要时再打开：

| 文件 | 什么时候才打开 |
|---|---|
| `user.schema.ts` | 想知道 name、email 有什么校验规则时 |
| `user.types.ts` | 看不懂某个参数或返回值的 TypeScript 类型时 |

这就是第一条防迷路规则：

> 不要因为看到 import 就立刻点进去。先看当前函数在做什么，只有类型或函数含义阻止你继续阅读时，才跳转。

---

## 2. 一次请求到底跳几次文件

客户端发送：

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "  张三  ",
  "email": " ZhangSan@Example.COM "
}
```

运行路线：

```text
user.route.ts
  匹配 POST /
        ↓
user.schema.ts
  校验并清洗 name、email
        ↓
user.controller.ts
  读取合法 body，调用 service.create()
        ↓
user.service.ts
  判断邮箱是否已经存在
        ↓
user.repository.ts
  执行 SELECT、INSERT，再读取创建结果
        ↓
MySQL
```

返回时沿着调用栈反方向回来：

```text
MySQL Row
  ↓ Repository 转成 User
User Entity
  ↓ Service 转成 UserOutput
UserOutput
  ↓ Controller 包装 HTTP 201
JSON 响应
```

你只需要知道每次为什么跳转：

1. Route 不处理业务，所以跳到 Controller；
2. Controller 不判断邮箱重复，所以跳到 Service；
3. Service 不写 SQL，所以跳到 Repository；
4. Repository 不决定 HTTP 状态码，数据库结果回到 Service；
5. Service 给出业务结果，Controller 再决定返回 HTTP 201。

如果你在 Controller 里看到 SQL，或者在 Repository 里看到 `res.status(409)`，就说明职责混在一起了。

---

## 3. 为什么运行顺序和手写顺序不同

请求运行时是从外向内：

```text
Route → Controller → Service → Repository → MySQL
```

从零手写时，建议从被依赖的一端开始：

```text
types
  ↓
schema
  ↓
repository
  ↓
service
  ↓
controller
  ↓
route
  ↓
server 组装
```

原因是 Controller 需要 Service，Service 需要 Repository。先把底层契约写好，上一层就知道应该调用什么。

这一章假设你已经按照第 6 章准备好这些公共文件：

- `src/shared/errors/app-error.ts`：统一业务错误；
- `src/shared/http/api-response.ts`：统一成功响应；
- `src/middlewares/validate.middleware.ts`：Zod 校验中间件；
- `src/middlewares/error.middleware.ts`：统一错误响应；
- `src/database/mysql.ts`：mysql2 连接池；
- `src/app.ts`：创建 Express App。

它们不属于 User 模块，不需要每写一个业务模块就复制一遍。完整代码可以查看[第 6 章](./06-build-one-create-user-api-from-zero.md)。

---

## 4. 文件一：user.types.ts——把暂时需要的类型放在一起

新建 `src/modules/user/user.types.ts`：

```ts
export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}

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

先不要把这五个定义想得太复杂。

### 4.1 User

```ts
export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}
```

这是程序内部理解的用户。Repository 从数据库读取数据后，返回 `User`；Service 也使用它。

### 4.2 UserOutput

```ts
export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}
```

这是允许返回给前端的用户。内部 `Date` 在 JSON 响应里变成 ISO 字符串。

### 4.3 CreateUserRecord

```ts
export interface CreateUserRecord {
  name: string
  email: string
}
```

这是 Repository 插入数据库时需要的数据。ID 和创建时间由 MySQL 生成，所以不在这里。

### 4.4 UserRepository

```ts
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserRecord): Promise<User>
}
```

它不是数据库实现，而是 Service 对数据层提出的要求：

- 我需要按邮箱查询；
- 我需要创建用户。

Service 只依赖这个接口，因此测试时可以换成内存 Fake，生产时使用 MySQL。

### 4.5 DuplicateUserEmailError

这是 Repository 在唯一索引冲突时抛出的数据层错误。它不带 HTTP 409，因为 Repository 不负责 HTTP。

检查点：这个文件没有 Express Request、Response，也没有 SQL。

---

## 5. 文件二：user.schema.ts——只负责检查外部输入

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

export type CreateUserRequest = z.infer<
  typeof createUserRequestSchema
>

export type CreateUserDto = CreateUserRequest['body']
```

这个文件同时做两件紧密相关的事：

1. 用 Zod 在运行时检查真实请求；
2. 从 Schema 推导 TypeScript 输入类型。

输入：

```json
{
  "name": "  张三  ",
  "email": " ZhangSan@Example.COM "
}
```

校验成功后的 `body`：

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

`CreateUserRequest` 代表完整的：

```ts
{
  body: {
    name: string
    email: string
  }
  params: {}
  query: {}
}
```

`CreateUserDto` 只代表 body，Service 不需要知道 params 和 query。

检查点：Schema 不查询数据库，也不判断邮箱是否已经注册。邮箱格式是否正确属于输入校验；邮箱是否已注册属于业务规则。

---

## 6. 文件三：user.repository.ts——数据库和转换先放在一起

生产版把 Repository 接口、MySQL 实现和 Mapper 拆成三个文件。学习版先把接口放在 `user.types.ts`，把 MySQL 实现和行转换放在当前文件。

新建 `src/modules/user/user.repository.ts`：

```ts
import type {
  Pool,
  ResultSetHeader,
  RowDataPacket
} from 'mysql2/promise'
import {
  DuplicateUserEmailError,
  type CreateUserRecord,
  type User,
  type UserRepository
} from './user.types.js'

interface UserRow extends RowDataPacket {
  id: number | string
  name: string
  email: string
  created_at: Date | string
}

interface MysqlErrorLike {
  code?: unknown
}

function toUser(row: UserRow): User {
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
    const [rows] = await this.pool.execute<UserRow[]>(
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
    const [rows] = await this.pool.execute<UserRow[]>(
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

    const createdUser = await this.findById(result.insertId)

    if (!createdUser) {
      throw new Error(`创建用户后无法读取记录：${result.insertId}`)
    }

    return createdUser
  }
}
```

先把这个文件折叠成三个区块理解：

```text
第一区：UserRow
  MySQL 返回的数据长什么样

第二区：toUser、isDuplicateEntry
  把数据库格式转成程序格式，把 MySQL 错误识别出来

第三区：MysqlUserRepository
  真正执行 SELECT 和 INSERT
```

### 6.1 findByEmail

```ts
const [rows] = await this.pool.execute<UserRow[]>(sql, [email])
```

SQL 中的 `?` 与 `[email]` 对应。不要把 email 拼进 SQL 字符串，否则会产生 SQL 注入风险。

找到数据时用 `toUser()` 转成 Entity；找不到返回 `null`。Repository 不决定“找不到”是不是业务错误。

### 6.2 create

创建过程不是只有 INSERT：

```text
INSERT
  ↓ 得到 insertId
SELECT by id
  ↓ 得到数据库生成的 created_at
toUser
  ↓
返回完整 User
```

### 6.3 为什么捕获 ER_DUP_ENTRY

即使 Service 已经查询过邮箱，两个并发请求仍可能同时认为邮箱不存在。数据库唯一索引会让后插入的请求得到 `ER_DUP_ENTRY`。

Repository 把 MySQL 专用错误转换成 `DuplicateUserEmailError`。Service 不需要认识 MySQL 错误码。

检查点：这个文件可以导入 mysql2，但不能导入 Express Response，也不能返回 HTTP 状态码。

---

## 7. 文件四：user.service.ts——只看业务允许不允许

新建 `src/modules/user/user.service.ts`：

```ts
import { AppError } from '../../shared/errors/app-error.js'
import type { CreateUserDto } from './user.schema.js'
import {
  DuplicateUserEmailError,
  type User,
  type UserOutput,
  type UserRepository
} from './user.types.js'

function emailAlreadyExists(): AppError {
  return new AppError(
    409,
    'EMAIL_ALREADY_EXISTS',
    '该邮箱已被使用'
  )
}

function toUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  }
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

读 Service 时，不要先研究 import。直接从 `create()` 开始读：

```text
1. repository.findByEmail(email)
2. 已存在 → 抛 409 业务错误
3. 不存在 → repository.create(input)
4. 创建结果转成 UserOutput
5. 并发唯一键冲突 → 仍然转成相同 409
```

Service 不知道：

- URL 是什么；
- 请求是不是 POST；
- HTTP Response 怎么写；
- SQL 的表名是什么；
- MySQL Pool 怎么创建。

Service 只知道业务动作和 `UserRepository` 契约。

`toUserOutput()` 暂时放在 Service，是学习版有意做的合并。等输出转换变多或多个用例重复使用时，再单独拆出 Mapper。

检查点：在这个文件搜索 `express`、`mysql2`、`SELECT`、`INSERT`，都不应该出现。

---

## 8. 文件五：user.controller.ts——只做 HTTP 控制

新建 `src/modules/user/user.controller.ts`：

```ts
import type { RequestHandler } from 'express'
import { sendSuccess } from '../../shared/http/api-response.js'
import type { CreateUserRequest } from './user.schema.js'
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

Controller 只有三步：

```text
取参数
  ↓
调用 Service
  ↓
返回 HTTP 响应
```

为什么读取 `res.locals.validated`，而不是 `req.body`？

因为 Validate Middleware 已经把校验成功、去掉空格、邮箱转小写后的结果放在那里。读取原始 `req.body` 会绕过这道安全边界。

为什么返回 201？

因为创建了新资源。选择 HTTP 状态码属于 Controller 的控制职责。

为什么没有 `try/catch`？

Express 5 会把 async Handler 抛出的错误交给全局 Error Middleware。Controller 不需要复制统一错误处理。

检查点：Controller 中没有 `if (existingUser)`，也没有 SQL。

---

## 9. 文件六：user.route.ts——只声明执行顺序

新建 `src/modules/user/user.route.ts`：

```ts
import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware.js'
import type { UserController } from './user.controller.js'
import { createUserRequestSchema } from './user.schema.js'

export function createUserRouter(
  controller: UserController
): Router {
  const router = Router()

  router.post(
    '/',
    validate(createUserRequestSchema),
    controller.create
  )

  return router
}
```

Route 可以读成一句中文：

```text
收到 POST /
→ 先用 createUserRequestSchema 校验
→ 成功后执行 controller.create
```

这里的 `/` 不是完整地址。App 会把 Router 挂载到 `/api/v1/users`：

```text
/api/v1/users + /
= /api/v1/users
```

检查点：Route 没有业务判断，也没有直接调用 Service。

---

## 10. 不建 user.module.ts，直接在 server.ts 组装

生产版用 `user.module.ts` 封装依赖组装。学习版为了少跳一个文件，直接在 `server.ts` 看清楚对象是怎么连起来的。

完整 `src/server.ts`：

```ts
import 'dotenv/config'
import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import {
  checkDatabaseConnection,
  createDatabase
} from './database/mysql.js'
import { createUserController } from './modules/user/user.controller.js'
import { MysqlUserRepository } from './modules/user/user.repository.js'
import { createUserRouter } from './modules/user/user.route.js'
import { UserService } from './modules/user/user.service.js'

async function main(): Promise<void> {
  const env = loadEnv(process.env)
  const pool = createDatabase(env)

  await checkDatabaseConnection(pool)

  const repository = new MysqlUserRepository(pool)
  const service = new UserService(repository)
  const controller = createUserController(service)
  const userRouter = createUserRouter(controller)
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

只看最关键的五行：

```ts
const repository = new MysqlUserRepository(pool)
const service = new UserService(repository)
const controller = createUserController(service)
const userRouter = createUserRouter(controller)
const app = createApp(userRouter)
```

依赖关系非常直白：

```text
Pool
  ↓
MysqlUserRepository
  ↓
UserService
  ↓
UserController
  ↓
UserRouter
  ↓
Express App
```

这就是手动依赖注入。不是只有使用 Java Spring 的 `@Autowired` 才叫依赖注入。

当你以后增加多个业务模块，`server.ts` 组装代码变长，再把这四个 User 对象的创建搬到 `user.module.ts`。

---

## 11. 现在重新跟读一次，不要打开所有文件

在编辑器按下面顺序操作。

### 11.1 从 Route 开始

打开 `user.route.ts`，只回答：

```text
POST / 先校验，然后执行 controller.create。
```

Schema 的细节第一遍不用展开。

### 11.2 跳到 Controller

按住 Ctrl 点击 `controller.create`，进入 `user.controller.ts`，只回答：

```text
Controller 取出 body，调用 service.create，成功返回 201。
```

`CreateUserRequest` 看不懂时才打开 schema；暂时也可以相信它代表已校验请求。

### 11.3 跳到 Service

进入 `service.create`，只回答：

```text
先查邮箱；存在就报 409；不存在就创建。
```

不要在这里研究 SQL，因为 Service 里本来就不应该有 SQL。

### 11.4 跳到 Repository

分别进入：

```text
repository.findByEmail
repository.create
```

到这里才研究 SELECT、INSERT、占位符和数据库 Row 转换。

### 11.5 到此停止

一次阅读只解决一个问题。不要继续跳到 AppError、Pool、Express 类型声明、mysql2 源码。它们是主线之外的公共工具。

你已经完成了这次请求的跟踪：

```text
Route → Controller → Service → Repository
```

---

## 12. 手工验证三种结果

先运行类型检查：

```powershell
npm run typecheck
```

启动服务：

```powershell
npm run dev
```

### 12.1 创建成功

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

预期 HTTP 201：

```json
{
  "success": true,
  "code": "USER_CREATED",
  "message": "用户创建成功",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "createdAt": "2026-08-04T08:00:00.000Z"
  }
}
```

### 12.2 参数错误

```powershell
$body = @{
  name = 'A'
  email = 'wrong'
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:3000/api/v1/users' `
  -ContentType 'application/json' `
  -Body $body
```

预期 HTTP 400，错误码是 `VALIDATION_ERROR`。这次请求在 Schema 处停止，不进入 Controller、Service 和 Repository。

### 12.3 邮箱重复

把第一次成功请求再次执行。预期 HTTP 409：

```json
{
  "success": false,
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "该邮箱已被使用",
  "details": null
}
```

这次请求进入 Service，在预查询或数据库唯一索引处被拒绝。

---

## 13. 最小 Service 测试

测试文件不属于生产 User 模块，所以不计入 6 个文件。为了同时测试 Service 和 API，我们准备一个 Fake Repository。

新建 `tests/helpers/fake-user.repository.ts`：

```ts
import type {
  CreateUserRecord,
  User,
  UserRepository
} from '../../src/modules/user/user.types.js'

export class FakeUserRepository implements UserRepository {
  public readonly users: User[]
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
    const user: User = {
      id: this.nextId,
      name: input.name,
      email: input.email,
      createdAt: new Date('2026-08-04T08:00:00.000Z')
    }

    this.nextId += 1
    this.users.push(user)
    return user
  }
}
```

新建 `tests/unit/user.service.test.ts`：

```ts
import { describe, expect, it } from 'vitest'
import type { User } from '../../src/modules/user/user.types.js'
import { UserService } from '../../src/modules/user/user.service.js'
import { FakeUserRepository } from '../helpers/fake-user.repository.js'

describe('UserService.create', () => {
  it('创建用户并返回公开输出', async () => {
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
      createdAt: '2026-08-04T08:00:00.000Z'
    })
  })

  it('邮箱已经存在时抛出 409 业务错误', async () => {
    const existingUser: User = {
      id: 1,
      name: '原用户',
      email: 'same@example.com',
      createdAt: new Date('2026-08-03T08:00:00.000Z')
    }
    const repository = new FakeUserRepository([existingUser])
    const service = new UserService(repository)

    await expect(
      service.create({
        name: '新用户',
        email: 'same@example.com'
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      code: 'EMAIL_ALREADY_EXISTS'
    })
  })
})
```

Service 测试不启动 Express，也不连接 MySQL。它只回答：业务规则是否正确？

运行：

```powershell
npm run test:unit
```

---

## 14. 最小 API 测试

新建 `tests/api/user.api.test.ts`：

```ts
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../src/app.js'
import { createUserController } from '../../src/modules/user/user.controller.js'
import { createUserRouter } from '../../src/modules/user/user.route.js'
import { UserService } from '../../src/modules/user/user.service.js'
import { FakeUserRepository } from '../helpers/fake-user.repository.js'

function createTestApp() {
  const repository = new FakeUserRepository()
  const service = new UserService(repository)
  const controller = createUserController(service)
  const userRouter = createUserRouter(controller)
  return createApp(userRouter)
}

describe('POST /api/v1/users', () => {
  it('清洗参数并返回 HTTP 201', async () => {
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
        createdAt: '2026-08-04T08:00:00.000Z'
      }
    })
  })

  it('非法参数在进入 Controller 前返回 HTTP 400', async () => {
    const response = await request(createTestApp())
      .post('/api/v1/users')
      .send({
        name: 'A',
        email: 'wrong'
      })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      success: false,
      code: 'VALIDATION_ERROR'
    })
  })
})
```

注意 `createTestApp()` 中的四行：

```ts
const repository = new FakeUserRepository()
const service = new UserService(repository)
const controller = createUserController(service)
const userRouter = createUserRouter(controller)
```

生产环境和测试环境的 Service、Controller、Route 完全相同，只替换 Repository：

```text
生产：MysqlUserRepository
测试：FakeUserRepository
```

这就是 Repository 接口真正带来的价值。

运行：

```powershell
npm run test:api
```

---

## 15. 六个文件之间到底谁 import 谁

不要背全部 import 语句，只看稳定的依赖方向：

```text
user.route.ts
  ├─ 使用 user.schema.ts
  └─ 使用 user.controller.ts

user.controller.ts
  ├─ 使用 user.schema.ts 的请求类型
  └─ 使用 user.service.ts

user.service.ts
  ├─ 使用 user.schema.ts 的 DTO
  └─ 使用 user.types.ts 的 Repository 契约

user.repository.ts
  └─ 使用 user.types.ts 的 Entity 和 Repository 契约
```

依赖大致从外向内指向：

```text
Route → Controller → Service → Types ← Repository
  ↓                         ↑
Schema ─────────────────────┘
```

`user.types.ts` 像一份小合同，Service 和 Repository 都能看，但它不主动调用任何层。

### 15.1 import type 不会产生运行调用

看到：

```ts
import type { UserService } from './user.service.js'
```

不要把它理解成“程序现在调用了 Service”。`import type` 只让 TypeScript 知道形状，编译后会消失。

真正发生运行调用的是：

```ts
await service.create(body)
```

区分“类型依赖”和“函数调用”，脑子会清楚很多。

---

## 16. 从 6 个文件怎么变成生产版 10 个文件

等你已经可以独立写通接口，再按三个步骤拆。

### 16.1 第一次拆分：拆 user.types.ts

当前：

```text
user.types.ts
  ├─ User
  ├─ UserOutput
  ├─ CreateUserRecord
  ├─ UserRepository
  └─ DuplicateUserEmailError
```

生产版：

```text
user.entity.ts
  └─ User

user.dto.ts
  └─ UserOutput、请求 DTO

user.repository.ts
  └─ CreateUserRecord、UserRepository、数据层错误
```

文件数量从 6 变成 8。拆分原因不是追求文件多，而是内部 Entity、公开 DTO 和持久化契约开始分别变化。

### 16.2 第二次拆分：拆 MySQL 实现和 Mapper

当前：

```text
user.repository.ts
  ├─ UserRow
  ├─ toUser
  └─ MysqlUserRepository
```

生产版：

```text
user.mapper.ts
  └─ UserRow、toUser、toUserOutput

user.mysql-repository.ts
  └─ MysqlUserRepository 和 SQL
```

文件数量从 8 变成 9。拆分原因是转换规则变多，需要单独测试或被多个 Repository 方法复用。

### 16.3 第三次拆分：增加 user.module.ts

当前依赖组装放在 `server.ts`：

```text
Repository → Service → Controller → Router
```

生产版把它搬到：

```text
user.module.ts
```

文件数量从 9 变成 10。拆分原因是 server 中出现多个模块，启动文件需要保持简洁。

完整演进关系：

| 学习版 | 生产版 |
|---|---|
| `user.types.ts` | `user.entity.ts` + `user.dto.ts` + `user.repository.ts` |
| `user.schema.ts` | `user.schema.ts` |
| `user.repository.ts` | `user.mapper.ts` + `user.mysql-repository.ts` |
| `user.service.ts` | `user.service.ts` |
| `user.controller.ts` | `user.controller.ts` |
| `user.route.ts` | `user.route.ts` |
| `server.ts` 中组装 | `user.module.ts` 中组装 |

你会发现：10 文件没有增加新的请求步骤，只是把已有职责放进更独立的文件。

---

## 17. 什么时候不要拆，什么时候应该拆

### 17.1 暂时不要拆

出现以下情况时，保持 6 文件通常更适合学习和小项目：

- User 只有一两个接口；
- 类型定义一屏可以看完；
- 只有 MySQL 一种 Repository 实现；
- Row 转 Entity 只有少量字段改名；
- `server.ts` 只组装一两个业务模块；
- 你还不能脱离教程复述一次请求的完整路线。

### 17.2 可以开始拆

出现这些信号时，再拆有真实收益：

- User 已有创建、列表、详情、修改、删除等多个用例；
- Entity 出现内部字段，而 Output 必须隐藏部分字段；
- DTO 和 Repository 契约越来越长，经常分别修改；
- Mapper 有多种 Row、日期、枚举、BigInt 转换；
- 同时存在 MySQL Repository 和 Fake/缓存/第三方实现；
- `server.ts` 被大量模块组装代码淹没；
- 团队成员经常同时修改同一个大文件，产生冲突。

拆文件的判断标准不是“Java 项目都这么写”，而是：

> 这个职责是否已经可以独立变化、独立测试，而且继续放在一起会明显妨碍阅读？

如果答案是否定的，就先别拆。

---

## 18. 给自己的一张防迷路卡片

以后读任何 Express 分层接口，先写下四句话：

```text
Route：哪个地址？
Controller：取什么，返回什么？
Service：业务允许吗？
Repository：数据怎么存取？
```

阅读时遵守三条规则：

1. 第一遍只跟函数调用，不追类型定义；
2. 第二遍再看 Schema 和 types；
3. 第三遍才研究 Mapper、错误转换和依赖组装。

创建用户接口可以压缩成一句话：

```text
POST 路由校验参数，Controller 把合法 body 交给 Service，
Service 判断邮箱是否重复，Repository 用参数化 SQL 写入 MySQL，
最后 Controller 返回 HTTP 201。
```

只要这句话在脑中是连贯的，你就没有迷路。文件是为了放置职责，不是请求真的执行了 10 个不同业务步骤。

下一步不要马上继续加功能。建议关掉教程，自己从空目录手写这 6 个 User 文件；写每个文件前，先说出它只负责回答哪个问题。能独立写通后，再回到生产版对照拆分。
