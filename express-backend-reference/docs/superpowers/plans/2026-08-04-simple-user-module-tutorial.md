# 6 文件 User 模块简化教程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一篇用 6 个 User 文件讲通 `POST /api/v1/users` 的入门教程，降低读代码时的文件跳转和认知负担。

**Architecture:** 教程保留 Route → Controller → Service → Repository → MySQL 主链，将 Entity、DTO、Repository 契约和数据层错误合并到 `user.types.ts`，将 Mapper 合并到 MySQL Repository，将依赖组装移到 `server.ts`。最后再说明何时以及如何演进到 10 文件生产结构。

**Tech Stack:** TypeScript、Express 5、Zod 4、mysql2/promise、MySQL、Vitest、Supertest、PowerShell。

## Global Constraints

- 只新增 `doc/production-backend-tutorial/07-create-user-api-simple-version.md`。
- 不修改 `doc/production-backend-tutorial/README.md` 和第 01～06 章。
- User 模块恰好使用 `user.types.ts`、`user.schema.ts`、`user.repository.ts`、`user.service.ts`、`user.controller.ts`、`user.route.ts` 六个文件。
- Controller 只处理 HTTP，Service 只处理业务规则，Repository 只处理持久化。
- 所有 SQL 使用 `?` 占位符，邮箱唯一性同时由 Service 预检查和数据库唯一索引保证。
- 所有示例必须完整，不使用 TODO、TBD、伪代码或代表省略内容的省略号。

---

### Task 1: 建立不会迷路的阅读模型

**Files:**

- Create: `doc/production-backend-tutorial/07-create-user-api-simple-version.md`

**Interfaces:**

- Consumes: 第 06 章中的 `POST /api/v1/users` 契约和公共基础设施。
- Produces: 六文件职责表、运行主线、首次阅读顺序、文件跳转规则。

- [ ] **Step 1: 写明教程定位和边界**

明确说明第 07 章不是替换生产结构，而是一个学习过渡版本；接口仍为 `POST /api/v1/users`，不扩展其他接口。

- [ ] **Step 2: 写六文件职责表**

为每个文件只写一个首要问题，例如 Route 回答“哪个 URL 交给谁”，Service 回答“业务允许不允许”。

- [ ] **Step 3: 写运行主线和跳转规则**

给出 `Route → Validate → Controller → Service → Repository → MySQL`，并要求第一次只打开 Route、Controller、Service、Repository 四个文件；类型看不懂再打开 types，参数校验看不懂再打开 schema。

- [ ] **Step 4: 写手写顺序**

按 types → schema → repository → service → controller → route → server 组装排列，解释运行顺序和编写顺序不同。

### Task 2: 写出 6 文件完整实现和最小验证

**Files:**

- Modify: `doc/production-backend-tutorial/07-create-user-api-simple-version.md`

**Interfaces:**

- Consumes: `AppError`、`validate()`、`sendSuccess()`、mysql2 `Pool`。
- Produces: `UserRepository`、`MysqlUserRepository`、`UserService`、`createUserController()`、`createUserRouter()` 的完整且类型一致的示例。

- [ ] **Step 1: 写 `user.types.ts` 完整代码**

定义 `User`、`UserOutput`、`CreateUserRecord`、`UserRepository` 和 `DuplicateUserEmailError`，并逐个说明哪些层会使用它们。

- [ ] **Step 2: 写 `user.schema.ts` 完整代码**

定义完整请求 Schema，并通过 `z.infer` 导出 `CreateUserRequest` 和 `CreateUserDto`。

- [ ] **Step 3: 写 `user.repository.ts` 完整代码**

在同一文件中定义 MySQL Row、`toUser()`、重复键识别、`findByEmail()`、私有 `findById()` 和参数化 `create()`。

- [ ] **Step 4: 写 `user.service.ts` 完整代码**

实现重复邮箱预检查、并发唯一键冲突转换以及 Entity 到 `UserOutput` 的转换。

- [ ] **Step 5: 写 Controller 和 Route 完整代码**

Controller 只读取 `res.locals.validated`、调用 Service、返回 201；Route 只声明 POST、Schema 和 Controller 的执行顺序。

- [ ] **Step 6: 写 `server.ts` 组装代码**

明确展示 `MysqlUserRepository → UserService → Controller → Router → App` 五步组装，解释这替代了 `user.module.ts`。

- [ ] **Step 7: 写手工验证和最小测试**

提供有效、参数错误、重复邮箱三次请求；提供一份完整 Service 测试和一份完整 API 测试，覆盖成功与主要失败路径。

### Task 3: 写演进说明并验证文档边界

**Files:**

- Verify: `doc/production-backend-tutorial/07-create-user-api-simple-version.md`
- Verify unchanged: `doc/production-backend-tutorial/README.md`
- Verify unchanged: `doc/production-backend-tutorial/01-libraries-and-setup.md`
- Verify unchanged: `doc/production-backend-tutorial/02-config-database-and-migrations.md`
- Verify unchanged: `doc/production-backend-tutorial/03-request-validation-errors-and-logging.md`
- Verify unchanged: `doc/production-backend-tutorial/04-user-module-from-route-to-sql.md`
- Verify unchanged: `doc/production-backend-tutorial/05-testing-running-and-debugging.md`
- Verify unchanged: `doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md`

**Interfaces:**

- Consumes: 六文件学习结构和现有十文件生产结构。
- Produces: 明确的拆分时机、逐步映射、最终完整性检查结果。

- [ ] **Step 1: 写 6 → 10 文件映射**

说明 `user.types.ts` 如何拆成 entity/dto/repository，`user.repository.ts` 如何拆成 mapper/mysql-repository，以及 server 组装如何迁入 module。

- [ ] **Step 2: 写“什么时候不要拆”和“什么时候应该拆”**

以接口数量、文件长度、模型数量、实现数量和测试替换需求作为可观察标准，避免为了目录好看提前拆分。

- [ ] **Step 3: 扫描文档结构**

运行：

```powershell
rg -n "^## |TODO|TBD|待补充|待定|伪代码" doc\production-backend-tutorial\07-create-user-api-simple-version.md
```

预期：显示所有二级标题，不显示未完成标记。

- [ ] **Step 4: 检查代码围栏成对闭合**

统计以三个反引号开头的行，预期数量为偶数。

- [ ] **Step 5: 比较旧教程 SHA-256**

将 README 和第 01～06 章的最终 SHA-256 与写作前基线比较，预期每个文件均为 `Unchanged=True`。
