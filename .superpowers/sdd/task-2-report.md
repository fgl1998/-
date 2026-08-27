# Task 2 报告：API 与后端字段归一化

## 状态

完成。未修改页面、后端或 `package.json`，未引入第三方依赖，未提交 Git。

## 修改文件

- `uniapp-v2/tests/article-normalizer.test.js`：覆盖列表/详情文章的作者与字段差异、三种标签形态、类型稳定性，以及评论作者和时间字段。
- `uniapp-v2/tests/api.test.js`：验证用户、文章与评论接口只通过注入的共享 HTTP 客户端描述路径与请求体。
- `uniapp-v2/common/article.js`：新增无运行时依赖的 `normalizeArticle`、`normalizeComment` 纯函数；统一嵌套/扁平作者、camelCase/snake_case 时间和收藏数字段，并保证 `favorited` 为 boolean、`favoritesCount` 为 number、`tags` 为字符串数组。
- `uniapp-v2/api/user.js`：新增登录和当前用户 API 封装，复用 `common/http`。
- `uniapp-v2/api/article.js`：新增文章列表/详情/收藏、取消收藏及评论 CRUD API 封装，复用 `common/http`。

## TDD 记录

1. 先用 `apply_patch` 新建 `tests/article-normalizer.test.js`，此时尚未创建 `common/article.js`。
2. 红灯命令：

   ```powershell
   & 'C:\Program Files\nodejs\node.exe' --test tests/article-normalizer.test.js
   ```

   结果：失败，`MODULE_NOT_FOUND: ../common/article`，原因是归一化模块尚不存在，符合预期。
3. 使用 `apply_patch` 创建最小 `common/article.js` 后，归一化测试 4/4 通过。
4. 再先用 `apply_patch` 新建 `tests/api.test.js`；此时 API 模块尚不存在。
5. 红灯命令：

   ```powershell
   & 'C:\Program Files\nodejs\node.exe' --test tests/api.test.js
   ```

   结果：失败，`MODULE_NOT_FOUND: ../api/user`，原因是接口封装尚不存在，符合预期。
6. 使用 `apply_patch` 创建 `api/user.js` 与 `api/article.js` 后，运行完整回归。

## 验证

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/api.test.js tests/article-normalizer.test.js tests/session.test.js tests/http.test.js
```

结果：退出码 0，16/16 通过、0 失败。其中 Task 2 新增 6 个测试，Task 1 既有 10 个测试均继续通过。测试输出仅有 Node 关于 `NO_COLOR` 与 `FORCE_COLOR` 的环境变量警告，不影响 TAP 结果。

## 自查

- 所有 API 均经 Task 1 统一 HTTP 客户端发出，因此固定 POST、鉴权头、401 处理和错误语义不会在接口层重复实现。
- API 封装仅持有路径和后端约定的请求体：用户登录/当前用户、文章列表/详情/收藏/取消收藏、评论列表/创建/删除。
- 文章归一化始终返回 `id`、`slug`、`title`、`description`、`body`、`author`、`tags`、`favorited`、`favoritesCount`、`createdAt`、`updatedAt`；评论始终返回 `id`、`articleId`、`body`、`author`、`createdAt`、`updatedAt`。
- 未触碰页面、后端和既有 Task 1 实现；Git 工作区已有的其他改动保持原样。

## 审查修复：列表嵌套作者 ID（2026-08-27）

### 根因与范围

- 审查发现真实文章列表的嵌套作者为 `author: { author_id, username, image, bio }`，而最初的列表测试错误地使用了 `author.id`。
- `normalizeAuthor` 对嵌套作者 ID 的候选键仅包含 `id`、`userId`、`user_id`，所以真实 `author.author_id` 会被归一化成 `author.id: null`。
- 修复范围仅限 `uniapp-v2/tests/article-normalizer.test.js` 与 `uniapp-v2/common/article.js`：测试夹具改为真实 `author.author_id` 并显式断言 `article.author.id === 7`；实现将 `author_id` 加入嵌套作者 ID 候选键。

### TDD 修复记录

1. 先用 `apply_patch` 更新列表夹具为真实 `author: { author_id: 7, ... }`，并新增 `author.id` 断言；尚未修改归一化实现。
2. 红灯命令：

   ```powershell
   & 'C:\Program Files\nodejs\node.exe' --test tests/article-normalizer.test.js
   ```

   结果：4 个测试中 3 通过、1 失败。目标列表测试断言差异为实际 `author.id: null`、预期 `author.id: 7`，准确复现审查问题。
3. 使用 `apply_patch` 作单一实现修改后，以同一命令复跑。

   结果：4/4 通过，0 失败。

### 回归验证

```powershell
& 'C:\Program Files\nodejs\node.exe' --test tests/api.test.js tests/article-normalizer.test.js tests/session.test.js tests/http.test.js
```

结果：退出码 0，16/16 通过、0 失败。输出仍仅包含 `NO_COLOR`/`FORCE_COLOR` 的 Node 环境变量警告，不影响 TAP 结果。
