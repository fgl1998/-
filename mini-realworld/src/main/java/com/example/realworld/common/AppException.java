package com.example.realworld.common;

public class AppException extends RuntimeException {
    private final int httpStatus;
    private final String code;

    public AppException(
            int httpStatus,
            String code,
            String message
    ){
        super(message);
        this.httpStatus=httpStatus;
        this.code=code;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public String getCode() {
        return code;
    }
}
