# Agent 清除历史前端设计

## 目标

在 `uniapp-v2/pages/agent/chat.vue` 中增加“清除历史”入口。用户确认后调用已有的 Agent 清除历史接口，清除当前登录用户的 LangGraph checkpoint，并立即把页面恢复为无历史的欢迎状态。

## 后端契约

- 请求：`POST /api/agent/clear_history`
- 鉴权：沿用 HTTP 客户端自动附加的 Bearer Token。
- 请求体：空对象，不允许前端传入 `userId`。
- 成功：HTTP 200，响应 `{ "success": true }`；前端只依赖请求成功，不依赖 `data`。
- 失败：沿用公共 HTTP 客户端产生的错误信息。

后端根据 `request.auth.userId` 生成 `realworld-user:<userId>`，并调用 `checkpointer.deleteThread(threadId)`，身份边界符合现有设计。

## 页面交互

- 在聊天页顶部提示栏右侧放置“清除历史”按钮。
- 未加载完成、正在发送消息或正在清除时禁用按钮。
- 点击后通过 `uni.showModal` 二次确认，说明操作会删除当前账号的全部助手对话且不可恢复。
- 用户取消时不发请求，也不修改页面。
- 请求成功后：
  - 使进行中的旧请求结果失效；
  - 清空 `messages`、`draft` 和历史/过程错误；
  - 保持 `historyLoaded = true`，直接显示现有欢迎卡片；
  - 显示“历史已清除”提示。
- 请求失败时保留现有消息，并显示后端或网络错误。

## 状态和并发

新增 `clearingHistory` 状态。发送、重载历史和清除历史互斥。清除开始时递增 `requestGeneration`，防止较早发出的历史读取结果在清除成功后重新覆盖页面。

清除按钮只在已登录页面显示；如果 Token 失效，公共 HTTP 客户端继续负责清理会话并跳转登录页。

## 代码范围

- `uniapp-v2/api/agent.js`：增加无参数的 `clearHistory()` API 方法。
- `uniapp-v2/pages/agent/chat.vue`：增加按钮、确认交互、状态处理和样式。
- `uniapp-v2/tests/agent.test.js`：覆盖请求契约、取消、成功、失败和并发保护。

不修改日志文件，不修改 LangGraph 历史结构，不处理 `chat0.vue`。

## 验证标准

- API 请求使用当前 JWT、空请求体和正确路径。
- 未确认时不会删除。
- 成功后页面只显示欢迎状态，旧历史不会被迟到响应恢复。
- 失败时历史仍保留，用户能看到错误提示。
- 清除期间不能发送、重新加载或重复清除。
- 现有 Agent 页面测试继续通过。
