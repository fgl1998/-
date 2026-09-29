package com.example.realworld.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateFollowRequest {
    @NotNull(message = "userId cannot be null")
    private Long userId;
    @NotNull(message = "followingId cannot be null")
    private Long followingId;

    public Long getFollowingId() {
        return followingId;
    }

    public Long getUserId() {
        return userId;
    }
}
