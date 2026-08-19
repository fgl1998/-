# API 接口总表

> 所有业务接口统一使用 `POST` 请求。

| 所属模块 | 接口功能 | HTTP 方法 | 路径 | 涉及表 |
|---|---|---|---|---|
| `user` | 用户注册 | POST | `/api/users/create` | `users` |
| `user` | 用户登录 | POST | `/api/users/login` | `users` |
| `user` | 获取当前用户 | POST | `/api/users/getUser` | `users` |
| `user` | 更新当前用户 | POST | `/api/users/updateUser` | `users` |
| `profile` | 获取用户公开资料 | POST | `/api/profiles/get` | `users`, `follows` |
| `profile` | 关注用户 | POST | `/api/profiles/follow` | `users`, `follows` |
| `profile` | 取消关注用户 | POST | `/api/profiles/unfollow` | `users`, `follows` |
| `article` | 获取文章列表 | POST | `/api/articles/list` | `articles`, `users`, `favorites`, `follows`, `tags`, `article_tags` |
| `article` | 获取关注用户的文章 | POST | `/api/articles/feed` | `articles`, `users`, `follows`, `favorites`, `tags`, `article_tags` |
| `article` | 获取文章详情 | POST | `/api/articles/detail` | `articles`, `users`, `favorites`, `follows`, `tags`, `article_tags` |
| `article` | 创建文章 | POST | `/api/articles/create` | `articles`, `users`, `tags`, `article_tags` |
| `article` | 更新文章 | POST | `/api/articles/update` | `articles`, `users`, `tags`, `article_tags` |
| `article` | 删除文章 | POST | `/api/articles/delete` | `articles`, `comments`, `article_tags`, `favorites` |
| `favorite` | 收藏文章 | POST | `/api/articles/favorite` | `articles`, `favorites` |
| `favorite` | 取消收藏文章 | POST | `/api/articles/unfavorite` | `articles`, `favorites` |
| `comment` | 获取文章评论列表 | POST | `/api/articles/comments/list` | `articles`, `comments`, `users`, `follows` |
| `comment` | 创建文章评论 | POST | `/api/articles/comments/create` | `articles`, `comments`, `users` |
| `comment` | 删除文章评论 | POST | `/api/articles/comments/delete` | `articles`, `comments` |
| `tag` | 获取所有标签 | POST | `/api/tags/list` | `tags` |
