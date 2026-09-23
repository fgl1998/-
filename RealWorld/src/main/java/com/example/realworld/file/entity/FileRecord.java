package com.example.realworld.file.entity;

//public class FileRecord {
//}
public record FileRecord(
        String fileId,
        String originalName,
        String contentType,
        Long fileSize,
        String storageType,
        String objectKey,
        Long uploaderId
) {
}