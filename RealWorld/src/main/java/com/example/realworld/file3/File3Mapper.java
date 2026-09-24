package com.example.realworld.file3;

import org.apache.ibatis.annotations.Arg;
import org.apache.ibatis.annotations.ConstructorArgs;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface File3Mapper {

    @Insert("""
            INSERT INTO file3_files (file_id, content_type, file_size)
            VALUES (#{fileId}, #{contentType}, #{fileSize})
            """)
    int insert(File3Record file);

    @Select("""
            SELECT file_id, content_type, file_size
            FROM file3_files WHERE file_id = #{fileId}
            """)
    @ConstructorArgs({
            @Arg(column = "file_id", javaType = String.class),
            @Arg(column = "content_type", javaType = String.class),
            @Arg(column = "file_size", javaType = long.class)
    })
    File3Record findById(@Param("fileId") String fileId);
}
