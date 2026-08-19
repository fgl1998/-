# API 接口对应 SQL（全 POST 版）

本文档对应 [`api-interface-table.md`](./api-interface-table.md)，数据库结构以 [`table2.md`](./table2.md) 为准。

## 1. 通用约定

- 所有业务接口统一使用 `POST`。
- SQL 使用 `?` 占位符，不拼接用户输入。
- 登录用户 ID 来自 JWT 解析后的 `req.userId`，不由前端提交。
- `currentUserId` 表示当前登录用户 ID；未登录时，文章列表等可选登录接口可以传入 `0`，使 `EXISTS` 返回 `false`。
- `limit = pageSize`，`offset = (page - 1) * pageSize`。
- 查询返回空数组不是 SQL 错误。
- 创建文章、更新文章包含多条相关写操作，必须使用同一个数据库连接和事务。
- 多条普通 `SELECT` 通常不需要事务；其中任意一条报错时，整个接口失败，不返回不完整数据。

---

# 2. User 模块

## 2.1 用户注册

```text
POST /api/users/create
```

请求参数：

```json
{
  "username": "zhangsan",
  "email": "zhangsan@test.com",
  "password": "123456"
}
```

检查邮箱是否存在：

```sql
SELECT id
FROM users
WHERE email = ?
LIMIT 1;
```

检查用户名是否存在：

```sql
SELECT id
FROM users
WHERE username = ?
LIMIT 1;
```

后端使用 `bcrypt` 将 `password` 转换成 `passwordHash`，然后创建用户：

```sql
INSERT INTO users (
  username,
  email,
  password_hash
)
VALUES (?, ?, ?);
```

使用 `result.insertId` 查询创建结果：

```sql
SELECT
  id,
  username,
  email,
  bio,
  image,
  created_at,
  updated_at
FROM users
WHERE id = ?
LIMIT 1;
```

说明：即使提前检查了邮箱和用户名，仍然需要处理唯一索引产生的重复键异常，因为并发请求可能同时通过检查。

## 2.2 用户登录

```text
POST /api/users/login
```

```sql
SELECT
  id,
  username,
  email,
  password_hash,
  bio,
  image,
  created_at,
  updated_at
FROM users
WHERE email = ?
LIMIT 1;
```

后端使用 `bcrypt.compare(password, password_hash)` 校验密码，成功后生成 JWT。`password_hash` 不得返回给前端。

## 2.3 获取当前用户

```text
POST /api/users/getUser
```

```sql
SELECT
  id,
  username,
  email,
  bio,
  image,
  created_at,
  updated_at
FROM users
WHERE id = ?
LIMIT 1;
```

参数：

```text
req.userId
```

## 2.4 更新当前用户

```text
POST /api/users/updateUser
```

先根据实际传入字段动态生成 `SET` 子句。例如更新用户名、简介和头像：

```sql
UPDATE users
SET
  username = ?,
  bio = ?,
  image = ?
WHERE id = ?;
```

更新邮箱：

```sql
UPDATE users
SET email = ?
WHERE id = ?;
```

更新密码前先生成新的 `passwordHash`：

```sql
UPDATE users
SET password_hash = ?
WHERE id = ?;
```

更新后重新查询：

```sql
SELECT
  id,
  username,
  email,
  bio,
  image,
  created_at,
  updated_at
FROM users
WHERE id = ?
LIMIT 1;
```

---

# 3. Profile 模块

## 3.1 获取用户公开资料

```text
POST /api/profiles/get
```

使用 `EXISTS` 一次返回当前用户是否关注目标用户：

```sql
SELECT
  users.id,
  users.username,
  users.bio,
  users.image,

  EXISTS (
    SELECT 1
    FROM follows
    WHERE follows.follower_id = ?
      AND follows.following_id = users.id
  ) AS following

FROM users
WHERE users.username = ?
LIMIT 1;
```

参数：

```text
currentUserId
username
```

未登录时 `currentUserId` 可以传 `0`，此时 `following` 为 `0`。

## 3.2 关注用户

```text
POST /api/profiles/follow
```

查询目标用户：

```sql
SELECT id
FROM users
WHERE username = ?
LIMIT 1;
```

业务层禁止 `req.userId === followingId`，然后建立关注关系：

```sql
INSERT IGNORE INTO follows (
  follower_id,
  following_id
)
VALUES (?, ?);
```

参数：

```text
req.userId
followingId
```

关注成功后可以复用“获取用户公开资料”的 SQL 返回 Profile。

## 3.3 取消关注用户

```text
POST /api/profiles/unfollow
```

查询目标用户：

```sql
SELECT id
FROM users
WHERE username = ?
LIMIT 1;
```

删除关注关系：

```sql
DELETE FROM follows
WHERE follower_id = ?
  AND following_id = ?;
```

取消成功后可以复用“获取用户公开资料”的 SQL 返回 Profile。

---

# 4. Article 模块

## 4.1 获取文章列表

```text
POST /api/articles/list
```

主查询保持“一行一篇文章”，获取文章、作者、关注状态、收藏状态和收藏数量：

```sql
SELECT
  articles.id,
  articles.slug,
  articles.title,
  articles.description,
  articles.body,
  articles.author_id,
  articles.created_at,
  articles.updated_at,

  users.username AS author_username,
  users.bio AS author_bio,
  users.image AS author_image,

  EXISTS (
    SELECT 1
    FROM follows
    WHERE follows.follower_id = ?
      AND follows.following_id = articles.author_id
  ) AS following,

  EXISTS (
    SELECT 1
    FROM favorites
    WHERE favorites.user_id = ?
      AND favorites.article_id = articles.id
  ) AS favorited,

  (
    SELECT COUNT(*)
    FROM favorites
    WHERE favorites.article_id = articles.id
  ) AS favorites_count

FROM articles
JOIN users
  ON users.id = articles.author_id

ORDER BY articles.created_at DESC
LIMIT ? OFFSET ?;
```

参数：

```text
currentUserId
currentUserId
limit
offset
```

查询文章总数：

```sql
SELECT COUNT(*) AS total
FROM articles;
```

主查询完成后提取当前页 `articleIds`，一次批量查询全部标签：

```sql
SELECT
  article_tags.article_id,
  tags.id AS tag_id,
  tags.name AS tag_name
FROM article_tags
JOIN tags
  ON tags.id = article_tags.tag_id
WHERE article_tags.article_id IN (?, ?, ?)
ORDER BY article_tags.article_id, tags.name;
```

`IN` 中的占位符数量由 `articleIds.length` 决定。文章列表为空时直接返回，不执行标签 SQL。代码层根据 `article_id` 分组并组装文章列表。

可选筛选条件应动态加入主查询与总数查询，不能直接拼接用户输入。示例：

```sql
-- 按作者筛选
AND users.username = ?

-- 按标签筛选
AND EXISTS (
  SELECT 1
  FROM article_tags filter_article_tags
  JOIN tags filter_tags
    ON filter_tags.id = filter_article_tags.tag_id
  WHERE filter_article_tags.article_id = articles.id
    AND filter_tags.name = ?
)

-- 按指定用户收藏筛选
AND EXISTS (
  SELECT 1
  FROM favorites filter_favorites
  JOIN users favorite_users
    ON favorite_users.id = filter_favorites.user_id
  WHERE filter_favorites.article_id = articles.id
    AND favorite_users.username = ?
)
```

## 4.2 获取关注用户的文章

```text
POST /api/articles/feed
```

需要登录。使用 `follows` 限制文章作者必须是当前用户关注的人：

```sql
SELECT
  articles.id,
  articles.slug,
  articles.title,
  articles.description,
  articles.body,
  articles.author_id,
  articles.created_at,
  articles.updated_at,

  users.username AS author_username,
  users.bio AS author_bio,
  users.image AS author_image,

  1 AS following,

  EXISTS (
    SELECT 1
    FROM favorites
    WHERE favorites.user_id = ?
      AND favorites.article_id = articles.id
  ) AS favorited,

  (
    SELECT COUNT(*)
    FROM favorites
    WHERE favorites.article_id = articles.id
  ) AS favorites_count

FROM follows
JOIN articles
  ON articles.author_id = follows.following_id
JOIN users
  ON users.id = articles.author_id

WHERE follows.follower_id = ?

ORDER BY articles.created_at DESC
LIMIT ? OFFSET ?;
```

参数：

```text
req.userId
req.userId
limit
offset
```

查询 Feed 总数：

```sql
SELECT COUNT(*) AS total
FROM follows
JOIN articles
  ON articles.author_id = follows.following_id
WHERE follows.follower_id = ?;
```

再使用当前页 `articleIds` 执行与文章列表相同的标签批量查询。

## 4.3 获取文章详情

```text
POST /api/articles/detail
```

查询文章主信息：

```sql
SELECT
  articles.id,
  articles.slug,
  articles.title,
  articles.description,
  articles.body,
  articles.author_id,
  articles.created_at,
  articles.updated_at,

  users.username AS author_username,
  users.bio AS author_bio,
  users.image AS author_image,

  EXISTS (
    SELECT 1
    FROM follows
    WHERE follows.follower_id = ?
      AND follows.following_id = articles.author_id
  ) AS following,

  EXISTS (
    SELECT 1
    FROM favorites
    WHERE favorites.user_id = ?
      AND favorites.article_id = articles.id
  ) AS favorited,

  (
    SELECT COUNT(*)
    FROM favorites
    WHERE favorites.article_id = articles.id
  ) AS favorites_count

FROM articles
JOIN users
  ON users.id = articles.author_id
WHERE articles.slug = ?
LIMIT 1;
```

参数：

```text
currentUserId
currentUserId
slug
```

根据查询结果中的 `articles.id` 查询标签：

```sql
SELECT
  tags.id,
  tags.name
FROM article_tags
JOIN tags
  ON tags.id = article_tags.tag_id
WHERE article_tags.article_id = ?
ORDER BY tags.name;
```

## 4.4 创建文章

```text
POST /api/articles/create
```

创建文章和绑定标签必须使用事务：

```sql
START TRANSACTION;
```

创建文章：

```sql
INSERT INTO articles (
  author_id,
  slug,
  title,
  description,
  body
)
VALUES (?, ?, ?, ?, ?);
```

参数：

```text
req.userId
slug
title
description
body
```

使用 `result.insertId` 得到 `articleId`。对于去重后的每一个标签名称执行：

```sql
INSERT IGNORE INTO tags (name)
VALUES (?);
```

无论标签原来存在还是刚创建，都统一查询标签 ID：

```sql
SELECT id
FROM tags
WHERE name = ?
LIMIT 1;
```

绑定文章和标签：

```sql
INSERT IGNORE INTO article_tags (
  article_id,
  tag_id
)
VALUES (?, ?);
```

全部写入成功：

```sql
COMMIT;
```

任意一步失败：

```sql
ROLLBACK;
```

提交成功后，使用文章详情 SQL 查询完整文章并返回。

## 4.5 更新文章

```text
POST /api/articles/update
```

先查询文章并校验作者权限：

```sql
SELECT
  id,
  author_id,
  slug
FROM articles
WHERE slug = ?
LIMIT 1;
```

确认 `author_id === req.userId` 后，在同一连接中开启事务：

```sql
START TRANSACTION;
```

更新文章字段：

```sql
UPDATE articles
SET
  title = ?,
  description = ?,
  body = ?
WHERE id = ?;
```

第一版可以保持原 slug 不变。更新标签时先删除旧关系：

```sql
DELETE FROM article_tags
WHERE article_id = ?;
```

对于新 `tagList` 中去重后的每一个标签执行：

```sql
INSERT IGNORE INTO tags (name)
VALUES (?);
```

```sql
SELECT id
FROM tags
WHERE name = ?
LIMIT 1;
```

```sql
INSERT IGNORE INTO article_tags (
  article_id,
  tag_id
)
VALUES (?, ?);
```

全部成功：

```sql
COMMIT;
```

任意一步失败：

```sql
ROLLBACK;
```

提交后复用文章详情 SQL 返回更新结果。

## 4.6 删除文章

```text
POST /api/articles/delete
```

查询文章并校验权限：

```sql
SELECT
  id,
  author_id
FROM articles
WHERE slug = ?
LIMIT 1;
```

确认 `author_id === req.userId` 后删除：

```sql
DELETE FROM articles
WHERE id = ?;
```

根据表结构中的 `ON DELETE CASCADE`，对应的 `comments`、`article_tags` 和 `favorites` 记录会自动删除，不需要手动逐表删除。

---

# 5. Favorite 模块

## 5.1 收藏文章

```text
POST /api/articles/favorite
```

根据 slug 查询文章：

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

建立收藏关系：

```sql
INSERT IGNORE INTO favorites (
  user_id,
  article_id
)
VALUES (?, ?);
```

参数：

```text
req.userId
articleId
```

如果只需要返回收藏数量：

```sql
SELECT COUNT(*) AS favorites_count
FROM favorites
WHERE article_id = ?;
```

如果需要返回完整文章，复用文章详情 SQL。

## 5.2 取消收藏文章

```text
POST /api/articles/unfavorite
```

根据 slug 查询文章：

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

删除收藏关系：

```sql
DELETE FROM favorites
WHERE user_id = ?
  AND article_id = ?;
```

如果需要返回完整文章，复用文章详情 SQL。

---

# 6. Comment 模块

## 6.1 获取文章评论列表

```text
POST /api/articles/comments/list
```

先确认文章存在并取得 `articleId`：

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

查询评论、评论作者以及当前用户是否关注评论作者：

```sql
SELECT
  comments.id,
  comments.article_id,
  comments.author_id,
  comments.body,
  comments.created_at,
  comments.updated_at,

  users.username AS author_username,
  users.bio AS author_bio,
  users.image AS author_image,

  EXISTS (
    SELECT 1
    FROM follows
    WHERE follows.follower_id = ?
      AND follows.following_id = comments.author_id
  ) AS following

FROM comments
JOIN users
  ON users.id = comments.author_id
WHERE comments.article_id = ?
ORDER BY comments.created_at ASC;
```

参数：

```text
currentUserId
articleId
```

未登录时 `currentUserId` 可以传 `0`。

## 6.2 创建文章评论

```text
POST /api/articles/comments/create
```

查询文章：

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

创建评论：

```sql
INSERT INTO comments (
  article_id,
  author_id,
  body
)
VALUES (?, ?, ?);
```

参数：

```text
articleId
req.userId
body
```

使用 `result.insertId` 得到 `commentId`，查询创建结果：

```sql
SELECT
  comments.id,
  comments.article_id,
  comments.author_id,
  comments.body,
  comments.created_at,
  comments.updated_at,

  users.username AS author_username,
  users.bio AS author_bio,
  users.image AS author_image,

  EXISTS (
    SELECT 1
    FROM follows
    WHERE follows.follower_id = ?
      AND follows.following_id = comments.author_id
  ) AS following

FROM comments
JOIN users
  ON users.id = comments.author_id
WHERE comments.id = ?
LIMIT 1;
```

## 6.3 删除文章评论

```text
POST /api/articles/comments/delete
```

查询评论、所属文章和作者：

```sql
SELECT
  comments.id,
  comments.article_id,
  comments.author_id
FROM comments
JOIN articles
  ON articles.id = comments.article_id
WHERE comments.id = ?
  AND articles.slug = ?
LIMIT 1;
```

确认 `comments.author_id === req.userId` 后删除：

```sql
DELETE FROM comments
WHERE id = ?;
```

---

# 7. Tag 模块

## 7.1 获取所有标签

```text
POST /api/tags/list
```

```sql
SELECT
  id,
  name,
  created_at
FROM tags
ORDER BY name ASC;
```

标签通常不提供独立创建接口，而是在创建或更新文章时自动创建并写入 `article_tags`。

---

# 8. 事务使用总结

| 接口 | 是否需要事务 | 原因 |
|---|---:|---|
| 用户注册 | 否 | 核心写入只有一条 `INSERT users` |
| 更新当前用户 | 否 | 通常是一条动态 `UPDATE` |
| 获取文章列表 | 否 | 多条查询失败时整体返回错误，没有数据需要回滚 |
| 获取文章详情 | 否 | 普通读取允许短暂数据变化 |
| 创建文章 | 是 | `articles`、`tags`、`article_tags` 必须共同成功或回滚 |
| 更新文章 | 是 | 文章字段和标签关系必须共同成功或回滚 |
| 删除文章 | 否 | 一条 `DELETE articles`，关联数据由外键级联删除 |
| 收藏、取消收藏 | 否 | 核心写入只有一条 `INSERT` 或 `DELETE` |
| 创建评论 | 否 | 核心写入只有一条 `INSERT comments` |
| 删除评论 | 否 | 核心写入只有一条 `DELETE comments` |

如果未来要求多条读取必须看到完全一致的数据快照，可以使用只读事务；事务内所有 SQL 必须通过同一个 `connection` 执行。

