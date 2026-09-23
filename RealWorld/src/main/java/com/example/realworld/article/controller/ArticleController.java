package com.example.realworld.article.controller;

import com.example.realworld.article.dto.CreateArticleRequest;
import com.example.realworld.article.dto.QueryArticleRequest;
import com.example.realworld.article.entity.ArticleQueryRow;
import com.example.realworld.article.service.ArticleService;
import com.example.realworld.common.PageResult;
import com.example.realworld.common.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping("/create")
    public Result<Long> createArticle(@Valid @RequestBody CreateArticleRequest request, HttpServletRequest httpServletRequest) {
        Long currentUserId = (Long) httpServletRequest.getAttribute("currentUserId");
        Long articleId = articleService.create(request,currentUserId);
        return Result.success(articleId);
    }

    @PostMapping("/queryArticles")
    public Result<PageResult<ArticleQueryRow>> queryArticles(@Valid @RequestBody QueryArticleRequest request, HttpServletRequest httpServletRequest){
        Long currentUserId = (Long) httpServletRequest.getAttribute("currentUserId");
        String keyWord = request.getKeyWord();
        int pageNumber = request.getPageNumber();
        int pageSize = request.getPageSize();
        PageResult<ArticleQueryRow> queryResult = articleService.queryArticles(currentUserId, keyWord, pageSize, pageNumber);
        return Result.success(queryResult);
    }
}
