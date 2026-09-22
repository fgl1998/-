package com.example.realworld.user;

import org.apache.ibatis.annotations.*;

//这是一个 MyBatis Mapper，请为它生成实现对象，并把生成的对象交给 Spring 管理。
// @Mapper 注解表示这是一个 MyBatis Mapper，MyBatis 会自动生成这个接口的实现类。这个实现类会包含一个方法，方法名是 findById，参数是 Long 类型的 id，返回值是 User 类型。
//MyBatis与spring是什么关系，能够混用注解吗？可以，MyBatis与spring可以混用注解，因为MyBatis已经集成了spring。
@Mapper
public interface UserMapper {
    @Select("""
            SELECT id, username, email, password_hash
            FROM users
            WHERE id = #{id}
            LIMIT 1
            """)
    User findById(
            @Param("id") Long id
    );

    @Select("""
            SELECT id, username, email, password_hash
            FROM users
            WHERE email = #{email}
            LIMIT 1
            """)
    User findByEmail(
            @Param("email") String email
    );

    @Insert("""
            INSERT INTO users (username, email, password_hash,created_at,updated_at)
            VALUES (#{username}, #{email}, #{passwordHash},NOW(),NOW())
            """)
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insert(User user);
}
