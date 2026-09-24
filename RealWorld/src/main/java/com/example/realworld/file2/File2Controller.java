package com.example.realworld.file2;

import com.example.realworld.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/**
 * 文件上传第一课：接收一个文件，直接保存到本地磁盘。
 * 阅读顺序：先看 upload()，再看构造方法中的保存目录配置。
 */
@RestController
@RequestMapping("/file2")
public class File2Controller {

    // Path 表示一个磁盘路径，这里保存的是目录路径。
    private final Path uploadDirectory;

    public File2Controller(
            // 读取配置；没有配置时，默认保存到启动工作目录下的 uploads/file2。
            @Value("${app.file2.upload-dir:uploads/file2}") String uploadDirectory
    ) {
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    // 完整地址：POST /file2/upload；multipart/form-data 是上传文件使用的表单格式。
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Result<String> upload(
            // 1. 接收名为 file 的表单字段，Spring 把上传内容交给 MultipartFile。
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        // 2. 没传文件，或者文件内容为空，就直接返回错误。
        if (file == null || file.isEmpty()) {
            return Result.error(400, "请选择非空文件");
        }

        // 3. 创建保存目录；目录已经存在时可以继续使用。
        Files.createDirectories(uploadDirectory);

        // 4. 后端生成随机文件名，让多次上传的同名文件各自保存。
        // 本课不保留原扩展名，文件内容不受影响，可以用编辑器打开。
        String savedName = UUID.randomUUID().toString();

        // 5. 目录 + 文件名 = 完整的保存路径。
        Path target = uploadDirectory.resolve(savedName);

        // 6. 核心：把上传的文件内容保存到磁盘。
        // 写入失败时抛出的 IOException 交给项目已有的全局异常处理。
        file.transferTo(target);

        // 7. 返回实际保存路径，方便学习时找到文件；这不是下载链接。
        return Result.success(target.toString());
    }
}
