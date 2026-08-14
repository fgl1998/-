Table users {
  id int [pk, increment]
  username varchar(50) [not null, unique]
  email varchar(255) [not null, unique]
  created_at timestamp [not null]
  updated_at timestamp [not null]
}
Table articles {
  id int [pk, increment]
  author_id int [not null]
  created_at timestamp [not null]
  updated_at timestamp [not null]
}

Ref: articles.author_id > users.id

Table comments {
  id int [pk,increment]
  article_id int [not null]
  author_id int [not null]
}
Ref: comments.author_id > users.id
Ref: comments.article_id > articles.id

Table favorites {
  id int [pk,increment]
  article_id int [not null]
  user_id int [not null]
}

Ref: favorites.user_id > users.id
Ref: favorites.article_id > articles.id

Table tags {
  id int [pk,increment]
}

Table article_tags {
  id int [pk,increment]
  article_id int [not null]
  tag_id int [not null]
}
Ref: article_tags.article_id > articles.id
Ref: article_tags.tag_id > tags.id

Table follows {
  id int [pk,increment]
  follower_id int [not null]
  following_id int [not null]
}
Ref: follows.follower_id > users.id
Ref: follows.following_id > users.id