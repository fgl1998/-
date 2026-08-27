# Tasks 3–6 页面集成报告

日期：2026-08-27  
状态：通过

## 完成内容

- `pages/login/login.vue`：替换为 username/password 登录，包含输入校验、提交锁与 loading、后端错误 toast；成功后通过 session 保存 token/user，并 `switchTab` 到首页。
- `pages/index/index.vue`：增加未登录入口；已登录后按 `page/pageSize` 请求文章列表（`pageSize = 10`），实现下拉刷新、触底分页、重复请求锁、结果去重、空/错/无更多状态和编码 slug 跳转。
- `pages/article/detail.vue`：新增详情页；按 slug 加载文章及评论，使用 articleId 收藏/取消收藏并同步本地计数，使用 articleId 创建评论，使用 commentId 删除本人评论，所有写操作均有防重复提交状态。
- `pages/my/my.vue`：未登录入口；已登录时先恢复缓存用户，再调用 `getUser` 刷新并回写 session；展示 username/email/bio，退出清理 session 并跳转登录页。
- `pages.json`：注册详情页，启用首页下拉刷新，更新页面标题和全局/TabBar 配色。
- `App.vue`：补充全局背景、文字、盒模型与底部安全区样式。
- `tests/pages.integration.test.js`：新增页面 API 契约、关键生命周期/状态、页面注册、脚本语法与相对 require 路径检查。

## 契约核对

- 页面调用与实际导出一致：`login`、`getUser`、`list`、`detail`、`favorite`、`unfavorite`、`listComments`、`createComment`、`deleteComment`。
- 页面统一使用 `common/session.js` 和 `common/article.js`，未直接访问旧 `userInfo` 缓存键。
- 所有页面相对 `require` 均已解析到现有文件。
- 页面与应用配置中未出现 base URL；地址仍集中在 `config/env.js`。
- 未修改后端、未新增依赖、未实现文章创建/编辑、未提交 git。

## 验证结果

1. TDD 红灯：新增页面集成测试首次运行 5 项失败，分别对应旧登录页、首页脚手架、缺失详情页、旧我的页缓存契约和缺失页面配置。
2. 全量测试：使用 Codex bundled Node.js 展开运行 `tests/*.test.js`，结果 `22 passed / 0 failed`（5 个测试文件）。
3. JavaScript 语法：对 `api`、`common`、`config`、`tests` 下 11 个 `.js` 文件逐个执行 `node --check`，全部通过。
4. Vue 页面脚本：测试提取 4 个 `.vue` 的 `<script>`，执行 JavaScript 解析并核对每个相对 `require`，全部通过。
5. 配置检查：`pages.json` 通过 PowerShell `ConvertFrom-Json` 严格解析；详情页存在且首页 `enablePullDownRefresh` 为 `true`。
6. 文本检查：页面/API 引用核对通过，页面 base URL 匹配数为 0，目标文件尾随空白匹配数为 0。

## 可用性限制

`uniapp-v2` 目录没有 `package.json`，环境中也没有项目级 uni-app/HBuilderX CLI 构建脚本，因此无法执行命令行小程序构建；未将此项记为通过。建议在 HBuilderX 中以微信小程序目标运行一次真机或开发者工具冒烟验证，重点检查 uView 控件渲染与后端连通性。

## 审查返工记录（2026-08-27）

状态：三个必须修复项均已处理。

### 修复内容

1. 我的页新增 `profileRequestGeneration`。每次资料刷新同时捕获 generation 与 token，`getUser` 返回后只有两者仍匹配才允许更新组件状态和 `session.setUser`；退出登录会递增 generation，使所有旧请求失效。换号时允许启动新请求，旧账号响应不能覆盖新账号缓存。
2. 详情页把评论列表读取改为单一 drain queue。任何读取或写后刷新都会设置 `commentsRefreshQueued`，并共享 `commentsRefreshPromise`；当前读取完成后若发现队列标记，会再发起一次列表请求。创建和删除共用 `commentsMutating` 互斥锁，避免两种写操作并发，且锁持续到写后刷新结束。
3. 首页将 reset/append 改为串行请求队列。reset 会递增 `requestGeneration`、取消待执行 append，并排队第一页请求；append 响应只有 generation 与 token 均匹配时才可落地。token 变化会排队新 token 的 reset，旧 token 响应被忽略。失败状态记录 `lastFailedMode`，footer 与空态按钮统一调用 `retryLoad`，按原模式重试。
4. 新增 `tests/pages.behavior.test.js`，直接提取并执行 Vue 页面 `<script>`，注入 deferred API、session 和 uni；覆盖退出后旧资料响应、换号双请求、评论创建/删除与在途读取交错、评论写互斥、append 中 reset、失败模式重试、token 切换旧响应后到。

### 红灯证据

命令：

```powershell
& 'C:\Users\51030\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\pages.behavior.test.js tests\pages.integration.test.js
```

修复前输出摘要：`13 tests / 5 pass / 8 fail`。7 个行为测试分别暴露三个竞态；另 1 个静态集成测试暴露 footer 仍直接调用 append。

### 覆盖测试

命令：

```powershell
& 'C:\Users\51030\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\pages.behavior.test.js
```

输出摘要：`7 tests / 7 pass / 0 fail`，耗时约 `117.508 ms`。

### 完整测试

命令：

```powershell
$testFiles = Get-ChildItem -LiteralPath 'tests' -Filter '*.test.js' -File | Select-Object -ExpandProperty FullName
& 'C:\Users\51030\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test $testFiles
```

输出摘要：`29 tests / 29 pass / 0 fail`，耗时约 `234.643 ms`。

### 语法与文本检查

- 对 `api`、`common`、`config`、`tests` 下 12 个 `.js` 文件逐个执行 bundled Node.js `--check`：`12/12` 通过。
- 页面行为/集成测试继续解析 4 个 `.vue` 的 `<script>` 并核对相对 `require`：通过。
- 本轮修改文件尾随空白扫描：`0` 处。
- 未修改后端、未新增依赖、未提交 git。

## 最终构建验证（2026-08-27）

- 修复微信小程序模板不支持复合 `:key` 的问题，文章列表改用稳定的 `article.slug`。
- 新增 `vue.config.js`，转译 uView 依赖；新增对应构建约束测试，记录了先失败后通过。
- 全量 Node 测试：`30 passed / 0 failed`。
- 使用本机 HBuilderX 内置 uni-app 编译器执行 `mp-weixin` production 构建，退出码为 0，输出 `DONE Build complete`。
- 产物：`unpackage/dist/build/mp-weixin`；其中 `app.json` 已包含 index、my、login、article/detail 四个页面。
- 当前后端已知边界保持不变：评论创建/删除仍会因后端 `getCommentById` 歧义 SQL 返回 500；前端会保留评论输入并展示后端错误。
