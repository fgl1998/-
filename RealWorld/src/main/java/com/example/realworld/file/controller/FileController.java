package com.example.realworld.file.controller;

import com.example.realworld.common.Result;
import com.example.realworld.file.dto.FileResponse;
import com.example.realworld.file.service.FileService;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Result<FileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestAttribute("currentUserId") Long currentUserId
    ) {
        return Result.success(
                fileService.upload(file, currentUserId)
        );
    }

    @GetMapping("/{fileId}")
    public Result<FileResponse> metadata(
            @PathVariable("fileId") String fileId,
            @RequestAttribute("currentUserId") Long currentUserId
    ) {
        return Result.success(
                fileService.metadata(fileId, currentUserId)
        );
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> download(
            @PathVariable("fileId") String fileId,
            @RequestAttribute("currentUserId") Long currentUserId
    ) {
        FileService.Download download =
                fileService.download(fileId, currentUserId);

        String disposition = ContentDisposition.attachment()
                .filename(
                        download.file().originalName(),
                        StandardCharsets.UTF_8
                )
                .build()
                .toString();

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(download.file().fileSize())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .header("X-Content-Type-Options", "nosniff")
                .cacheControl(CacheControl.noStore())
                .body(download.resource());
    }
}