package com.example.realworld.article.dto;

import jakarta.validation.constraints.Min;

public class QueryArticleRequest {

    private String keyWord;
    @Min(value = 1, message = "页码必须大于等于1")
    private int pageNumber;
    @Min(value = 1, message = "页大小必须大于等于1")
    private int pageSize;

    public int getPageNumber() {
        return pageNumber;
    }
    public int getPageSize() {
        return pageSize;
    }
    public String getKeyWord() {
        return keyWord;
    }
}
