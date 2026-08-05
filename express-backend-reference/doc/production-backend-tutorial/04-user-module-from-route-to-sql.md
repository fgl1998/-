# 第 4 章：User 模块——从 Route 一直走到 SQL

这一章用 `POST /api/v1/users` 贯穿整个模块。建议一边阅读，一边在编辑器打开 [src/modules/user](../../src/modules/user) 下的文件。

## 1. 为什么按业务模块放文件

小项目常见目录：

```text
controllers/
services/
repositories/
```

当模块增加后，修改 User 功能需要在三个大目录间来回跳。现在把强相关文件放到 `modules/user`，同时保留 Controller、Service、Repository 的职责边界。

模块化不等于所有东西都塞进一个文件。每个文件仍只有一个主要原因会发生变化。

## 2. 四种数据模型不要混在一起

### CreateUserDto：可信的用例输入

它由 Zod Schema 推导：

```ts
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>
export type CreateUserDto = CreateUserRequest['body']
```

如果 Schema 增加字段或修改类型，DTO 会同步变化，不会出现“运行时要求 A，TypeScript 却认为是 B”。

### UserRow：数据库返回结构

MySQL 字段使用蛇形命名：

```ts
interface UserRow {
  id: number | string
  name: string
  email: string
  created_at: Date | string
}
```

BIGINT 可能被驱动表示为数字或字符串，所以 Mapper 必须明确转换并检查 JavaScript 安全整数范围。

### User：内部业务实体

[user.entity.ts](../../src/modules/user/user.entity.ts)：

```ts
export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}
```

Entity 不包含 Express 的 Request，也不继承 mysql2 的 RowDataPacket。它表示应用内部理解的用户。

### UserOutput：对外响应模型

[user.dto.ts](../../src/modules/user/user.dto.ts)：

```ts
export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}
```

API 日期采用 ISO 字符串，而内部 Entity 使用 `Date`。以后数据库增加 `password_hash`、`deleted_at`，只要 Output 不包含它们，就不会因为直接 `res.json(row)` 而泄漏。

## 3. Mapper 负责边界转换

[user.mapper.ts](../../src/modules/user/user.mapper.ts) 提供两个方向：

```text
UserRow → User
User    → UserOutput
```

Mapper 只做确定性数据转换，不查询数据库、不判断邮箱是否重复。

```ts
export function toUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  }
}
```

## 4. Repository 接口描述“需要什么”

[user.repository.ts](../../src/modules/user/user.repository.ts)：

```ts
export interface UserRepository {
  findPage(input: { offset: number; limit: number }): Promise<User[]>
  count(): Promise<number>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(input: { name: string; email: string }): Promise<User>
  deleteById(id: number): Promise<boolean>
}
```

接口由 Service 的业务需要决定，不要把数据库所有能力无脑暴露出来。Service 只依赖这个接口，因此测试可以注入 Fake Repository，未来也可以注入 Drizzle Repository。

`DuplicateUserEmailError` 是数据层能确定的结果：唯一索引冲突。它没有 HTTP 状态，因为 Repository 不知道调用者是不是 HTTP 接口。

## 5. MySQL Repository 描述“怎么做到”

[user.mysql-repository.ts](../../src/modules/user/user.mysql-repository.ts) 实现接口。分页查询：

```sql
SELECT id, name, email, created_at
FROM users
ORDER BY id DESC
LIMIT ? OFFSET ?
```

这里的规则：

- 明确列出字段，不使用 `SELECT *`；
- 所有外部值用占位符；
- Repository 返回 Entity，不返回 mysql2 Row；
- SQL 只出现在 MySQL Repository；
- `ER_DUP_ENTRY` 转成 `DuplicateUserEmailError`；
- 创建后重新读取记录，拿到数据库生成的 ID 和时间。

为什么 `findById` 返回 `User | null`，不直接抛 404？因为“查不到”是否算错误取决于用例。某些后台任务查询不到可能只是跳过，HTTP 查询用户才需要 404。这个业务决定留给 Service。

## 6. Service 是业务用例中心

[user.service.ts](../../src/modules/user/user.service.ts) 完全不导入 Express 或 mysql2。

### 创建用户

```ts
async create(input: CreateUserDto): Promise<UserOutput> {
  const existingUser = await this.repository.findByEmail(input.email)
  if (existingUser) throw emailAlreadyExists()

  try {
    return toUserOutput(await this.repository.create(input))
  } catch (error) {
    if (error instanceof DuplicateUserEmailError) {
      throw emailAlreadyExists()
    }
    throw error
  }
}
```

为什么检查了邮箱，还要捕获重复键：

```text
请求 A 查询：不存在
请求 B 查询：不存在
请求 A 插入：成功
请求 B 插入：唯一索引冲突
```

预检查提供友好提示，数据库唯一索引解决并发竞态，两层都需要。

### 查询用户

Repository 返回 null 后，Service 转为：

```ts
new AppError(404, 'USER_NOT_FOUND', '用户不存在')
```

Controller 不判断 `if (!user)`，因此相同业务用例从定时任务或其他传输方式调用时仍保持一致。

### 分页

前端传 `page=2&pageSize=20`，SQL 需要 `offset` 和 `limit`：

```ts
const offset = (page - 1) * pageSize
```

Service 同时查询当前页和总数，再返回：

```json
{
  "page": 2,
  "pageSize": 20,
  "total": 35,
  "totalPages": 2
}
```

`totalPages` 是对客户端有意义的用例输出，不应由 MySQL Repository 拼 HTTP 响应。

## 7. Controller 只做 HTTP 控制

[user.controller.ts](../../src/modules/user/user.controller.ts) 的创建 Handler：

```ts
create: async (_req, res) => {
  const { body } = res.locals.validated as CreateUserRequest
  const user = await service.create(body)
  sendSuccess(res, 201, {
    code: 'USER_CREATED',
    message: '用户创建成功',
    data: user
  })
}
```

它只做三件事：

1. 读取已经校验的输入；
2. 调用一个 Service 用例；
3. 选择 HTTP 201 和成功响应码。

它没有 SQL、`safeParse`、邮箱重复检查或本地 `try/catch`。

“Controller 只做控制”不等于必须只有一行，而是不能承载业务和基础设施细节。

## 8. Route 只声明 HTTP 映射

[user.route.ts](../../src/modules/user/user.route.ts) 把四个接口与 Schema、Controller 组合：

```text
GET    /api/v1/users       列表
GET    /api/v1/users/:id   单个用户
POST   /api/v1/users       创建
DELETE /api/v1/users/:id   删除
```

`/api/v1` 由 `app.ts` 挂载，模块内部不重复写全局前缀。未来发布不兼容的 v2 时，可以并行挂载新 Router。

当前删除使用硬删除，因为示例还没有审计和恢复需求。真实业务若要求可恢复，应新增明确的软删除设计和 Migration，而不是只把 `DELETE` 偷换成一个字段更新。

## 9. Module 是手动依赖注入的组合根

[user.module.ts](../../src/modules/user/user.module.ts)：

```ts
export function createUserModule(repository: UserRepository): Router {
  const service = new UserService(repository)
  const controller = createUserController(service)
  return createUserRouter(controller)
}
```

这就是依赖注入，不一定需要装饰器或大型容器。依赖显式写出来有三个优点：

- 阅读函数签名就知道模块需要什么；
- 测试传 Fake Repository；
- 生产启动传 MysqlUserRepository。

[server.ts](../../src/server.ts) 是整个应用的组合根：

```ts
const pool = createDatabase(env)
const repository = new MysqlUserRepository(pool)
const userRouter = createUserModule(repository)
const app = createApp({ userRouter, ... })
```

## 10. 完整跟踪一次 POST 请求

请求：

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "  张三  ",
  "email": " ZhangSan@Example.COM "
}
```

执行顺序：

1. Request Context 生成 ID 并开始计时；
2. JSON Parser 生成 `req.body`；
3. Route 匹配 POST `/`；
4. Zod 得到 `{ name: '张三', email: 'zhangsan@example.com' }`；
5. Controller 调用 `service.create()`；
6. Service 调用 `findByEmail()`；
7. MySQL Repository 执行参数化 SELECT；
8. 不存在时执行参数化 INSERT；
9. Repository 把 UserRow 转为 User；
10. Service 把 User 转为 UserOutput；
11. Controller 返回 HTTP 201；
12. Request Context 记录状态码和耗时。

响应：

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

下一章用测试证明这些边界真的成立：[测试、运行、构建与常见问题](./05-testing-running-and-debugging.md)。
