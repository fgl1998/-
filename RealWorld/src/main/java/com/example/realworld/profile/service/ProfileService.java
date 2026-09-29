package com.example.realworld.profile.service;

import com.example.realworld.profile.entity.Profile;
import com.example.realworld.profile.mapper.ProfileMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    private final ProfileMapper profileMapper;

    public ProfileService(ProfileMapper profileMapper) {
        this.profileMapper = profileMapper;
    }

    public Profile findProfile(Long userId,String username) {
        return profileMapper.findProfile(userId,username);
    }

    public void follow(Long userId, Long followingId) {
        profileMapper.follow(userId, followingId);
    }

    public void unfollow(Long userId, Long followingId) {
        profileMapper.unfollow(userId, followingId);
    }

    public List<Profile> followingList(Long userId) {
        return profileMapper.followingList(userId);
    }

    public List<Profile> followedList(Long userId) {
        return profileMapper.followedList(userId);

    }
}
