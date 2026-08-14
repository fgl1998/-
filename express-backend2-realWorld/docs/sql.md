CREATE DATABASE realworld
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  bio TEXT NULL,
  image VARCHAR(500) NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
);
<!-- PRIMARY KEY (id),PRIMARY会建立主键索引
UNIQUE KEY uk_users_username (username),UNIQUE会建立唯一索引 -->

CREATE TABLE articles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  unique key uk_articles_slug (slug),

  KEY idx_articles_author_id (author_id),

  CONSTRAINT fk_articles_author
    FOREIGN KEY (author_id)
    REFERENCES users (id)
)

CREATE TABLE comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  article_id INT UNSIGNED NOT NULL,
  author_id INT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  Key idx_comments_article_id (article_id),
  Key idx_comments_author_id (author_id),

  CONSTRAINT fk_comments_article
    FOREIGN KEY (article_id)
    REFERENCES articles (id)
    ON DELETE CASCADE,

  ConSTRAINT fk_comments_author
    FOREIGN KEY (author_id)
    REFERENCES users (id)
)

CREATE TABLE tags (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_tags_name (name)
)

CREATE TABLE article_tags (
  article_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,

  PRIMARY KEY (article_id, tag_id),

  KEY idx_article_tags_tag_id (tag_id),

  CONSTRAINT fk_article_tags_article
    FOREIGN KEY (article_id)
    References articles (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_article_tags_tag
    FOREIGN KEY (tag_id)
    References tags (id)
    ON DELETE CASCADE
)

CREATE TABLE favorites (
  user_id INT UNSIGNED NOT NULL,
  article_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,


  PRIMARY KEY (user_id, article_id),
  KEY idx_favorites_article_id (article_id),

  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id)
    References users (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_favorites_article
    FOREIGN KEY (article_id)
    References articles (id)
    ON DELETE CASCADE
)

CREATE TABLE follows (
  follower_id INT UNSIGNED NOT NULL,
  following_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (follower_id, following_id),

  KEY idx_follows_following_id (following_id),

  CONSTRAINT fk_follows_follower
    FOREIGN KEY (follower_id)
    References users (id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_follows_following
    FOREIGN KEY (following_id)
    References users (id)
    ON DELETE CASCADE
)