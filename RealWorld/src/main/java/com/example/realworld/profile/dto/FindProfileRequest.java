package com.example.realworld.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FindProfileRequest {
    @NotBlank(message = "username cannot be blank")
    private String username;
    @NotNull(message = "userId cannot be null")
    private Long userId;

    public String getUsername() {
        return username;
    }

    public Long getUserId() {
        return userId;
    }
}
