package com.example.realworld.common;

/**
 * 统一返回结果包装类。
 * <p>
 * 所有接口（成功 / 失败）都返回该结构，HTTP 状态码统一为 200，
 * 业务状态通过 {@link #code} 字段承载：
 * <pre>
 * {
 *   "code": 200,
 *   "message": "success",
 *   "data": {...},
 *   "success": true
 * }
 * </pre>
 *
 * @param <T> 业务数据类型
 */
public class Result<T> {

    /** 成功时的业务码 */
    public static final int CODE_SUCCESS = 200;

    /** 业务状态码：成功为 200，失败沿用对应语义码（如 400 / 401 / 404 / 409 / 500） */
    private final int code;

    /** 提示信息 */
    private final String message;

    /** 业务数据，失败时为 null */
    private final T data;

    /** 是否成功 */
    private final boolean success;

    private Result(int code, String message, T data, boolean success) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
    }

    /**
     * 成功并携带数据
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(CODE_SUCCESS, "success", data, true);
    }

    /**
     * 成功但不携带数据
     */
    public static <T> Result<T> success() {
        return new Result<>(CODE_SUCCESS, "success", null, true);
    }

    /**
     * 失败
     *
     * @param code    业务状态码
     * @param message 错误提示
     */
    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null, false);
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }

    public boolean isSuccess() {
        return success;
    }
}
