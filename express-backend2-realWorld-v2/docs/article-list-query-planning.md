# 文章列表多表查询规划

## 1. 核心原则

规划文章列表 SQL 时，最重要的原则是：

> 主查询必须保证“一篇文章只返回一行”；会让一篇文章变成多行的数据，应当聚合或者拆成单独的批量查询。

这就是查询的“粒度”。

文章列表接口的主对象是文章，因此主查询粒度是：

```text
一行 = 一篇文章
```

例如数据库中有两篇文章，主查询最终也应该返回两行：

```text
article 1 + 相关单值信息
article 2 + 相关单值信息
```

这样 `LIMIT` 和 `OFFSET` 才表示文章的分页，而不是文章与关联记录组合结果的分页。

---

## 2. 从 articles 开始主查询

文章列表的主对象是文章，所以查询从 `articles` 开始：

```sql
SELECT
  articles.id,
  articles.slug,
  articles.title,
  articles.description,
  articles.body,
  articles.author_id,
  articles.created_at,
  articles.updated_at
FROM articles;
```

此时：

```text
一行 = 一篇文章
```

---

## 3. 作者为什么可以 JOIN

文章和作者的关系是：

```text
一篇文章只有一个作者
一个作者可以有多篇文章
```

从文章角度看，这是多对一关系：

```text
articles → users = 多对一
```

因此可以直接联表：

```sql
FROM articles
JOIN users
  ON users.id = articles.author_id
```

联表前有两篇文章，联表后仍然是两行：

```text
article 1 + author 10
article 2 + author 20
```

这个 JOIN 没有改变“一行一篇文章”的粒度，所以作者适合放进主查询。

---

## 4. 关注状态为什么使用 EXISTS

文章接口通常不需要返回完整的关注记录，只需要回答：

```text
当前用户有没有关注文章作者？
```

这是一个布尔判断，适合使用 `EXISTS`：

```sql
EXISTS (
  SELECT 1
  FROM follows
  WHERE follows.follower_id = ?
    AND follows.following_id = articles.author_id
) AS following
```

结果是：

```text
following = 0
```

或者：

```text
following = 1
```

它只给每篇文章增加一个标量字段，不会增加查询行数，因此可以放进主查询。

---

## 5. 收藏状态和收藏数量

文章接口通常需要两个不同的收藏信息：

```text
favorited       当前用户是否收藏
favoritesCount  文章的收藏总数
```

### 5.1 当前用户是否收藏

这是布尔判断，使用 `EXISTS`：

```sql
EXISTS (
  SELECT 1
  FROM favorites
  WHERE favorites.user_id = ?
    AND favorites.article_id = articles.id
) AS favorited
```

结果是：

```text
favorited = 0 或 1
```

### 5.2 文章收藏总数

这是统计问题，使用 `COUNT`：

```sql
(
  SELECT COUNT(*)
  FROM favorites
  WHERE favorites.article_id = articles.id
) AS favorites_count
```

结果是一个数字：

```text
favorites_count = 10
```

`EXISTS` 和 `COUNT` 都会把关联表的数据压缩成一个值，不会改变“一行一篇文章”的主查询粒度。

---

## 6. 文章列表主查询 SQL

主查询负责获取：

```text
articles            文章字段
users               作者字段
EXISTS follows      是否关注作者
EXISTS favorites    是否收藏文章
COUNT favorites     收藏总数
```

示例 SQL：

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

返回结果仍然满足：

```text
一行 = 一篇文章
```

对应的查询结果类型可以命名为：

```ts
interface ArticleListRow extends RowDataPacket {
  id: number
  slug: string
  title: string
  description: string
  body: string
  author_id: number
  created_at: Date
  updated_at: Date

  author_username: string
  author_bio: string | null
  author_image: string | null

  following: number
  favorited: number
  favorites_count: number
}
```

`ArticleListRow` 的边界由这条 SQL 的 `SELECT` 结果决定。

---

## 7. 标签为什么单独查询

文章和标签是多对多关系：

```text
一篇文章可以有多个标签
一个标签也可以属于多篇文章
```

例如一篇文章有三个标签：

```text
文章 1
├── TypeScript
├── Node.js
└── Express
```

如果主查询直接 JOIN 标签，一篇文章会变成三行：

```text
文章 1 + TypeScript
文章 1 + Node.js
文章 1 + Express
```

此时查询粒度变成：

```text
一行 = 一篇文章和一个标签的绑定关系
```

这会破坏文章列表的分页和主查询结构，所以标签适合拆成第二条批量 SQL。

---

## 8. 标签批量查询 SQL

主查询得到当前页的文章 ID 后，批量查询这些文章的全部标签：

```sql
SELECT
  article_tags.article_id,
  tags.id AS tag_id,
  tags.name AS tag_name
FROM article_tags
JOIN tags
  ON tags.id = article_tags.tag_id
WHERE article_tags.article_id IN (?, ?, ?);
```

第二条 SQL 的粒度是：

```text
一行 = 一篇文章和一个标签的绑定关系
```

对应类型：

```ts
interface ArticleTagRow extends RowDataPacket {
  article_id: number
  tag_id: number
  tag_name: string
}
```

查询结果示例：

```ts
[
  {
    article_id: 1,
    tag_id: 10,
    tag_name: 'TypeScript'
  },
  {
    article_id: 1,
    tag_id: 11,
    tag_name: 'Node.js'
  },
  {
    article_id: 2,
    tag_id: 12,
    tag_name: 'Express'
  }
]
```

代码层根据 `article_id` 对标签进行分组，再和 `ArticleListRow[]` 合并。

---

## 9. 为什么不同时 JOIN 标签和收藏记录

假设一篇文章有：

```text
3 个标签
4 条收藏记录
```

如果同时 JOIN 标签表和收藏表，结果可能不是 `3 + 4 = 7` 行，而是：

```text
3 × 4 = 12 行
```

因为每个标签都会和每条收藏记录组合：

```text
标签 A + 收藏用户 1
标签 A + 收藏用户 2
标签 A + 收藏用户 3
标签 A + 收藏用户 4

标签 B + 收藏用户 1
标签 B + 收藏用户 2
...
```

这叫作行数膨胀。

所以不同数据采用不同方式处理：

```text
收藏状态：EXISTS，压缩为一个布尔值
收藏数量：COUNT，压缩为一个数字
标签列表：保留多行，单独批量查询
```

---

## 10. 两条 SQL 的边界与组装

第一条 SQL：

```text
一行 = 一篇文章及其单值关联信息
```

对应：

```text
ArticleListRow[]
```

第二条 SQL：

```text
一行 = 一篇文章和一个标签的关系
```

对应：

```text
ArticleTagRow[]
```

最终组合流程：

```text
ArticleListRow[]
        +
ArticleTagRow[]
        ↓ 按 article_id 分组
     Article[]
```

Mapper 可以接收一篇文章的主查询结果和已经分组的标签：

```ts
function toArticle(
  row: ArticleListRow,
  tags: Tag[]
): Article {
  // 将数据库查询结果组装成最终业务对象
}
```

---

## 11. 通用查询规划步骤

以后规划其他接口时，可以按照以下步骤处理。

### 11.1 确定接口的主对象

```text
文章列表：主对象是 Article
评论列表：主对象是 Comment
用户列表：主对象是 User
```

### 11.2 确定主查询粒度

```text
文章列表：一行一篇文章
评论列表：一行一条评论
用户列表：一行一个用户
```

### 11.3 判断关联数据类型

| 需要的数据 | 示例 | 推荐方式 |
|---|---|---|
| 一个关联对象 | 文章作者 | `JOIN` |
| 布尔判断 | 是否关注、是否收藏 | `EXISTS` |
| 数字统计 | 收藏数量、评论数量 | `COUNT` |
| 多个关联对象 | 标签、评论列表 | 单独批量查询 |

### 11.4 检查是否改变主查询粒度

每增加一个 JOIN，都需要询问：

> 加入这张表以后，一篇文章还只返回一行吗？

如果答案是“是”，可以考虑放进主查询。

如果答案是“否”，可以选择：

```text
单独批量查询
聚合为单值
使用 JSON 聚合
```

---

## 12. 最终决策规则

| 数据关系或场景 | 推荐处理方式 |
|---|---|
| 一对一 | `JOIN` |
| 多对一 | `JOIN` |
| 简单布尔判断 | `EXISTS` |
| 简单数字统计 | `COUNT` 或聚合子查询 |
| 一对多 | 单独批量查询 |
| 多对多 | 单独批量查询 |
| JOIN 后产生大量重复行 | 拆分查询 |
| 每篇文章单独查询关联数据 | 不推荐，会产生 N+1 |
| 固定两到四条批量查询 | 可以接受 |

最核心的判断不是接口涉及多少张表，而是：

> 加入这份数据后，会不会改变一行所代表的业务含义。

