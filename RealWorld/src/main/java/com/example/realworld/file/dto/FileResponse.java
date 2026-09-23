package com.example.realworld.file.dto;

import com.example.realworld.file.entity.FileRecord;

//public class FileResponse {
//}
public record FileResponse(
        String fileId,
        String originalName,
        Long fileSize,
        String downloadUrl
) {
    public static FileResponse from(FileRecord file) {
        return new FileResponse(
                file.fileId(),
                file.originalName(),
                file.fileSize(),
                "/api/files/" + file.fileId() + "/download"
        );
    }
}