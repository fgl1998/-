package com.example.realworld.user.exception;

import com.example.realworld.common.exception.AppException;
import org.springframework.http.HttpStatus;


public class UserNotFoundException extends AppException {
    public UserNotFoundException() {
        super(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "用户不存在");
    }
}
