package com.example.realworld.user.exception;

import com.example.realworld.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AppException {
    public InvalidCredentialsException() {
        super(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "用户名或者密码错误");
    }
}
