package com.example.realworld.file3;

/** 文件表的一行；图片内容在磁盘上，这里只记录图片的信息。 */
public record File3Record(String fileId, String contentType, long fileSize) {
}
