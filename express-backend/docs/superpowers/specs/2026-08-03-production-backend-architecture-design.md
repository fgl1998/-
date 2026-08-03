# Express 生产级后端架构设计

## 1. 背景与目标

当前项目已经具备 `route / controller / service` 的基础分层，但参数校验、业务判断、数据访问、数据模型和 HTTP 响应之间仍缺少稳定边界。本次重构的目标不是机械复制 Java 目录，而是采用 Java 分层思想，结合 TypeScript、Express 5 和 MySQL 的特点，建设一个适合长期演进的生产级模块化单体。

首期成果既要能够运行，也要成为后续业务模块的标准模板。系统继续使用 MySQL、`mysql2/promise` 和手写 SQL；通过 Repository 契约隔离数据访问实现，使未来引入 Drizzle 或 Prisma 时不影响 Controller 和大部分 Service。

## 2. 已确认的设计决策

- 架构形态：模块化单体 + 轻量 Clean Architecture。
- 运行时：Node.js、TypeScript、Express 5。
- 数据库：MySQL。
- 数据访问：`mysql2/promise` + 参数化手写 SQL。
- 代码组织：优先按业务模块聚合，而不是建立不断膨胀的全局 Controller、Service 和 Repository 目录。
- 依赖管理：构造器注入或工厂函数手动组装，不引入 IoC 容器。
- 认证：首期仅预留认证上下文与中间件扩展位置，不实现 JWT 登录、Refresh Token 和 RBAC。
- API：统一使用 `/api/v1` 前缀。
- 测试：单元测试、真实 MySQL 集成测试和 API 测试三层覆盖。

## 3. 总体架构

```text
src/
├─ config/
│  └─ env.ts
├─ database/
│  ├─ mysql.ts
│  ├─ transaction.ts
│  ├─ migrate.ts
│  └─ migrations/
├─ shared/
│  ├─ errors/
│  ├─ http/
│  ├─ logger/
│  └─ types/
├─ middlewares/
│  ├─ validate.middleware.ts
│  ├─ error.middleware.ts
│  ├─ not-found.middleware.ts
│  ├─ request-id.middleware.ts
│  └─ authenticate.middleware.ts
├─ modules/
│  └─ user/
│     ├─ user.route.ts
│     ├─ user.controller.ts
│     ├─ user.service.ts
│     ├─ user.repository.ts
│     ├─ user.mysql-repository.ts
│     ├─ user.schema.ts
│     ├─ user.dto.ts
│     ├─ user.entity.ts
│     ├─ user.mapper.ts
│     └─ user.module.ts
├─ app.ts
└─ server.ts
```

核心依赖方向为：

```text
Route -> Controller -> Service -> Repository 契约
                                      ^
                              MySQL Repository 实现
```

依赖只能朝业务核心方向流动。Service 不依赖 Express，Repository 契约不依赖具体的 HTTP 传输方式，Controller 不直接依赖 MySQL。

## 4. 各组件职责

### 4.1 Route

Route 只声明 URL、HTTP 方法、中间件顺序和 Controller 绑定。参数校验、权限校验、限流等横切能力通过中间件组合，不在路由回调中实现业务逻辑。

### 4.2 Schema 与输入 DTO

每个接口使用 Zod 同时描述 `params`、`query` 和 `body`。Schema 是请求输入的唯一事实来源，TypeScript 输入类型通过 `z.infer` 生成，避免维护一份可能与运行时规则不一致的重复接口。

Schema 除了拒绝非法数据，还负责安全且确定的规范化，例如字符串 `trim`、邮箱小写化以及分页参数的数字转换。未经校验的 `req.body`、`req.query` 和 `req.params` 不能直接传入 Service。

### 4.3 Validate Middleware

通用校验中间件执行 Schema，并把通过校验的可信数据放入统一约定的请求字段。校验失败时抛出标准 `VALIDATION_ERROR`，由全局错误中间件生成响应。Controller 不重复调用 `safeParse`。

### 4.4 Controller

Controller 是 HTTP 适配层，只完成以下工作：

- 读取已经校验的输入；
- 调用对应 Service 用例；
- 选择 HTTP 状态码和成功响应辅助函数。

Controller 不执行 SQL，不判断邮箱是否重复或用户是否存在，不包含事务代码，也不吞掉 Service 抛出的异常。

### 4.5 Service

Service 实现业务用例、业务规则和事务边界。例如创建用户时，Service 负责组织邮箱冲突检查、用户创建和关联审计记录。Service 的参数和返回值是普通 TypeScript 数据，不包含 Express 的 `Request`、`Response` 或 `NextFunction`。

可预期业务失败使用稳定业务错误，例如 `USER_NOT_FOUND`、`EMAIL_ALREADY_EXISTS`。需要多步骤原子写入时，Service 通过事务管理契约执行，不直接操作连接的 `commit` 或 `rollback`。

### 4.6 Repository 契约与 MySQL 实现

`user.repository.ts` 定义 Service 所需的最小数据访问能力；`user.mysql-repository.ts` 使用 `mysql2/promise` 实现这些能力。所有用户模块 SQL 集中在 MySQL Repository 中，并满足以下规则：

- 所有外部值使用占位符；
- 明确列出查询列，不在业务查询中使用 `SELECT *`；
- 数据库字段映射为内部实体字段；
- 不在 Repository 中编写业务流程；
- 不把 MySQL 驱动错误直接泄漏到 Controller。

### 4.7 Entity、Row、DTO 与 Mapper

不同边界使用不同模型：

```text
CreateUserInput  API 请求输入
UserRow          MySQL 查询结果
User             内部业务实体
UserOutput       对外输出模型
```

数据库字段 `created_at` 映射为内部和 API 使用的 `createdAt`。密码、删除标记和内部状态等字段不会因为直接返回数据库记录而意外暴露。Mapper 负责 Row、Entity 和 Output DTO 之间的确定性转换。

### 4.8 Module Composition

`user.module.ts` 是模块组合根，负责实例化 MySQL Repository、Service、Controller 和 Router，并显式注入依赖。首期不使用装饰器和 IoC 容器；显式组装更容易阅读、测试和定位循环依赖。

### 4.9 Shared

`shared` 只存放确定被多个业务模块复用的基础能力，例如错误基类、HTTP 响应辅助函数、日志器和通用类型。仅被单一模块使用的代码必须留在该模块内，防止 `shared` 演变成无边界的杂物目录。

## 5. 请求与响应数据流

以 `POST /api/v1/users` 为例：

```text
HTTP JSON
  -> JSON Parser
  -> Request ID / Access Log
  -> Zod Validate Middleware
  -> User Controller
  -> User Service
  -> User Repository
  -> MySQL
  -> Entity / UserOutput
  -> Success Response
```

Service 创建用户时执行以下业务过程：

1. 接收经过校验和规范化的 `CreateUserInput`。
2. 检查邮箱冲突，用于生成友好业务提示。
3. 创建用户；数据库唯一索引是并发场景下的最终约束。
4. 将创建结果转换为 `UserOutput`。
5. 返回与 HTTP 无关的用例结果。

统一成功响应示例：

```json
{
  "success": true,
  "code": "USER_CREATED",
  "message": "用户创建成功",
  "data": {
    "id": 3,
    "name": "张三",
    "email": "zhangsan@example.com",
    "createdAt": "2026-08-03T08:00:00.000Z"
  }
}
```

分页成功响应额外包含：

```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

HTTP 状态码表达协议结果，稳定字符串 `code` 表达客户端可依赖的业务结果。中文 `message` 仅用于展示，不能作为前端分支判断依据。

## 6. 错误处理

系统错误分为三类：

1. 参数错误：由 Zod 校验产生，例如 `VALIDATION_ERROR`。
2. 可预期业务错误：由 Service 或确定的数据约束转换产生，例如 `USER_NOT_FOUND`、`EMAIL_ALREADY_EXISTS`。
3. 未知系统异常：数据库断连、程序缺陷等，对外统一为 `INTERNAL_SERVER_ERROR`。

统一错误响应示例：

```json
{
  "success": false,
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "该邮箱已被使用",
  "details": null,
  "requestId": "01K..."
}
```

错误处理中间件是唯一错误响应出口。Express 5 的异步拒绝统一交给该中间件，不在每个 Controller 添加重复 `try/catch`。生产响应不包含 SQL、连接配置、原始驱动异常或堆栈；完整异常与 Request ID 写入结构化日志。

字段校验错误的 `details` 只包含规范化后的字段路径、规则代码和安全提示。服务端未知错误始终返回通用文案。

## 7. 数据库与 Migration

数据库层使用 `mysql2/promise` 连接池。所有配置来自经过 Zod 校验的环境变量。应用进入就绪状态前执行数据库连通性检查；优雅退出时停止接收请求并关闭连接池。

手写 Migration 使用不可变的版本化 SQL：

```text
src/database/migrations/
├─ 001_create_users.sql
├─ 002_add_user_email_unique_index.sql
└─ ...
```

独立 `npm run migrate` 命令执行尚未应用的迁移，并把版本、文件名、校验和与执行时间记录到 `schema_migrations`。已经应用的迁移禁止修改，只能新增后续迁移。API 进程启动时不自动修改生产数据库结构。

用户邮箱必须存在数据库唯一索引。Service 的预检查改善用户体验，但不能替代唯一约束；Repository 必须识别重复键错误并转换为稳定的冲突结果。

## 8. 事务设计

事务管理器保证：

```text
获取一个连接
  -> beginTransaction
  -> 在同一连接上执行回调
  -> 成功 commit
  -> 失败 rollback
  -> finally release
```

单条原子 SQL 不额外创建事务。跨表或多步骤写入必须由 Service 声明一个事务边界，并把同一事务上下文传给参与的 Repository。Service 不直接调用 MySQL 连接的提交和回滚方法。首期不支持嵌套事务，也不把慢速外部网络调用放入数据库事务。

## 9. 日志、健康检查与安全基线

- 使用 Pino 输出结构化 JSON 日志。
- 每个请求生成或接收 Request ID，并记录请求方法、路径、状态码和耗时。
- 密码、Authorization、Token、Cookie 和数据库凭证统一脱敏。
- `/health/live` 只表示进程存活。
- `/health/ready` 检查数据库等必要依赖是否可用。
- 使用 `helmet` 设置基础安全响应头。
- CORS 允许来源由环境变量配置，不硬编码开发地址。
- JSON 请求体大小设置明确上限。
- HTTP Server 和 MySQL Pool 支持 `SIGINT`、`SIGTERM` 优雅关闭。

认证首期只定义可扩展的用户身份上下文与中间件位置，不提供无安全意义的假认证实现，也不把未完成的认证中间件应用到业务路由。

## 10. 测试策略

```text
tests/
├─ unit/
│  ├─ user.service.test.ts
│  └─ user.schema.test.ts
├─ integration/
│  ├─ user.repository.test.ts
│  └─ migrations.test.ts
└─ api/
   └─ user.api.test.ts
```

- 单元测试使用 Vitest。
- API 测试使用 Supertest。
- Service 单元测试注入 Fake Repository，不连接 MySQL。
- Repository 和 Migration 测试连接独立 MySQL 测试库，不 Mock 驱动。
- API 测试验证 HTTP 状态码、响应契约、错误码和中间件顺序。
- 事务测试必须覆盖成功提交和失败回滚。
- 测试环境数据不得连接开发或生产数据库。

CI 至少执行依赖安装、类型检查、Lint、单元测试和构建。真实 SQL 集成测试通过 CI 的 MySQL Service 执行。

## 11. 工程脚本与质量门禁

项目应提供以下脚本：

```text
dev
build
start
typecheck
lint
format
test
test:unit
test:integration
test:api
migrate
```

代码交付前必须通过类型检查、Lint、单元测试、数据库集成测试、API 测试和生产构建。`.env.example` 只提供变量名和安全示例，不包含真实凭证。

## 12. 第一阶段范围

第一阶段包含：

- 将代码重构为模块化单体结构；
- 配置校验、MySQL 连接池、Migration Runner 和事务管理；
- 将现有 User 路由迁移到新的 Schema、Controller、Service、Repository、Entity、DTO 和 Mapper 边界；
- User 列表增加基础分页；
- 统一成功响应、业务异常与错误处理中间件；
- Pino 日志、Request ID、健康检查和优雅退出；
- ESLint、Prettier、单元测试、Repository 集成测试和 API 测试；
- 认证扩展边界，但不实现认证业务。

第一阶段不包含：

- JWT 登录、Refresh Token 和 RBAC；
- ORM、Redis、消息队列和微服务；
- 文件上传、邮件和短信；
- 完整 OpenAPI 文档站点；
- 复杂 DDD、领域事件和 IoC 容器；
- 与架构建设无关的新业务功能。

## 13. 验收标准

- Controller 中不存在 SQL、Zod `safeParse` 和业务规则判断。
- Service 不导入 Express 或 MySQL 驱动类型。
- Repository 的 MySQL 实现通过真实数据库集成测试。
- 请求输入均先经过 Zod 校验，API 不直接信任原始请求字段。
- API 不直接返回 `UserRow` 或包含内部敏感字段的实体。
- 所有错误均通过全局错误中间件返回稳定错误码和 Request ID。
- 邮箱唯一性同时具有友好业务提示和数据库唯一约束保障。
- 多步骤写入失败时能够回滚，连接始终被释放。
- Migration 可在空测试库中从零执行，并能正确跳过已执行版本。
- `/health/live` 与 `/health/ready` 语义不同且行为可测试。
- `typecheck`、`lint`、全部测试和 `build` 均通过。
- 新业务模块能够沿用 User 模块的分层与组装方式，而不复制基础设施代码。

## 14. 后续演进

后续如引入 Drizzle 或 Prisma，应新增 Repository 适配实现并在模块组合根替换注入，保持 Controller、HTTP 契约和大部分 Service 不变。认证、缓存、消息队列和 OpenAPI 应根据明确业务需求分别设计，不能预先污染当前核心边界。
