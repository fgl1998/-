package com.example.realworld.file3;

import com.example.realworld.common.exception.GlobalExceptionHandler;
import com.example.realworld.file3.business.DemoArticle;
import com.example.realworld.file3.business.DemoArticleController;
import com.example.realworld.file3.business.DemoArticleMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class File3DemoTest {

    private static final byte[] PNG = Base64.getDecoder().decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH3sAAAAASUVORK5CYII=");

    @TempDir
    Path directory;

    private final TestFiles fileMapper = new TestFiles();
    private final TestArticles articleMapper = new TestArticles();
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        File3Service service = new File3Service(fileMapper, directory.toString());
        mvc = MockMvcBuilders.standaloneSetup(
                        new File3Controller(service),
                        new DemoArticleController(articleMapper, service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void uploadThenCreateBusinessRecordAndPubliclyReadImage() throws Exception {
        String fileId = upload();
        assertThat(fileId).matches("[0-9a-f]{32}");
        assertThat(Files.readAllBytes(directory.resolve(fileId))).isEqualTo(PNG);
        assertThat(fileMapper.rows.get(fileId).contentType()).isEqualTo("image/png");

        // 没有登录信息，也能直接读取图片字节。
        mvc.perform(get("/file3/files/" + fileId))
                .andExpect(status().isOk())
                .andExpect(content().contentType("image/png"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(content().bytes(PNG));

        String body = mvc.perform(post("/file3/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"我的文章\",\"coverFileId\":\"" + fileId + "\"}"))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.coverFileId").value(fileId))
                .andReturn().getResponse().getContentAsString();
        String articleId = JsonPath.read(body, "$.data.articleId");
        assertThat(articleMapper.rows.get(articleId).coverFileId()).isEqualTo(fileId);

        // 重新创建服务和 Controller，验证读取依赖的是记录和磁盘，而不是服务内部缓存。
        setUp();
        mvc.perform(get("/file3/articles/" + articleId))
                .andExpect(jsonPath("$.data.title").value("我的文章"))
                .andExpect(jsonPath("$.data.coverFileId").value(fileId));
        mvc.perform(get("/file3/files/" + fileId)).andExpect(content().bytes(PNG));
    }

    @Test
    void uploadingSameFilenameProducesIndependentFileIds() throws Exception {
        String first = upload();
        String second = upload();
        assertThat(first).isNotEqualTo(second);
        assertThat(Files.readAllBytes(directory.resolve(first))).isEqualTo(PNG);
        assertThat(Files.readAllBytes(directory.resolve(second))).isEqualTo(PNG);
        assertThat(fileMapper.rows).hasSize(2);
    }

    @Test
    void rejectsMissingEmptyAndUnsupportedUploads() throws Exception {
        mvc.perform(multipart("/file3/files/upload"))
                .andExpect(jsonPath("$.code").value(400));
        mvc.perform(multipart("/file3/files/upload").file(
                        new MockMultipartFile("file", "empty.png", "image/png", new byte[0])))
                .andExpect(jsonPath("$.code").value(400));
        mvc.perform(multipart("/file3/files/upload").file(
                        new MockMultipartFile("file", "page.html", "text/html", PNG)))
                .andExpect(jsonPath("$.code").value(400));
        assertThat(fileMapper.rows).isEmpty();
        try (var files = Files.list(directory)) {
            assertThat(files.toList()).isEmpty();
        }
    }

    @Test
    void missingInvalidAndDeletedImagesReturnHttp404() throws Exception {
        mvc.perform(get("/file3/files/not-a-file-id")).andExpect(status().isNotFound());
        mvc.perform(get("/file3/files/" + "a".repeat(32))).andExpect(status().isNotFound());
        String fileId = upload();
        Files.delete(directory.resolve(fileId));
        mvc.perform(get("/file3/files/" + fileId)).andExpect(status().isNotFound());
    }

    @Test
    void businessRequestMustReferenceAnExistingImage() throws Exception {
        mvc.perform(post("/file3/articles").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"文章\",\"coverFileId\":\"" + "a".repeat(32) + "\"}"))
                .andExpect(jsonPath("$.code").value(400));
        mvc.perform(post("/file3/articles").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\",\"coverFileId\":\"bad\"}"))
                .andExpect(jsonPath("$.code").value(400));
        assertThat(articleMapper.rows).isEmpty();
    }

    @Test
    void rejectedDatabaseInsertDoesNotReturnAFileIdOrLeaveAFile() throws Exception {
        fileMapper.rejectInsert = true;
        mvc.perform(multipart("/file3/files/upload").file(
                        new MockMultipartFile("file", "cover.png", "image/png", PNG)))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(500));
        try (var files = Files.list(directory)) {
            assertThat(files.toList()).isEmpty();
        }
    }

    private String upload() throws Exception {
        String body = mvc.perform(multipart("/file3/files/upload").file(
                        new MockMultipartFile("file", "cover.png", "image/png", PNG)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getContentAsString();
        String fileId = JsonPath.read(body, "$.data.fileId");
        assertThat((String) JsonPath.read(body, "$.data.url")).isEqualTo("/file3/files/" + fileId);
        return fileId;
    }

    // 测试替身只替代数据库，上传、HTTP 绑定、文件写入和图片响应都运行真实代码。
    private static class TestFiles implements File3Mapper {
        final Map<String, File3Record> rows = new HashMap<>();
        boolean rejectInsert;
        public int insert(File3Record file) {
            if (rejectInsert) return 0;
            rows.put(file.fileId(), file);
            return 1;
        }
        public File3Record findById(String fileId) { return rows.get(fileId); }
    }

    private static class TestArticles implements DemoArticleMapper {
        final Map<String, DemoArticle> rows = new HashMap<>();
        public int insert(DemoArticle article) {
            rows.put(article.articleId(), article);
            return 1;
        }
        public DemoArticle findById(String articleId) { return rows.get(articleId); }
    }
}
