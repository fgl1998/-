package com.example.realworld.article.controller;

import com.example.realworld.article.dto.CreateArticleRequest;
import com.example.realworld.article.service.ArticleService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @PostMapping("/create")
    public ResponseEntity<Long> createArticle(@Valid @RequestBody CreateArticleRequest request, HttpServletRequest httpServletRequest) {
        Long currentUserId = (Long) httpServletRequest.getAttribute("currentUserId");
        Long articleId = articleService.create(request,currentUserId);
        return ResponseEntity.ok(articleId);
    }
}
