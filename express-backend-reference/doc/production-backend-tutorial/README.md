# Express 生产级后端：从零到可运行项目

这套教程面向第一次系统学习 Node.js 后端分层的开发者。你不需要先掌握 Java，但如果熟悉 Spring Boot，会发现 Route、Controller、Service、Repository、DTO 等概念非常相似。

这里的“生产级”不是指一开始就上微服务、消息队列和复杂 DDD，而是先把一个长期项目最容易出问题的边界建立好：输入不可信、业务与 HTTP 混杂、SQL 散落、异常泄漏、数据库变更不可追踪、代码无法测试。

## 学完后能理解什么

- 为什么 TypeScript 类型不能代替接口参数校验；
- 为什么 Controller 应该很薄；
- Service、Repository 和 MySQL Repository 分别负责什么；
- Entity、数据库 Row、输入 DTO、输出 DTO 为什么不能混用；
- 连接池、Migration 和事务各解决什么问题；
- 如何用 Request ID 把客户端错误与服务端日志关联起来；
- 如何在没有真实数据库时测试业务，以及如何用测试库验证真实 SQL；
- 如何启动、调用、构建和排查这个项目。

## 前置环境

- Node.js `>=20.15.0 <21`；
- npm；
- MySQL 8；
- PowerShell、命令提示符或其他终端；
- 一个代码编辑器，例如 VS Code 或 IntelliJ IDEA。

先确认命令存在：

```powershell
node --version
npm --version
```

如果提示“无法将 npm 识别为命令”，先安装 Node.js，或把 Node 安装目录加入系统 `PATH`，然后重新打开终端。项目代码无法修复操作系统没有配置 `PATH` 的问题。

## 推荐阅读顺序

1. [项目依赖、脚本与目录](./01-libraries-and-setup.md)
2. [环境配置、MySQL、Migration 与事务](./02-config-database-and-migrations.md)
3. [请求校验、错误处理与日志](./03-request-validation-errors-and-logging.md)
4. [User 模块：从 Route 一直走到 SQL](./04-user-module-from-route-to-sql.md)
5. [测试、运行、构建与常见问题](./05-testing-running-and-debugging.md)

架构决策原文见 [生产级后端架构设计](../../docs/superpowers/specs/2026-08-03-production-backend-architecture-design.md)。逐任务实现步骤见 [实施计划](../../docs/superpowers/plans/2026-08-03-production-backend-implementation.md)。

## 最终目录

```text
express-backend/
├─ src/
│  ├─ config/
│  │  └─ env.ts
│  ├─ database/
│  │  ├─ migrations/001_create_users.sql
│  │  ├─ migrate.ts
│  │  ├─ mysql.ts
│  │  └─ transaction.ts
│  ├─ middlewares/
│  │  ├─ authenticate.middleware.ts
│  │  ├─ error.middleware.ts
│  │  ├─ not-found.middleware.ts
│  │  ├─ request-context.middleware.ts
│  │  └─ validate.middleware.ts
│  ├─ modules/user/
│  │  ├─ user.controller.ts
│  │  ├─ user.dto.ts
│  │  ├─ user.entity.ts
│  │  ├─ user.mapper.ts
│  │  ├─ user.module.ts
│  │  ├─ user.mysql-repository.ts
│  │  ├─ user.repository.ts
│  │  ├─ user.route.ts
│  │  ├─ user.schema.ts
│  │  └─ user.service.ts
│  ├─ shared/
│  │  ├─ errors/app-error.ts
│  │  ├─ http/api-response.ts
│  │  └─ logger/logger.ts
│  ├─ app.ts
│  └─ server.ts
├─ tests/
│  ├─ api/
│  ├─ helpers/
│  ├─ integration/
│  └─ unit/
├─ .env.example
├─ package.json
└─ tsconfig.json
```

## 一次请求如何流动

以前的初学版经常把所有事情放在一个回调里。现在 `POST /api/v1/users` 会走过下面的路径：

```text
前端 JSON
  → Express JSON Parser
  → Request Context（生成 requestId、记录耗时）
  → Zod Validate Middleware（校验并清洗输入）
  → User Controller（控制 HTTP 状态码和响应）
  → User Service（检查邮箱、执行创建用例）
  → UserRepository 接口
  → MysqlUserRepository（执行参数化 SQL）
  → MySQL
  → User Entity
  → UserOutput DTO
  → 统一 JSON 响应
```

记住一句话：**每一层只解决一种问题。** 当某一层变复杂时，可以独立测试和替换，而不需要重写整个请求链路。

## 最快运行路径

```powershell
cd E:\面试项目\express-backend
npm install
Copy-Item .env.example .env
```

编辑 `.env`，填入本机 MySQL 用户、密码和数据库名。先在 MySQL 创建空库，然后执行：

```powershell
npm run migrate
npm run dev
```

浏览器或接口工具访问：

```text
GET http://localhost:3000/health/live
GET http://localhost:3000/health/ready
GET http://localhost:3000/api/v1/users
```

如果启动失败，不要跳过错误信息。先阅读 [测试、运行、构建与常见问题](./05-testing-running-and-debugging.md) 的排错表。
