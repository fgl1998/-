package com.example.realworld.file3;

import com.example.realworld.common.exception.AppException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

/** 只负责保存和读取图片，不关心图片会用作哪篇文章的封面。 */
@Service
public class File3Service {

    private final File3Mapper fileMapper;
    private final Path uploadDirectory;

    public File3Service(File3Mapper fileMapper,
                        @Value("${app.file3.upload-dir:uploads/file3}") String uploadDirectory) {
        this.fileMapper = fileMapper;
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    public File3Record upload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "FILE3_EMPTY", "请选择非空图片");
        }

        // 这是文件这一部分的 Content-Type，例如 image/png。
        // 整个上传请求的 Content-Type 则是 multipart/form-data。
        String contentType = file.getContentType();
        if (contentType == null || !Set.of("image/png", "image/jpeg", "image/gif", "image/webp")
                .contains(contentType)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "FILE3_TYPE", "请选择 PNG、JPEG、GIF 或 WebP 图片");
        }

        // 1. 生成 fileId。本例直接把 fileId 当作磁盘上的文件名。
        String fileId = UUID.randomUUID().toString().replace("-", "");
        Files.createDirectories(uploadDirectory);
        Path target = uploadDirectory.resolve(fileId);

        // 2. 图片内容保存到磁盘，文件信息保存到数据库。
        File3Record record = new File3Record(fileId, contentType, file.getSize());
        try {
            file.transferTo(target);
            if (fileMapper.insert(record) != 1) {
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "FILE3_SAVE", "保存文件记录失败");
            }
        } catch (IOException | RuntimeException exception) {
            // 本次上传失败时，尽量清理已经写入的文件。
            try {
                Files.deleteIfExists(target);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }
            throw exception;
        }

        // 3. 两处都保存完成，才把 fileId 交给调用者。
        return record;
    }

    /** 查数据库记录并确认图片还在。图片不存在时返回 null，没有用户权限判断。 */
    public File3Record find(String fileId) {
        // 限定为自己生成的 ID，避免把任意字符串当作磁盘路径。
        if (fileId == null || !fileId.matches("[0-9a-f]{32}")) {
            return null;
        }
        File3Record record = fileMapper.findById(fileId);
        Path target = uploadDirectory.resolve(fileId);
        if (record == null || !Files.isRegularFile(target) || !Files.isReadable(target)) {
            return null;
        }
        return record;
    }

    /** Resource 代表要交给 Spring 读取并写入 HTTP 响应的磁盘文件。 */
    public Resource resource(File3Record file) {
        return new FileSystemResource(uploadDirectory.resolve(file.fileId()));
    }
}
