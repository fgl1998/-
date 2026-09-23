package com.example.realworld.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

//app.use((error, req, res, next) => {
//        // 全局处理错误
//        })
//@RestControllerAdvice这个类专门负责处理所有 Controller 抛出来的异常，并将结果转换成 JSON。
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理 @Valid 校验失败
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        String message = exception
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("请求参数错误");

        Map<String, Object> response = Map.of(
                "error", Map.of(
                        "code", "VALIDATION_ERROR",
                        "message", message
                )
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
    /**
     * 2. 处理请求体 JSON 格式错误
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidJson(
            HttpMessageNotReadableException exception
    ) {
        Map<String, Object> body = Map.of(
                "error", Map.of(
                        "code", "INVALID_JSON",
                        "message", "请求体不是合法的 JSON"
                )
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    /**
     * 3. 处理所有自定义业务异常
     */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Map<String, Object>> handleAppException(
            AppException exception
    ) {
        Map<String, Object> body = createErrorBody(
                exception.getCode(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(exception.getStatus())
                .body(body);
    }

    /**
     * 处理所有未预料到的异常，作为最后的 500 兜底
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnknownException(
            Exception exception
    ) {
        exception.printStackTrace();

        Map<String, Object> body = Map.of(
                "error", Map.of(
                        "code", "INTERNAL_SERVER_ERROR",
                        "message", "服务器内部错误"
                )
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body);
    }

    /**
     * 统一创建错误响应体
     */
    private Map<String, Object> createErrorBody(
            String code,
            String message
    ) {
        return Map.of(
                "error", Map.of(
                        "code", code,
                        "message", message
                )
        );
    }


}

//Exception
//        ├── MethodArgumentNotValidException
//        ├── UserAlreadyExistsException
//        ├── NullPointerException
//        ├── SQLException
//        └── 其他异常
//前端调用注册接口
//        ↓
//        UserController.register()
//        ↓
//        UserService.register()
//        ↓
//        发现邮箱存在
//        ↓
//        throw new UserAlreadyExistsException()
//        ↓
//        Spring 捕获异常
//        ↓
//        GlobalExceptionHandler
//        ↓
//        handleUserAlreadyExistsException()
//        ↓
//        返回 409 和错误 JSON

//UserService
//        ↓
//        抛出 UserAlreadyExistsException
//        ↓
//        它继承了 AppException
//        ↓
//        匹配 @ExceptionHandler(AppException.class)
//    ↓
//            读取异常里的 status、code、message
//            ↓
//            返回 409 和错误 JSON