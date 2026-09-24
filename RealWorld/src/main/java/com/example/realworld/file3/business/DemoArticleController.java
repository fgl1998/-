package com.example.realworld.file3.business;

import com.example.realworld.common.Result;
import com.example.realworld.common.exception.AppException;
import com.example.realworld.file3.File3Service;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/** 演示业务接口：保存文章，只引用已经上传的封面图片。 */
@RestController
@RequestMapping("/file3/articles")
public class DemoArticleController {

    private final DemoArticleMapper articleMapper;
    private final File3Service fileService;

    public DemoArticleController(DemoArticleMapper articleMapper, File3Service fileService) {
        this.articleMapper = articleMapper;
        this.fileService = fileService;
    }

    // 第二次请求：普通 JSON，只有标题和 coverFileId，没有 MultipartFile。
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public Result<DemoArticle> create(@Valid @RequestBody CreateRequest request) {
        // 只检查图片是否存在，不检查是谁上传的。
        if (fileService.find(request.coverFileId()) == null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "FILE3_COVER", "封面图片不存在，请先上传图片");
        }

        DemoArticle article = new DemoArticle(
                UUID.randomUUID().toString().replace("-", ""),
                request.title(),
                request.coverFileId()
        );
        if (articleMapper.insert(article) != 1) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "FILE3_ARTICLE", "保存文章失败");
        }
        return Result.success(article);
    }

    @GetMapping("/{articleId}")
    public Result<DemoArticle> detail(@PathVariable("articleId") String articleId) {
        DemoArticle article = articleMapper.findById(articleId);
        if (article == null) {
            throw new AppException(HttpStatus.NOT_FOUND, "FILE3_ARTICLE", "文章不存在");
        }
        return Result.success(article);
    }

    public record CreateRequest(
            @NotBlank(message = "标题不能为空")
            @Size(max = 120, message = "标题不能超过120个字符") String title,
            @NotBlank(message = "coverFileId不能为空")
            @Pattern(regexp = "[0-9a-f]{32}", message = "coverFileId格式错误") String coverFileId
    ) {
    }
}
