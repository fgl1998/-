# Task 1：登录态与 HTTP 客户端

工作目录：`E:\面试项目\uniapp-v2`

## 目标

为 uni-app Vue 2 小程序建立可测试的登录态和统一请求层。后端保持不变，所有接口均为 POST，鉴权头为 `Authorization: Bearer <token>`，业务响应结构为 `{ success, code, message, data }`。

## 必须完成

- 新建 `tests/session.test.js`、`tests/http.test.js`。
- 新建 `common/session.js`、`common/http.js`、`config/env.js`。
- 使用 Node `node:test`，严格先看到测试失败再写实现。
- session 统一存取并清除 token/user，storage 必须可注入，Node 导入时不能因不存在全局 `uni` 报错。
- HTTP 客户端的 request adapter、getToken、onUnauthorized、baseUrl 必须可注入。
- 自动添加 Bearer 头；成功时返回响应 `data`；HTTP 错误或 `success:false` 时 reject 可读错误。
- 401 时清理登录态并导航到登录页，但避免在登录页形成重复跳转。
- 默认 base URL 为 `http://127.0.0.1:3000`，说明真机联调应改为开发机局域网 IP。
- 不修改后端，不修改本任务范围外的页面。

## 验证

使用项目可用的 Node 可执行文件运行两个测试文件并报告“先失败、后通过”的命令和结果。

## 交付约束

- 用 `apply_patch` 编辑文件。
- 不提交 git commit；主控代理统一管理工作区。
- 自查变更。
- 将完整报告写到 `E:\面试项目\.superpowers\sdd\task-1-report.md`，报告包括状态、修改文件、测试命令/结果、自查和关注点。
- 最终只回复 `DONE`、`DONE_WITH_CONCERNS`、`NEEDS_CONTEXT` 或 `BLOCKED`，附一行摘要。
