package com.example.realworld.file3.business;

/** 演示业务：文章只保存封面的 fileId，不保存磁盘路径或图片内容。 */
public record DemoArticle(String articleId, String title, String coverFileId) {
}
