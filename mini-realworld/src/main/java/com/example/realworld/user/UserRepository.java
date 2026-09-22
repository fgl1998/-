package com.example.realworld.user;


public interface UserRepository {
    User findById(Long id);
    User findByEmail(String email);
    Long create(
            String username,
            String email,
            String password
    );
}
