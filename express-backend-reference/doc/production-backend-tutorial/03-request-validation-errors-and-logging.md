# 第 3 章：请求校验、错误处理与日志

## 1. Middleware 是一条有顺序的流水线

Express 中间件按照注册顺序执行。[app.ts](../../src/app.ts) 的核心顺序是：

```text
requestContext
  → helmet
  → cors
  → express.json
  → health routes
  → business routes
  → notFoundHandler
  → errorHandler
```

顺序不是格式偏好，而会改变行为：

- `express.json` 必须在读取 `req.body` 前执行；
- 业务路由必须在 404 中间件前注册；
- 错误处理中间件必须最后注册；
- Request ID 要尽早生成，这样后续任何错误都有 ID。

## 2. 为什么 TypeScript 不能校验 HTTP 请求

假设 Controller 写了：

```ts
async function create(body: { name: string; email: string }) {}
```

这只告诉编译器“开发者希望 body 长这样”。网络上的客户端仍然可以发送：

```json
{
  "name": 123,
  "email": false
}
```

编译后的 JavaScript 不保留 TypeScript 接口。任何跨越系统边界的数据都必须运行时校验，包括 HTTP、环境变量、消息队列和第三方接口响应。

## 3. Schema 同时校验和规范化

[user.schema.ts](../../src/modules/user/user.schema.ts) 中的创建规则：

```ts
export const createUserRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email().toLowerCase()
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
})
```

收到：

```json
{
  "name": "  张三  ",
  "email": " ZhangSan@Example.COM "
}
```

通过后得到：

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

这能避免数据库同时出现 `A@EXAMPLE.COM` 和 `a@example.com` 等表达相同含义的数据。

分页 URL 中的 `page=2` 仍是字符串。`z.coerce.number()` 负责转换，再执行整数、正数和最大值检查。

## 4. 通用 Validate Middleware

如果每个 Controller 都调用 `safeParse`，Controller 会重复下面的工作：组装 body/params/query、格式化 Zod 错误、决定状态码、返回 JSON。

[validate.middleware.ts](../../src/middlewares/validate.middleware.ts) 把这些工作集中处理：

```ts
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
```

`res.locals` 是一次请求内的临时存储，不会在不同请求间共享。Controller 只读取 `res.locals.validated`，不再信任原始 `req.body`。

Zod 的原始 Issue 可能包含很多内部字段。项目只返回 `path`、`code`、`message`，降低错误契约与某个库版本的耦合。

## 5. Route 决定中间件组合

[user.route.ts](../../src/modules/user/user.route.ts)：

```ts
router.get('/', validate(listUsersRequestSchema), controller.list)
router.get('/:id', validate(userIdRequestSchema), controller.getById)
router.post('/', validate(createUserRequestSchema), controller.create)
router.delete('/:id', validate(userIdRequestSchema), controller.remove)
```

从左到右理解：请求先匹配路径，再校验对应输入，最后才允许进入 Controller。以后接入认证时，可以组合为：

```ts
router.delete(
  '/:id',
  authenticate,
  authorize('user:delete'),
  validate(userIdRequestSchema),
  controller.remove
)
```

当前 [authenticate.middleware.ts](../../src/middlewares/authenticate.middleware.ts) 只定义扩展契约，没有假装“从某个请求头读 ID 就算登录”。错误的占位认证比暂不实现更危险。

## 6. AppError 是安全的可预期错误

[app-error.ts](../../src/shared/errors/app-error.ts)：

```ts
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown = null
  ) {
    super(message)
  }
}
```

四个字段各有用途：

- `statusCode`：HTTP 协议，例如 404、409；
- `code`：前端可稳定判断的机器码；
- `message`：给人看的文字，可修改或国际化；
- `details`：字段错误等安全补充信息。

不要让前端通过中文 `message === '用户不存在'` 判断逻辑，因为文案一改就会破坏前端。

## 7. 为什么 Error Handler 必须唯一

Service、Controller、Middleware 都可能失败。如果每处自己返回错误 JSON，字段会逐渐不一致。

[error.middleware.ts](../../src/middlewares/error.middleware.ts) 是唯一错误响应出口：

```json
{
  "success": false,
  "code": "USER_NOT_FOUND",
  "message": "用户不存在",
  "details": null,
  "requestId": "..."
}
```

对于 `AppError`，返回已知状态和业务码。对于普通 `Error`：

- 服务端日志记录原始异常；
- 客户端固定收到 HTTP 500；
- 响应使用 `INTERNAL_SERVER_ERROR`；
- 不返回 SQL、堆栈、文件路径、密码或原始异常消息。

Express 5 会把异步 Handler 的 Promise rejection 交给错误中间件，所以 Controller 不需要到处复制 `try/catch(next)`。

## 8. Request ID 如何串联一次请求

[request-context.middleware.ts](../../src/middlewares/request-context.middleware.ts) 先读取客户端的 `x-request-id`；没有时用 `crypto.randomUUID()` 生成。ID 同时放到：

- 响应头 `x-request-id`；
- `res.locals.requestId`；
- 错误响应 JSON；
- 请求完成日志。

用户反馈“接口报错”时，可以提供 Request ID。运维人员无需按模糊时间搜索，直接查询同一 ID 的日志。

中间件使用 `process.hrtime.bigint()` 计算耗时，并在响应 `finish` 时记录：

```json
{
  "requestId": "...",
  "method": "POST",
  "path": "/api/v1/users",
  "statusCode": 201,
  "durationMs": 12.34,
  "msg": "request completed"
}
```

## 9. 结构化日志和脱敏

[logger.ts](../../src/shared/logger/logger.ts) 使用 Pino，并配置敏感路径：

```text
authorization
cookie
password
token
DB_PASSWORD
```

记录对象而不是拼字符串：

```ts
logger.error({ err: error, requestId }, 'unhandled request error')
```

这样日志平台能把 `requestId` 当成字段过滤。测试环境的默认日志级别为 `silent`，避免测试输出被访问日志淹没。

## 10. Helmet、CORS 与 JSON 限制分别防什么

- Helmet：设置浏览器安全响应头；
- CORS：限制浏览器页面的跨域来源；
- `express.json({ limit: '1mb' })`：避免无限大的 JSON 请求占用内存；
- Zod：校验字段类型、格式和范围；
- SQL 占位符：防止输入改变 SQL 结构。

这些是不同防线，不能互相替代。CORS 也不是鉴权：非浏览器客户端不受浏览器同源策略限制。

下一章跟踪真实业务请求：[User 模块：从 Route 一直走到 SQL](./04-user-module-from-route-to-sql.md)。
