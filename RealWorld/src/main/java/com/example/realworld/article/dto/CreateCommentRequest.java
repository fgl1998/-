package com.example.realworld.article.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCommentRequest {
    private String body;
    private Long articleId;

    @NotBlank(message = "Article ID cannot be blank")
    public Long getArticleId() {
        return articleId;
    }

    @NotBlank(message = "Body cannot be blank")
    public String getBody() {
        return body;
    }
}
