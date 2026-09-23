package com.example.realworld.article.mapper;

import com.example.realworld.article.entity.Article;
import com.example.realworld.article.entity.ArticleQueryRow;
import com.example.realworld.article.entity.ArticleTag;
import org.apache.ibatis.annotations.*;

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

    @Select("""
            SELECT
                    a.id,
                    a.slug,
                    a.title,
                    a.description,
                    a.body,
                    a.created_at,
                    a.updated_at,
                    a.author_id,
                    u.username AS author_username,
                    u.bio AS author_bio,
                    u.image AS author_image,
                    
                    EXISTS(
                      SELECT 1
                      FROM favorites f
                      WHERE f.user_id = #{userId}
                      AND f.article_id = a.id
                    ) AS favorited,
                    
                    (
                    SELECT COUNT(*)
                    FROM favorites f
                    WHERE f.article_id = a.id
                    ) AS favorites_count
                    
                  FROM articles a
                  JOIN users u ON a.author_id = u.id
                  WHERE a.title LIKE CONCAT('%', COALESCE(#{keyword}, ''), '%')
                  ORDER BY a.created_at DESC
                  LIMIT #{limit} OFFSET #{offset}
            """)
    List<ArticleQueryRow> queryArticles(
            @Param("userId") Long userId,
            @Param("keyword") String keyword,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Select("""
        SELECT COUNT(*)
        FROM articles a
        WHERE a.title LIKE CONCAT('%', COALESCE(#{keyword}, ''), '%')
        """)
    long countArticles(@Param("keyword") String keyword);
}
