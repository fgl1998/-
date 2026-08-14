Table users {
  id int [pk, increment]
  username varchar(50) [not null, unique]
  email varchar(255) [not null, unique]
  password_hash varchar(255) [not null]
  bio text
  image varchar(500)
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Table articles {
  id int [pk, increment]
  author_id int [not null]

  slug varchar(255) [not null, unique]
  title varchar(255) [not null]
  description varchar(500) [not null]
  body text [not null]

  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Ref: articles.author_id > users.id

Table comments {
  id int [pk, increment]

  article_id int [not null]
  author_id int [not null]

  body text [not null]

  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Ref: comments.article_id > articles.id [delete: cascade]
Ref: comments.author_id > users.id

Table tags {
  id int [pk, increment]
  name varchar(100) [not null, unique]
  created_at timestamp [not null]
}
<!-- 同一篇文章，不能重复绑定同一个标签 -->
Table article_tags {
  article_id int [not null]
  tag_id int [not null]

  indexes {
    (article_id, tag_id) [unique]
  }
}

Ref: article_tags.article_id > articles.id [delete: cascade]
Ref: article_tags.tag_id > tags.id [delete: cascade]

Table favorites {
  user_id int [not null]
  article_id int [not null]
  created_at timestamp [not null]

  indexes {
    (user_id, article_id) [unique]
  }
}

Ref: favorites.user_id > users.id [delete: cascade]
Ref: favorites.article_id > articles.id [delete: cascade]

Table follows {
  follower_id int [not null]
  following_id int [not null]
  created_at timestamp [not null]

  indexes {
    (follower_id, following_id) [unique]
  }
}

Ref: follows.follower_id > users.id [delete: cascade]
Ref: follows.following_id > users.id [delete: cascade]

<!-- 为什么一定要外键才有 cascade
CASCADE 不是单独使用的。 -->
<!-- 先建立父子关系
        ↓
FOREIGN KEY

再规定父数据删除时怎么办
        ↓
ON DELETE CASCADE -->
<!-- FOREIGN KEY (自己的外键字段)
REFERENCES 父表(父表主键)
ON DELETE CASCADE -->