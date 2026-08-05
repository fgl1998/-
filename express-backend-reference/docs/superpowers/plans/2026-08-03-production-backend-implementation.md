# Express Production Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有 Express 示例重构为可运行、可测试的生产级模块化单体，并交付一组面向新手的中文实现教程。

**Architecture:** 请求经过通用中间件后进入按业务聚合的 User 模块，依次流经 Route、Controller、Service、Repository 契约和 MySQL Repository。基础设施集中处理配置、连接池、Migration、事务、日志和错误，Service 不依赖 Express 或 MySQL 驱动。

**Tech Stack:** Node.js、TypeScript、Express 5、Zod 4、MySQL、mysql2/promise、Pino、Helmet、Vitest、Supertest、ESLint、Prettier。

## Execution Status

- 已完成源码、默认单元/API 测试、类型检查、Lint、生产构建和六篇新手教程。
- 默认质量门禁结果：7 个测试文件、33 个测试全部通过。
- 真实 MySQL 集成测试已经编写，但本机 `root` 空密码连接被 MySQL 拒绝；需由开发者在 `.env` 提供专用测试账号后执行 `npm run test:integration`。

## Global Constraints

- 使用 MySQL、`mysql2/promise` 和参数化手写 SQL，不引入 ORM。
- API 统一使用 `/api/v1` 前缀。
- 输入类型以 Zod Schema 为唯一事实来源。
- Service 不导入 Express 或 MySQL 驱动类型。
- 认证只预留边界，不实现 JWT、Refresh Token 或 RBAC。
- 已执行 Migration 不可修改，只能新增版本。
- 不覆盖或提交 `express-backend` 之外的用户改动。
- 每个实现任务遵循 Red-Green-Refactor，并在完成后运行相关测试。

---

## File Map

### Project and quality configuration

- Modify `express-backend/package.json`: dependencies and executable scripts.
- Modify `express-backend/tsconfig.json`: strict application compilation.
- Create `express-backend/eslint.config.js`: TypeScript flat ESLint configuration.
- Create `express-backend/.prettierrc.json`: formatting rules.
- Create `express-backend/vitest.config.ts`: test discovery and environment.
- Create `express-backend/.env.example`: documented safe configuration template.

### Shared infrastructure

- Create `express-backend/src/config/env.ts`: validate and normalize process environment.
- Create `express-backend/src/shared/errors/app-error.ts`: safe operational error model.
- Create `express-backend/src/shared/http/api-response.ts`: success envelope helpers.
- Create `express-backend/src/shared/logger/logger.ts`: Pino logger and redaction.
- Create `express-backend/src/middlewares/request-context.middleware.ts`: request ID and access log.
- Create `express-backend/src/middlewares/validate.middleware.ts`: reusable Zod request validation.
- Modify `express-backend/src/middlewares/error.middleware.ts`: single safe error response outlet.
- Modify `express-backend/src/middlewares/not-found.middleware.ts`: stable route-not-found error.
- Create `express-backend/src/middlewares/authenticate.middleware.ts`: authentication contract only, not fake authentication.

### Database

- Create `express-backend/src/database/mysql.ts`: pool construction, ping and shutdown.
- Create `express-backend/src/database/transaction.ts`: begin/commit/rollback/release lifecycle.
- Create `express-backend/src/database/migrate.ts`: immutable SQL migration runner.
- Create `express-backend/src/database/migrations/001_create_users.sql`: users table and unique email index.

### User module

- Create `express-backend/src/modules/user/user.entity.ts`: internal User entity.
- Create `express-backend/src/modules/user/user.schema.ts`: Zod request schemas.
- Create `express-backend/src/modules/user/user.dto.ts`: inferred input and explicit output models.
- Create `express-backend/src/modules/user/user.repository.ts`: persistence contract and duplicate-email error.
- Create `express-backend/src/modules/user/user.mapper.ts`: row/entity/output conversion.
- Create `express-backend/src/modules/user/user.mysql-repository.ts`: parameterized MySQL implementation.
- Create `express-backend/src/modules/user/user.service.ts`: business use cases.
- Create `express-backend/src/modules/user/user.controller.ts`: HTTP adaptation.
- Create `express-backend/src/modules/user/user.route.ts`: route and validation composition.
- Create `express-backend/src/modules/user/user.module.ts`: manual dependency composition.

### Application bootstrap

- Modify `express-backend/src/app.ts`: app factory, security middleware, health routes and API mounting.
- Modify `express-backend/src/server.ts`: infrastructure composition and graceful shutdown.

### Tests

- Create `express-backend/tests/helpers/fake-user.repository.ts`: in-memory repository test double.
- Create `express-backend/tests/unit/env.test.ts`: environment normalization.
- Create `express-backend/tests/unit/user.schema.test.ts`: input validation.
- Create `express-backend/tests/unit/user.service.test.ts`: business rules.
- Create `express-backend/tests/api/user.api.test.ts`: middleware and HTTP contract.
- Create `express-backend/tests/integration/mysql-user.repository.test.ts`: real SQL behavior.
- Create `express-backend/tests/integration/transaction.test.ts`: commit and rollback behavior.

### Beginner tutorial

- Create `express-backend/doc/production-backend-tutorial/README.md`: learning route and final file tree.
- Create `express-backend/doc/production-backend-tutorial/01-libraries-and-setup.md`: library purpose and scripts.
- Create `express-backend/doc/production-backend-tutorial/02-config-database-and-migrations.md`: environment, pool, SQL migrations and transactions.
- Create `express-backend/doc/production-backend-tutorial/03-request-validation-errors-and-logging.md`: request middleware flow.
- Create `express-backend/doc/production-backend-tutorial/04-user-module-from-route-to-sql.md`: complete User request walkthrough.
- Create `express-backend/doc/production-backend-tutorial/05-testing-running-and-debugging.md`: tests, commands and common failures.

---

### Task 1: Install the toolchain and lock executable project scripts

**Files:**
- Modify: `express-backend/package.json`
- Modify: `express-backend/tsconfig.json`
- Create: `express-backend/eslint.config.js`
- Create: `express-backend/.prettierrc.json`
- Create: `express-backend/vitest.config.ts`

**Interfaces:**
- Produces: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run migrate`.

- [ ] **Step 1: Install runtime and development dependencies**

Run:

```powershell
npm install mysql2 pino helmet
npm install -D vitest supertest @types/supertest eslint @eslint/js typescript-eslint prettier
```

Expected: commands exit with code 0 and update both `package.json` and `package-lock.json`.

- [ ] **Step 2: Define exact scripts**

Set the `scripts` object to:

```json
{
  "dev": "tsx watch src/server.ts",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src tests vitest.config.ts",
  "format": "prettier --write src tests doc package.json tsconfig.json vitest.config.ts eslint.config.js",
  "test": "vitest run tests/unit tests/api",
  "test:unit": "vitest run tests/unit",
  "test:api": "vitest run tests/api",
  "test:integration": "vitest run tests/integration",
  "build": "tsc",
  "start": "node dist/server.js",
  "migrate": "tsx src/database/migrate.ts"
}
```

- [ ] **Step 3: Add Vitest, ESLint and Prettier configuration**

`vitest.config.ts` must export:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    clearMocks: true,
    restoreMocks: true
  }
})
```

ESLint must combine `@eslint/js` recommended and `typescript-eslint` recommended configs, ignore `dist` and `node_modules`, and allow Node globals through TypeScript types. Prettier must use no semicolons, single quotes and no trailing commas.

- [ ] **Step 4: Verify the baseline failure is understood**

Run:

```powershell
npm run typecheck
```

Expected before later tasks: FAIL because existing placeholder module files reference undefined variables. This proves the current snippets are incomplete rather than silently usable.

- [ ] **Step 5: Commit only project configuration files**

```powershell
git add express-backend/package.json express-backend/package-lock.json express-backend/tsconfig.json express-backend/eslint.config.js express-backend/.prettierrc.json express-backend/vitest.config.ts
git commit -m "chore: configure backend quality toolchain"
```

### Task 2: Build validated configuration and safe shared HTTP infrastructure

**Files:**
- Create: `express-backend/.env.example`
- Create: `express-backend/src/config/env.ts`
- Create: `express-backend/src/shared/errors/app-error.ts`
- Create: `express-backend/src/shared/http/api-response.ts`
- Create: `express-backend/src/shared/logger/logger.ts`
- Create: `express-backend/tests/unit/env.test.ts`

**Interfaces:**
- Produces: `loadEnv(source): AppEnv`, `AppError`, `sendSuccess(res, response)`, `logger`.

- [ ] **Step 1: Write failing environment tests**

Test these complete behaviors:

```ts
expect(loadEnv({ DB_USER: 'root', DB_NAME: 'app' }).PORT).toBe(3000)
expect(loadEnv({ DB_USER: 'root', DB_NAME: 'app', CORS_ORIGINS: 'http://a.test,http://b.test' }).CORS_ORIGINS)
  .toEqual(['http://a.test', 'http://b.test'])
expect(() => loadEnv({ DB_NAME: 'app' })).toThrow()
```

- [ ] **Step 2: Run the focused test and observe RED**

Run: `npm run test:unit -- tests/unit/env.test.ts`

Expected: FAIL because `loadEnv` does not exist.

- [ ] **Step 3: Implement configuration and shared contracts**

`AppEnv` must include normalized `NODE_ENV`, `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT`, `CORS_ORIGINS` and `LOG_LEVEL`. `loadEnv` must accept a plain source object so tests do not mutate `process.env`; `env` is created once with `loadEnv(process.env)`.

Use this operational error signature:

```ts
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown = null
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

Use this successful response contract:

```ts
export interface SuccessResponse<T> {
  code: string
  message: string
  data: T
  meta?: PaginationMeta
}
```

`sendSuccess` adds `success: true` and accepts an explicit HTTP status. Pino redaction must cover Authorization, Cookie, password, token and database password paths.

- [ ] **Step 4: Run unit tests and typecheck**

Run: `npm run test:unit -- tests/unit/env.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit configuration and shared contracts**

```powershell
git add express-backend/.env.example express-backend/src/config express-backend/src/shared express-backend/tests/unit/env.test.ts
git commit -m "feat: add validated backend configuration"
```

### Task 3: Implement request validation, request context and centralized errors

**Files:**
- Create: `express-backend/src/middlewares/request-context.middleware.ts`
- Modify: `express-backend/src/middlewares/validate.middleware.ts`
- Modify: `express-backend/src/middlewares/error.middleware.ts`
- Modify: `express-backend/src/middlewares/not-found.middleware.ts`
- Modify: `express-backend/src/middlewares/authenticate.middleware.ts`
- Test through: `express-backend/tests/api/user.api.test.ts` in Task 7.

**Interfaces:**
- Produces: `ValidatedLocals<T>`, `validate(schema)`, `requestContext`, `notFoundHandler`, `errorHandler`.

- [ ] **Step 1: Define validated locals and middleware behavior**

```ts
export interface ValidatedLocals<T> {
  validated: T
  requestId: string
}

export function validate<T>(schema: z.ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    })
    if (!result.success) {
      next(new AppError(400, 'VALIDATION_ERROR', '请求参数校验失败', normalizeIssues(result.error.issues)))
      return
    }
    res.locals.validated = result.data
    next()
  }
}
```

`normalizeIssues` returns only `path`, `code` and `message`.

- [ ] **Step 2: Implement request context**

Use `crypto.randomUUID()` when `x-request-id` is absent, set the response header, save the ID in `res.locals.requestId`, and log one completion event on `finish` with method, original URL, status and duration.

- [ ] **Step 3: Implement the single error outlet**

For `AppError`, return its status, code, message, details and Request ID. For unknown errors, log the original exception and return HTTP 500 with `INTERNAL_SERVER_ERROR`, a generic Chinese message, `details: null` and Request ID. Preserve Express behavior when headers were already sent.

- [ ] **Step 4: Implement route-not-found and authentication boundary**

`notFoundHandler` must raise `ROUTE_NOT_FOUND`. The authentication file only declares an `AuthUser` shape and an `AuthenticationHandler` contract; it must not trust headers or fabricate a logged-in user.

- [ ] **Step 5: Run typecheck after User placeholders are replaced in Tasks 4-6**

Run: `npm run typecheck`

Expected after Task 6: PASS.

### Task 4: Implement MySQL pool, versioned migrations and transactions

**Files:**
- Modify: `express-backend/src/database/mysql.ts`
- Modify: `express-backend/src/database/transaction.ts`
- Create: `express-backend/src/database/migrate.ts`
- Create: `express-backend/src/database/migrations/001_create_users.sql`
- Create: `express-backend/tests/integration/transaction.test.ts`

**Interfaces:**
- Produces: `createDatabase(env)`, `checkDatabaseConnection(pool)`, `closeDatabase(pool)`, `withTransaction(pool, work)`, `runMigrations(config)`.

- [ ] **Step 1: Write a failing transaction integration test**

The test creates a temporary row inside `withTransaction`, throws `new Error('force rollback')`, and then asserts the row count is unchanged. A second case completes normally and asserts the row was committed.

- [ ] **Step 2: Implement database lifecycle**

`createDatabase` returns a `mysql2/promise` pool configured with host, port, user, password, database, connection limit, UTF-8 and `waitForConnections: true`. Ping executes `SELECT 1`; close calls `pool.end()`.

- [ ] **Step 3: Implement the transaction lifecycle**

```ts
export async function withTransaction<T>(
  pool: Pool,
  work: (connection: PoolConnection) => Promise<T>
): Promise<T> {
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
}
```

- [ ] **Step 4: Implement immutable SQL migrations**

Create `schema_migrations(version, filename, checksum, executed_at)`. Sort `NNN_name.sql` files, reject duplicate versions, compare the SHA-256 checksum for already executed files, execute new files in order, and insert their metadata only after the SQL succeeds. Exit non-zero on any mismatch or SQL failure.

The first migration creates `users(id BIGINT UNSIGNED AUTO_INCREMENT, name VARCHAR(50), email VARCHAR(255), created_at DATETIME(3))` and a unique email index using `utf8mb4`.

- [ ] **Step 5: Run migrations and integration tests against the dedicated test database**

Run:

```powershell
$env:DB_NAME='express_backend_test'
npm run migrate
npm run test:integration -- tests/integration/transaction.test.ts
```

Expected: migration is applied once; both commit and rollback tests pass.

### Task 5: Build the User domain, schemas, DTOs and Repository contract

**Files:**
- Modify: `express-backend/src/modules/user/user.entity.ts`
- Modify: `express-backend/src/modules/user/user.schema.ts`
- Modify: `express-backend/src/modules/user/user.dto.ts`
- Modify: `express-backend/src/modules/user/user.repository.ts`
- Modify: `express-backend/src/modules/user/user.mapper.ts`
- Create: `express-backend/tests/unit/user.schema.test.ts`

**Interfaces:**
- Produces: `User`, `CreateUserDto`, `ListUsersDto`, `UserOutput`, `UserRepository`, `toUserOutput`.

- [ ] **Step 1: Write failing Schema tests**

Assert that valid creation input trims the name and lowercases email, invalid IDs fail, page defaults to 1, page size defaults to 20, and page size above 100 fails.

- [ ] **Step 2: Define exact domain and persistence contracts**

```ts
export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

export interface UserRepository {
  findPage(input: { offset: number; limit: number }): Promise<User[]>
  count(): Promise<number>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(input: { name: string; email: string }): Promise<User>
  deleteById(id: number): Promise<boolean>
}
```

`DuplicateUserEmailError` is a module-level persistence outcome that contains no HTTP status.

- [ ] **Step 3: Implement schemas and inferred DTOs**

Creation validates a 2-50 character trimmed name and a lowercased email. ID uses `z.coerce.number().int().positive()`. Pagination uses coerced positive integers, defaults `page=1`, `pageSize=20`, and limits `pageSize` to 100.

- [ ] **Step 4: Implement mapping**

`toUserOutput` returns `{ id, name, email, createdAt: user.createdAt.toISOString() }`. MySQL row mapping converts numeric IDs safely and converts database dates to `Date`.

- [ ] **Step 5: Run Schema tests**

Run: `npm run test:unit -- tests/unit/user.schema.test.ts`

Expected: PASS.

### Task 6: Implement MySQL Repository and business Service with TDD

**Files:**
- Create: `express-backend/src/modules/user/user.mysql-repository.ts`
- Modify: `express-backend/src/modules/user/user.service.ts`
- Create: `express-backend/tests/helpers/fake-user.repository.ts`
- Create: `express-backend/tests/unit/user.service.test.ts`
- Create: `express-backend/tests/integration/mysql-user.repository.test.ts`

**Interfaces:**
- Consumes: `UserRepository`, User DTOs and mapping from Task 5.
- Produces: `MysqlUserRepository`, `UserService.list/getById/create/remove`.

- [ ] **Step 1: Write failing Service tests with a Fake Repository**

Cover page offset calculation, total pages, user-not-found, successful creation, pre-existing email conflict, duplicate-key race conversion, successful removal and remove-not-found.

- [ ] **Step 2: Implement Service business rules**

`list` calculates `offset = (page - 1) * pageSize` and returns output DTOs with pagination metadata. `getById` raises `USER_NOT_FOUND`. `create` performs a friendly precheck, creates the user, and converts `DuplicateUserEmailError` to `EMAIL_ALREADY_EXISTS` with HTTP 409. `remove` raises `USER_NOT_FOUND` when no row is deleted.

- [ ] **Step 3: Run Service tests**

Run: `npm run test:unit -- tests/unit/user.service.test.ts`

Expected: PASS.

- [ ] **Step 4: Write Repository integration tests before implementation**

Against the migrated test database, cover parameterized create, lookup by ID, case-normalized email lookup, pagination ordering, count, delete result and duplicate email translation.

- [ ] **Step 5: Implement parameterized SQL**

Use explicit columns and placeholders:

```sql
SELECT id, name, email, created_at
FROM users
ORDER BY id DESC
LIMIT ? OFFSET ?
```

Use the same explicit columns for lookups, `INSERT INTO users(name, email) VALUES (?, ?)` for creation, and `DELETE FROM users WHERE id = ?` for removal. Detect MySQL `ER_DUP_ENTRY` and throw `DuplicateUserEmailError`.

- [ ] **Step 6: Run Repository integration tests**

Run: `npm run test:integration -- tests/integration/mysql-user.repository.test.ts`

Expected: PASS.

### Task 7: Compose Controller, routes, app and graceful server; verify the API

**Files:**
- Modify: `express-backend/src/modules/user/user.controller.ts`
- Modify: `express-backend/src/modules/user/user.route.ts`
- Create: `express-backend/src/modules/user/user.module.ts`
- Modify: `express-backend/src/app.ts`
- Modify: `express-backend/src/server.ts`
- Create: `express-backend/tests/api/user.api.test.ts`
- Delete obsolete: `express-backend/src/controllers/user.controller.ts`
- Delete obsolete: `express-backend/src/routes/user.route.ts`
- Delete obsolete: `express-backend/src/services/user.service.ts`
- Delete obsolete: `express-backend/src/utils/app-error.ts`

**Interfaces:**
- Produces: `createUserController(service)`, `createUserRouter(controller)`, `createUserModule(repository)`, `createApp(dependencies)`, `startServer()`.

- [ ] **Step 1: Write failing API tests**

Use Supertest with a Fake Repository. Cover `POST /api/v1/users` returning 201 and normalized output, invalid body returning 400 with `VALIDATION_ERROR`, missing ID returning 404 with `USER_NOT_FOUND`, unknown route returning `ROUTE_NOT_FOUND`, and every error returning the `x-request-id` response header plus matching JSON `requestId`.

- [ ] **Step 2: Implement the thin Controller**

Each handler reads `res.locals.validated`, calls one Service method, then calls `sendSuccess`. It contains no Zod parsing, SQL, email-existence check or local `try/catch`.

- [ ] **Step 3: Implement route and module composition**

Routes are:

```text
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
DELETE /api/v1/users/:id
```

Every route uses its matching validation Schema before its Controller. `createUserModule` manually constructs Service and Controller from the injected Repository.

- [ ] **Step 4: Implement the application factory**

Middleware order is request context, Helmet, configured CORS, JSON parser, health routes, `/api/v1/users`, not-found and error handler. `/health/live` never contacts MySQL; `/health/ready` calls an injected readiness function and reports failure through the global error handler.

- [ ] **Step 5: Implement startup and graceful shutdown**

`startServer` creates the pool, checks connectivity, constructs `MysqlUserRepository`, creates the app, then listens. `SIGINT` and `SIGTERM` close the HTTP server before ending the pool, guard against repeated shutdown, and force a non-zero exit if the shutdown deadline is exceeded.

- [ ] **Step 6: Run API tests, typecheck, lint and build**

Run:

```powershell
npm run test:api
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit 0.

### Task 8: Write the beginner tutorial from the verified implementation

**Files:**
- Create all six files under `express-backend/doc/production-backend-tutorial/` listed in File Map.

**Interfaces:**
- Consumes: final verified source code and commands from Tasks 1-7.
- Produces: a sequential Chinese tutorial that can be followed without reading the architecture spec first.

- [ ] **Step 1: Write the tutorial index and learning route**

The README explains prerequisites, final directory tree, recommended reading order, how a request flows, and links to all five chapters using relative Markdown links.

- [ ] **Step 2: Explain every library and script**

Chapter 1 covers what Express, Zod, mysql2, Pino, Helmet, Vitest, Supertest, ESLint and Prettier do; why each is present; what it does not do; installation commands; and every npm script with expected output.

- [ ] **Step 3: Explain environment, pool, Migration and transaction code line by line**

Chapter 2 includes safe `.env` examples, connection pool lifecycle, placeholder SQL, Migration version/checksum behavior, transaction commit/rollback flow, initial database creation command and common MySQL authentication/port errors.

- [ ] **Step 4: Explain the HTTP infrastructure request flow**

Chapter 3 explains middleware ordering, request ID, structured logs, Zod input normalization, safe error envelopes, why TypeScript alone cannot validate requests, and why Controller should not call `safeParse`.

- [ ] **Step 5: Walk through the complete User module**

Chapter 4 follows one `POST /api/v1/users` request from JSON to SQL and back, then explains Entity vs Row vs Input DTO vs Output DTO, Repository substitution, business errors and list pagination. It links every discussed source file using relative paths.

- [ ] **Step 6: Explain testing, running and debugging**

Chapter 5 provides copyable commands for local database preparation, migrations, development server, curl/PowerShell API calls, unit tests, API tests, integration tests and production build. It includes a symptom/cause/fix table for environment validation, connection refused, access denied, unknown database, duplicate email, migration checksum mismatch and port conflicts.

- [ ] **Step 7: Verify documentation against the code**

Run a link/path scan and manually compare every command, route, response field and filename against the final implementation. Remove every unfinished-marker and empty section before delivery.

### Task 9: Final verification and focused handoff

**Files:**
- Verify all project files; do not modify unrelated workspace projects.

**Interfaces:**
- Produces: evidence that the code and tutorial agree and the default quality gate passes.

- [ ] **Step 1: Run the default quality gate**

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Expected: every command exits 0.

- [ ] **Step 2: Run the database quality gate when the dedicated test database is available**

```powershell
npm run migrate
npm run test:integration
```

Expected: migrations apply or safely skip, Repository and transaction tests pass.

- [ ] **Step 3: Inspect the final diff**

Confirm no secrets, generated `dist`, `.env`, unrelated workspace files or user-owned `.claude` files are staged. Confirm old global User files are removed only because their complete replacements exist under `src/modules/user`.

- [ ] **Step 4: Deliver the learning entry point**

The final handoff links the tutorial README, architecture spec, implementation plan and main application files, and clearly distinguishes verified default tests from any database tests not run because a local MySQL service was unavailable.
