# Task 2 审查：API 与后端字段归一化

## 结论

**CHANGES_REQUIRED**

API 封装与 CommonJS 集成符合规格，但文章列表归一化没有兼容真实后端嵌套作者中的 `author_id`，会稳定地产生错误的 `author.id`；现有测试夹具使用了并不存在于真实列表响应中的 `author.id`，因此没有发现该问题。

## 阻塞问题

### 1. 列表文章的真实 `author.author_id` 被丢失

- 位置：`uniapp-v2/common/article.js:15`
- 相关测试：`uniapp-v2/tests/article-normalizer.test.js:13`
- 后端证据：`express-backend2-realWorld/src/modules/article/article.mapper.ts:62-78`

真实后端的列表 mapper `toArticleQuery` 构造的是：

```js
author: {
  author_id: row.author_id,
  username: row.author_username,
  image: row.author_image,
  bio: row.author_bio
}
```

但 `normalizeAuthor` 对嵌套作者 ID 只检查：

```js
['id', 'userId', 'user_id']
```

它没有检查 `author_id`。因此把真实 `/api/articles/list` 中的 article 交给 `normalizeArticle` 后，结果会是 `author.id === null`，而不是后端作者 ID。当前测试人为使用 `author: { id: 7, ... }`，与真实 mapper 不一致，恰好绕过了缺陷。

建议把嵌套作者候选键补为包含 `author_id`，并把列表测试夹具改成后端实际结构 `author: { author_id: 7, ... }`，断言归一化后仍为 `author.id === 7`。

## 规格符合性

### API 路径与请求体：通过

逐项对照后端 `user.route.ts`、`article.route.ts` 和对应 Zod schema：

- `/api/users/login` 使用 `{ username, password }`。
- `/api/users/getUser` 使用空对象。
- `/api/articles/list` 使用 `{ page, pageSize }`。
- `/api/articles/detail` 使用 `{ slug }`。
- 收藏/取消收藏使用 `{ articleId }`。
- 评论列表使用 `{ articleId }`，创建使用 `{ articleId, body }`，删除使用 `{ commentId }`。
- 所有请求均委托给 Task 1 的共享 `request`；Task 1 客户端固定发出 POST，并负责鉴权、401 与响应解包。

这些路径、方法语义和请求体字段与真实后端一致。

### 后端字段归一化：未通过

- 文章顶层 `id/slug/title/description/body`：兼容真实列表和详情结构。
- 时间：兼容 `createdAt/updatedAt` 与 `created_at/updated_at`。
- 收藏数：兼容列表的 `favoritesCount` 与详情的 `favorites_count`，并稳定转为 number。
- 收藏状态：真实后端返回 MySQL 数字 `0/1`，能稳定转为 boolean。
- tags：兼容真实后端 `{ tag_name }[]`，也兼容字符串和字符串数组。
- 评论：兼容真实后端的 `id/article_id/author_id/author_username/...` 与 camelCase 时间字段。
- **列表作者 ID：不兼容真实后端的嵌套 `author.author_id`，属于必须修复的规格缺口。**

### falsy 值风险：通过

`pick` 以 `!== undefined` 判断字段是否存在，因此 `0`、`false`、空字符串和 `null` 都不会因为 truthy/falsy 判断而错误回退到备用字段。API 请求体始终是对象，Task 1 的 `data || {}` 也不会吞掉对象内部的 falsy 字段，例如 `favorited: 0`、`page: 0` 或 `body: ''`。真实后端会在 schema 层拒绝非法值，但客户端不会静默改写这些值。

### CommonJS 集成：通过

- Task 1 的 `common/http.js` 通过 `module.exports` 暴露 `request: http.request`。
- `api/user.js` 和 `api/article.js` 使用 `require('../common/http')`，与该导出方式一致。
- 新增 API 与归一化模块同样通过 `module.exports` 暴露命名属性，Node 测试也按 CommonJS 加载，没有出现 ESM/CJS 形状不匹配。
- API factory 注入的默认客户端正是 Task 1 导出的对象；其 `request` 是闭包函数，不依赖 `this`，所以 `const request = client.request` 不会破坏默认集成。

## 代码质量

### 优点

- 归一化逻辑是无副作用纯函数，字段选择、类型转换和标签处理职责清晰。
- API factory 便于注入测试客户端，接口层没有复制鉴权和错误处理逻辑。
- `pick` 使用 definedness 而非 truthiness，避免了常见的 falsy 值丢失问题。
- 未引入第三方依赖，也未把页面或后端逻辑耦合进本任务。

### 测试质量

现有测试覆盖了详情扁平作者、三种标签形态、类型稳定性、评论归一化和全部接口调用，但列表文章测试没有使用真实后端的嵌套作者字段名。这不是单纯的覆盖率问题，而是夹具与生产契约不一致，导致核心兼容目标产生假阳性。修复实现时应同步修正该夹具。

## 验证说明

按审查任务要求，本次只做静态审查，没有修改 Task 2 实现，也没有重跑 `task-2-report.md` 已报告的测试。报告所述的 16/16 通过被视为历史测试记录；它不能反证上述缺陷，因为当前测试未输入真实的 `author.author_id` 结构。

---

## 修复复审（2026-08-27）

### 复审结论

**APPROVED**

原阻塞项已关闭：`normalizeAuthor` 的嵌套作者 ID 候选键现已包含 `author_id`，真实列表响应中的 `author.author_id` 会被正确归一化为 `author.id`。

### 复核证据

- `uniapp-v2/common/article.js:15` 已从 `['id', 'userId', 'user_id']` 修改为 `['id', 'userId', 'user_id', 'author_id']`。
- `uniapp-v2/tests/article-normalizer.test.js:13` 的列表夹具已改用真实后端结构 `author: { author_id: 7, ... }`。
- 同一测试既在完整对象断言中要求 `author.id: 7`，又显式断言 `article.author.id === 7`，能够防止原问题回归。
- `task-2-report.md` 记录了针对该问题的有效红灯：修复实现前实际值为 `null`、期望值为 `7`；修复后归一化测试 4/4 通过，随后完整回归 16/16 通过。

### 最终判断

本次修复准确对应原审查 finding，没有扩大实现范围。结合初审已经通过的 API 路径/请求体、falsy 值处理和 CommonJS 集成，Task 2 现满足规格与代码质量要求。

本次复审按要求仅静态读取实现、测试和报告，没有重跑测试，也没有修改 Task 2 实现文件；仅追加了本复审记录。
