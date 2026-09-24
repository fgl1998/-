-- 在 application.properties 配置的 realworld 数据库中执行一次。
-- 只创建 file3 的演示表。

CREATE TABLE IF NOT EXISTS file3_files (
    file_id CHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT '文件ID，也用作磁盘文件名',
    content_type VARCHAR(100) NOT NULL COMMENT '例如 image/png，用于浏览器显示图片',
    file_size BIGINT NOT NULL COMMENT '文件字节数',
    PRIMARY KEY (file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS file3_articles (
    article_id CHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    title VARCHAR(120) NOT NULL,
    cover_file_id CHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT '引用上传接口返回的fileId',
    PRIMARY KEY (article_id),
    CONSTRAINT fk_file3_article_cover FOREIGN KEY (cover_file_id) REFERENCES file3_files (file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
