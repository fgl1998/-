package com.example.realworld.file3;

import com.example.realworld.common.Result;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/** 公共文件接口：上传图片，以及通过 fileId 查看图片。 */
@RestController
@RequestMapping("/file3/files")
public class File3Controller {

    private final File3Service fileService;

    public File3Controller(File3Service fileService) {
        this.fileService = fileService;
    }

    // 第一次请求：form-data 上传图片，返回 JSON 中的 fileId 和访问地址。
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<UploadResponse> upload(
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        File3Record saved = fileService.upload(file);
        return Result.success(new UploadResponse(saved.fileId(), "/file3/files/" + saved.fileId()));
    }

    // 浏览器或 <img> 发起 GET 请求：这里返回图片内容，而不是 Result 包装的 JSON。
    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> image(@PathVariable("fileId") String fileId) throws IOException {
        File3Record file = fileService.find(fileId);
        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileService.resource(file);
        return ResponseEntity.ok()
                // 告诉浏览器响应体是图片，例如 image/png。
                .contentType(MediaType.parseMediaType(file.contentType()))
                .contentLength(resource.contentLength())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);
    }

    // record 是保存几个字段的数据类，Spring 会把它转换成 JSON。
    public record UploadResponse(String fileId, String url) {
    }
}
