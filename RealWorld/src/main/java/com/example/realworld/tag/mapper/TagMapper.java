package com.example.realworld.tag.mapper;

import com.example.realworld.tag.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TagMapper {
    @Select("""
            select id ,name ,created_at ,updated_at from tags
            """)
    List<Tag> findAll();
}