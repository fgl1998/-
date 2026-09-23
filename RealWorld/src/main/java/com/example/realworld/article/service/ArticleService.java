package com.example.realworld.article.service;

import com.example.realworld.article.dto.CreateArticleRequest;
import com.example.realworld.article.entity.Article;
import com.example.realworld.article.mapper.ArticleMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class ArticleService {
    private final ArticleMapper articleMapper;

    public ArticleService(ArticleMapper articleMapper) {
        this.articleMapper = articleMapper;
    }

    @Transactional
    public Long create(CreateArticleRequest request,Long currentUserId){
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setDescription(request.getDescription());
        article.setBody(request.getBody());
        article.setAuthorId(currentUserId);
        article.setSlug(generateSlug(request.getTitle()));
        articleMapper.insertArticle(article);

        if(!request.getTagsId().isEmpty()){
            articleMapper.insertArticleTags(article.getId(), request.getTagsId());
        }

        return article.getId();
    }

    private String generateSlug(String title) {
        String normalized = title
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5\\s-]", "")
                .replaceAll("[\\s_-]+", "-")
                .replaceAll("^-+|-+$", "");

        String suffix = UUID.randomUUID().toString().substring(0, 8);

        return !normalized.isBlank()
                ? normalized + "-" + suffix
                : "article-" + suffix;
    }
}
