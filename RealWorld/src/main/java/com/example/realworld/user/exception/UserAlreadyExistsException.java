package com.example.realworld.user.exception;

import com.example.realworld.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends AppException {

    public UserAlreadyExistsException() {
        super(
                HttpStatus.CONFLICT,
                "USER_ALREADY_EXISTS",
                "该邮箱已经被注册"
        );
    }
}