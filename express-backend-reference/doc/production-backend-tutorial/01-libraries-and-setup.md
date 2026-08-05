# 第 1 章：项目依赖、脚本与目录

## 1. 为什么 Express 项目需要自己设计架构

Spring Boot 会给你 Controller、依赖注入、统一异常等较强约定；Express 的核心很轻，只负责路由和中间件执行。自由度高意味着团队必须自己确定：参数在哪里校验、业务写在哪里、SQL 放在哪里、错误由谁返回。

本项目采用“模块化单体 + 轻量 Clean Architecture”：部署时仍是一个 Node 进程，但代码按业务模块划分，并严格限制依赖方向。

## 2. 每个运行时库做什么

可以在 [package.json](../../package.json) 查看实际版本。

### express

Express 提供 HTTP Server 应用模型、Router 和 Middleware。它负责把请求按顺序交给中间件，但不提供数据库、参数校验或业务分层。

在本项目中，Express 类型只允许出现在 HTTP 适配层，例如 `app.ts`、Route、Controller 和 Middleware。Service 不能导入 `Request` 或 `Response`。

### zod

Zod 在程序运行时检查真实请求。TypeScript 的类型在编译后会被删除，因此下面的写法不能阻止客户端传入数字：

```ts
interface CreateUserBody {
  email: string
}
```

Zod 不仅校验，还可以清洗输入，例如 `trim()`、`toLowerCase()` 和把字符串分页参数转换为数字。项目通过 `z.infer` 从 Schema 生成 TypeScript 类型，避免维护两套规则。

### mysql2

`mysql2/promise` 提供 Promise 风格的 MySQL 连接池、预处理语句和事务 API。本项目没有 ORM，SQL 保持可见；所有外部值都通过 `?` 占位符传入。

mysql2 不负责业务规则。它不知道“邮箱重复”应该显示什么中文提示，这类决定属于 Service。

### pino

Pino 输出结构化 JSON 日志。与随意 `console.log('出错了')` 相比，JSON 日志可以被日志平台按 `requestId`、状态码或耗时搜索。项目还配置了密码、Token、Cookie 等字段脱敏。

### helmet

Helmet 设置一组常用安全响应头，降低浏览器内容嗅探、错误嵌入等常见风险。它不是完整安全方案，不能代替参数校验、鉴权、SQL 占位符或 HTTPS。

### cors

CORS 决定浏览器允许哪些前端来源跨域调用后端。来源列表从 `.env` 读取，不能永远硬编码为 `http://localhost:5173`。

### dotenv

dotenv 在开发环境把 `.env` 文件加载到 `process.env`。它只负责加载字符串，不负责判断端口是不是合法数字，所以后面仍要用 Zod 校验。

## 3. 每个开发依赖做什么

### TypeScript

TypeScript 在编译阶段检查类型。项目启用 `strict` 和 `noUncheckedIndexedAccess`，让可能不存在的值更早暴露。当前锁定 `5.9.3`，原因是它与项目的 ESLint TypeScript 插件兼容。

### tsx

tsx 可以在开发阶段直接执行 `.ts` 文件，并支持 Watch。生产环境不使用 tsx，而是先执行 `tsc`，再由 Node 运行 `dist/server.js`。

### Vitest

Vitest 运行单元测试和集成测试。它负责断言“代码应该做什么”，例如 Service 遇到未知用户必须抛出 `USER_NOT_FOUND`。

### Supertest

Supertest 直接向内存中的 Express App 发请求，不需要先占用 3000 端口。它用于验证路由、中间件、状态码和响应 JSON 是否正确。

### ESLint

ESLint 发现未使用变量、危险写法和不一致的类型导入。它检查代码含义，不负责调整缩进。

### Prettier

Prettier 统一换行、引号和缩进。它处理代码外观，不判断业务是否正确。

## 4. 为什么要锁定兼容版本

安装最新版并不一定等于稳定。本项目原来使用 TypeScript 7，但当时的 `typescript-eslint` 只支持 `<6.1`；同时最新版 ESLint/Vite 要求 Node 20.19，而现有运行环境是 Node 20.15。

错误做法是加 `--force` 强行安装。这样只会把安装阶段的警告拖到运行或 CI 阶段。本项目改为兼容组合：

```text
Node.js             20.15+
TypeScript          5.9.3
ESLint              9.39.2
typescript-eslint   8.47.0
Vitest              3.2.4
Vite                 6.1.0
```

当以后升级 Node 时，应在独立分支同时升级工具链，并运行完整测试和构建。

## 5. npm 脚本逐个解释

### 开发启动

```powershell
npm run dev
```

执行 `tsx watch src/server.ts`。修改 TypeScript 文件后自动重启。需要有效 `.env` 和可连接的数据库。

### 类型检查

```powershell
npm run typecheck
```

执行 `tsc --noEmit`，只检查类型，不生成 `dist`。

### Lint 与格式化

```powershell
npm run lint
npm run format
```

`lint` 只报告规则问题；`format` 会修改文件格式。提交前至少运行 `lint`。

### 默认测试

```powershell
npm test
```

运行 `tests/unit` 和 `tests/api`，不需要 MySQL，因此开发者和 CI 可以快速反馈。

### 数据库集成测试

```powershell
npm run test:integration
```

会连接 `.env` 指定的数据库并清理 `users` 测试数据。数据库名必须使用专门测试库，例如 `express_backend_test`，绝不能指向生产库。

### 编译与生产启动

```powershell
npm run build
npm start
```

`build` 把 `src` 编译到 `dist`；`start` 运行编译结果。生产部署不能用 Watch 模式。

### Migration

```powershell
npm run migrate
```

按版本执行尚未应用的 SQL 文件。API 启动时不会偷偷修改数据库，这是有意设计。

## 6. 如何阅读项目目录

第一次阅读建议按一次请求的顺序，而不是按字母顺序：

1. [app.ts](../../src/app.ts)：中间件和路由总体顺序；
2. [user.route.ts](../../src/modules/user/user.route.ts)：URL 对应哪个处理器；
3. [user.schema.ts](../../src/modules/user/user.schema.ts)：输入规则；
4. [user.controller.ts](../../src/modules/user/user.controller.ts)：HTTP 控制；
5. [user.service.ts](../../src/modules/user/user.service.ts)：业务规则；
6. [user.repository.ts](../../src/modules/user/user.repository.ts)：Service 需要的数据能力；
7. [user.mysql-repository.ts](../../src/modules/user/user.mysql-repository.ts)：真实 SQL；
8. [server.ts](../../src/server.ts)：最终如何把所有实现组装起来。

下一章开始连接真实数据库：[环境配置、MySQL、Migration 与事务](./02-config-database-and-migrations.md)。
