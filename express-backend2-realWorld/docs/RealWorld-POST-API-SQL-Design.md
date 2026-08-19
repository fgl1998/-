# RealWorld Express 后端 API + SQL 设计（全 POST 版）

> 适用项目：`express-backend2-realWorld`  
> 当前约定：**所有业务接口统一使用 POST**，暂不采用 RESTful。  
> 数据库以当前项目的 `users / articles / comments / tags / article_tags / favorites / follows` 表为基础。

---

## 1. 总体约定

### 1.1 接口统一格式

建议所有接口统一：

```text
POST /api/模块/动作
```

例如：

```text
POST /api/users/login
POST /api/articles/create
POST /api/articles/detail
POST /api/articles/delete
POST /api/tags/list
```

### 1.2 登录态接口

需要登录的接口，通过 JWT 中间件得到：

```ts
req.userId
```

**不要让前端传 `userId`。**

例如：

```text
Authorization: Bearer xxxxx
```

认证中间件解析 Token：

```ts
req.userId = payload.userId
```

后续业务统一使用：

```ts
const userId = req.userId
```

### 1.3 SQL 参数

本文 SQL 全部使用 `?` 占位符：

```sql
SELECT * FROM users WHERE id = ?;
```

不要拼接用户输入：

```ts
// 不推荐
`SELECT * FROM users WHERE id = ${id}`
```

---

# 2. API 总表

| 模块 | 接口 | 是否登录 | 用途 |
|---|---|---:|---|
| 用户 | `POST /api/users/create` | 否 | 注册 |
| 用户 | `POST /api/users/login` | 否 | 登录 |
| 用户 | `POST /api/users/getUser` | 是 | 获取当前用户 |
| 用户 | `POST /api/users/updateUser` | 是 | 更新当前用户 |
| Profile | `POST /api/profiles/get` | 可选 | 查看用户资料 |
| Profile | `POST /api/profiles/follow` | 是 | 关注用户 |
| Profile | `POST /api/profiles/unfollow` | 是 | 取消关注 |
| 文章 | `POST /api/articles/list` | 可选 | 获取文章列表 |
| 文章 | `POST /api/articles/detail` | 可选 | 获取文章详情 |
| 文章 | `POST /api/articles/create` | 是 | 创建文章，同时处理 Tag |
| 文章 | `POST /api/articles/update` | 是 | 更新文章，同时处理 Tag |
| 文章 | `POST /api/articles/delete` | 是 | 删除文章 |
| 收藏 | `POST /api/articles/favorite` | 是 | 收藏文章 |
| 收藏 | `POST /api/articles/unfavorite` | 是 | 取消收藏 |
| 评论 | `POST /api/articles/comments/list` | 可选 | 获取文章评论 |
| 评论 | `POST /api/articles/comments/create` | 是 | 创建评论 |
| 评论 | `POST /api/articles/comments/delete` | 是 | 删除评论 |
| 标签 | `POST /api/tags/list` | 否 | 获取所有标签 |

---

# 3. User 用户模块

## 3.1 注册

### API

```text
POST /api/users/create
```

### Body

```json
{
  "username": "zhangsan",
  "email": "zhangsan@test.com",
  "password": "123456"
}
```

注意：

前端传：

```text
password
```

后端通过 `bcrypt` 生成：

```text
passwordHash
```

数据库存：

```text
password_hash
```

### 业务流程

```text
参数校验
   ↓
检查 email 是否重复
   ↓
检查 username 是否重复
   ↓
bcrypt.hash(password)
   ↓
INSERT users
   ↓
查询刚创建的用户
   ↓
返回用户信息
```

### SQL 1：检查邮箱

```sql
SELECT id
FROM users
WHERE email = ?
LIMIT 1;
```

### SQL 2：检查用户名

```sql
SELECT id
FROM users
WHERE username = ?
LIMIT 1;
```

### SQL 3：创建用户

```sql
INSERT INTO users (
  username,
  email,
  password_hash
)
VALUES (?, ?, ?);
```

参数：

```text
username
email
passwordHash
```

### SQL 4：查询创建结果

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
WHERE id = ?;
```

---

## 3.2 登录

### API

```text
POST /api/users/login
```

### Body

```json
{
  "email": "zhangsan@test.com",
  "password": "123456"
}
```

### SQL

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

后端：

```text
查不到用户
   ↓
登录失败

查到用户
   ↓
bcrypt.compare(password, password_hash)
   ↓
生成 JWT
   ↓
返回用户 + token
```

---

## 3.3 获取当前用户

### API

```text
POST /api/users/getUser
```

### Body

无需 userId：

```json
{}
```

用户 ID 从：

```ts
req.userId
```

取得。

### SQL

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

---

## 3.4 更新当前用户

### API

```text
POST /api/users/updateUser
```

### Body 示例

```json
{
  "username": "newname",
  "bio": "hello world",
  "image": "https://xxx.com/avatar.png"
}
```

建议支持部分更新。

### 更新用户名

```sql
UPDATE users
SET username = ?
WHERE id = ?;
```

### 更新邮箱

```sql
UPDATE users
SET email = ?
WHERE id = ?;
```

### 更新 Bio

```sql
UPDATE users
SET bio = ?
WHERE id = ?;
```

### 更新头像

```sql
UPDATE users
SET image = ?
WHERE id = ?;
```

实际项目中，可以在 Repository 中根据传入字段动态生成：

```sql
UPDATE users
SET
  username = ?,
  bio = ?,
  image = ?
WHERE id = ?;
```

如果修改密码：

```text
password
   ↓
bcrypt.hash()
   ↓
password_hash
```

SQL：

```sql
UPDATE users
SET password_hash = ?
WHERE id = ?;
```

更新完成后再次查询用户：

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
WHERE id = ?;
```

---

# 4. Profile 用户资料模块

Profile 与 User 的区别：

```text
User
= 当前登录用户自己的账号资料

Profile
= 查看其他用户的公开资料
```

---

## 4.1 获取用户 Profile

### API

```text
POST /api/profiles/get
```

### Body

```json
{
  "username": "lisi"
}
```

### SQL：查询用户

```sql
SELECT
  id,
  username,
  bio,
  image
FROM users
WHERE username = ?
LIMIT 1;
```

如果当前用户已经登录，还需要判断：

```text
我是否关注这个用户？
```

### SQL：判断关注状态

```sql
SELECT 1
FROM follows
WHERE follower_id = ?
  AND following_id = ?
LIMIT 1;
```

参数：

```text
follower_id  = req.userId
following_id = profileUser.id
```

最终：

```json
{
  "username": "lisi",
  "bio": "...",
  "image": "...",
  "following": true
}
```

---

## 4.2 关注用户

### API

```text
POST /api/profiles/follow
```

### Body

```json
{
  "username": "lisi"
}
```

### SQL 1：查询被关注用户

```sql
SELECT id
FROM users
WHERE username = ?
LIMIT 1;
```

得到：

```text
followingId
```

### SQL 2：建立关注关系

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

业务层需要禁止：

```text
自己关注自己
```

即：

```ts
if (req.userId === followingId) {
  throw ...
}
```

---

## 4.3 取消关注

### API

```text
POST /api/profiles/unfollow
```

### Body

```json
{
  "username": "lisi"
}
```

### SQL 1

```sql
SELECT id
FROM users
WHERE username = ?
LIMIT 1;
```

### SQL 2

```sql
DELETE FROM follows
WHERE follower_id = ?
  AND following_id = ?;
```

---

# 5. Article 文章模块

---

## 5.1 获取文章列表

### API

```text
POST /api/articles/list
```

### Body

第一版先只做分页：

```json
{
  "page": 1,
  "pageSize": 20
}
```

Service 转换：

```ts
const limit = pageSize
const offset = (page - 1) * pageSize
```

### SQL：文章列表

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

  users.username,
  users.bio,
  users.image,

  (
    SELECT COUNT(*)
    FROM favorites
    WHERE favorites.article_id = articles.id
  ) AS favorites_count

FROM articles

JOIN users
  ON articles.author_id = users.id

ORDER BY articles.created_at DESC

LIMIT ? OFFSET ?;
```

参数：

```text
limit
offset
```

### SQL：文章总数

```sql
SELECT COUNT(*) AS total
FROM articles;
```

---

## 5.2 查询一篇文章的 Tags

文章列表查询出来以后，需要获取文章标签。

### SQL

```sql
SELECT
  tags.id,
  tags.name
FROM article_tags

JOIN tags
  ON article_tags.tag_id = tags.id

WHERE article_tags.article_id = ?

ORDER BY tags.name;
```

第一版可以先：

```text
查询文章列表
   ↓
拿 article.id
   ↓
查询对应 tagList
```

后面再优化批量查询，暂时不要为了“一条复杂 SQL”增加学习成本。

---

# 6. 获取文章详情

## API

```text
POST /api/articles/detail
```

### Body

```json
{
  "slug": "express-backend-study"
}
```

### SQL 1：文章 + 作者

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

  users.username,
  users.bio,
  users.image,

  (
    SELECT COUNT(*)
    FROM favorites
    WHERE favorites.article_id = articles.id
  ) AS favorites_count

FROM articles

JOIN users
  ON articles.author_id = users.id

WHERE articles.slug = ?

LIMIT 1;
```

### SQL 2：文章标签

```sql
SELECT
  tags.id,
  tags.name
FROM article_tags

JOIN tags
  ON article_tags.tag_id = tags.id

WHERE article_tags.article_id = ?;
```

如果用户已登录，可以查询是否收藏：

```sql
SELECT 1
FROM favorites
WHERE user_id = ?
  AND article_id = ?
LIMIT 1;
```

---

# 7. 创建文章 —— Tag 重点

这是当前项目最需要优先实现的接口。

## 7.1 API

```text
POST /api/articles/create
```

需要登录。

### Body

```json
{
  "title": "Express 后端开发",
  "description": "学习 Express + MySQL",
  "body": "正文内容...",
  "tagList": [
    "Express",
    "Node.js",
    "MySQL"
  ]
}
```

注意：

前端提交的是：

```text
tagList: string[]
```

**不需要提交 `tagId`。**

---

## 7.2 后端完整流程

```text
POST /api/articles/create

        ↓

JWT 得到 userId

        ↓

生成 slug

        ↓

BEGIN TRANSACTION

        ↓

创建 articles

        ↓

得到 articleId

        ↓

循环 tagList

        ↓

Tag 是否存在？
   ↙          ↘
存在          不存在
 ↓              ↓
拿 tagId      INSERT tags
                ↓
             拿 tagId

        ↓

INSERT article_tags

        ↓

COMMIT

        ↓

查询完整文章

        ↓

返回
```

---

## 7.3 必须使用事务

伪代码：

```ts
const connection = await pool.getConnection()

try {
  await connection.beginTransaction()

  // 创建 article

  // 创建 / 查询 tag

  // 建立 article_tags

  await connection.commit()
} catch (error) {
  await connection.rollback()
  throw error
} finally {
  connection.release()
}
```

---

## 7.4 SQL 1：创建文章

```sql
INSERT INTO articles (
  title,
  description,
  body,
  author_id,
  slug
)
VALUES (?, ?, ?, ?, ?);
```

参数：

```text
input.title
input.description
input.body
req.userId
slug
```

MySQL 返回：

```ts
result.insertId
```

得到：

```text
articleId
```

---

## 7.5 SQL 2：处理 Tag

例如：

```json
[
  "Express",
  "Node.js",
  "MySQL"
]
```

对于每一个 tag：

### 先尝试创建

```sql
INSERT IGNORE INTO tags (name)
VALUES (?);
```

由于：

```text
tags.name
```

有唯一索引：

```text
UNIQUE KEY uk_tags_name
```

已经存在时不会创建重复数据。

然后统一查询 Tag ID：

```sql
SELECT id, name
FROM tags
WHERE name = ?
LIMIT 1;
```

这样无论 Tag：

```text
已经存在
```

还是：

```text
刚刚创建
```

最后都可以得到：

```text
tagId
```

---

## 7.6 SQL 3：建立文章与 Tag 的关系

```sql
INSERT IGNORE INTO article_tags (
  article_id,
  tag_id
)
VALUES (?, ?);
```

参数：

```text
articleId
tagId
```

因为：

```text
PRIMARY KEY (article_id, tag_id)
```

所以同一篇文章不会重复绑定同一个 Tag。

---

## 7.7 创建文章示例

请求：

```json
{
  "title": "Express 入门",
  "description": "Express 学习",
  "body": "文章正文",
  "tagList": [
    "Express",
    "Node.js"
  ]
}
```

假设：

```text
Express 已存在，id = 3
Node.js 不存在
```

执行过程：

```sql
START TRANSACTION;
```

创建文章：

```sql
INSERT INTO articles (
  title,
  description,
  body,
  author_id,
  slug
)
VALUES (
  'Express 入门',
  'Express 学习',
  '文章正文',
  1,
  'express-intro-xxxx'
);
```

假设：

```text
articleId = 100
```

处理 Express：

```sql
INSERT IGNORE INTO tags (name)
VALUES ('Express');

SELECT id
FROM tags
WHERE name = 'Express'
LIMIT 1;
```

得到：

```text
tagId = 3
```

绑定：

```sql
INSERT IGNORE INTO article_tags (
  article_id,
  tag_id
)
VALUES (100, 3);
```

处理 Node.js：

```sql
INSERT IGNORE INTO tags (name)
VALUES ('Node.js');

SELECT id
FROM tags
WHERE name = 'Node.js'
LIMIT 1;
```

假设：

```text
tagId = 8
```

绑定：

```sql
INSERT IGNORE INTO article_tags (
  article_id,
  tag_id
)
VALUES (100, 8);
```

最后：

```sql
COMMIT;
```

数据库结果：

```text
articles

100   Express 入门
```

```text
tags

3   Express
8   Node.js
```

```text
article_tags

100   3
100   8
```

---

# 8. 更新文章

## API

```text
POST /api/articles/update
```

需要登录。

### Body

```json
{
  "slug": "express-intro-xxxx",
  "title": "Express 完整入门",
  "description": "新版简介",
  "body": "新版正文",
  "tagList": [
    "Express",
    "MySQL"
  ]
}
```

第一版建议：

> 更新 title 时暂时**不要修改 slug**。

这样逻辑简单，而且旧 URL 不会突然失效。

---

## 8.1 SQL：先查询文章

```sql
SELECT
  id,
  author_id,
  slug
FROM articles
WHERE slug = ?
LIMIT 1;
```

Service 判断：

```ts
article.author_id === req.userId
```

否则：

```text
403 Forbidden
```

---

## 8.2 开启事务

```text
BEGIN
```

### 更新文章

```sql
UPDATE articles
SET
  title = ?,
  description = ?,
  body = ?
WHERE id = ?;
```

如果第一版只支持部分字段更新，可以动态生成 SQL。

---

## 8.3 更新 Tag

最简单可靠的第一版方案：

```text
删除旧关系
   ↓
重新建立新关系
```

删除：

```sql
DELETE FROM article_tags
WHERE article_id = ?;
```

然后针对新的：

```text
tagList
```

重复创建文章时的 Tag 处理：

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

最后：

```text
COMMIT
```

---

# 9. 删除文章

## API

```text
POST /api/articles/delete
```

需要登录。

### Body

```json
{
  "slug": "express-intro-xxxx"
}
```

### SQL 1：查询文章

```sql
SELECT
  id,
  author_id
FROM articles
WHERE slug = ?
LIMIT 1;
```

Service 判断：

```text
文章是否存在
```

以及：

```text
article.author_id === req.userId
```

### SQL 2：删除文章

```sql
DELETE FROM articles
WHERE id = ?;
```

由于当前数据库已经设置：

```text
article_tags.article_id
ON DELETE CASCADE

comments.article_id
ON DELETE CASCADE

favorites.article_id
ON DELETE CASCADE
```

所以删除文章后：

```text
article_tags
comments
favorites
```

对应关系会自动删除。

**不要在 Service 中手动一张表一张表删除。**

---

# 10. Favorite 收藏模块

## 10.1 收藏文章

### API

```text
POST /api/articles/favorite
```

需要登录。

### Body

```json
{
  "slug": "express-intro-xxxx"
}
```

### SQL 1：查询 articleId

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

### SQL 2：收藏

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

因为：

```text
PRIMARY KEY (user_id, article_id)
```

所以同一个用户无法重复收藏同一篇文章。

### SQL 3：收藏数量

```sql
SELECT COUNT(*) AS favorites_count
FROM favorites
WHERE article_id = ?;
```

---

## 10.2 取消收藏

### API

```text
POST /api/articles/unfavorite
```

### Body

```json
{
  "slug": "express-intro-xxxx"
}
```

### SQL 1

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

### SQL 2

```sql
DELETE FROM favorites
WHERE user_id = ?
  AND article_id = ?;
```

---

# 11. Comment 评论模块

## 11.1 获取文章评论

### API

```text
POST /api/articles/comments/list
```

### Body

```json
{
  "slug": "express-intro-xxxx"
}
```

### SQL 1：查询 articleId

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

### SQL 2：查询评论

```sql
SELECT
  comments.id,
  comments.body,
  comments.created_at,
  comments.updated_at,

  users.id AS author_id,
  users.username,
  users.bio,
  users.image

FROM comments

JOIN users
  ON comments.author_id = users.id

WHERE comments.article_id = ?

ORDER BY comments.created_at ASC;
```

---

## 11.2 创建评论

### API

```text
POST /api/articles/comments/create
```

需要登录。

### Body

```json
{
  "slug": "express-intro-xxxx",
  "body": "写得很好"
}
```

### SQL 1

```sql
SELECT id
FROM articles
WHERE slug = ?
LIMIT 1;
```

### SQL 2

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

得到：

```text
commentId = result.insertId
```

### SQL 3：查询刚创建的评论

```sql
SELECT
  comments.id,
  comments.body,
  comments.created_at,
  comments.updated_at,

  users.id AS author_id,
  users.username,
  users.bio,
  users.image

FROM comments

JOIN users
  ON comments.author_id = users.id

WHERE comments.id = ?

LIMIT 1;
```

---

## 11.3 删除评论

### API

```text
POST /api/articles/comments/delete
```

需要登录。

### Body

```json
{
  "slug": "express-intro-xxxx",
  "commentId": 10
}
```

### SQL 1：查询评论

```sql
SELECT
  comments.id,
  comments.article_id,
  comments.author_id
FROM comments

JOIN articles
  ON comments.article_id = articles.id

WHERE comments.id = ?
  AND articles.slug = ?

LIMIT 1;
```

Service 判断：

```text
comment.author_id === req.userId
```

### SQL 2

```sql
DELETE FROM comments
WHERE id = ?;
```

---

# 12. Tag 标签模块

## 12.1 获取所有 Tag

### API

```text
POST /api/tags/list
```

### Body

```json
{}
```

### SQL

```sql
SELECT
  id,
  name
FROM tags
ORDER BY name ASC;
```

返回示例：

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Express"
    },
    {
      "id": 2,
      "name": "MySQL"
    },
    {
      "id": 3,
      "name": "Node.js"
    }
  ]
}
```

前端创建文章页面可以先请求：

```text
POST /api/tags/list
```

显示已有标签。

用户既可以：

```text
选择已有标签
```

也可以：

```text
输入一个新标签
```

最终创建文章时统一提交：

```json
{
  "tagList": [
    "Express",
    "Node.js",
    "NestJS"
  ]
}
```

---

# 13. 为什么暂时不需要 `/api/tags/create`

当前项目推荐：

```text
Tag 的读取
    ↓
POST /api/tags/list

Tag 的创建
    ↓
由 POST /api/articles/create 自动完成
```

所以暂时不需要：

```text
POST /api/tags/create
```

否则前端流程会变成：

```text
发现 NestJS 不存在
   ↓
POST /api/tags/create
   ↓
拿 tagId
   ↓
POST /api/articles/create
```

没有必要。

更简单的是：

```text
前端只提交 tagList
   ↓
后端自己处理 Tag 是否存在
```

---

# 14. 创建文章的模块职责

创建文章以后，代码职责建议如下。

```text
article.controller.ts

接收：
req.body
req.userId

        ↓

article.service.ts

负责整个业务流程：
生成 slug
开启事务
创建文章
处理 tags
建立 article_tags
提交事务
组装返回值

        ↓

Repository
```

建议 Repository：

```text
article.repository.ts
├── create()
├── findById()
├── findBySlug()
├── findList()
├── update()
└── delete()

tag.repository.ts
├── findAll()
├── findById()
├── findByName()
└── createIfNotExists()

article-tag.repository.ts
├── create()
├── deleteByArticleId()
└── findByArticleId()
```

核心原则：

```text
Repository
负责 SQL

Service
负责业务流程
```

---

# 15. 第一阶段暂时不要实现太复杂的文章筛选

RealWorld 后续可能支持：

```text
tag
author
favorited
feed
```

但是当前阶段不建议马上加。

先完成：

```text
POST /api/articles/list

{
  "page": 1,
  "pageSize": 20
}
```

把以下关系真正跑通：

```text
users
  │
  ↓
articles
  │
  ├──────── article_tags ─────── tags
  │
  ├──────── comments
  │
  └──────── favorites
```

等 CRUD 与多表关系稳定以后，再增加：

```json
{
  "page": 1,
  "pageSize": 20,
  "tag": "Express",
  "author": "zhangsan"
}
```

---

# 16. 推荐开发顺序

当前不要同时开发所有接口。

建议严格按照以下顺序：

```text
1. POST /api/users/create
2. POST /api/users/login
3. POST /api/users/getUser
4. POST /api/users/updateUser

        ↓

5. POST /api/tags/list

        ↓

6. POST /api/articles/create
   ├── articles
   ├── tags
   ├── article_tags
   └── transaction

        ↓

7. POST /api/articles/detail

        ↓

8. POST /api/articles/list

        ↓

9. POST /api/articles/update

        ↓

10. POST /api/articles/delete

        ↓

11. favorite / unfavorite

        ↓

12. comments

        ↓

13. profiles / follows
```

其中最重要的一关是：

```text
POST /api/articles/create
```

它第一次真正涉及：

```text
多张表
+
多对多关系
+
事务
+
Service 编排
+
Repository 分层
```

完成这一块后，再开发收藏、评论、关注会顺很多。

---

# 17. 当前版本最终接口清单

```text
# User

POST /api/users/create
POST /api/users/login
POST /api/users/getUser
POST /api/users/updateUser


# Profile

POST /api/profiles/get
POST /api/profiles/follow
POST /api/profiles/unfollow


# Article

POST /api/articles/list
POST /api/articles/detail
POST /api/articles/create
POST /api/articles/update
POST /api/articles/delete


# Favorite

POST /api/articles/favorite
POST /api/articles/unfavorite


# Comment

POST /api/articles/comments/list
POST /api/articles/comments/create
POST /api/articles/comments/delete


# Tag

POST /api/tags/list
```

---

# 18. 当前最重要的 CreateArticle 数据结构

Zod 可以设计为：

```ts
export const CreateArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(255),

  description: z
    .string()
    .trim()
    .min(1)
    .max(500),

  body: z
    .string()
    .trim()
    .min(1),

  tagList: z
    .array(
      z.string()
        .trim()
        .min(1)
        .max(100)
    )
    .max(10)
    .default([])
})
```

请求：

```json
{
  "title": "Express 后端学习",
  "description": "学习多表关系",
  "body": "正文...",
  "tagList": [
    "Express",
    "Node.js",
    "MySQL"
  ]
}
```

后端最终负责：

```text
articles       创建文章
tags           自动补充不存在的标签
article_tags   建立文章与标签的多对多关系
```

这就是当前项目里 Tag 最合适的处理方式。
