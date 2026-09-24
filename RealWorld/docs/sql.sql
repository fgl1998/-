CREATE TABLE stored_files (
                              file_id CHAR(32) CHARACTER SET ascii COLLATE ascii_bin
                                                         NOT NULL COMMENT '业务引用的文件ID',

                              original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
                              content_type VARCHAR(255) NOT NULL COMMENT '上传时声明的文件类型',
                              file_size BIGINT NOT NULL COMMENT '字节数',

                              storage_type VARCHAR(20) NOT NULL COMMENT 'LOCAL 或 OSS',
                              object_key VARCHAR(255) NOT NULL COMMENT '相对于存储根目录的键',

                              uploader_id BIGINT NOT NULL COMMENT '上传用户ID',
                              status VARCHAR(20) NOT NULL DEFAULT 'UPLOADING'
                                  COMMENT 'UPLOADING：未完成，READY：可用',

                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

                              PRIMARY KEY (file_id),
                              UNIQUE KEY uk_storage_object (storage_type, object_key),
                              KEY idx_uploader (uploader_id),
                              KEY idx_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;