# 用户中心后端接口进度

全部沿用现有约定：`POST`、响应包 `{ success, code, message, data }`。

## 已提供并已接入小程序

### 用户关系

- `/api/profiles/followingList`：请求 `{ userId }`，data 为该用户的关注列表 `Profile[]`
- `/api/profiles/followedList`：请求 `{ userId }`，data 为该用户的粉丝列表 `Profile[]`
- `/api/profiles/get`：请求 `{ username }`，data 为作者资料
- `/api/profiles/follow`：请求 `{ followingId }`
- `/api/profiles/unfollow`：请求 `{ followingId }`

### 用户文章

- `/api/articles/getArticleListByUserId`：请求 `{ userId }`，data 为该用户发布的文章数组
- `/api/articles/getFavoriteArticleListByUserId`：请求 `{ userId }`，data 为该用户收藏的文章数组

这两个接口虽然用于计算数量，但当前实际返回的是文章数组，不是单独的数字。小程序同时用数组展示文章列表，并用 `array.length` 显示文章数和收藏数。

当前文章响应是扁平作者字段，前端已经统一归一化：

```json
{
  "id": 1,
  "slug": "article-slug",
  "title": "文章标题",
  "description": "文章摘要",
  "body": "正文",
  "author_id": 2,
  "author_username": "alice",
  "author_bio": "个人简介",
  "author_image": null,
  "favorites_count": 3,
  "createdAt": "2026-08-28T00:00:00.000Z",
  "updatedAt": "2026-08-28T00:00:00.000Z"
}
```

## 小程序当前已完成

- 我的关注和粉丝真实列表、真实数量
- 我的文章和收藏文章真实列表、真实数量
- 文章列表加载、空状态、失败重试、下拉刷新
- 点击文章进入详情，点击作者头像进入真实作者主页
- 作者真实资料、关注数、粉丝数、文章数
- 作者关注和取消关注真实操作
- 登录账号切换时丢弃旧账号的延迟响应

## 后端后续建议优化

1. 四个列表接口当前都一次返回完整数组。数据较多后建议增加 `{ page, pageSize }`，返回 `{ items, total, page, pageSize, totalPages }`，前端统计直接使用 `total`。
2. `followingList`、`followedList` 的 SQL 没有查询 `following`，但 mapper 会读取该字段，所以列表项中的 `following` 当前为空。需要在关系列表直接操作关注时，再补 `EXISTS(...) AS following`。
3. 两个按用户 ID 查询文章的接口当前没有返回标签，因此这些列表不会显示标签；需要标签时应返回与 `/api/articles/list` 一致的 `tags`。
4. 如果列表只允许查询当前用户，应添加 `authMiddleware` 并使用 `req.userId`；如果作者主页允许查看其他用户的数据，保留请求中的 `userId` 即可。
5. `getArticleListByUserId` 当前响应 code 写成了 `FAVORITE_ARTICLE_LIST_FOUND`，建议改成独立的 `ARTICLE_LIST_BY_USER_FOUND`，不影响前端读取 data。
