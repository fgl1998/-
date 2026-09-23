package com.example.realworld.common.exception;

import com.example.realworld.common.Result;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

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
    public Result<Void> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        String message = exception
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("请求参数错误");

        return Result.error(400, message);
    }

    /**
     * 2. 处理请求体 JSON 格式错误
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Result<Void> handleInvalidJson(
            HttpMessageNotReadableException exception
    ) {
        return Result.error(400, "请求体不是合法的 JSON");
    }

    /**
     * 3. 处理所有自定义业务异常
     */
    @ExceptionHandler(AppException.class)
    public Result<Void> handleAppException(
            AppException exception
    ) {
        // HTTP 统一返回 200，把原本的 HTTP 状态码作为业务码放入 Result.code
        return Result.error(
                exception.getStatus().value(),
                exception.getMessage()
        );
    }

    /**
     * 4. 处理请求方法不允许
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<Void> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException exception
    ) {
        return Result.error(404, "方法不存在");
    }

    /**
     * 5. 处理静态资源 / 路径不存在
     * <p>
     * 访问了没有对应 Controller 映射、也没有对应静态资源的路径（如根路径 "/"）时，
     * Spring MVC 会兜底抛出 NoResourceFoundException。这里统一按 404 处理，
     * 避免落入下面的 Exception 兜底被误报成 500，同时不打印堆栈污染日志。
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public Result<Void> handleNoResourceFoundException(
            NoResourceFoundException exception
    ) {
        return Result.error(404, "请求的资源不存在");
    }

    /**
     * 处理所有未预料到的异常，作为最后的 500 兜底
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleUnknownException(
            Exception exception
    ) {
        exception.printStackTrace();

        return Result.error(500, "服务器内部错误");
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