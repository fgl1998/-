# Tasks 3–6 页面审查

## 结论

**总体：CHANGES_REQUIRED**

- **规格符合性：CHANGES_REQUIRED**
- **代码质量 / 运行正确性：CHANGES_REQUIRED**

登录、页面注册、API 路径与请求体、后端响应归一化、Vue 2/uView 2 组件用法等主路径基本符合任务要求；但页面层缺少异步请求的会话/代次保护，导致退出登录后旧资料可重新写回、评论写操作成功后的刷新可被吞掉、下拉刷新或 token 变化时的重置请求可被正在进行的分页请求静默丢弃。这些都是实际可达的慢网/并发运行缺陷，需要修复后再批准。

根据审查约束，本次没有重跑 `task-3-6-report.md` 已记录的测试，也没有修改任何业务文件。

## 必须修复

### 1. [P1] 旧 `getUser` 响应可在退出或换号后重新写入全局用户缓存

- 位置：`uniapp-v2/pages/my/my.vue:55-65`、`uniapp-v2/pages/my/my.vue:81-85`

`restoreAndRefresh()` 在请求前读取 `cached.token`，但 `await userApi.getUser()` 返回后没有确认当前 session 仍是同一个 token，就直接执行：

```js
this.userInfo = user || {}
session.setUser(this.userInfo)
```

退出按钮在 `refreshing` 时仍可点击。慢网下可发生：

1. A 用户进入“我的”，`getUser` 请求开始；
2. 用户立即退出，`session.clear()` 清掉 token 和 user，并跳到登录页；
3. A 的旧请求随后成功，已销毁页面中的 Promise continuation 仍会运行，重新写入 A 的 `USER_KEY`；
4. 若用户已经登录 B，A 的旧响应还会覆盖 B 刚写入的缓存用户，形成 token=B、user=A 的跨账号错配。

这既破坏“退出时清理登录态”的缓存语义，也会让后续“先显示缓存”展示错误账号资料。应为刷新捕获 token/请求代次，并在任何组件状态或 `session.setUser` 写入前确认 `session.getToken()` 仍等于发起请求时的 token；退出时还应使旧代次失效。需补一个 deferred Promise 测试覆盖“刷新中退出”和“刷新中退出后登录另一账号”。

### 2. [P2] 评论创建/删除成功后要求的刷新可能被 `commentsLoading` 静默吞掉

- 位置：`uniapp-v2/pages/article/detail.vue:134-145`、`uniapp-v2/pages/article/detail.vue:164-188`

`loadComments()` 在 `commentsLoading === true` 时直接返回。评论创建、删除和错误重试之间没有统一串行化；创建与删除也可以同时提交。因此一个写操作成功后执行的 `await this.loadComments()`，可能刚好遇到另一个评论列表请求而立即返回，并没有发出“写后刷新”。先发出的列表请求又可能在该写操作提交前已经读完数据，最终页面会出现：

- 新评论已创建、输入框已清空，但新评论不在列表；或
- 评论已删除，但旧评论仍留在列表。

这不满足“创建/删除成功后刷新列表”。应采用以下任一可靠策略：让并发调用共享当前 Promise 后再强制排队一次刷新；维护 `pendingCommentsRefresh`/请求代次；串行化评论写操作；或直接用创建接口返回的评论更新本地列表、删除成功后本地过滤，再做后台校准。不能把需要保证发生的写后刷新当作重复读取直接丢弃。

### 3. [P2] 首页的单一 `loading` 锁会丢弃重置请求，且刷新失败后的“点击重试”会改成加载下一页

- 位置：`uniapp-v2/pages/index/index.vue:73-92`、`uniapp-v2/pages/index/index.vue:105-126`、`uniapp-v2/pages/index/index.vue:44-45`

正常的连续触底由同步设置的 `loading` 正确防重，页码也只在成功后递增；但同一个锁同时控制 append 和 reset，产生两个错误语义：

1. 触底加载或其他请求进行中时触发下拉刷新，`loadArticles(true)` 在第 106 行直接返回，`onPullDownRefresh` 随即停止刷新动画，用户的刷新动作没有执行也没有排队。
2. 已有文章时，若 `loadArticles(true)` 失败，`errorMessage` 会显示在 footer；footer 的“点击重试”固定调用 `loadArticles(false)`，因此它会按旧 `page` 加载下一页，而不是重试刚失败的第一页刷新。

此外，`onShow` 在第 84 行先把 `activeToken` 改成新 token，再调用可能因旧请求 `loading` 而返回的 reset。若同一页面实例中 session 发生变化，旧 token 请求仍可在第 117 行安装旧结果，而后续 `onShow` 又认为新 token 已经激活。

建议区分 reset/append 状态，至少排队 `pendingReset`，并让每次请求捕获 token 与 request generation；响应返回时只允许当前 generation 且 token 未变化的请求写状态。错误状态还应记录失败的请求类型，使重试重复同一操作。应补行为测试覆盖“append 中 refresh”“refresh 失败后点击重试”和“token 变化时旧响应后到”。

## 规格符合性

### 登录页：通过

- `pages/login/login.vue` 已改为 username/password；空用户名和空密码会在客户端拦截。
- `submitting` 同时承担防重复、按钮 loading 和 disabled；异常保留后端 `message` 并用 toast 展示。
- 登录响应与真实后端一致：`user.service.ts` 返回 `{ user, token }`；页面用 `session.set({ token, user })` 保存，并 `switchTab` 到首页。
- 后端还限制 username 最长 20、password 长度 6–20；页面没有提前复刻这些约束，但非法输入会由后端 400 的可读错误返回。任务只要求输入校验，当前非空校验可接受，不单独阻断。

### 首页：部分通过，存在上述分页/刷新竞态

- 未登录入口、`pageSize: 10`、POST 列表 API、触底、防重复、去重、空/错/无更多状态和编码 slug 跳转均已实现。
- 真实后端 `PageResult` 是 `{ items, total, page, pageSize, totalPages }`；页面读取 `items/totalPages` 正确。
- `loading` 在第一次 `await` 前同步置 true，可挡住通常的重复触底；失败不递增页码，成功后 `page = targetPage + 1`，这些主路径正确。
- reset 被 append 吞掉、刷新失败重试模式错误以及 token/request generation 缺失仍需修复。

### 文章详情：部分通过，存在上述评论刷新竞态

- 页面已注册；slug 从 URL 读取并解码，详情和评论均通过共享 API 加载。
- 收藏/取消收藏传 `articleId`；评论创建传 `articleId`，删除传 `commentId`，与后端 Zod schema 一致。
- 评论创建失败不会清空输入；成功后才清空。删除入口只对当前用户显示，写操作均有至少各自的防重复状态。
- 写后评论刷新在并发场景不可靠，因此此部分尚不能判为完全符合。

### 我的页面：未通过

- “先显示缓存、再调 `getUser`、成功回写缓存”的顺序正确；未登录入口、username/email/bio 与退出导航也已实现。
- 但旧刷新结果能够越过退出/换号边界重新写全局缓存，属于必须修复的会话竞态。

### 配置与样式：源码层面通过

- `pages.json` 已注册详情页、启用首页下拉刷新并设置合理标题；详情不是 tab 页，首页/我的仍是 tab 页，导航方式匹配。
- `App.vue` 保留 uView 全局样式导入，并增加背景、文字、盒模型与底部安全区样式。
- 页面保持 Vue 2 Options API，没有引入依赖，也没有把 base URL 散落进页面。

## API 与真实后端契约核对

### 导出和相对路径：通过

- 页面使用的 `login`、`getUser`、`list`、`detail`、`favorite`、`unfavorite`、`listComments`、`createComment`、`deleteComment` 均由 `api/user.js` 或 `api/article.js` 的默认 CommonJS 导出真实提供。
- 页面 `../../api/*`、`../../common/*` 相对路径与目录层级一致。
- 评论真实路由是单数 `/api/articles/comment/{create,list,delete}`，不是旧设计文档中的复数 `/comments/*`；当前前端 API 使用单数路径，与 `article.route.ts:21-23` 的实际源码一致。
- 列表、详情、收藏和评论请求体字段与后端 schema 一致；HTTP 层统一 POST 并返回响应包的 `data`。

### 响应字段：通过

- 列表返回嵌套 `author.author_id`、camelCase `favoritesCount`、数字 `favorited` 与 `{ tag_name }[]`；当前 normalizer 均能处理。
- 详情/评论返回顶层 `author_id/author_username/...` 与 `favorites_count`；当前 normalizer 均能处理。
- 后端列表分页确实返回 `items/totalPages`，页面没有沿用 RealWorld 官方的 `articles/articlesCount` 形状。

## 重点运行正确性检查

### Vue 2 / uView 2：通过

- `manifest.json` 明确 `vueVersion: "2"`；`uview-ui` 本地版本为 2.0.38，其包元数据明确支持 Vue 2、不支持 Vue 3。
- 使用到的 `u-form`/`u-form-item` 的 `labelPosition`、`borderBottom`，`u-input` 的 `border`/password，`u-textarea` 的 `maxlength`/`count`，以及 `u-button` 的 loading/disabled/plain/shape 均能在本地组件 props 中找到。
- 页面使用 Options API 与 uni-app 页面生命周期；CommonJS `require` 与项目现有 webpack/HBuilderX 链路一致。

### 收藏计数：当前契约主路径通过

- `normalizeArticle` 保证 `favoritesCount` 为 number，Vue 2 中这两个属性在对象创建时已存在，后续赋值可响应。
- 后端收藏接口只返回 `{ favorited: true|false }`，不返回新计数；页面在成功后按之前状态 `+1/-1`，用 `Math.max(0, ...)` 防止负数，并用 `favoriteSubmitting` 防重复。对单页面顺序操作，这与后端 `INSERT IGNORE`/`DELETE` 语义一致。
- 若要求跨设备实时精确计数，仍需服务端返回计数或操作后重取详情；当前 MVP 规格没有要求实时订阅，因此不把这一点单独列为阻断。

### 评论所有者 ID 类型：按当前后端契约通过

- 登录/getUser 的 `user.id` 来自 MySQL `INT` 并以 number 返回；评论 mapper 的 `author_id` 同样声明并返回 number。
- `normalizeAuthor` 当前不改变 ID 类型，因此 `comment.author.id === currentUser.id` 在真实后端响应和当前 session 写入路径中是 number 对 number，能够正确显示删除入口。
- 这段实现对未来的数字字符串不宽容，且现有页面测试反而锁定了严格比较，却没有输入 `"8"`/`8` 混合夹具。若要继续宣称兼容多种外部响应形状，建议在 normalizer 统一 ID 类型，而不是在模板里散落宽松比较；但按“后端当前契约”不构成缺陷。

### 模板空值访问：当前数据流下通过

- 首页的每一项先经过 `normalizeArticle`；详情在进入模板分支前也先归一化。normalizer 总会生成 `author: { ... }` 和 `tags: []`。
- 评论每项经过 `normalizeComment`，同样总会生成 author 对象；`currentUser` 和 `userInfo` 的 data 默认值均为 `{}`。
- 因此 `article.author.username`、`article.tags.length`、`comment.author.username/id` 在当前代码路径不会因后端 null/缺字段而直接抛错。若未来绕过 normalizer，应同步收紧模板防御或保持这些不变量。

### 401 清理与导航：主路径通过

- 当前后端无 token/无效 token 都使用 HTTP 401；`common/http.js` 会先调用 unauthorized handler，默认 handler 清除 token/user，再从非登录页 `reLaunch` 到登录页。
- 当前已在登录页时不重复跳转；登录凭据错误实际是 HTTP 403，所以不会被误当作 token 失效导航。
- 并发写操作可能同时收到多个 401，handler 没有 redirect single-flight，可能产生重复 `reLaunch` 失败日志；第一次导航和 session 清理仍能生效，当前属于非阻断健壮性建议。

## 真机网络与可交付产物限制

这部分不违反“base URL 不散落”的源码要求，但当前工程不能被描述为无需配置即可真机运行：

1. `config/env.js:1` 默认是 `http://127.0.0.1:3000`。在真机中它指向手机自身，不是开发电脑；注释要求手工改 LAN IP 是必要条件，还需同网段并放通电脑防火墙/3000 端口。
2. `manifest.json:53` 的微信小程序 AppID 为空；现有生成物使用 `touristappid`，不能代替正式账号的标准真机预览/上传配置。
3. `manifest.json:55` 的 `urlCheck:false` 只能视为开发调试配置，不能替代发布环境要求的 HTTPS 合法请求域名配置；LAN IP/HTTP 方案不能作为生产发布方案。
4. 当前 `unpackage/dist/dev/mp-weixin/app.json` 仍只列出旧的 index/my/login 三页，缺少详情页，说明生成物未由本次源码重新构建。它不能作为当前实现的真机包；必须在 HBuilderX 重新构建后再导入微信开发者工具。

因此，修复页面竞态后，交付前仍应完成一次带有效 AppID 和可达 API 地址的微信开发者工具/真机冒烟。实现报告已说明没有 CLI 构建能力，这是诚实的验证限制，但“建议检查后端连通性”应升级为明确的真机前置配置清单。

## 测试质量评估

`tests/pages.integration.test.js` 主要是源码正则存在性测试，不是页面行为集成测试：

- 它不能执行 Vue 生命周期、并发 Promise、session 切换或 `uni` 导航，因而无法发现上述三个竞态。
- 收藏断言 `/articleApi\.(?:favorite|unfavorite)/` 只要求二者任意一个出现，删除另一分支仍可能通过。
- 评论所有者断言只检查源码中存在严格相等文本，没有验证真实 number 契约或混合类型行为。
- `new Function` 只检查 `<script>` 的普通 JavaScript 语法，不等价于 Vue SFC/uni-app/uView 的模板编译。
- 配置测试覆盖详情注册和首页刷新开关，但没有验证 tab/non-tab 导航约束、真机 AppID/base URL 或当前生成物是否包含详情页。

建议新增可注入 API/session/uni 的页面逻辑行为测试，至少覆盖本报告三个必须修复场景；并在有 HBuilderX 的环境执行一次当前源码的微信小程序构建。已有报告中的 22/22 通过仍是有效的静态/模块回归记录，但不足以证明页面运行时正确。

## 最终审查意见

**CHANGES_REQUIRED** — 主功能和真实后端契约基本对齐，但必须先补齐会话与请求代次保护，确保退出/换号不会被旧资料响应污染、评论写后刷新不会丢失、分页中的 reset 不会被静默吞掉；随后再做一次有效 AppID 与可达 API 配置下的微信真机/开发者工具验证。

---

## 修复复审（2026-08-27）

### 复审结论

**总体：APPROVED**

- **规格符合性：APPROVED**
- **代码质量 / 运行正确性：APPROVED**

初审的三个必须修复项均已关闭。复审按要求只读取返工报告、实现和测试，没有修改业务文件，也没有重跑实现者报告中的 7/7 或 29/29 测试。

### 1. 会话回写竞态：已关闭

- `pages/my/my.vue:57` 每次刷新先递增并捕获 `profileRequestGeneration`，第 66 行同时捕获发起请求时的 token。
- `getUser` 成功后的组件更新与 `session.setUser` 前，会同时检查 generation 未变化且 `session.getToken()` 仍是原 token（第 70–72 行）；错误 toast 也受相同会话条件保护。
- `handleLogout` 在清 session 前先递增 generation（第 90–92 行），所以已发出的旧请求即使在页面销毁后返回，也不能重新写用户缓存。
- 新 token 再次触发 `restoreAndRefresh()` 会启动新 generation；旧账号响应不会阻塞或覆盖新账号响应。
- `tests/pages.behavior.test.js:97` 使用 deferred 响应验证“刷新中退出后旧响应到达不写缓存”；第 115 行验证 A/B 两次请求交错时只写 B。测试直接执行页面方法并检查 session writes，不是文本存在性断言，能够防止原缺陷回归。

### 2. 评论写后强制刷新：已关闭

- `loadComments()` 现在总会设置 `commentsRefreshQueued`，并让所有调用共享 `commentsRefreshPromise`（`pages/article/detail.vue:137-143`）。
- `runCommentsRefreshQueue()` 在每次读取前消费一次标志，并在读取完成后重新检查；若写操作在某次列表请求进行中要求刷新，while 会再发出一次列表请求，而不是直接返回并丢掉刷新（第 145–160 行）。Promise 清理和 while 结束之间没有 `await`，不存在新请求插入到“队列已空但 Promise 尚未清除”的可重入窗口。
- 创建与删除共用 `commentsMutating`（第 180–212 行），写锁持续到 `await this.loadComments()` 完成；创建和删除不能再互相交错制造未覆盖的最终状态。创建失败仍保留输入，成功后才清空。
- 行为测试第 143 行验证创建发生在旧列表读取期间时必定追加第二次读取；第 175 行验证删除同样追加刷新，并阻止并发创建。这两个测试检查实际调用次数和最终评论 ID/列表，而非只检查方法名。

### 3. 分页 reset、重试模式与 token generation：已关闭

- reset 会递增 `requestGeneration`、清除待执行 append、记录 reset token，并进入现有串行队列（`pages/index/index.vue:121-155`）。append 在途时触发 reset 不再返回后丢失，而是使旧 append generation 失效并在其后执行第一页请求。
- 每个请求在落地成功或错误状态前，同时检查捕获的 generation 和 token（第 182–207 行）；旧 token/旧 generation 响应不能再写文章、页码或错误状态。
- token 变化时 reset 会更新 `activeToken` 并排队新 token 请求；旧请求完成后，queue 继续消费新 reset。退出时 `invalidateArticleRequests()` 递增 generation 并清空待执行项。
- `lastFailedMode` 只由仍有效的失败请求写入，`retryLoad()` 按该模式选择 append 或 reset；空态按钮和 footer 均已统一调用它，因此刷新失败不会再被误重试为下一页。
- 行为测试第 216 行验证 append 中 reset 的请求顺序为 page 2 后 page 1，且旧 append 结果不落地；第 248 行验证 append 失败后重试仍请求同一页；第 273 行验证 A token 响应后到被忽略、B token reset 最终落地。

### 测试与回归判断

- 新增 `pages.behavior.test.js` 的 harness 会提取页面 `<script>`、注入 API/session/uni，并直接绑定执行 methods。虽然它不是完整的 Vue/uni-app 渲染测试，但对本次三个纯异步状态机缺陷具有针对性，覆盖的时序和断言与生产逻辑一致。
- `pages.integration.test.js` 已把 footer 重试入口约束为 `retryLoad`；原有 API、页面注册和路径检查仍保留。
- 实现报告记录了修复前 `13 tests / 5 pass / 8 fail`、修复后行为测试 `7/7`、完整测试 `29/29`。本次复审没有重新执行这些命令，因此只把它们作为实现者的测试记录；审批依据同时包括上述逐行静态时序复核。
- 未发现返工对已通过的真实后端 API 路径、请求体、收藏计数、评论所有者 number ID、模板归一化、401 清理导航或 Vue 2/uView 2 用法造成回归。

### 保留的交付边界

初审记录的真机前置条件仍然存在：默认 `127.0.0.1`、空微信 AppID、发布环境 HTTPS/合法域名以及当前生成物尚未重新构建。这些不再作为页面源码返工项，但在声称“真机可用”或交付微信包之前，仍必须按初审清单完成 HBuilderX/微信开发者工具构建和真机连通性验证。

### 最终判断

**APPROVED** — 三个必须修复的异步竞态均由正确的会话/请求代次、drain queue 和失败模式状态修复，并有针对性的 deferred 行为测试覆盖；Tasks 3–6 的页面源码现满足规格与运行正确性要求，真机配置与构建验证仍作为明确的交付前置条件保留。
