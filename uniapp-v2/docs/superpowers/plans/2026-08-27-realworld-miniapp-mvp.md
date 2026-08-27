# RealWorld 小程序 MVP 实施计划

> **For Codex:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** 基于现有 Express 后端接口，完成用户名密码登录、文章分页浏览、文章详情、收藏、评论以及个人信息与退出登录。

**Architecture:** 使用 `common/session.js` 统一管理 Token 和用户缓存，使用可注入适配器的 `common/http.js` 统一处理后端响应与 401，API 文件只描述接口；页面通过纯函数把列表、详情两种文章字段结构归一化。后端保持不变，所有请求沿用 POST。

**Tech Stack:** uni-app Vue 2、uView 2、JavaScript、Node.js 内置测试框架

---

### Task 1: 登录态与 HTTP 客户端

**Files:**
- Create: `tests/session.test.js`
- Create: `tests/http.test.js`
- Create: `common/session.js`
- Create: `common/http.js`
- Create: `config/env.js`

1. 先写测试，覆盖 Token/User 的存取清除、Bearer 头、后端业务错误和 401 回调。
2. 运行 Node 测试，确认因模块尚未实现而失败。
3. 实现可注入 storage/request adapter 的最小代码，并再次运行测试。

### Task 2: API 与后端字段归一化

**Files:**
- Create: `tests/article-normalizer.test.js`
- Create: `common/article.js`
- Create: `api/user.js`
- Create: `api/article.js`

1. 先写列表文章、详情文章、评论三种数据的归一化测试。
2. 实现兼容 snake_case、camelCase 和嵌套 author 的转换函数。
3. 封装登录、当前用户、文章列表/详情、收藏、评论接口，保持全部 POST。

### Task 3: 用户名密码登录页

**Files:**
- Modify: `pages/login/login.vue`

1. 将原身份证表单替换为 username/password 表单。
2. 提交登录接口，成功后保存 Token 和 user，跳转首页。
3. 显示输入校验、提交 loading 和后端错误信息。

### Task 4: 分页文章首页

**Files:**
- Modify: `pages/index/index.vue`
- Modify: `pages.json`

1. 首页调用 `/api/articles/list`，使用 page/pageSize 管理分页。
2. 实现下拉刷新、触底加载、空状态、错误状态与未登录入口。
3. 显示作者、时间、标签、收藏数，并跳转文章详情。

### Task 5: 文章详情、收藏和评论

**Files:**
- Create: `pages/article/detail.vue`
- Modify: `pages.json`

1. 按 slug 获取详情并展示文章内容。
2. 根据 favorited 调用收藏或取消收藏，并即时同步状态。
3. 加载、创建和删除评论；后端失败时保留输入并展示真实错误。

### Task 6: 我的页面和应用样式

**Files:**
- Modify: `pages/my/my.vue`
- Modify: `App.vue`

1. 我的页面读取缓存并调用当前用户接口刷新资料。
2. 实现未登录入口和清理登录态后的退出流程。
3. 补充页面通用背景、卡片和安全区样式。

### Task 7: 验证与交付

**Files:**
- Verify: `tests/*.test.js`
- Verify: `pages/**/*.vue`
- Verify: `common/*.js`, `api/*.js`, `config/*.js`

1. 运行全部 Node 测试与 JavaScript 语法检查。
2. 使用可用的 uni-app/HBuilderX 构建命令做微信小程序构建；若本机无命令行构建能力，明确记录限制。
3. 检查 git diff，确认没有修改后端和无关文件。

### Follow-up: 文章发布

- 新增 `pages/article/create.vue` 与首页发布入口。
- 新增文章创建和标签列表 API；标签按当前后端契约提交为 ID 数组 JSON 字符串。
- 发布成功后跳转文章详情，失败保留表单并显示后端错误。
