# 第 2 章：环境配置、MySQL、Migration 与事务

## 1. 先理解配置为什么也是输入

很多新手只校验前端参数，却直接相信 `process.env.PORT`、`DB_PORT`。环境变量始终是字符串，也可能缺失或拼错。如果配置错误直到第一个请求才暴露，排错成本会很高。

[env.ts](../../src/config/env.ts) 把环境变量当作应用启动输入：

```ts
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_USER: z.string().trim().min(1),
  DB_NAME: z.string().trim().min(1)
})

export function loadEnv(source: Record<string, string | undefined>) {
  return envSchema.parse(source)
}
```

这里有三个重点：

- `z.coerce.number()` 把字符串 `"3000"` 转成数字；
- `DB_USER` 和 `DB_NAME` 缺失时立即终止启动；
- `loadEnv` 接受普通对象，因此单元测试不需要不断修改全局 `process.env`。

## 2. 准备开发库和测试库

进入 MySQL：

```powershell
mysql -u root -p
```

输入密码后执行：

```sql
CREATE DATABASE IF NOT EXISTS express_backend
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE DATABASE IF NOT EXISTS express_backend_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

为什么要两个库：

- `express_backend` 保存本地开发数据；
- `express_backend_test` 允许集成测试插入和删除数据；
- 集成测试不能连接生产库。

测试代码还会检查数据库名必须以 `_test` 结尾，避免配置错误时清理开发或生产数据。

## 3. 创建 `.env`

不要手写所有变量，先复制模板：

```powershell
Copy-Item .env.example .env
```

示例：

```env
NODE_ENV=development
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=express_app
DB_PASSWORD=请填写本机密码
DB_NAME=express_backend
DB_CONNECTION_LIMIT=10

CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=info
```

`.env` 已被 `.gitignore` 忽略，不能提交真实密码。`.env.example` 可以提交，但只能放安全示例。

生产环境通常由容器平台或部署系统注入环境变量，不必依赖服务器磁盘上的 `.env` 文件。

## 4. 连接池解决什么问题

错误做法是在每次请求中执行 `createConnection()`：创建 TCP 连接和数据库握手有成本，请求结束又销毁，吞吐量会很差。

[mysql.ts](../../src/database/mysql.ts) 创建 Pool：

```ts
export function createDatabase(env: DatabaseEnv): Pool {
  return mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: env.DB_CONNECTION_LIMIT,
    charset: 'utf8mb4',
    timezone: 'Z'
  })
}
```

请求执行查询时从池中借连接，完成后由 mysql2 自动归还。只有显式事务需要手动获取并释放同一个连接。

`timezone: 'Z'` 让应用按 UTC 解释数据库日期；API 最终使用 ISO 8601，例如 `2026-08-03T08:00:00.000Z`。前端再按用户时区显示。

## 5. 为什么启动前要 Ping

[server.ts](../../src/server.ts) 在监听端口前调用：

```ts
await checkDatabaseConnection(pool)
```

内部执行 `SELECT 1`。如果密码或数据库名错误，进程不会先宣称“启动成功”，等用户请求时才失败。

两个健康检查语义不同：

- `/health/live`：Node 进程仍能处理请求，不访问数据库；
- `/health/ready`：数据库可用，服务真的可以承接业务流量。

容器平台可以在 live 失败时重启进程，在 ready 失败时暂时停止转发流量。

## 6. Migration 是数据库的 Git 历史

手工告诉同事“请执行这段 SQL”很容易遗漏，也无法知道某个环境已经执行到哪一步。Migration 把数据库结构变化变成版本化文件。

首个文件 [001_create_users.sql](../../src/database/migrations/001_create_users.sql)：

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

邮箱唯一索引是并发安全的最终保障。Service 先查邮箱只能改善提示，两个并发请求仍可能同时认为邮箱不存在，因此数据库约束不能省略。

## 7. Migration Runner 如何工作

[migrate.ts](../../src/database/migrate.ts) 执行以下步骤：

```text
扫描 NNN_name.sql
  → 按数字版本排序
  → 计算文件 SHA-256
  → 读取 schema_migrations
  → 已执行且校验和一致：跳过
  → 未执行：运行 SQL
  → 成功后记录版本、文件名和校验和
```

运行：

```powershell
npm run migrate
```

第一次输出类似：

```text
Migration 执行完成，本次新增 1 个版本
```

第二次会显示新增 0 个版本，这叫幂等执行。

如果已经执行的 SQL 文件被修改，校验和会改变，Runner 会拒绝继续。正确做法是新增 `002_xxx.sql`，不是编辑历史文件。

本项目约定每个 Migration 文件只包含一个数据库结构变更语句。MySQL 的很多 DDL 会隐式提交，不能假设把多个 DDL 包在事务里就能完整回滚。

## 8. 参数化 SQL 为什么安全

错误写法：

```ts
const sql = `SELECT * FROM users WHERE email = '${email}'`
```

如果 email 含引号和 SQL 片段，语句结构可能被改变。正确写法：

```ts
await pool.execute(
  'SELECT id, name, email, created_at FROM users WHERE email = ?',
  [email]
)
```

SQL 模板与数据分开交给驱动，输入中的引号只会被当作数据。参数化查询仍不能替代权限控制和输入长度限制，但它是防止 SQL 注入的基础。

## 9. 事务为什么必须使用同一个连接

事务不是“连续执行几条 SQL”，而是一个数据库连接上的状态。若两条 SQL 从连接池拿到不同连接，`rollback` 无法回滚另一条连接的写入。

[transaction.ts](../../src/database/transaction.ts) 的完整生命周期：

```ts
const connection = await pool.getConnection()
try {
  await connection.beginTransaction()
  const result = await work(connection)
  await connection.commit()
  return result
} catch (error) {
  await connection.rollback()
  throw error
} finally {
  connection.release()
}
```

`finally` 最重要：无论成功失败都归还连接。漏掉 `release()` 会逐渐耗尽连接池，表现为服务运行一段时间后所有请求卡住。

单条 `INSERT` 本身就是原子的，不必额外包事务。创建订单并同时扣库存这类跨表多步骤操作才需要由 Service 声明事务边界。

不要在数据库事务中发送邮件、调用慢速第三方接口或长时间等待用户输入，否则连接和锁会被占用太久。

下一章进入 HTTP 边界：[请求校验、错误处理与日志](./03-request-validation-errors-and-logging.md)。
