# Task 2：API 与后端字段归一化

工作目录：`E:\面试项目\uniapp-v2`

## 目标

在 Task 1 的 `common/http.js` 基础上封装用户/文章接口，并用纯函数兼容后端列表与详情不一致的字段结构。

## 后端契约（全部 POST）

- `/api/users/login`：`{username,password}`，返回 `{user,token}`。
- `/api/users/getUser`：鉴权，返回用户。
- `/api/articles/list`：鉴权，`{page,pageSize}`，返回 `{items,total,page,pageSize,totalPages}`。
- `/api/articles/detail`：鉴权，`{slug}`。
- `/api/articles/favorite`、`/api/articles/unfavorite`：鉴权，`{articleId}`，返回 `{favorited}`。
- `/api/articles/comment/list`：鉴权，`{articleId}`，返回评论数组。
- `/api/articles/comment/create`：鉴权，`{articleId,body}`。
- `/api/articles/comment/delete`：鉴权，`{commentId}`。

列表文章 author 是嵌套对象，详情文章作者字段是 `author_id/author_username/...`；时间与收藏数同时可能出现 camelCase/snake_case。tags 可能是字符串、名称数组或 `{tag_name}` 对象数组。评论作者是 `author_id/author_username/...`。

## 必须完成

- 先创建 `tests/article-normalizer.test.js` 并确认失败，再创建 `common/article.js`。
- 归一化结果必须提供稳定字段：文章的 id/slug/title/description/body/author/tags/favorited/favoritesCount/createdAt/updatedAt；评论的 id/articleId/body/author/createdAt/updatedAt。
- `favorited` 必须为 boolean，计数必须为 number，tags 必须为字符串数组。
- 创建 `api/user.js` 与 `api/article.js`，只描述接口路径/请求体，复用统一 HTTP 客户端。
- 不修改后端和页面，不引入 package.json 或第三方依赖。

## 验证与报告

- 运行新增测试和 Task 1 既有测试，报告命令与结果。
- 用 `apply_patch` 编辑，不提交 git。
- 报告写入 `E:\面试项目\.superpowers\sdd\task-2-report.md`；最终仅回复状态与一行摘要。

