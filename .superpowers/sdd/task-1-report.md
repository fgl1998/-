# Task 1 报告：登录态与 HTTP 客户端

## 状态

完成。未修改后端、页面或提交 Git。

## 修改文件

- `uniapp-v2/tests/session.test.js`：注入式 storage 的登录态存取、清除和无 `uni` 导入测试。
- `uniapp-v2/tests/http.test.js`：POST/Bearer、base URL 注入、业务与 HTTP 错误、401 清理及登录页防循环测试。
- `uniapp-v2/common/session.js`：可注入 storage 的 token/user 统一存取与清除；Node 环境使用内存回退，导入不会引用不存在的 `uni`。
- `uniapp-v2/common/http.js`：可注入 request adapter、getToken、onUnauthorized、baseUrl 的 POST 客户端；处理 Bearer、业务/HTTP 错误与默认 401 退出登录逻辑。
- `uniapp-v2/config/env.js`：默认 `http://127.0.0.1:3000`，并注明真机联调应切换开发机局域网 IP。

## TDD 记录

1. 先用 `apply_patch` 新增 `tests/session.test.js` 和 `tests/http.test.js`，未创建任何请求层生产文件。
2. 红灯命令：

   ```powershell
   & 'C:\Program Files\nodejs\node.exe' --test tests/session.test.js tests/http.test.js
   ```

   结果：失败，两个文件均报 `MODULE_NOT_FOUND`（`../common/session`、`../common/http` 尚未实现），共 2 个失败子测试；这是预期的新增能力缺失。
3. 使用 `apply_patch` 写入最小实现后，以同一命令复跑。

   结果：退出码 0，10/10 子测试通过，0 失败。

## 自查

- 所有请求固定为 `POST`，token 存在时添加 `Authorization: Bearer <token>`。
- 成功响应返回业务包内的 `data`；HTTP 非 2xx 或 `success: false` 均抛出含后端 message 的 `Error`。
- 401 会调用可注入处理器；默认处理器先清除登录态，再以 `reLaunch` 进入 `/pages/login/login`，当前已在登录页时不重复跳转。
- `session` 的默认 storage 仅在运行时以 `typeof uni` 检查，不会使 Node 导入失败；测试 storage 可完全注入。
- `git diff --check` 未发现空白错误。Git 状态含主工作区既有的后端和文档变更，未触碰它们。

## 关注点

- 当前 Node 不在 PATH；验证使用已安装的 `C:\Program Files\nodejs\node.exe`（Node v20.15.0）。
- 测试环境输出 `NO_COLOR` 与 `FORCE_COLOR` 的 Node 环境变量警告；不影响 TAP 结果（10 通过、0 失败）。
