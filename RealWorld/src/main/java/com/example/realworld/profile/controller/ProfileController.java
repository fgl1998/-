package com.example.realworld.profile.controller;

import com.example.realworld.common.Result;
import com.example.realworld.common.exception.AppException;
import com.example.realworld.profile.dto.CreateFollowRequest;
import com.example.realworld.profile.dto.FindProfileRequest;
import com.example.realworld.profile.entity.Profile;
import com.example.realworld.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/findProfile")
    public Result<Profile> findProfile(@Valid @RequestBody FindProfileRequest body) {
        String username = body.getUsername();
        Long userId = body.getUserId();
        Profile result = profileService.findProfile(userId,username);
        return Result.success(result);
    }

    @PostMapping("/follow")
    public Result<Void> follow(@Valid @RequestBody CreateFollowRequest body) {
        Long userId = body.getUserId();
        Long followingId = body.getFollowingId();
        profileService.follow(userId, followingId);
        return Result.success();
    }

    @PostMapping("/unfollow")
    public Result<Void> unfollow(@Valid @RequestBody CreateFollowRequest body) {
        Long userId = body.getUserId();
        Long followingId = body.getFollowingId();
        profileService.unfollow(userId, followingId);
        return Result.success();
    }

    @PostMapping("/followingList")
    public Result<List<Profile>> followingList(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        if(userId == null){
            throw new AppException(HttpStatus.BAD_REQUEST, "400", "userId is null");
        }
        List<Profile> result = profileService.followingList(userId);
        return Result.success(result);
    }
    @PostMapping("/followerList")
    public Result<List<Profile>> followerList(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        if(userId == null){
            throw new AppException(HttpStatus.BAD_REQUEST, "400", "userId is null");
        }
        List<Profile> result = profileService.followedList(userId);
        return Result.success(result);
    }
}
