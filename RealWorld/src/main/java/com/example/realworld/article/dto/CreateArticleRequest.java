package com.example.realworld.article.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreateArticleRequest {
    @NotBlank(message = "标题不能为空")
    @Size(max=100,message = "标题不能超过100个字符")
    private String title;

    @NotBlank(message = "描述不能为空")
    @Size(max=255,message = "描述不能超过255个字符")
    private String description;
    @NotBlank(message = "内容不能为空")
    private String body;

    @NotEmpty(message = "标签不能为空")
    private List<Long> tagsId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getBody() {
        return body;
    }
    public void setBody(String body) {
        this.body = body;
    }
    public List<Long> getTagsId() {
        return tagsId;
    }
    public void setTagsId(List<Long> tagsId) {
        this.tagsId = tagsId;
    }
}
