# 用户中心静态页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 不修改后端，使用集中式假数据完成关注、粉丝、我的文章、收藏文章和作者主页的页面与跳转。

**Architecture:** 新增 `mock/user-center.js` 作为唯一假数据源；关系和文章各复用一个列表页，通过 query type 切换数据。作者主页用 username 查询假数据，现有文章页只增加作者头像跳转。

**Tech Stack:** uni-app Vue 2、uView 2、CommonJS、Node.js node:test

## Global Constraints

- 不修改 `express-backend2-realWorld`。
- 所有新增页面先用静态数据，后续 API 接好后替换数据源。
- 保持现有登录、文章分页、详情、收藏和发布功能不回退。

---

### Task 1: 假数据与后端接口清单

**Files:**
- Create: `mock/user-center.js`
- Create: `docs/backend-user-center-apis.md`
- Test: `tests/user-center.mock.test.js`

- [ ] 先测试关注/粉丝/文章/收藏假数据及 profile 查询。
- [ ] 运行测试并确认模块缺失失败。
- [ ] 实现集中式假数据和后端待补接口契约。
- [ ] 运行测试确认通过。

### Task 2: 我的页面与四个列表

**Files:**
- Modify: `pages/my/my.vue`
- Create: `pages/profile/relation.vue`
- Create: `pages/article/list.vue`
- Modify: `pages.json`
- Test: `tests/pages.integration.test.js`

- [ ] 先测试页面注册和四个入口路由。
- [ ] 实现关注/粉丝复用列表页、我的文章/收藏复用列表页。
- [ ] 点击用户可进入作者主页。

### Task 3: 作者主页与头像入口

**Files:**
- Create: `pages/profile/detail.vue`
- Modify: `pages/index/index.vue`
- Modify: `pages/article/detail.vue`
- Modify: `pages.json`
- Test: `tests/pages.integration.test.js`

- [ ] 先测试作者主页注册及头像导航。
- [ ] 实现作者主页静态展示。
- [ ] 首页和文章详情作者头像点击跳转主页，并阻止卡片点击冒泡。

### Task 4: 验证

- [ ] 运行全部 Node 测试。
- [ ] 执行 HBuilderX 微信小程序 production 构建。
- [ ] 检查构建 app.json 包含所有新增页面。
