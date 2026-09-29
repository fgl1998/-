package com.example.realworld.profile.mapper;


import com.example.realworld.profile.entity.Profile;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProfileMapper {
    @Select("""
            SELECT users.id,users.username,users.email,users.image,users.bio,users.created_at,
                  EXISTS(
                    SELECT 1 FROM follows
                    WHERE follows.follower_id=#{userId}
                    AND follows.following_id=users.id
                  ) AS following
                  FROM users
                  WHERE users.username=#{username}
                  LIMIT 1
            """)
    Profile findProfile(Long userId,String username);

    @Insert("""
            INSERT IGNORE INTO follows(follower_id,following_id) VALUES(#{userId},#{followingId})
            """)
    void follow(Long userId, Long followingId);

    @Insert("""
            DELETE FROM follows
            WHERE follower_id=#{userId}
            AND following_id=#{followingId}
            """)
    void unfollow(Long userId, Long followingId);

    @Select("""
            SELECT
                    users.id,
                    users.username,
                    users.image,
                    users.bio,
                    users.created_at,
                    1 AS following
                  FROM follows
                  JOIN users ON follows.following_id=users.id
                  WHERE follows.follower_id=#{userId}
            """)
    List<Profile> followingList(Long userId);

    @Select("""
            SELECT
                    users.id,
                    users.username,
                    users.image,
                    users.bio,
                    users.created_at,
                    EXISTS(
            				  SELECT 1 from follows WHERE follows.following_id=users.id AND follows.follower_id=#{userId}
            				) AS following
                  FROM follows
                  JOIN users ON follows.follower_id=users.id
                  WHERE follows.following_id=#{userId}
            """)
    List<Profile> followedList(Long userId);
}
