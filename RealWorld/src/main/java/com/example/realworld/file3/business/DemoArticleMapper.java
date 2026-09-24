package com.example.realworld.file3.business;

import org.apache.ibatis.annotations.Arg;
import org.apache.ibatis.annotations.ConstructorArgs;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface DemoArticleMapper {

    @Insert("""
            INSERT INTO file3_articles (article_id, title, cover_file_id)
            VALUES (#{articleId}, #{title}, #{coverFileId})
            """)
    int insert(DemoArticle article);

    @Select("""
            SELECT article_id, title, cover_file_id
            FROM file3_articles WHERE article_id = #{articleId}
            """)
    @ConstructorArgs({
            @Arg(column = "article_id", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "cover_file_id", javaType = String.class)
    })
    DemoArticle findById(@Param("articleId") String articleId);
}
