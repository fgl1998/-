# Express RealWorld 进阶学习计划

> 这份计划用于指导你从当前的 `Express + TypeScript + mysql2` 学习成果，逐步完成一个具有真实业务意义的后端项目。
>
> 核心原则：项目代码由你亲手编写；GitHub 项目只用于理解需求、对照实现和复盘，不直接复制成自己的项目。

## 1. 最终目标

独立完成一个类似 Medium 的 RealWorld（Conduit）后端，并接入现成的 Vue 3 前端。

以后真正手写的项目建议放在独立目录：

```text
E:\面试项目\express-realworld-mysql
```

当前目录 `E:\面试项目\express-pro-plan` 只存放学习计划和学习记录，不存放项目实现代码。

完成后，你应该能够独立解释并实现下面这条调用链：

```text
Vue 页面
  -> HTTP 请求
  -> Express Route
  -> Controller
  -> Service
  -> Repository
  -> mysql2/promise
  -> MySQL
```

你还应该能够回答：

- 请求数据在哪里校验？
- Controller 为什么不能写业务规则？
- Service 为什么不应该直接写 SQL？
- Repository 应该返回数据库行，还是业务实体？
- MySQL 查询结果为什么需要 `RowDataPacket`？
- 为什么 TypeScript 类型不能代替运行时校验？
- 401、403、404、409、422、500 分别在什么情况下返回？
- 为什么 Service 查重后，数据库仍然需要唯一索引？
- 如何测试 Service，而不连接真实 MySQL？
- 如何测试一条完整的 HTTP 接口？

## 2. 你的当前起点

根据当前 `express-backend2/src/app.ts`，你已经接触过：

- Express、CORS、环境变量。
- TypeScript 的 `interface`、`Promise<T>` 和 `null`。
- `mysql2/promise` 连接池。
- `RowDataPacket`、`ResultSetHeader`。
- SQL 占位符 `?`。
- 将 `created_at` 映射为 `createdAt`。
- `CreateUserInput`、`User`、`UserOutput`。
- Repository 和 Service 的基本职责。
- 对象写法与 class 写法的区别。
- 手动依赖注入的基本概念。

当前主要缺口：

- 还没有完整跑通 Route 到数据库再到响应的接口。
- 请求校验、错误处理、HTTP 状态码还没有形成固定流程。
- 业务规则应该放在哪里，还需要通过更多接口巩固。
- 登录、JWT、权限控制还没有形成完整认识。
- 关联表、分页、事务和测试尚未形成实战经验。
- 还不适合直接学习复杂 DI 容器、DDD、CQRS 或微服务。

## 3. 项目范围

### 3.1 要实现的业务

- 用户注册、登录和个人资料。
- JWT 身份认证。
- 创建、查看、修改、删除文章。
- 文章分页、标签筛选和作者筛选。
- 创建和删除评论。
- 关注和取消关注用户。
- 收藏和取消收藏文章。
- 权限校验。
- 统一错误响应。
- 单元测试和接口测试。
- API 文档、日志、安全中间件和 Docker。

### 3.2 第一版明确不做

- 微服务、CQRS、领域事件。
- 消息队列、Redis 缓存。
- OAuth 第三方登录、邮件验证码。
- 文件上传、支付。
- Kubernetes。
- Inversify、tsyringe 等依赖注入容器。
- 泛型 `BaseController`、`BaseService`、`BaseRepository`。

这些内容不是永远不学，而是等主业务完成后，再根据真实需要加入。

## 4. 技术栈与依赖原则

### 4.1 第一阶段固定技术栈

- Node.js：使用一个明确的 LTS 主版本。
- Express 5。
- TypeScript 严格模式。
- MySQL 8。
- `mysql2/promise`。
- 手写参数化 SQL。
- Zod：运行时请求校验。
- bcrypt：密码哈希。
- jsonwebtoken：JWT。
- Vitest：单元测试。
- Supertest：HTTP 接口测试。
- dotenv：环境变量加载。

### 4.2 生产化阶段再加入

- Pino：结构化日志。
- Helmet：安全响应头。
- express-rate-limit：限流。
- Swagger/OpenAPI：接口文档。
- Docker 和 Docker Compose。

### 4.3 版本锁定规则

学习项目也要锁定版本：

```bash
npm install --save-exact <package-name>
npm install --save-dev --save-exact <package-name>
```

要求：

- `package.json` 中不使用 `^` 和 `~`。
- 提交 `package-lock.json`。
- 不删除 lock 文件后随意重新安装。
- 升级依赖时，一次只升级少量包，并重新运行类型检查和测试。
- Node.js 主版本写入 README，可进一步使用 `.nvmrc` 固定。

## 5. 控制文件数量的规则

你之前被一个用户模块十个文件弄乱，所以第一版采用“够用才拆”的方式。

一个普通业务模块最多先保留五个主要文件：

```text
src/modules/users/
├── user.route.ts
├── user.controller.ts
├── user.service.ts
├── user.repository.ts
└── user.schema.ts
```

| 文件 | 只负责什么 |
|---|---|
| `user.route.ts` | HTTP 方法、路径、中间件顺序、Controller 绑定 |
| `user.controller.ts` | 从请求取数据、调用 Service、发送响应 |
| `user.service.ts` | 查重、权限、状态变化等业务规则 |
| `user.repository.ts` | SQL、MySQL 查询结果和数据库映射 |
| `user.schema.ts` | Zod 校验规则，并推导接口入参类型 |

拆分规则：

- 类型很少时，先放在最接近它的文件里。
- 只有多个文件都需要同一类型时，才增加 `user.types.ts`。
- 只有真正需要替换 Repository 或写 Service 单元测试时，才增加 Repository 接口。
- 一个文件超过约 200～300 行，并且存在两个清晰职责时，再考虑拆分。
- 不因为 Java 项目通常有某个目录，就在 Express 项目中机械创建同名目录。

## 6. 每个接口统一采用的手写顺序

以后每写一个接口，都按照下面顺序，不要先把所有目录建完。

1. 用中文写业务需求和失败场景。
2. 写 HTTP 方法、URL、请求体和响应体。
3. 设计或修改数据库表、外键和索引。
4. 定义当前接口真正需要的最少类型。
5. 写 Repository，让数据库能力先明确。
6. 写 Service，实现查重、权限、状态变化等业务规则。
7. 写 Zod Schema，校验真实 HTTP 输入。
8. 写 Controller，只取数据、调 Service、发响应。
9. 注册 Route，明确中间件执行顺序。
10. 验证成功、校验失败、不存在、冲突、未登录和无权限。

Repository 检查：

- SQL 是否使用占位符。
- 查询返回类型是否正确。
- 找不到数据时是否返回 `null`。
- 插入、更新、删除是否检查 `insertId` 或 `affectedRows`。
- 数据库字段是否映射为业务字段。

Service 检查：

- 是否只处理业务规则和操作组合。
- 是否意外依赖 Express 的 `Request`、`Response`。
- 是否直接写了 SQL。
- 是否把 MySQL 原始错误直接暴露给前端。

Controller 检查：

- 是否只获取已校验的数据。
- 是否只调用 Service。
- 是否只决定 HTTP 响应。
- 是否出现查重、权限、密码处理等业务代码。

## 7. 总体阶段安排

| 阶段 | 主题 | 建议时间 | 可独立验收的结果 |
|---|---|---:|---|
| 0 | 项目和数据库基础 | 1～2 天 | Express、MySQL、类型检查可运行 |
| 1 | CRUD 热身重构 | 2～3 天 | 一个完整资源的 CRUD |
| 2 | 用户注册 | 3～5 天 | 注册接口完整通过 |
| 3 | 登录和认证 | 4～6 天 | JWT 登录和当前用户接口 |
| 4 | 文章 CRUD | 5～7 天 | 文章完整生命周期和权限 |
| 5 | 列表、筛选、分页 | 4～6 天 | 可供 Vue 列表页面使用 |
| 6 | 评论、关注、收藏 | 6～9 天 | 多表关系业务完整 |
| 7 | 测试和生产化 | 6～10 天 | 测试、日志、文档、Docker |

时间只是参考，以验收结果为准。如果上一阶段不能独立解释，不进入下一阶段。

---

## 阶段 0：项目和数据库基础

### 目标

建立一个最小、稳定、能反复运行的工程环境。

### 手写任务

- 新建独立 Git 仓库 `express-realworld-mysql`。
- 初始化 npm 项目并锁定依赖版本。
- 配置 TypeScript 严格模式。
- 配置开发、类型检查、构建和生产启动命令。
- 创建 `.env.example`，真实 `.env` 加入 `.gitignore`。
- 创建 MySQL 数据库和连接池。
- 实现 `/health` 健康检查。
- 分开 Express 应用创建和端口监听，以便以后使用 Supertest。

### 最小目录

```text
src/
├── app.ts
├── server.ts
├── config.ts
└── db.ts
```

暂时不要创建 Controller、Service、Repository 空目录。

### 验收标准

- [ ] 开发命令可以启动服务。
- [ ] `GET /health` 返回 200。
- [ ] 缺少必须的环境变量时，程序启动失败并说明变量名。
- [ ] MySQL 连接失败时，不会假装启动成功。
- [ ] TypeScript 类型检查通过。
- [ ] `package-lock.json` 已生成且依赖版本已锁定。

---

## 阶段 1：CRUD 热身重构

参考：[bezkoder/node-js-typescript-mysql-rest-api](https://github.com/bezkoder/node-js-typescript-mysql-rest-api)

只参考它的 CRUD 范围和路由组织，不复制回调式数据库代码、动态 SQL 拼接或全可选实体类型。

### 接口

```text
POST   /api/tutorials
GET    /api/tutorials
GET    /api/tutorials/:id
PUT    /api/tutorials/:id
DELETE /api/tutorials/:id
```

### 学习重点

- Route、Controller、Service、Repository 的调用方向。
- `RowDataPacket` 和 `ResultSetHeader`。
- 创建后使用 `insertId` 查询完整记录。
- `null` 与“未找到”的处理。
- PUT 的完整更新含义。
- `affectedRows` 的作用。
- 统一错误中间件。

### 验收标准

- [ ] Controller 中没有 SQL。
- [ ] Repository 中没有 HTTP 状态码。
- [ ] Service 中没有 Express 的 `Request` 和 `Response`。
- [ ] 所有 SQL 输入都使用占位符。
- [ ] 资源不存在返回 404。
- [ ] 非法路径参数返回 400。
- [ ] 创建返回 201。
- [ ] 使用 Postman 或 REST Client 保存完整请求示例。

### 阶段复盘

- 为什么创建记录后还要根据 `insertId` 查询一次？
- Repository 为什么返回 `null` 而不是直接返回 404？
- Controller 中的重复 `try/catch` 是否应该统一处理？

---

## 阶段 2：用户注册

### 接口

```text
POST /api/users
```

### 数据库重点

`users` 表至少包含：

- `id`
- `username`
- `email`
- `password_hash`
- `bio`
- `image`
- `created_at`
- `updated_at`

约束：

- `username` 唯一。
- `email` 唯一。
- 密码只保存哈希值。
- 对外查询默认不选择 `password_hash`。

### 业务规则

- 用户名不能为空并限制长度。
- 邮箱必须是合法格式。
- 密码必须满足最低长度。
- 用户名和邮箱不能重复。
- Service 先做友好的查重提示。
- 数据库唯一索引负责最终并发安全。
- 返回值不能包含密码哈希。

### 手写顺序

1. 写注册接口的请求、响应和失败场景。
2. 写 `users` 建表 SQL。
3. 定义用户查询行和公开用户实体。
4. Repository 实现按邮箱、用户名查询和创建用户。
5. Service 实现输入规范化、查重、密码哈希和输出转换。
6. Zod 实现请求体校验。
7. Controller 调用 Service 并返回 201。
8. Route 绑定校验中间件和 Controller。
9. 错误中间件映射校验错误、冲突错误和未知错误。
10. 验证所有成功与失败场景。

### 状态码约定

| 情况 | 状态码 |
|---|---:|
| 注册成功 | 201 |
| 请求格式错误 | 400 或 422，项目内固定一种 |
| 邮箱或用户名冲突 | 409 |
| 未知服务端错误 | 500 |

### 验收标准

- [ ] 相同邮箱和用户名不能重复注册。
- [ ] 并发情况下仍由数据库唯一索引兜底。
- [ ] 数据库中看不到明文密码。
- [ ] 响应中没有密码字段。
- [ ] MySQL 原始错误、SQL 和堆栈没有返回给前端。
- [ ] 能从 Route 开始按顺序解释每一层。

---

## 阶段 3：登录和 JWT 认证

### 接口

```text
POST /api/users/login
GET  /api/user
PUT  /api/user
```

### 需要掌握

- 使用 bcrypt 比较密码。
- 登录成功签发 JWT。
- 从统一格式的 Authorization 请求头读取 token。
- 认证中间件验证 token。
- 将当前用户的最少身份信息放入 `req.user`。
- 扩展 Express Request 的 TypeScript 类型。
- 更新邮箱或用户名时重新查重。
- 修改密码时重新生成哈希。

### 错误约定

| 情况 | 状态码 |
|---|---:|
| 登录信息格式错误 | 400/422 |
| 邮箱或密码错误 | 401 |
| 缺少、无效或过期 token | 401 |
| 已登录但禁止操作 | 403 |

登录失败统一返回“邮箱或密码错误”，不要暴露邮箱是否存在。

### 验收标准

- [ ] 正确账号密码能够登录。
- [ ] 错误密码和不存在邮箱返回一致信息。
- [ ] 不带 token 不能读取当前用户。
- [ ] 无效 token 返回 401，而不是 500。
- [ ] 用户只能修改自己的资料。
- [ ] 修改密码后数据库仍然只有哈希。
- [ ] 认证中间件不包含文章或用户资料业务逻辑。

---

## 阶段 4：文章 CRUD

### 接口

```text
POST   /api/articles
GET    /api/articles/:slug
PUT    /api/articles/:slug
DELETE /api/articles/:slug
```

### 数据库重点

`articles` 表至少包含 `id`、`slug`、`title`、`description`、`body`、`author_id`、`created_at` 和 `updated_at`。

- `slug` 唯一。
- `author_id` 外键关联 `users.id`。
- 为 `author_id` 和常用排序字段建立合适索引。

### 业务规则

- 只有登录用户可以创建文章。
- slug 由标题生成，并解决重复标题冲突。
- 任何人可以查看公开文章。
- 只有作者可以修改和删除自己的文章。
- 删除不存在的文章返回 404。
- 删除他人的文章返回 403。

### 验收标准

- [ ] 创建文章能正确保存 `author_id`。
- [ ] 返回文章时包含作者公开资料。
- [ ] 两篇相同标题的文章不会破坏唯一约束。
- [ ] 非作者不能修改和删除。
- [ ] 文章更新时间正确变化。
- [ ] Controller 不判断当前用户是不是作者。
- [ ] Service 不直接拼 SQL。

---

## 阶段 5：文章列表、筛选和分页

### 接口

```text
GET /api/articles?page=1&pageSize=10&author=alice&tag=typescript
```

后续加入 `favorited` 筛选。

### 学习重点

- `LIMIT`、`OFFSET` 和 `COUNT(*)`。
- 动态构建 `WHERE` 条件和参数数组。
- `INNER JOIN`、`LEFT JOIN`。
- 一对多查询产生重复行的问题。
- 默认排序和稳定排序。
- 将 Query 字符串校验并转换为数字。

### 返回结构

项目内部先统一为：

```text
items
page
pageSize
total
totalPages
```

如果要完全连接 RealWorld 前端，再在接口层适配为规范要求的 `articles` 和 `articlesCount`。

### 验收标准

- [ ] 默认分页生效，pageSize 有合理最大值。
- [ ] 总数不受 LIMIT 影响。
- [ ] 空列表返回空数组，不返回 404。
- [ ] author、tag、favorited 可以单独筛选。
- [ ] 多个筛选条件组合后参数顺序仍然正确。
- [ ] 用户输入没有直接拼进 SQL。
- [ ] JOIN 后没有重复文章。

---

## 阶段 6：评论、关注和收藏

### 评论接口

```text
POST   /api/articles/:slug/comments
GET    /api/articles/:slug/comments
DELETE /api/articles/:slug/comments/:id
```

规则：只有登录用户可以发表评论；所有人可以查看；只有评论作者可以删除；删除时确认评论属于当前文章。

### 关注接口

```text
POST   /api/profiles/:username/follow
DELETE /api/profiles/:username/follow
GET    /api/profiles/:username
```

`user_follows` 使用 `follower_id + followed_id` 联合唯一约束。用户不能关注自己，重复关注不能产生两条记录，取消关注保持幂等。

### 收藏接口

```text
POST   /api/articles/:slug/favorite
DELETE /api/articles/:slug/favorite
```

`article_favorites` 使用 `user_id + article_id` 联合唯一约束。文章响应包含 `favorited` 和 `favoritesCount`。

### 验收标准

- [ ] 评论、关注和收藏分别有明确的数据表。
- [ ] 外键删除规则经过明确选择。
- [ ] 联合唯一索引阻止重复关系。
- [ ] 用户不能删除别人的评论。
- [ ] 用户不能关注自己。
- [ ] 并发收藏不会产生重复记录。
- [ ] 能解释哪些判断属于 Service，哪些约束必须由数据库兜底。

---

## 阶段 7：测试和生产化

### Service 单元测试

目标是不连接真实数据库，验证：

- 注册查重。
- 登录密码错误。
- 文章作者权限。
- 不能关注自己。
- 不能删除他人评论。
- 重复收藏的处理。

到这一阶段再为 Repository 定义最小接口，通过构造函数或工厂函数注入 Service：

```text
真实运行：Service <- MySQL Repository
单元测试：Service <- Fake Repository
```

不要为了测试引入 DI 容器。

### HTTP 接口测试

使用 Supertest 验证路由、JSON 解析、校验、认证、Controller 响应、404 和错误中间件。

### Repository 集成测试

使用测试数据库验证真实 SQL、行映射、唯一索引、外键、事务提交和回滚。

### 生产化加入顺序

1. Pino 请求日志。
2. Helmet。
3. CORS 白名单。
4. 登录和注册接口限流。
5. Swagger/OpenAPI。
6. `/health/live` 与 `/health/ready`。
7. 优雅关闭 HTTP Server 和 MySQL Pool。
8. Dockerfile。
9. Docker Compose 启动 API 和 MySQL。
10. GitHub Actions 执行类型检查、测试和构建。

参考：[edwinhern/express-typescript](https://github.com/edwinhern/express-typescript)。只借鉴具体能力，不整体复制目录。

### 最终验收标准

- [ ] 类型检查、单元测试、HTTP 测试和关键 Repository 集成测试通过。
- [ ] Vue 3 RealWorld 前端可以完成注册、登录、发文、评论、关注和收藏。
- [ ] 日志有请求 ID、方法、路径、状态码和耗时。
- [ ] 日志不记录密码和完整 token。
- [ ] Swagger 展示主要接口。
- [ ] Docker Compose 可以从空环境启动 API 和 MySQL。
- [ ] README 能让另一位开发者完成安装、数据库初始化和启动。

## 8. Vue 联调路线

参考：[mutoe/vue3-realworld-example-app](https://github.com/mutoe/vue3-realworld-example-app)

不要等全部后端完成后才联调：

1. 注册完成后接注册页面。
2. 登录完成后接登录状态和 token 保存。
3. 当前用户完成后接个人资料页面。
4. 文章 CRUD 完成后接编辑器和详情页。
5. 列表完成后接首页分页和筛选。
6. 评论、关注、收藏完成后接对应交互。

字段不一致时，先比较 RealWorld API 规范，再决定修改哪一端，不要临时增加多个同义字段。

## 9. GitHub 项目的正确阅读方法

不要按照仓库文件顺序硬读。每次只选择一个接口：

```text
先看 Route
  -> 找到 Controller
  -> 找到 Service
  -> 找到 Repository 或 ORM 调用
  -> 找到输入和输出类型
  -> 找到测试
```

每次记录：

1. 请求从哪里进入？
2. 数据在哪里校验？
3. 业务规则在哪里？
4. 数据库在哪里访问？
5. 错误如何变成 HTTP 响应？

看到好代码后先关闭参考，自己写一遍；写不出来时再回去对照。

## 10. GitHub 参考项目定位

### RealWorld 官方规范

- [realworld-apps/realworld](https://github.com/realworld-apps/realworld)
- 用作需求、接口契约和前后端兼容标准。

### Express + Prisma RealWorld

- [gothinkster/node-express-prisma-v1-official-app](https://github.com/gothinkster/node-express-prisma-v1-official-app)
- 参考注册、登录、文章、评论、关注、收藏的业务流程和测试范围。
- 它使用 Prisma 和 PostgreSQL且依赖较旧，不复制数据库实现。

### Bezkoder MySQL CRUD

- [bezkoder/node-js-typescript-mysql-rest-api](https://github.com/bezkoder/node-js-typescript-mysql-rest-api)
- 用作 CRUD 热身和重构练习。
- 它缺少 Service，部分查询采用字符串拼接，不是生产级范本。

### Express TypeScript Boilerplate

- [edwinhern/express-typescript](https://github.com/edwinhern/express-typescript)
- 用于项目后期学习测试、日志、安全、环境变量和 OpenAPI。
- 不在业务尚未跑通时照搬全部结构。

## 11. 每次学习的固定循环

```text
阅读一个需求
  -> 写请求和响应示例
  -> 制造一个失败请求或失败测试
  -> 手写最少实现
  -> 类型检查
  -> 验证成功路径
  -> 验证失败路径
  -> 用 Vue 或 Postman 联调
  -> 写复盘
  -> 提交 Git
```

一次提交只表达一个结果，例如：

```text
feat: add user registration
feat: add email conflict handling
test: cover user registration service
feat: add article pagination
docs: document authentication flow
```

不要把注册、登录、文章和 Docker 混在一个提交中。

## 12. 每阶段复盘模板

```text
阶段名称：

1. 我完成了哪些接口？
2. 请求经过了哪些文件？
3. 最重要的三条业务规则是什么？
4. 哪些代码属于 Controller？为什么？
5. 哪些代码属于 Service？为什么？
6. 哪些代码属于 Repository？为什么？
7. 遇到的 TypeScript 错误是什么？真正原因是什么？
8. 遇到的 MySQL 错误是什么？真正原因是什么？
9. 哪个文件开始难读？是否真的需要拆分？
10. 如果重新写一次，我会按什么顺序写？
```

## 13. 判断是否真正掌握

- 不看参考项目，可以从接口需求开始写出基本结构。
- 可以画出请求调用链。
- 可以解释每个类型为什么存在。
- 可以解释为什么某段逻辑属于某一层。
- 可以列出至少三个失败场景。
- 可以为 Service 写一个不连接数据库的测试。
- 可以修改需求，而不是只能照原代码重写。
- 可以定位错误发生在 Route、Controller、Service、Repository 还是数据库。

## 14. 需要暂停扩展的信号

出现下面情况时，不要继续增加功能：

- 已经不知道请求从哪个文件进入。
- 同一个类型在多个文件重复定义，但含义不同。
- Controller、Service、Repository 都在捕获并重新抛出同一个错误。
- 为了写一个接口需要同时打开十多个业务文件。
- 出现大量 `any` 只是为了让 TypeScript 不报错。
- 测试失败后不知道失败属于业务、HTTP 还是数据库。
- 新功能还没跑通，就开始配置 Redis、Docker 或 Swagger。

处理方法：退回当前接口，画出调用链，删除没有实际作用的抽象，只保留能够解释清楚的结构。

## 15. 最终项目成果

- 可运行的 Express + TypeScript 后端。
- MySQL 建表或迁移脚本。
- 完整 `.env.example`。
- 用户、文章、评论、关注、收藏模块。
- JWT 认证和权限控制。
- 参数化手写 SQL。
- Service 单元测试和 HTTP 接口测试。
- API 文档、Docker 启动方式和项目 README。
- 学习复盘文档。
- 可以连接 Vue 3 RealWorld 前端的演示效果。

面试时重点不是文件数量，而是能够清楚解释：

- 为什么这样分层。
- 业务规则放在哪里。
- 数据库约束如何兜底。
- TypeScript 类型解决什么问题，Zod 又解决什么问题。
- 如何测试业务逻辑。
- 如何从简单代码逐步演进到可长期维护的项目。

