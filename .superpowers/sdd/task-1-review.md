# Task 1 审查：登录态与 HTTP 客户端

## 结论

**总体：APPROVED**

- **规格符合性：APPROVED**
- **代码质量 / uni-app Vue 2 运行兼容性：APPROVED**

未发现需要返工的规格偏差、运行时阻断或测试失真。根据审查约束，本次未重复运行实现报告中已通过的测试。

## 1. 规格符合性

### 通过项

1. 交付文件齐全：`common/session.js`、`common/http.js`、`config/env.js`、`tests/session.test.js`、`tests/http.test.js` 均已新建。
2. `session` 统一管理 `token`/`user`，同时提供整体读写、单项读写和清理；`storage` 可通过 `createSession({ storage })` 注入。
3. `session` 在模块加载时通过 `typeof uni !== 'undefined'` 判断运行环境，Node 导入不会因缺少全局 `uni` 而崩溃；Node 回退 storage 也保持了默认实例可用。
4. HTTP 客户端的 `requestAdapter`、`getToken`、`onUnauthorized`、`baseUrl` 均可注入。
5. 请求固定为 `POST`；存在 token 时添加 `Authorization: Bearer <token>`，无 token 时不添加。
6. 2xx 且非 `success:false` 时返回业务包的 `data`；HTTP 非 2xx、`success:false` 以及 adapter 拒绝均会 reject `Error`，优先保留后端 `message`，HTTP/业务错误还携带 `code` 和 `statusCode`。
7. HTTP 401 会在拒绝前调用未授权处理器；默认处理器先清除 session，当前路由不是 `pages/login/login` 时通过 `uni.reLaunch` 进入登录页，已在登录页时不重复跳转。
8. 默认 base URL 为 `http://127.0.0.1:3000`，且 `config/env.js` 明确说明真机联调需换成开发机局域网 IP。
9. 实现报告记录了同一条 `node --test` 命令的红灯（实现文件尚未存在，2 个 `MODULE_NOT_FOUND`）和绿灯（10/10 通过），满足报告“先失败、后通过”的要求。

### 规格边界判定

- 401 清理/导航是默认 `onUnauthorized` 的行为；显式注入 `onUnauthorized` 时由调用方替换默认策略，这与“`onUnauthorized` 必须可注入”一致，不属于缺失默认登出。
- `success:false` 的业务错误不触发 401 处理；当前后端约定与任务表述将 401 作为 HTTP 状态，所以这不构成规格偏差。

## 2. 代码质量与 uni-app Vue 2 兼容性

### CommonJS 兼容性

**判定：可在当前 HBuilderX uni-app Vue 2 项目中使用，不构成阻断。**

- 项目 `manifest.json` 明确使用 Vue 2，源码由 HBuilderX/uni-app 的 webpack 链路处理，不是把这些 `.js` 原样当作浏览器 ESM 执行。
- 当前已在用的 `uni_modules/uview-ui` 源码同样包含 `module.exports` 和 `require(...)`，并与 `import`/`export` 混用；已存在的 `unpackage/dist/dev/mp-weixin/common/vendor.js` 也能看到 webpack 产生的 CommonJS 模块包装。这是当前工程工具链能处理 CommonJS 的项目内证据。
- `http.js` 和 `session.js` 内部使用 CommonJS 是一致的，不存在内部互操作问题。后续页面若遵循明确用法（例如 `const { request } = require('@/common/http')`，或经当前 webpack/Babel 处理的命名 import）可稳定使用。
- 直接引用 `uni` 的位置均有 `typeof uni` 前置判断；`getCurrentPages` 也先检查函数是否存在，因此不会破坏 Node 测试导入。

### 请求与错误语义

- adapter 将 `uni.request` 的 `success`/`fail` 转换为 Promise，符合 uni-app 中 HTTP 非 2xx 仍走 `success` 回调的语义；因此在 adapter 之后根据 `statusCode` 判断 HTTP 错误是正确的。
- 网络失败、HTTP 失败和业务失败均是 Promise rejection，不会把错误包当成正常数据返回。
- 401 先等待 `onUnauthorized()` 再抛出可读 HTTP 错误，既支持同步默认处理器，也支持异步注入处理器。

### 测试有效性

- 10 个测试覆盖了本任务的主要分支：session 存/取/清理、无 `uni` 导入、POST/Bearer/base URL、无 token、业务错误、HTTP 错误、401 回调、默认清理和登录页防循环。
- `session` 模块在测试声明前就于无全局 `uni` 的 Node 进程中被 `require`；如果顶层导入不安全，测试文件会在收集阶段失败。因此“可在无 `uni` 时导入”虽只做了简单类型断言，关键行为仍被有效验证。
- 401 测试分别验证了 HTTP 客户端的调用责任与默认 handler 的清理/导航责任，与可注入设计匹配。

## 非阻断建议

1. `request(path, data, requestOptions)` 目前只使用 `requestOptions.header`，函数名称会让人预期 timeout、responseType 等其他 `uni.request` 选项也能透传。未来确实需要这些选项时，建议显式定义白名单或先展开 `extraOptions` 再强制覆盖 `url/method/data/header`。当前任务未要求，不影响通过。
2. `data || {}` 会把 `false`、0 或空字符串转成空对象；当前后端 POST 接口使用对象请求体，不是实际缺陷。若将来需支持标量 payload，可改为仅对 `undefined` 提供 `{}` 默认值。
3. 可再补一个“使用默认 client 组合默认 unauthorized handler”的端到端单元测试，以防未来组装代码被误改；现有分层测试已能支撑当前实现的审批。

## 最终审查意见

**APPROVED** — 任务 1 实现满足明确规格，CommonJS 在当前 HBuilderX/uni-app Vue 2 工具链中有项目内兼容证据，HTTP/401 语义正确，测试有效覆盖核心行为。
