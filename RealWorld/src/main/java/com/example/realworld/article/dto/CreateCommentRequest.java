package com.example.realworld.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCommentRequest {
    private String body;
    private Long articleId;

    @NotNull(message = "Article ID cannot be null")
    public Long getArticleId() {
        return articleId;
    }

    @NotBlank(message = "Body cannot be blank")
    public String getBody() {
        return body;
    }
}
