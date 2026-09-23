package com.example.realworld.file.mapper;

import com.example.realworld.file.entity.FileRecord;
import org.apache.ibatis.annotations.*;

@Mapper
public interface FileMapper {
    @Insert("""
            INSERT INTO stored_files (
                file_id, original_name, content_type, file_size,
                storage_type, object_key, uploader_id, status
            )
            VALUES (
                #{fileId}, #{originalName}, #{contentType}, #{fileSize},
                #{storageType}, #{objectKey}, #{uploaderId}, 'UPLOADING'
            )
            """)
    int insertUploading(FileRecord file);

    @Update("""
            UPDATE stored_files
            SET status = 'READY'
            WHERE file_id = #{fileId}
              AND status = 'UPLOADING'
            """)
    int markReady(@Param("fileId") String fileId);

    @Select("""
            SELECT file_id, original_name, content_type, file_size,
                   storage_type, object_key, uploader_id
            FROM stored_files
            WHERE file_id = #{fileId}
              AND status = 'READY'
            """)
    @ConstructorArgs({
            @Arg(column = "file_id", javaType = String.class),
            @Arg(column = "original_name", javaType = String.class),
            @Arg(column = "content_type", javaType = String.class),
            @Arg(column = "file_size", javaType = Long.class),
            @Arg(column = "storage_type", javaType = String.class),
            @Arg(column = "object_key", javaType = String.class),
            @Arg(column = "uploader_id", javaType = Long.class)
    })
    FileRecord findReadyById(@Param("fileId") String fileId);
}
