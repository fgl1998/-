package com.example.realworld.tag.controller;

import com.example.realworld.common.Result;
import com.example.realworld.tag.entity.Tag;
import com.example.realworld.tag.service.TagService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    private final TagService tagService;
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/list")
    public Result<List<Tag>> list() {
        List<Tag> result = tagService.findAll();
        return  Result.success(result);
    }
}