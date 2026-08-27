# uniapp-v2 RealWorld 小程序最终整体代码审查

## 结论

**CHANGES_REQUIRED**

前端页面的主要状态机与当前已修改后端的字段形状基本对齐，真实 HBuilderX 构建也包含文章详情页；但交付仍有两个确定性阻断：

1. 首页分页依赖了工作区中尚未提交、且与“后端保持不变”直接冲突的 Express 分页改造。恢复原后端后，首页会把后端返回的文章数组当成无 `items` 的分页对象，最终显示空列表。
2. 实际 Express 后端的评论创建和删除都会经过一条列名歧义的 SQL。创建会先落库再返回 500，重试可能产生重复评论；删除会在执行删除前返回 500，因此无法完成。

在“必须保持原 Express 后端不变”与“必须实现真实分页、评论创建和删除”同时成立时，当前仓库无法满足验收，需要先解决后端能力与约束之间的冲突。

## 审查范围与方法

- 需求来源：`uniapp-v2/docs/superpowers/plans/2026-08-27-realworld-miniapp-mvp.md`。
- 前端审查范围：`api/*.js`、`common/*.js`、`config/*.js`、`pages/**/*.vue`、`App.vue`、`pages.json`、`vue.config.js`、`tests/*.test.js`。
- 后端契约核对范围：`express-backend2-realWorld/src` 下用户、文章、评论相关 route/schema/mapper/controller/service/repository、鉴权和响应错误处理。
- 本次按要求只做静态审查，没有修改业务源码，也没有重跑测试。
- `unpackage/dist/build/mp-weixin` 只用于确认真实构建是否包含当前页面和配置，没有把生成代码风格作为源码问题。`app.json:3-6` 已包含 index、my、login、article/detail 四页，详情页产物齐全。

## Critical

### 1. 首页分页依赖未授权的后端改造；原 Express 后端下文章列表必然为空

**位置**

- 前端：`uniapp-v2/pages/index/index.vue:192-202`
- 当前后端改动：
  - `express-backend2-realWorld/src/modules/article/article.route.ts:16`
  - `express-backend2-realWorld/src/modules/article/article.controller.ts:57-69`
  - `express-backend2-realWorld/src/modules/article/article.schema.ts:78-88`
  - `express-backend2-realWorld/src/modules/article/article.service.ts:85-111`
  - `express-backend2-realWorld/src/modules/article/article.repository.ts:242-291`
  - 新文件 `express-backend2-realWorld/src/utils/pagination.ts:1-44`
- 相关测试夹具：`uniapp-v2/tests/pages.behavior.test.js:237-243,257`、`uniapp-v2/tests/pages.integration.test.js:44-55`

**证据**

前端只接受分页对象：

```js
const incoming = Array.isArray(result && result.items)
  ? result.items.map(normalizeArticle)
  : []
```

随后还读取 `result.totalPages`。但 Git 基线中的原 Express 后端：

- `/api/articles/list` 没有 `ArticleListSchema`；
- controller 调用 `articleService.list(req.userId)`，不读取分页参数；
- service 的返回值是 `ArticleOutput[]`，不是 `{ items, totalPages }`；
- repository 固定执行 `LIMIT 10 OFFSET 0`。

当前工作区为了让前端分页成立，修改了 route/controller/schema/service/repository，并新增 `src/utils/pagination.ts`，把响应改成 `PageResult`。`git status --short` 明确显示这些后端文件为修改或未跟踪状态。

**影响**

- 若遵守用户要求、恢复并沿用原后端，登录后的 `/api/articles/list` 会成功返回数组；前端却把它归一化为 `[]`，首页显示“还没有文章”。详情、收藏和评论入口也随之不可达。
- 原后端始终只返回前 10 条，单靠前端无法实现真实的第二页请求。换句话说，“后端不改”与“真实分页”在当前基线契约下不可同时满足。
- 现有测试全部注入了新的 `{ items, totalPages }` 形状，因此即使测试全绿，也不会发现恢复原后端后的空列表。

**必须处理**

需要明确选择并记录其中一种方案：

1. 获得授权，对后端做最小、独立、经过审查的分页契约变更，并把该变更纳入正式交付；或
2. 坚持后端完全不变，则前端必须兼容原数组响应，同时承认后端只能提供固定前 10 条，调整“分页浏览”的验收范围。

在没有该决策前，不能以“后端未修改且分页已完成”验收。

### 2. 实际后端的评论创建和删除被 `WHERE id = ?` 歧义查询阻断

**位置**

- 路由/schema：`express-backend2-realWorld/src/modules/article/article.route.ts:21-23`、`article.schema.ts:62-75`
- 调用链：`express-backend2-realWorld/src/modules/article/article.service.ts:157-167,181-189`
- 缺陷 SQL：`express-backend2-realWorld/src/modules/article/article.repository.ts:456-484`
- 表字段证据：`express-backend2-realWorld/src/modules/article/article.mapper.ts:146-155` 与 `src/modules/user/user.mapper.ts:5-13`
- 前端表现：`uniapp-v2/pages/article/detail.vue:180-212`

**证据**

`getCommentById` 同时连接 `comments` 和 `users`：

```sql
FROM comments
JOIN users ON users.id = comments.author_id
WHERE id = ?
```

两张表都有 `id`，该条件没有限定表名，MySQL 会报 `Column 'id' in where clause is ambiguous`。仓库中的 SQL 设计文档使用的正确形式也是 `WHERE comments.id = ?`，但实际源码没有采用它。

这条查询同时位于两个核心流程：

- 创建评论先执行 `INSERT`，随后用 `getCommentById` 读取新评论。插入已自动提交后，读取报错并由 Express 返回 500。前端按失败保留输入，用户重试会再次插入，造成重复评论。
- 删除评论先用 `getCommentById` 做存在性和作者校验；查询先报 500，所以永远到不了真正的 `DELETE`。

**影响**

评论列表可以读取，但评论创建无法得到成功响应，评论删除确定性失败。这直接违背 MVP 的“加载、创建和删除评论”要求，并可能造成数据重复。

**必须处理**

该问题无法由前端安全规避。必须把查询改为 `WHERE comments.id = ?` 并验证创建/删除，或明确接受实际后端评论写接口不可用。由于用户同时要求“不改后端”，这里同样需要先获得约束上的明确决策。

## Important

### 3. 当前交付状态并非“后端保持不变”，且包含与小程序无关的后端漂移

`git status --short -- express-backend2-realWorld` 除了上述分页相关改动外，还显示：

- `package.json`、`package-lock.json` 增加 OpenAPI/Swagger 依赖；
- `profile/profile.error.ts`、`profile/profile.service.ts` 有跟随语义相关改动；
- `article.repository.ts` 还包含 feed 收藏查询修正；
- `.claude/settings.local.json` 为未跟踪文件。

这些变更不属于本次小程序前端范围。即便最终获得分页后端改造授权，也应把分页所需最小变更与其他后端漂移分离；若坚持原要求，则交付前必须确保后端目录没有随本功能提交任何变化。这里陈述的是当前工作树事实，不推断各改动由谁产生。

### 4. 默认 API 地址只能用于桌面本地调试，真机和发布构建无法直接访问

**位置**

- `uniapp-v2/config/env.js:1-3`
- 当前真实构建已把同一地址写入 `unpackage/dist/build/mp-weixin/common/vendor.js`

`BASE_URL` 固定为 `http://127.0.0.1:3000`。在微信开发者工具的本机调试代理中可以配合关闭域名校验使用，但在手机上 `127.0.0.1` 指向手机自身，不是开发电脑；正式微信请求还需要可达的 HTTPS 合法域名。当前只有“手工改成局域网 IP”的注释，没有按开发/真机/发布选择环境的机制。

因此现有构建可以证明“源码能被 HBuilderX 编译”，不能证明“真机可运行”。若真机或发布属于本次验收，必须用实际可达地址重新构建，并完成登录、列表、详情、收藏、评论和退出的端到端冒烟；若验收只限本机开发者工具，应在交付说明中明确该边界。

## Minor

### 5. 详情页收藏成功后，返回首页仍显示旧收藏数

**位置**：`uniapp-v2/pages/article/detail.vue:163-178`、`pages/index/index.vue:82-95`

详情页只更新自己的 `article`，而首页 `onShow` 在 token 未变化且列表非空时不会刷新。因此用户在详情收藏/取消收藏后返回首页，列表卡片的收藏数保持旧值，直到手动下拉刷新。可在返回前标记列表脏、共享局部状态，或让首页从详情返回时做轻量刷新。

另外，详情页按本地旧状态对收藏数 `+1/-1`，服务端只返回布尔状态；当服务端状态已因其他客户端变化时，计数可能短暂漂移。操作成功后重取详情或让服务端返回权威计数会更稳健。

### 6. 测试验证了前端内部约定，没有验证“原后端不变”的真实契约

- `tests/pages.integration.test.js` 主要是源码正则和普通 JavaScript 解析，不执行 Vue/uni 生命周期或真实网络。
- `tests/pages.behavior.test.js` 对并发状态机的覆盖是有效的，但列表夹具只使用改造后的分页对象。
- `tests/api.test.js` 只验证路径与请求体，不验证后端响应形状。
- 评论测试注入的是成功 API，无法暴露实际 repository SQL 的 500。

这不否定现有测试对 session、HTTP、归一化和竞态的价值，但测试通过不能作为“与未修改 Express 后端端到端兼容”的证据。建议增加一份契约夹具，直接由基线后端响应形状派生；后端评论问题修复或获准处理后，再做数据库集成冒烟。

### 7. 并发 401 可能重复触发登录页重启

**位置**：`uniapp-v2/common/http.js:37-50,97-104`

每个 401 都会独立清 session 并调用 `uni.reLaunch`。详情页可能同时加载文章和评论，或页面存在并发请求时，多个 401 会连续触发导航。第一次通常能正确退出，后续调用可能产生导航失败日志或闪动。可给默认 unauthorized handler 增加一次性导航锁；这不阻断当前主流程。

## 已通过的关键项

- 登录接口 `/api/users/login`、当前用户 `/api/users/getUser` 的路径、POST 请求体和 `{ user, token }` 解包正确。
- HTTP 层统一使用 POST；有 token 时发送 `Authorization: Bearer <token>`，与后端 `authMiddleware` 一致。
- HTTP 非 2xx、业务失败和 401 的错误传播清晰；401 会清除 token/user 并跳转登录页。
- session 的 token/user 存取、清理和 Node 测试注入设计合理。
- 列表/详情/评论 normalizer 已兼容当前后端的嵌套 `author.author_id`、扁平 `author_id/author_username`、snake_case/camelCase 时间、数字收藏状态与标签对象。
- 详情按 slug 请求；收藏、评论列表/创建/删除分别传 `articleId` 或 `commentId`，与当前 route/schema 一致。
- 首页 reset/append/token generation、评论写后刷新队列、我的页面退出/换号 generation 保护均已正确处理此前的慢网竞态。
- 登录、首页、我的、详情四页均已注册；首页下拉刷新和 tab/non-tab 导航方式匹配。
- 真实 HBuilderX `mp-weixin` 构建包含详情页，未发现由本次源码导致的 SFC 构建阻断。

## 功能验收矩阵

| 功能 | 前端源码 | 当前工作区后端 | 原始未修改后端 | 结论 |
|---|---|---|---|---|
| 用户名/密码登录 | 对齐 | 对齐 | 对齐 | 通过 |
| 退出与 401 | 对齐 | 对齐 | 对齐 | 通过 |
| 文章列表第一页 | 只接受分页对象 | 返回分页对象 | 返回数组 | 原后端下失败 |
| 文章后续分页 | 状态机正确 | 依赖新增分页改造 | 固定 `LIMIT 10 OFFSET 0` | 约束冲突 |
| 文章详情 | 对齐 | 对齐 | 对齐 | 通过 |
| 收藏/取消收藏 | 对齐 | 对齐 | 字段名不同但前端有 fallback | 主流程通过 |
| 评论列表 | 对齐 | 对齐 | 对齐 | 通过 |
| 评论创建 | 前端错误保留输入正确 | 插入后查询 500 | 同一 SQL 缺陷 | 阻断且可能重复 |
| 评论删除 | 对齐 | 删除前查询 500 | 同一 SQL 缺陷 | 阻断 |
| 微信真机联网 | 需换地址 | 后端可本机运行 | 后端可本机运行 | 默认配置不可用 |

## 最终审批意见

**CHANGES_REQUIRED** — 先解决“保持后端不变”与分页/评论接口实际能力的冲突；至少关闭分页响应契约依赖和评论歧义 SQL 两个 Critical，再隔离全部无关后端改动，并用可达 API 地址完成一次真实小程序端到端验证。前端其余已审查主路径可保留。
