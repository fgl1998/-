package com.example.realworld.file.service;

import com.example.realworld.common.exception.AppException;
import com.example.realworld.common.exception.UnauthorizedException;
import com.example.realworld.file.dto.FileResponse;
import com.example.realworld.file.entity.FileRecord;
import com.example.realworld.file.mapper.FileMapper;
import com.example.realworld.file.storage.FileStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class FileService {

    private static final Logger log =
            LoggerFactory.getLogger(FileService.class);

    private final FileMapper fileMapper;
    private final Map<String, FileStorage> storages;
    private final FileStorage uploadStorage;

    public FileService(
            FileMapper fileMapper,
            List<FileStorage> storageList,
            @Value("${app.file.active-storage:LOCAL}") String activeStorage
    ) {
        this.fileMapper = fileMapper;

        this.storages = storageList.stream()
                .collect(Collectors.toUnmodifiableMap(
                        FileStorage::type,
                        Function.identity()
                ));

        this.uploadStorage = storages.get(activeStorage);

        if (uploadStorage == null) {
            throw new IllegalStateException(
                    "未配置文件存储实现：" + activeStorage
            );
        }
    }

    /*
     * 不把数据库操作和磁盘操作放进一个数据库事务。
     * UPLOADING 记录先独立提交，文件写完后再更新为 READY。
     */
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public FileResponse upload(MultipartFile file, Long currentUserId) {
        requireLogin(currentUserId);

        if (file == null || file.isEmpty()) {
            throw error(HttpStatus.BAD_REQUEST, "文件不能为空");
        }

        String originalName = normalizeName(file.getOriginalFilename());

        String contentType = file.getContentType();
        if (contentType == null || contentType.length() > 255) {
            contentType = "application/octet-stream";
        }

        String fileId = randomId();

        String objectKey = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                + "/" + randomId();

        FileRecord record = new FileRecord(
                fileId,
                originalName,
                contentType,
                file.getSize(),
                uploadStorage.type(),
                objectKey,
                currentUserId
        );

        // 先留下可追踪的记录
        if (fileMapper.insertUploading(record) != 1) {
            throw error(HttpStatus.INTERNAL_SERVER_ERROR, "创建文件记录失败");
        }

        try (InputStream input = file.getInputStream()) {
            uploadStorage.write(
                    objectKey,
                    input,
                    file.getSize(),
                    contentType
            );
        } catch (IOException | RuntimeException exception) {
            log.error("写入文件失败，fileId={}", fileId, exception);
            throw error(HttpStatus.INTERNAL_SERVER_ERROR, "文件上传失败");
        }

        /*
         * 如果这里失败，不立即删除真实文件。
         * 数据库提交结果可能不确定，保留文件供后续核对。
         */
        try {
            if (fileMapper.markReady(fileId) != 1) {
                throw new IllegalStateException("文件状态更新失败");
            }
        } catch (RuntimeException exception) {
            log.error("更新文件状态失败，fileId={}", fileId, exception);
            throw error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "文件状态确认失败，请稍后重试"
            );
        }

        return FileResponse.from(record);
    }

    public FileResponse metadata(String fileId, Long currentUserId) {
        return FileResponse.from(
                requireOwnedReady(fileId, currentUserId)
        );
    }

    /*
     * 业务保存 fileId 前也调用此方法：
     * 校验文件已经上传完成，且属于当前用户。
     */
    public FileRecord requireOwnedReady(
            String fileId,
            Long currentUserId
    ) {
        requireLogin(currentUserId);

        if (fileId == null || !fileId.matches("[0-9a-f]{32}")) {
            throw error(HttpStatus.BAD_REQUEST, "fileId 格式错误");
        }

        FileRecord record = fileMapper.findReadyById(fileId);

        if (record == null
                || !Objects.equals(record.uploaderId(), currentUserId)) {
            throw error(
                    HttpStatus.NOT_FOUND,
                    "文件不存在或无权访问"
            );
        }

        return record;
    }

    public Download download(String fileId, Long currentUserId) {
        FileRecord record = requireOwnedReady(fileId, currentUserId);

        // 按文件自己的存储类型读取，而不是按当前上传配置读取
        FileStorage storage = storages.get(record.storageType());

        if (storage == null) {
            throw error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "文件对应的存储服务不可用"
            );
        }

        try {
            return new Download(
                    record,
                    storage.read(record.objectKey())
            );
        } catch (IOException exception) {
            log.error("读取文件失败，fileId={}", fileId, exception);
            throw error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "文件暂时无法读取"
            );
        }
    }

    private String normalizeName(String originalName) {
        String name = originalName == null
                ? "file"
                : originalName.replace('\\', '/');

        name = name.substring(name.lastIndexOf('/') + 1);
        name = name.replaceAll("\\p{Cntrl}", "_");

        if (name.isBlank() || name.equals(".") || name.equals("..")) {
            name = "file";
        }

        if (name.length() > 255) {
            throw error(HttpStatus.BAD_REQUEST, "文件名不能超过255个字符");
        }

        return name;
    }

    private void requireLogin(Long userId) {
        if (userId == null) {
            throw new UnauthorizedException("请先登录");
        }
    }

    private String randomId() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    private AppException error(HttpStatus status, String message) {
        return new AppException(status, "FILE_ERROR", message);
    }

    public record Download(FileRecord file, Resource resource) {
    }
}