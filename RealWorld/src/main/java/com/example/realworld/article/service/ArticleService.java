package com.example.realworld.article.service;

import com.example.realworld.article.dto.CreateArticleRequest;
import com.example.realworld.article.entity.Article;
import com.example.realworld.article.entity.ArticleQueryRow;
import com.example.realworld.article.mapper.ArticleMapper;
import com.example.realworld.common.PageResult;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.transform.Result;
import java.util.List;
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

    public PageResult<ArticleQueryRow> queryArticles(Long currentUserId, String keyword, int pageSize, int pageNumber){
        if(pageSize>100){
            pageSize = 100;
        }
        int offset = (pageNumber - 1) * pageSize;
        long total = articleMapper.countArticles(keyword);
        List<ArticleQueryRow> list = total==0
                ?List.of()
                :articleMapper.queryArticles(currentUserId, keyword, pageSize, offset);
        return new PageResult<>(list,total,pageSize,pageNumber);
    }
}
