package com.example.realworld.user;

import com.example.realworld.common.AppException;

public class UserAlreadyExistsException
        extends AppException {

    public UserAlreadyExistsException() {
        super(
                409,
                "USER_ALREADY_EXISTS",
                "用户名或邮箱已经存在"
        );
    }
}