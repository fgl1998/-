package com.example.realworld.file.storage;

import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

public interface FileStorage {

    String type();

    // 输入流由调用方关闭
    void write(
            String objectKey,
            InputStream input,
            long size,
            String contentType
    ) throws IOException;

    // 返回能按需打开输入流的资源
    Resource read(String objectKey) throws IOException;

    // 删除不存在的对象也视为成功
    void delete(String objectKey) throws IOException;
}