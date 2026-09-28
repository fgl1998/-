package com.example.realworld.article.entity;

import java.time.LocalDateTime;

public class CommentQueryRow {
    private Long id;
    private Long articleId;
    private Long authorId;
    private String body;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String authorUsername;
    private String authorBio;
    private String authorImage;
    private Boolean following;
}
