# 🔍 user 模块代码审查报告

> ✍️ 先说结论：目前有 **7 个应该优先改的问题**，除此之外还有一些 P2 级的代码整理问题。
> 各节编号沿用原文档的问题编号（1 ~ 15），方便对照。

---

## 📑 目录

| 章节 | 内容 | 数量 |
|:---|:---|:---:|
| 🚨 P0 · 必须立即修复 | dotenv 初始化、`updateUser({})` 非法 SQL、email 唯一键冲突 | 3 |
| 🟠 P1 · 重要，建议尽快改 | `findByEmail()` 残缺 User、bio/image 类型、truthy 判断、登录口径、缺 username | 5 |
| 🟡 P2 · 代码整理 | 注册并发、CreateUserData、JWT、401/403、Controller、import、image 长度 | 7 |
| 🏗️ 最终目标 | user 模块整理后的目录结构 | 1 |
| 🗺️ 推荐修改顺序 | 11 步清单 | 11 |
| 💡 最重要的一点 | 数据流全景 | 1 |

---

## 🎯 问题总览

**优先修复（P0 / P1，共 7 条）：**

| 优先级 | 问题 | 是否可能出 bug |
|:---:|:---|:---:|
| 🔴 P0 | dotenv 和 JWT 初始化顺序 | ✅ 是（可能启动直接报错） |
| 🔴 P0 | `updateUser({})` 会生成非法 SQL | ✅ 是 |
| 🔴 P0 | 更新 email 遇到唯一键冲突会变 500 | ✅ 是 |
| 🟠 P1 | `findByEmail()` 返回残缺的 User | ⚠️ 类型与运行时不一致 |
| 🟠 P1 | bio/image 的 null 类型定义错误 | ✅ 是 |
| 🟠 P1 | 更新字段用了 truthy 判断 | ⚠️ 无法清空 bio/image |
| 🟠 P1 | login/update 行为和你自己的 API 文档不一致 | ⚠️ 接口契约混乱 |

> 📌 注：最后一条「文档不一致」实际包含 2 个问题（登录口径、更新缺 username），详见下文 P1 第 8、9 条。

**P2 · 代码整理（共 7 条）：**

| 优先级 | 问题 | 说明 |
|:---:|:---|:---|
| 🟡 P2 | 注册存在并发重复插入问题 | 偶发 500，需补 `ER_DUP_ENTRY` 转换 |
| 🟡 P2 | `CreateUserData` 定义了但没真正用上 | 分层边界模糊 |
| 🟡 P2 | JWT 方案有复杂化风险 | 当前方案已够用 |
| 🟡 P2 | 401 / 403 状态码用反了 | 语义错误 |
| 🟡 P2 | Controller 冗余，以后可简化 | 暂不影响 |
| 🟡 P2 | 存在无用 import | 代码噪音，直接清理 |
| 🟡 P2 | image 长度和数据库不对齐 | `max(100)` vs `VARCHAR(500)` |

---

## 🚨 P0 · 必须立即修复

### 🔴 P0 · 10. JWT 有一个比较隐蔽的启动问题

> ⚠️ 这是我比较建议你**立即处理**的。

**现状 —— 你 app.ts：**

```ts
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { errorHandler } from './middleware/error-handler.js'
import { userRouter } from './modules/user/user.route.js'


dotenv.config()
```

而你的模块链是：

```text
userRouter
 ↓
user.controller
 ↓
user.service
 ↓
jwt.ts
```

`jwt.ts` 在**模块加载时**就读环境变量：

```ts
const JWT_SECRET = process.env.JWT_SECRET


if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}
```

你的项目又是：

```json
"type": "module"
```

所以环境变量配置最好不要依赖写在 app 主体中“稍后执行”的 `dotenv.config()`。

**✅ 最简单的改法**

入口文件第一行：

```ts
import 'dotenv/config'


import express from 'express'
import cors from 'cors'
...
```

更成熟一点以后可以做：

```text
config/
└── env.ts
```

统一：

```ts
import 'dotenv/config'


export const env = {
  JWT_SECRET: process.env.JWT_SECRET!,
  DB_HOST: process.env.DB_HOST!,
  ...
}
```

然后 JWT：

```ts
import { env } from '../config/env.js'
```

以后所有环境变量都从 `env.JWT_SECRET` 读取。

> 💡 不过你现在还是学习阶段，先 `import 'dotenv/config'` 就够了。

---

### 🔴 P0 · 2. `updateUser({})` 现在一定有问题

**现状 —— 你的 schema：**

```ts
export const UpdateUserSchema = z.object({
  email: ...optional(),
  password: ...optional(),
  bio: ...optional(),
  image: ...optional(),
})
```

所以 `{}` 是**合法的**。

然后 repository：

```ts
const fileds: string[] = []


...


await pool.execute(
  `
  update users set ${fileds.join(',')} where id=?
  `,
  [...values, id]
)
```

于是 SQL 变成：

```sql
UPDATE users
SET
WHERE id = ?
```

直接 MySQL 语法错误 → 全局错误处理 → `500 INTERNAL_SERVER_ERROR`。

> ⚠️ **这个必须修。**

**✅ 建议：在 schema 就拦截**

```ts
export const UpdateUserSchema = z.object({
  email: z.string().trim().email('邮箱格式错误').optional(),
  password: z.string().min(6).max(20).optional(),
  bio: z.string().max(100).nullable().optional(),
  image: z.string().max(500).nullable().optional(),
}).refine(
  data => Object.keys(data).length > 0,
  {
    message: '至少需要提供一个需要修改的字段'
  }
)
```

> 💡 **为什么放 schema**：“更新接口至少传一个字段”属于**输入规则**，不属于**业务逻辑**，所以非常适合 schema 负责。

---

### 🔴 P0 · 7. 更新 email 现在也有重复问题

**场景 —— 比如数据库里有：**

| 用户 | email |
|:---|:---|
| 用户1 | `a@qq.com` |
| 用户2 | `b@qq.com` |

用户2 提交：

```json
{
  "email": "a@qq.com"
}
```

你 service 现在直接更新：

```ts
const user =
  await userRepository.updateUserById(userId, input)
```

数据库：

```text
ER_DUP_ENTRY
```

最后：

```text
500
```

所以更新 email 同样需要处理唯一键冲突。这里有两种办法。

**✅ 我更推荐：双保险（和注册完全一样）**

```text
service
    ↓
提前检查
    ↓
EmailAlreadyExistsError

同时

repository / 数据库
    ↓
ER_DUP_ENTRY
    ↓
兜底转换
```

---

## 🟠 P1 · 重要，建议尽快改

### 🟠 P1 · 1. 最大的问题之一：`findByEmail()` 的返回类型不对

**现状 —— 你现在：**

```ts
async findByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.execute<UserRow[]>(
    `
    select id,username,email,created_at
    from users
    where email=?
    limit 1
    `,
    [email]
  )


  return rows[0] ? toUser(rows[0]) : null
}
```

但是 `toUser()`：

```ts
return {
  id: row.id,
  username: row.username,
  email: row.email,
  password_hash: row.password_hash,
  image: row.image,
  bio: row.bio,
  createdAt: row.created_at,
  updatedAt: row.updated_at
}
```

你的 SQL **根本没查**：

- ❌ `password_hash`
- ❌ `image`
- ❌ `bio`
- ❌ `updated_at`

结果 TypeScript 却告诉 service：

```ts
Promise<User | null>
```

实际上你拿到的是：

```ts
{
  id: 1,
  username: 'xxx',
  email: 'xxx',
  password_hash: undefined,
  bio: undefined,
  image: undefined,
  updatedAt: undefined
}
```

这是一个非常典型的 repository 类型设计问题。

**✅ 推荐你现在直接改成**

既然这个函数只用于：

```ts
const existingUser = await userRepository.findByEmail(input.email)


if (existingUser) {
  throw new EmailAlreadyExistsError()
}
```

那么它根本就不需要返回 User。直接：

```ts
existsByEmail(email: string): Promise<boolean>
```

SQL：

```ts
async existsByEmail(email: string): Promise<boolean> {
  const [rows] = await pool.execute<UserRow[]>(
    `
    SELECT id
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  )


  return rows.length > 0
}
```

进一步甚至单独定义：

```ts
interface IdRow extends RowDataPacket {
  id: number
}
```

这会更准确。

---

### 🟠 P1 · 4. bio/image 类型必须改

你的数据库明确写的是：

```sql
bio TEXT NULL,
image VARCHAR(500) NULL,
```

但是：

| 层 | 当前类型 |
|:---|:---|
| `UserRow` | `bio: string` / `image: string` |
| `User` | `bio: string` / `image: string` |
| `UserOutput` | `bio: string` / `image: string` |

应该统一为：

```text
MySQL
   ↓
UserRow
   ↓
User
   ↓
UserOutput


string | null
string | null
string | null
string | null
```

> ⚠️ 不要在中间某层“假装它一定有值”。

---

### 🟠 P1 · 3. 你的 update 判断方式有 bug

**现状 —— 现在：**

```ts
if (input.bio) {
  fileds.push('bio=?')
  values.push(input.bio)
}
```

如果用户提交：

```json
{
  "bio": ""
}
```

想清空简介：

```ts
if ("")
```

是 `false`。

所以不会更新。同样 `image: ""` 也无法清空。

> ⚠️ 这里**不要判断 truthy**。

**✅ 应该判断：**

```ts
if (input.bio !== undefined) {
  fields.push('bio=?')
  values.push(input.bio)
}
```

同理：

```ts
if (input.email !== undefined) {}


if (input.password !== undefined) {}


if (input.image !== undefined) {}
```

> 💡 **这是以后写动态 UPDATE SQL 很重要的一条：判断字段有没有传，用 `!== undefined`，不要直接 `if(value)`。**

因为语义完全不同：

| 值 | 含义 |
|:---|:---|
| `undefined` | 没传 |
| `""` | 用户明确传了空字符串 |
| `null` | 用户明确要求清空 |
| `0` | 用户明确传了 0 |
| `false` | 用户明确传了 false |

---

### 🟠 P1 · 8. 你的 API 文档和实际代码已经出现不一致（登录）

你自己的 api.md 写登录：

```sql
SELECT ...
FROM users
WHERE email = 'lisi@test.com';
```

也就是：

```json
{
  "email": "...",
  "password": "..."
}
```

但代码现在：

```ts
export const LoginSchema = z.object({
  username: ...,
  password: ...
})
```

然后：

```ts
userRepository.findByUsername(input.username)
```

> ⚠️ 你得选一个。

**✅ 如果按 RealWorld，我建议登录用 email：**

```json
{
  "email": "xxx@qq.com",
  "password": "123456"
}
```

然后：

```ts
findByEmailForLogin(email)
```

**但是注意：**

这时候就不能用刚才那个 `existsByEmail()`，因为登录需要：

```text
id
username
email
password_hash
bio
image
...
```

所以 repository 最终可以有：

```ts
existsByEmail(email)
findByEmail(email)
```

这是完全合理的。一个用于“**有没有**”，一个用于“**把完整用户查出来**”。

---

### 🟠 P1 · 9. 更新用户缺了 username

你的 api.md 更新用户写的是：

```sql
UPDATE users
SET
  username = 'lisi',
  email = 'lisi@test.com',
  password_hash = '...'
WHERE id = '2';
```

但是 `UpdateUserSchema`：

```ts
{
  email,
  password,
  bio,
  image
}
```

没有 username。repository 也没有 username。

> ✅ 如果你的业务允许改用户名，就补上：

```ts
username: z.string()
  .trim()
  .min(1)
  .max(20)
  .optional()
```

然后同 email 一样：**检查 username 是否重复 + 数据库 UNIQUE 兜底**。

---

## 🟡 P2 · 代码整理

### 🟡 P2 · 5. 注册存在一个我们之前讨论过的并发问题

你现在注册逻辑：

```ts
let existingUser =
  await userRepository.findByUsername(input.username)


if (existingUser) {
  throw new UsernameAlreadyExistsError()
}


existingUser =
  await userRepository.findByEmail(input.email)


if (existingUser) {
  throw new EmailAlreadyExistsError()
}


await userRepository.create(...)
```

普通情况下没问题。**但是：**

```text
请求 A                     请求 B


查 email → 没有
                           查 email → 没有


INSERT
                           INSERT
```

数据库有：

```sql
UNIQUE KEY uk_users_username (username),
UNIQUE KEY uk_users_email (email)
```

所以其中一个 INSERT 会：`ER_DUP_ENTRY`

然后现在你的代码没有识别它：

```text
ER_DUP_ENTRY
     ↓
repository 没转换
     ↓
service 不认识
     ↓
errorHandler
     ↓
500
```

> 🎯 **这就是之前我们讨论的：先查一次，是为了用户体验。数据库 UNIQUE，才是真正的数据安全底线。**

所以这里 repository 的 `create()` 应该补异常转换。大概：

```ts
try {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    INSERT INTO users(username,email,password_hash)
    VALUES(?,?,?)
    `,
    [input.username, input.email, input.passwordHash]
  )


  ...
} catch (error: any) {
  if (error?.code === 'ER_DUP_ENTRY') {
    // 根据 constraint / message 判断 username 还是 email
    ...
  }


  throw error
}
```

> ✅ 这个是**应该处理的底层数据库异常**。

---

### 🟡 P2 · 6. 你已经定义 CreateUserData，但是没真正用上

schema 里：

```ts
export interface CreateUserData {
  username: string
  email: string
  passwordHash: string
}
```

这个设计思路其实是对的。因为：

```text
Controller
    ↓
CreateUserInput
password = 明文
    ↓
Service bcrypt
    ↓
CreateUserData
passwordHash = 密文
    ↓
Repository
```

但你现在 repository：

```ts
create(input: CreateUserInput): Promise<User>
```

于是又把 repository 和 API 输入绑定起来了。

**✅ 建议真正落实：**

```ts
interface CreateUserData {
  username: string
  email: string
  passwordHash: string
}
```

service：

```ts
const data: CreateUserData = {
  username: input.username,
  email: input.email,
  passwordHash: await bcrypt.hash(input.password, 12)
}


const user = await userRepository.create(data)
```

repository：

```ts
create(data: CreateUserData): Promise<User>
```

然后：

```ts
[
  data.username,
  data.email,
  data.passwordHash
]
```

这样层次就很清楚：

```text
CreateUserInput
      ↓
   Service
      ↓
CreateUserData
      ↓
 Repository
```

> 💡 这是我比较建议你**现在就养成的习惯**。

---

### 🟡 P2 · 11. JWT 本身目前够用，不要继续复杂化

你现在：

```ts
sign({ id: existingUser.id })
```

然后：

```ts
const payload = verify(token)
req.userId = payload.id
```

同时你也已经给 Express Request 做了：

```ts
interface Request {
  userId?: number
}
```

> ✅ 这套对于你当前 RealWorld 项目**完全够**。

现在不用上：

- Refresh Token
- Redis Token 黑名单
- JWT rotation
- 设备管理
- tokenVersion
- OAuth
- RBAC

这些先不碰。

---

### 🟡 P2 · 12. 401 / 403 建议现在改正

你自己的 API 文档其实已经写对了：

| 状态码 | 语义 |
|:---|:---|
| `401 Unauthorized` | 未登录、Token 无效 |
| `403 Forbidden` | 已经登录，但是没有权限 |

但是代码：

```ts
export class UserUnauthrized extends AppError {
  super(
    'UNAUTHORIZED',
    403,
    '未授权'
  )
}
```

`TokenInvalid` 也是 403。`InvalidCredentials`（用户名或密码错误）目前也是 403。

> ✅ **建议**：`UserUnauthrized`、`TokenInvalid`、`InvalidCredentials` 都改 `401`。

这样以后非常清楚：

| 状态码 | 语义 |
|:---|:---|
| `401` | 我是谁都不知道 / 身份认证失败 |
| `403` | 我知道你是谁，但是你没资格干这件事 |

---

### 🟡 P2 · 13. Controller 可以暂时保留，但有个地方可以以后简化

现在 controller：

```ts
try {
  const user = await userService.login(input)


  return res.status(200).json(...)
} catch (error) {
  next(error)
}
```

你的项目已经是：

```json
"express": "5.2.1"
```

所以以后可以把 controller 简化不少。

> 💡 不过你现在刚学“错误一路向上传递”的机制，我反而建议**暂时保留**。因为这样你脑子里的调用链非常清楚：

```text
Repository
   ↓ throw
Service
   ↓ throw
Controller
   ↓ next(error)
errorHandler
```

等你完全理解之后，再利用 Express 5 简化。

---

### 🟡 P2 · 14. 有一些明显的无用 import，可以清理

repository 里面：

- `CreateUserData`
- `LoginInput`
- `EmailAlreadyExistsError`
- `InvalidCredentialsError`
- `bcrypt`
- `fi`

其中好几个现在根本没使用。特别是：

```ts
import { fi } from 'zod/v4/locales'
```

这个明显是误 import，**删掉**。

service：

```ts
import { sign, verify } from '../../utils/jwt.js'
```

实际上只用了 `sign`。改：

```ts
import { sign } from '../../utils/jwt.js'
```

> ✅ 这些虽然不是业务 bug，但现在就可以清理。

---

### 🟡 P2 · 15. image 长度和数据库最好对齐

| 位置 | 当前 |
|:---|:---|
| 数据库 | `image VARCHAR(500)` |
| schema | `image: z.string().max(100).optional()` |

图片 URL 100 字符其实很容易超过。

**✅ 建议：**

```ts
image: z.string()
  .trim()
  .max(500)
  .nullable()
  .optional()
```

甚至之后可以 `.url()`，但当前不是必须。

---

## 🏗️ 最终目标：user 模块结构

> ✅ 我建议你最终把 user 模块整理成这个状态。**不用增加文件。**

```text
user/
│
├── user.schema.ts
│   ├── CreateUserSchema
│   ├── LoginSchema
│   ├── UpdateUserSchema
│   ├── CreateUserInput
│   ├── LoginInput
│   ├── UpdateUserInput
│   └── CreateUserData
│
├── user.dto.ts
│   ├── UserOutput
│   └── LoginOutput
│
├── user.entity.ts
│   └── User
│
├── user.mapper.ts
│   ├── UserRow
│   └── toUser()
│
├── user.repository.ts
│   ├── existsByEmail()
│   ├── existsByUsername()
│   ├── findByEmail()
│   ├── findById()
│   ├── create()
│   └── updateUserById()
│
├── user.service.ts
│   ├── create()
│   ├── login()
│   ├── getUser()
│   └── updateUserById()
│
├── user.controller.ts
├── user.route.ts
└── user.error.ts
```

> 🚫 你现在**不要再继续抽象更多层**。例如现在暂时不用：

```text
BaseRepository
BaseService
BaseController
ResponseFactory
AbstractMapper
GenericRepository<T>
```

这种东西现在只会增加理解成本。

---

## 🗺️ 推荐修改顺序

> ✅ 建议严格按这个顺序：

- [ ] ① 修 JWT dotenv 初始化
- [ ] ② 修 bio/image `string | null`
- [ ] ③ 修 UpdateUserSchema 禁止 `{}`
- [ ] ④ update 判断全部改成 `!== undefined`
- [ ] ⑤ CreateUserData 真正用于 repository
- [ ] ⑥ findByEmail 残缺 User 问题
- [ ] ⑦ 注册 `ER_DUP_ENTRY` → 业务错误
- [ ] ⑧ 更新 email/username 重复处理
- [ ] ⑨ login 到底 email 还是 username，统一文档和代码
- [ ] ⑩ 401 / 403
- [ ] ⑪ 清无用 import

---

## 💡 最重要的一点

你这个项目现在已经不用继续纠结“分几层才专业”了。真正值得学的是下面这条**数据流**：

```text
HTTP 请求
   │
   ▼
Route
   │
   ├── authMiddleware
   ├── validateBody
   ▼
Controller
   │
   │ CreateUserInput
   ▼
Service
   │
   ├── 业务规则
   ├── 查重
   ├── bcrypt
   │
   │ CreateUserData
   ▼
Repository
   │
   ├── SQL
   ├── MySQL异常转换
   ▼
Mapper
   │
   ▼
Entity
   │
   ▼
Service
   │
   │ UserOutput
   ▼
Controller
   │
   ▼
HTTP Response

任何地方 throw
        │
        ▼
errorHandler
        │
        ├── AppError → 对应业务状态码
        └── 未知 Error → 500
```

这条链你现在已经基本搭起来了。

> 🎯 **下一阶段不是增加架构，而是把上面这 11 个边界问题逐个修掉。**

其中我建议你下一步先从 **UpdateUser 重构** 开始，因为它同时能练到 **schema、service、repository、动态 SQL、唯一键异常** 这几个最核心的后端知识点。
