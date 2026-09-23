package com.example.realworld.file.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@Component
public class LocalFileStorage implements FileStorage {

    private final Path root;

    public LocalFileStorage(
            @Value("${app.file.local-root}") String rootDirectory
    ) throws IOException {
        this.root = Path.of(rootDirectory)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(root);
    }

    @Override
    public String type() {
        return "LOCAL";
    }

    @Override
    public void write(
            String objectKey,
            InputStream input,
            long size,
            String contentType
    ) throws IOException {
        Path target = resolve(objectKey);
        Files.createDirectories(target.getParent());

        // 放在 try 外：创建失败时不能误删已经存在的文件
        OutputStream output = Files.newOutputStream(
                target,
                StandardOpenOption.CREATE_NEW,
                StandardOpenOption.WRITE
        );

        try (output) {
            input.transferTo(output);
        } catch (IOException | RuntimeException exception) {
            // 清理本次创建的半成品文件
            try {
                Files.deleteIfExists(target);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }
            throw exception;
        }
    }

    @Override
    public Resource read(String objectKey) throws IOException {
        Path target = resolve(objectKey);

        if (!Files.isRegularFile(target) || !Files.isReadable(target)) {
            throw new IOException("文件不存在或不可读取");
        }

        return new FileSystemResource(target);
    }

    @Override
    public void delete(String objectKey) throws IOException {
        Files.deleteIfExists(resolve(objectKey));
    }

    private Path resolve(String objectKey) throws IOException {
        Path target = root.resolve(objectKey).normalize();

        if (!target.startsWith(root) || target.equals(root)) {
            throw new IOException("非法存储路径");
        }

        return target;
    }
}