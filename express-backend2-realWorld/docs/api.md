users
- POST /api/users              注册 
  
  ```
  INSERT INTO users (username, email, password_hash)
  VALUES ('lisi', 'lisi@test.com', 'fake_hash_124');
  ```
  
- POST /api/users/login        登录
  ```
  SELECT id,username,eamil,password_hash FROM users WHERE email = 'lisi@test.com';
  然后拿密码去比较
  ```

- GET  /api/user               获取当前用户
  ```
  SELECT id,username,email,bio,image,created_at,updated_at FROM users WHERE id = '1' LIMIT 1;
  ```

- PUT  /api/user               更新当前用户
  ```
  UPDATE users SET username = 'lisi', email = 'lisi@test.com', password_hash = 'fake_hash_124' WHERE id = '2';
  ```

profiles
- GET    /api/profiles/:username
- POST   /api/profiles/:username/follow
- DELETE /api/profiles/:username/follow

articles
- GET    /api/articles
  ```
  SELECT
    id,
    slug,
    title,
    description,
    body,
    author_id,
    created_at,
    updated_at,
    user.id AS author_id,
    user.username AS username,
    user.bio AS bio,
    user.image AS image
  FROM articles
  JOIN users ON articles.author_id = users.id
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?;
  ```
- GET    /api/articles/:slug
- POST   /api/articles
- PUT    /api/articles/:slug
- DELETE /api/articles/:slug

favorites
- POST   /api/articles/:slug/favorite
- DELETE /api/articles/:slug/favorite

comments
- GET    /api/articles/:slug/comments
- POST   /api/articles/:slug/comments
- DELETE /api/articles/:slug/comments/:id

tags
- GET /api/tags

| HTTP  | 含义                    | 使用场景         |
| ----- | --------------------- | ------------ |
| `200` | OK                    | 查询、修改、登录等成功  |
| `201` | Created               | 创建用户、文章、评论   |
| `204` | No Content            | 删除成功且不需要返回数据 |
| `400` | Bad Request           | 参数格式、参数校验错误  |
| `401` | Unauthorized          | 未登录、Token 无效 |
| `403` | Forbidden             | 已登录，但没有权限    |
| `404` | Not Found             | 用户、文章、评论不存在  |
| `409` | Conflict              | 邮箱重复、用户名重复等  |
| `429` | Too Many Requests     | 以后做限流时使用     |
| `500` | Internal Server Error | 未知服务器错误      |
