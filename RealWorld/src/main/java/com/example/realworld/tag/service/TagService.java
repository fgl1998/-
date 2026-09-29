package com.example.realworld.tag.service;

import com.example.realworld.tag.entity.Tag;
import com.example.realworld.tag.mapper.TagMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    private final TagMapper tagMapper;

    public TagService(TagMapper tagMapper) {
        this.tagMapper = tagMapper;
    }
    public List<Tag> findAll() {
        return tagMapper.findAll();
    }
}