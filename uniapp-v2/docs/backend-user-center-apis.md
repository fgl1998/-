# 用户中心后端接口进度

全部沿用现有约定：`POST`、响应包 `{ success, code, message, data }`。

## 已提供并已接入小程序

### 我的关注列表

- 路径：`/api/profiles/followingList`
- 请求：`{ userId: 1 }`
- data：`Profile[]`

### 我的粉丝列表

- 路径：`/api/profiles/followedList`
- 请求：`{ userId: 1 }`
- data：`Profile[]`

当前小程序使用两个数组的长度显示关注数和粉丝数，并支持加载、空列表、失败重试和下拉刷新。

当前实际 `Profile` 数据包含：

```json
{
  "id": 2,
  "username": "alice",
  "bio": "个人简介",
  "image": "https://example.com/avatar.png",
  "createdAt": "2026-08-27T00:00:00.000Z"
}
```

### 后端建议优化（不影响当前列表展示）

1. `followingList`、`followedList` 的 SQL 没有查询 `following`，但 mapper 会读取该字段，所以当前返回值中的 `following` 是空值。需要展示关注按钮时再补 `EXISTS(...) AS following`。
2. 当前接口一次返回全部数据。如果数据会较多，后续请求增加 `{ page, pageSize }`，响应改成 `{ items, total, page, pageSize, totalPages }`。
3. 如果这两个接口只允许查询当前用户，可以添加 `authMiddleware` 并直接使用 `req.userId`；如果作者主页也允许查看其他人的关注关系，保留请求中的 `userId` 即可。

## 仍缺少的接口能力

### 我的文章列表

无需新路径，但要让现有 `/api/articles/list` 的 `author` 筛选真正生效。

- 请求：`{ page: 1, pageSize: 10, author: "当前用户名" }`
- data：沿用现有文章 PageResult。

### 我的收藏文章列表

- 路径建议：`/api/articles/favorites/list`
- 请求：`{ page: 1, pageSize: 10 }`
- data：沿用现有文章 PageResult，items 使用和 `/api/articles/list` 相同的 Article 结构。

### 文章和收藏统计数字

关注数和粉丝数现在可由列表长度得到。文章和收藏接入分页后，应优先使用分页返回的 `total`；也可以扩展 `/api/users/getUser`，增加：

```json
{
  "articlesCount": 5,
  "favoritesCount": 16
}
```

## 作者主页

现有接口可复用：

- `/api/profiles/get`：`{ username }`
- `/api/profiles/follow`：`{ followingId }`
- `/api/profiles/unfollow`：`{ followingId }`

作者文章复用 `/api/articles/list` 的 `author` 筛选。
