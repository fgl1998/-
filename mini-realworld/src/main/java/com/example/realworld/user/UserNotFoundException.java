package com.example.realworld.user;

import com.example.realworld.common.AppException;

public class UserNotFoundException extends AppException {
    public UserNotFoundException(){
        super(
                404,
                "USER_NOT_FOUND",
                "用户不存在"
        );
    }
}
