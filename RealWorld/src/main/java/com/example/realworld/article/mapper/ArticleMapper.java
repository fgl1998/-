package com.example.realworld.article.mapper;

import com.example.realworld.article.entity.Article;
import com.example.realworld.article.entity.ArticleTag;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArticleMapper {
    @Insert("""
            INSERT INTO articles(title,description,body,author_id,slug)
            VALUES(#{title},#{description},#{body},#{authorId},#{slug})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertArticle(Article article);

    @Insert("""
            <script>
            INSERT INTO article_tags (article_id, tag_id)
            VALUES
            <foreach collection="tagIds" item="tagId" separator=",">
                (#{articleId}, #{tagId})
            </foreach>
            </script>
            """)
    int insertArticleTags(@Param("articleId") Long articleId, @Param("tagIds") List<Long> tagIds);
}
