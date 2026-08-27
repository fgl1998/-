# Tasks 3–6：完成小程序页面

工作目录：`E:\面试项目\uniapp-v2`

## 目标

使用已完成的 session、HTTP、API、article normalizer，实现一个可用的 uni-app Vue 2/uView 2 微信小程序 MVP。后端保持不变。

## 必须完成

### 登录页 `pages/login/login.vue`

- 替换身份证假表单为 username/password 登录。
- 输入校验；提交 loading；后端错误通过 toast 显示。
- 成功后保存 `token` 和 `user`，`switchTab` 到首页。

### 首页 `pages/index/index.vue`

- 未登录显示明确登录入口；已登录 POST `/api/articles/list`。
- 分页使用 `page/pageSize`，pageSize 取 10；支持下拉刷新与触底加载。
- 正确处理重复加载、空状态、错误状态、没有更多。
- 展示标题、摘要、作者、时间、标签、收藏数；点击按编码后的 slug 打开详情。

### 详情页 `pages/article/detail.vue`

- 新增页面并在 `pages.json` 注册。
- 按 slug 加载详情和评论；展示正文、作者、标签与时间。
- 收藏/取消收藏使用 articleId，同步 favorited 与 favoritesCount，防重复提交。
- 创建评论成功后清空输入并刷新列表；失败时保留输入并显示后端错误。
- 仅当前用户自己的评论展示删除入口；删除时使用 commentId，成功刷新。

### 我的页面 `pages/my/my.vue`

- 未登录展示登录入口。
- 已登录先显示缓存，再调用 getUser 刷新并回写缓存。
- 展示 username/email/bio；退出时清理登录态并跳转登录页。

### 应用配置与样式

- 更新 `pages.json` 以启用详情页、首页下拉刷新和合理标题。
- 更新 `App.vue` 提供全局背景、文字与安全区基础样式。
- 保持 Vue 2 Options API 和现有 uView 2；不要引入依赖。
- base URL 配置不应散落在页面。
- 不做文章创建/编辑，不修改后端。

## 验证与报告

- 检查页面使用的 API 名称与实际导出一致，检查所有相对 import 路径。
- 运行现有全部测试和可用的 JavaScript 语法检查。
- 用 `apply_patch` 编辑，不提交 git。
- 报告写入 `E:\面试项目\.superpowers\sdd\task-3-6-report.md`；最终仅回复状态与一行摘要。
