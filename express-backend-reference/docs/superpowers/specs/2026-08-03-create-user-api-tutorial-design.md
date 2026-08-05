# 从零完整编写创建用户接口：教程设计

## 目标

新增一篇可以独立阅读的中文教程，帮助不熟悉后端请求流程的初学者从原始 Express 示例出发，亲手完成 `POST /api/v1/users`。读者完成这一条纵向接口后，应能把同一方法迁移到其他增删改查接口。

## 文件边界

- 新增教程：`doc/production-backend-tutorial/06-build-one-create-user-api-from-zero.md`。
- 不修改已有 `README.md` 和第 1–5 章。
- 不修改 `express-backend` 练习目录。
- 教程及设计文件只存在于 `express-backend-reference` 独立参考目录。

## 教学方式

教程先区分两个顺序：

```text
请求运行顺序：Route → Validate → Controller → Service → Repository → MySQL

推荐编写顺序：
需求契约 → 数据库与公共基础 → Entity/Schema/DTO
→ Repository → Mapper → MySQL Repository
→ Service → Controller → Route → App → 测试
```

运行顺序帮助读者理解请求去了哪里；编写顺序保证当前文件需要的依赖已经存在。

## 教程范围

### 1. 开始前

- 展示最终请求 JSON、HTTP 201 响应、HTTP 400 参数错误和 HTTP 409 邮箱冲突。
- 给出明确验收标准和最终目录树。
- 说明每一步应在哪个目录执行命令。

### 2. 依赖和配置

- 解释并安装 `mysql2`、`zod`。
- 复用已有 Express、cors、dotenv 和 TypeScript。
- 创建 `.env.example` 并解释 `.env` 不可提交。
- 创建经过 Zod 校验的环境配置。

### 3. 数据库基础

- 给出创建数据库命令。
- 给出完整 `users` 建表 SQL和邮箱唯一索引。
- 创建 mysql2 Promise 连接池。
- 解释连接、连接池、占位符、唯一索引和 `created_at`。

### 4. HTTP 公共基础

- 完整编写 `AppError`。
- 完整编写统一成功响应辅助函数。
- 完整编写 Zod Validate Middleware。
- 完整编写全局 Error Middleware。
- 解释错误为何抛出后集中返回，而不是每层直接 `res.json()`。

### 5. User 模块

按以下依赖顺序提供完整、可复制代码：

1. `user.entity.ts`；
2. `user.schema.ts`；
3. `user.dto.ts`；
4. `user.repository.ts`；
5. `user.mapper.ts`；
6. `user.mysql-repository.ts`；
7. `user.service.ts`；
8. `user.controller.ts`；
9. `user.route.ts`；
10. `user.module.ts`。

每个文件都回答：

- 这个文件解决什么问题；
- 它依赖哪个已完成文件；
- 它向下一层提供什么；
- 完整代码；
- 关键代码逐段解释；
- 初学者常见错误；
- 写完后如何做最小检查。

### 6. 应用组装

- 完整改写 `app.ts`。
- 完整改写 `server.ts`。
- 解释为什么实例化顺序是 Pool → Repository → Service → Controller → Router。
- 解释为什么 Service 不能导入 Express，Controller 不能执行 SQL。

### 7. 验证

- 执行 TypeScript 类型检查。
- 执行建表和启动命令。
- 使用 PowerShell 分别调用成功、参数错误、重复邮箱和数据库记录检查。
- 给出请求在每一层的数据形状变化。

### 8. 自动化测试

- 安装 Vitest 和 Supertest。
- 完整编写 Fake Repository。
- 完整编写创建用户 Service 测试。
- 完整编写创建用户 API 测试。
- 说明为什么 Service 测试不连接数据库，API 测试不监听真实端口。

### 9. 迁移方法

教程末尾提供通用接口检查清单：

```text
定义请求与响应
→ 建立 Schema 和 DTO
→ 明确 Entity
→ 定义 Repository 契约
→ 实现数据访问
→ 编写 Service 业务规则
→ 编写 Controller
→ 绑定 Route
→ 组装依赖
→ 覆盖成功与失败测试
```

并分别说明查询详情、列表、更新和删除接口相对创建接口需要替换的部分。

## 写作规则

- 假设读者不知道 `async/await`、构造器注入、泛型和 Express Middleware 的业务用途，首次出现时用直白语言解释。
- 不使用省略代码、伪代码、`TODO` 或“其余类似”。
- 所有导入路径、函数名、类型名和响应字段与参考项目一致。
- 完整代码块之后再逐段解释，避免把一个文件拆成无法复制的碎片。
- 明确区分“此接口必须具备”和“以后可扩展”的功能，避免日志、JWT、Redis 等内容干扰第一条接口。
- 不要求读者复制完整参考项目，所有步骤从原始简单示例开始。

## 验收标准

- 教程单独打开即可跟随，不依赖读者先读旧章节。
- 所有提到的文件都有完整代码或明确说明无需修改。
- `POST /api/v1/users` 的成功、校验失败和邮箱冲突流程均讲到 Error Handler。
- 读者可以说清 Route、Controller、Service、Repository 各自职责。
- 文档中的完整代码可组成一条可编译的接口纵向切片。
- 已有教程文件的内容和哈希保持不变。
