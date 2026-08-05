# Progressive Express Learning Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 `doc/阶段.md`，用一个创建用户接口演示从单文件 Express 到 Service、Repository、Class 和 TypeScript 类型的五阶段渐进学习路线。

**Architecture:** 阶段 1～4 使用同一个 JavaScript 文件，每次只抽取一个新概念，避免文件跳转掩盖业务流程；阶段 5 才转为 TypeScript 并加入 `CreateUserDto` 和 `UserRepository`。最后说明拆文件只是移动已经理解的代码，不会创造新的业务步骤。

**Tech Stack:** Node.js、Express 5、MySQL、mysql2/promise、dotenv、JavaScript、TypeScript。

## Global Constraints

- 只创建 `E:\面试项目\express-backend-reference\doc\阶段.md`。
- 不修改已有项目源码和已有教程。
- 五个阶段都围绕 `POST /users` 创建用户。
- 每个阶段提供完整代码，不使用伪代码或代表省略内容的省略号。
- 从第一阶段开始使用 MySQL、参数化 SQL 和数据库邮箱唯一索引。
- 每次演进只解决一个明确问题，并说明为什么暂时不引入下一层设计。

---

### Task 1: 写明学习原则和第一、二阶段

**Files:**

- Create: `doc/阶段.md`

**Interfaces:**

- Consumes: 用户指定的五阶段学习顺序。
- Produces: 单文件完整接口，以及抽出 `createUser(input)` Service 函数后的完整接口。

- [ ] **Step 1: 写学习规则和 MySQL 前置准备**

说明阶段 1～4 始终在同一个文件操作；给出依赖安装、`.env`、`users` 表和唯一索引的完整内容。

- [ ] **Step 2: 写第一阶段完整代码**

在一个 `app.post('/users')` 中顺序展示校验、查重、插入、重新读取和返回，并解释读者只需跟住这五步。

- [ ] **Step 3: 写第二阶段完整代码**

仅把查重和创建业务抽为 `async function createUser(input)`，Route 保留 HTTP 校验和响应映射；明确此阶段 Service 仍直接使用 Pool 是有意的过渡状态。

### Task 2: 写第三、四、五阶段

**Files:**

- Modify: `doc/阶段.md`

**Interfaces:**

- Consumes: `createUser(input)` 和 mysql2 Pool。
- Produces: Repository 对象、构造器注入的 `UserService` class，以及最终 TypeScript DTO/Repository 接口。

- [ ] **Step 1: 写第三阶段完整代码**

创建具有 `findByEmail()`、`findById()`、`create()` 的 Repository 对象，使 Service 不再包含 SQL；代码仍保留在同一文件。

- [ ] **Step 2: 写第四阶段完整代码**

把 Service 函数改成 `UserService` class，通过构造器注入 Repository 对象；说明 class 解决多用例共享依赖和替换测试实现的问题。

- [ ] **Step 3: 写第五阶段完整代码**

把同一文件转换为 `app.ts`，定义 `CreateUserDto`、`User`、`UserRepository`、`UserService`，让 TypeScript 检查依赖契约；保留完整 Express 启动和错误处理代码。

### Task 3: 写拆文件策略和验证

**Files:**

- Modify and verify: `doc/阶段.md`

**Interfaces:**

- Consumes: 已理解的第五阶段代码块。
- Produces: 机械拆文件顺序、阶段选择清单和完整性验证结果。

- [ ] **Step 1: 写最后拆文件的机械步骤**

展示 `app.ts` 中的 types、repository、service、HTTP 部分如何依次移动到文件，不新增业务逻辑。

- [ ] **Step 2: 写学习和项目选择清单**

说明初学者停在哪一阶段、什么时候进入下一阶段，以及大型项目为什么最终需要第五阶段后的拆分。

- [ ] **Step 3: 验证文档**

检查五个阶段标题、完整代码围栏、SQL 占位符、唯一索引、Service、Repository、class、interface 和 DTO 均存在；扫描 TODO、TBD、待补充和伪代码。

- [ ] **Step 4: 验证旧文件未修改**

比较写作前记录的现有教程 SHA-256，预期全部保持不变。
