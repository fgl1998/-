# 第 5 章：测试、运行、构建与常见问题

## 1. 为什么测试分三层

只有 API 测试时，失败很难定位；只有单元测试时，又可能出现 SQL 根本不能运行。项目把测试分成：

```text
unit        快速验证纯规则和单个组件
api         验证 Express 请求链路和响应契约
integration 使用真实 MySQL 验证 SQL、约束和事务
```

测试数量不是目标。每层验证自己最擅长的风险，才是目标。

## 2. Service 单元测试为什么用 Fake Repository

[fake-user.repository.ts](../../tests/helpers/fake-user.repository.ts) 是内存实现，遵守与 MySQL Repository 相同的 `UserRepository` 接口。

[user.service.test.ts](../../tests/unit/user.service.test.ts) 不启动 Express、不连接 MySQL，可以直接验证：

- 分页 offset 计算；
- `USER_NOT_FOUND`；
- 邮箱已存在；
- 并发重复键结果转换；
- 创建和删除用例。

这不是为了证明 Fake Repository 正确，而是让 Service 测试只关注业务。若测试 Service 必须模拟 Request、Response、mysql2 Pool 和 SQL Row，说明代码耦合太重。

运行：

```powershell
npm run test:unit
```

## 3. API 测试为什么不监听 3000 端口

[user.api.test.ts](../../tests/api/user.api.test.ts) 使用 Supertest：

```ts
const response = await request(createTestApp())
  .post('/api/v1/users')
  .send({ name: '张三', email: 'zhangsan@example.com' })

expect(response.status).toBe(201)
expect(response.body.code).toBe('USER_CREATED')
```

Supertest 直接调用 Express App，所以：

- 不需要提前执行 `npm run dev`；
- 不会与本机 3000 端口冲突；
- 能给每个测试创建独立 Fake Repository；
- 能验证中间件顺序、Header、状态码和 JSON。

运行：

```powershell
npm run test:api
```

## 4. 数据库集成测试的安全准备

先建立测试库：

```sql
CREATE DATABASE IF NOT EXISTS express_backend_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

不要把 `.env` 的开发库永久改成测试库。PowerShell 可以只为当前终端覆盖数据库名：

```powershell
$env:NODE_ENV='test'
$env:DB_NAME='express_backend_test'
npm run migrate
npm run test:integration
```

终端关闭后临时环境变量消失。

集成测试会删除 `users` 表中的测试数据，因此代码强制数据库名以 `_test` 结尾。若看到：

```text
集成测试数据库名必须以 _test 结尾
```

不要删除这项保护，应修正 `DB_NAME`。

[mysql-user.repository.test.ts](../../tests/integration/mysql-user.repository.test.ts) 验证真实参数化 SQL、分页、删除和唯一索引错误转换。[transaction.test.ts](../../tests/integration/transaction.test.ts) 验证真实 commit 与 rollback。

## 5. 默认质量门禁

日常提交前执行：

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

含义：

- `typecheck`：严格类型正确；
- `lint`：静态规则正确；
- `test`：无需数据库的单元和 API 行为正确；
- `build`：能生成生产 ESM JavaScript。

有测试数据库的 CI 再加：

```powershell
npm run test:integration
```

## 6. 第一次完整启动

### 第一步：安装依赖

```powershell
cd E:\面试项目\express-backend
npm install
```

### 第二步：准备配置

```powershell
Copy-Item .env.example .env
```

编辑 `.env`，至少确认：

```env
DB_USER=你的MySQL用户
DB_PASSWORD=你的MySQL密码
DB_NAME=express_backend
```

### 第三步：执行 Migration

```powershell
npm run migrate
```

### 第四步：启动开发服务器

```powershell
npm run dev
```

看到结构化的 `server started` 日志后，服务默认运行于 `http://localhost:3000`。

## 7. 用 PowerShell 调用接口

### 检查进程存活

```powershell
Invoke-RestMethod http://localhost:3000/health/live
```

### 检查数据库就绪

```powershell
Invoke-RestMethod http://localhost:3000/health/ready
```

### 创建用户

```powershell
$body = @{
  name = '张三'
  email = 'zhangsan@example.com'
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/v1/users `
  -ContentType 'application/json' `
  -Body $body
```

### 分页查询

```powershell
Invoke-RestMethod 'http://localhost:3000/api/v1/users?page=1&pageSize=20'
```

### 查询一个用户

```powershell
Invoke-RestMethod http://localhost:3000/api/v1/users/1
```

### 删除用户

```powershell
Invoke-RestMethod `
  -Method Delete `
  -Uri http://localhost:3000/api/v1/users/1
```

## 8. 生产模式本地验证

```powershell
npm run build
npm start
```

这次运行的是 `dist/server.js`，不是 TypeScript Watch。部署前必须验证生产构建，因为 ESM 文件扩展名、编译配置等问题可能只在编译结果中暴露。

`server.ts` 监听 `SIGINT` 和 `SIGTERM`。按 Ctrl+C 时先停止接受新请求，再关闭 MySQL Pool。10 秒仍未结束才强制退出，避免部署系统永久等待。

## 9. 常见错误排查表

| 现象 | 常见原因 | 处理方法 |
| --- | --- | --- |
| 无法将 `npm` 识别为命令 | Node 未安装或 PATH 未刷新 | 安装 Node，确认安装目录进入 PATH，重新打开终端 |
| `ER_ACCESS_DENIED_ERROR` | MySQL 用户或密码错误 | 用 `mysql -u 用户 -p` 验证账号，再修改 `.env` |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL 服务未启动或端口错误 | 启动 MySQL 服务，核对 `DB_HOST/DB_PORT` |
| `Unknown database` | 数据库还没创建 | 先执行 `CREATE DATABASE`，Migration 不负责创建数据库本身 |
| 启动时报环境变量校验失败 | `.env` 缺字段或数字非法 | 对照 `.env.example`，不要把端口写成任意文字 |
| `EMAIL_ALREADY_EXISTS` | 邮箱唯一索引冲突 | 换邮箱；不要删除唯一索引来绕过业务规则 |
| Migration 校验和变化 | 修改了已经执行的 SQL 文件 | 恢复历史文件，新增下一个版本 |
| `EADDRINUSE` | 端口被其他进程占用 | 关闭占用进程，或修改 `.env` 的 `PORT` |
| CORS 被拒绝 | 前端 Origin 不在允许列表 | 把完整 Origin 加到 `CORS_ORIGINS`，逗号分隔 |
| `/health/live` 成功但 `/health/ready` 失败 | Node 正常但数据库不可用 | 检查数据库连接、权限和连接池 |
| 集成测试拒绝数据库名 | 数据库名没有 `_test` 后缀 | 使用专门测试库，不要绕过保护 |

## 10. 如何定位一个 500 错误

1. 从响应头或 JSON 记下 `requestId`；
2. 在服务日志搜索相同 `requestId`；
3. 阅读日志中的原始 `err`；
4. 先复现并写失败测试；
5. 找到数据从哪一层变错，再修根因；
6. 运行默认质量门禁确认没有回归。

客户端看不到内部错误消息是安全设计，不代表服务端没有记录。Request ID 正是连接这两个视角的桥梁。

## 11. 添加下一个业务模块

不要复制数据库、错误处理和日志基础设施。只需要按 User 模块模式建立：

```text
modules/article/
├─ article.schema.ts
├─ article.dto.ts
├─ article.entity.ts
├─ article.repository.ts
├─ article.mysql-repository.ts
├─ article.service.ts
├─ article.controller.ts
├─ article.route.ts
└─ article.module.ts
```

先写 Service 行为测试，再写最小实现；Repository 的真实 SQL放到独立测试库验证。最后在 `server.ts` 组装实现，在 `app.ts` 挂载 Router。

回到 [教程首页](./README.md)。
