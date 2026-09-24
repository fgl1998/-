package com.example.realworld.file2;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class File2ControllerTest {

    @TempDir
    Path temporaryDirectory;

    private Path uploadDirectory;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        uploadDirectory = temporaryDirectory.resolve("uploads");
        mockMvc = MockMvcBuilders.standaloneSetup(
                new File2Controller(uploadDirectory.toString())
        ).build();
    }

    @Test
    void uploadsFileAndReturnsItsActualDiskPath() throws Exception {
        byte[] content = "我的第一个上传文件".getBytes(StandardCharsets.UTF_8);
        var response = mockMvc.perform(multipart("/file2/upload").file(
                new MockMultipartFile("file", "笔记.txt", "text/plain", content)
        )).andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value(200));

        List<Path> savedFiles;
        try (var files = Files.list(uploadDirectory)) {
            savedFiles = files.toList();
        }
        assertThat(savedFiles).hasSize(1);
        assertThat(Files.readAllBytes(savedFiles.get(0))).isEqualTo(content);
        response.andExpect(jsonPath("$.data").value(savedFiles.get(0).toString()));
    }

    @Test
    void sameOriginalFilenameDoesNotOverwritePreviousUpload() throws Exception {
        for (String content : List.of("first", "second")) {
            mockMvc.perform(multipart("/file2/upload").file(
                    new MockMultipartFile("file", "hello.txt", "text/plain",
                            content.getBytes(StandardCharsets.UTF_8))
            )).andExpect(jsonPath("$.success").value(true));
        }

        try (var files = Files.list(uploadDirectory)) {
            List<Path> savedFiles = files.toList();
            assertThat(savedFiles).hasSize(2);
            assertThat(List.of(Files.readString(savedFiles.get(0)),
                    Files.readString(savedFiles.get(1))))
                    .containsExactlyInAnyOrder("first", "second");
        }
    }

    @Test
    void rejectsMissingOrEmptyFileWithoutWritingToDisk() throws Exception {
        mockMvc.perform(multipart("/file2/upload"))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(multipart("/file2/upload").file(
                new MockMultipartFile("file", "empty.txt", "text/plain", new byte[0])
        )).andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.success").value(false));

        assertThat(uploadDirectory).doesNotExist();
    }

    @Test
    void clientFilenameCannotChooseTheSaveLocation() throws Exception {
        mockMvc.perform(multipart("/file2/upload").file(
                new MockMultipartFile("file", "../outside.txt", "text/plain",
                        "hello".getBytes(StandardCharsets.UTF_8))
        )).andExpect(jsonPath("$.success").value(true));

        assertThat(temporaryDirectory.resolve("outside.txt")).doesNotExist();
        try (var files = Files.list(uploadDirectory)) {
            assertThat(files.toList()).hasSize(1);
        }
    }
}
