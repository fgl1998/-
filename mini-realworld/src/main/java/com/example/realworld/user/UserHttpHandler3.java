package com.example.realworld.user;

import com.example.realworld.common.AppException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class UserHttpHandler3 {

    private final UserController userController;
    private final ObjectMapper objectMapper;

    public UserHttpHandler3(
            UserController userController
    ) {
        this.userController = userController;
        this.objectMapper = new ObjectMapper();
    }

    public void getById(HttpExchange exchange)
            throws IOException {
        // 根据 id 查询用户
        try{
            if(!"GET".equalsIgnoreCase(exchange.getRequestMethod())){
                exchange.getRequestHeaders().set("Allow","GET");
                sendError(
                        exchange,
                        405,
                        "METHOD_NOT_ALLOWED",
                        "只支持 GET 请求"
                );
                return;
            }
            Long id = getRequiredId(exchange);

            User user = userController.getUserById(id);

            sendJson(
                    exchange,
                    200,
                    Map.of("data",toUserData(user))
            );

        }catch (AppException e){
            sendError(
                    exchange,
                    400,
                    "INVALID_PARAMETER",
                    e.getMessage()
            );

        } catch (RuntimeException e){
            e.printStackTrace();

            sendError(
                    exchange,
                    500,
                    "INTERNAL_ERROR",
                    "服务器内部错误"
            );
        } finally {
            exchange.close();
        }

    }

    public void register(HttpExchange exchange)
            throws IOException {
        // 以后由你补充注册
        try{
            if(!"POST".equalsIgnoreCase(exchange.getRequestMethod())){
                exchange.getRequestHeaders().set("Allow","POST");
                sendError(
                        exchange,
                        405,
                        "METHOD_NOT_ALLOWED",
                        "只支持 POST 请求"
                );
                return;
            }
            CreateUserRequest request = objectMapper.readValue(
                    exchange.getRequestBody(),
                    CreateUserRequest.class
            );
            validateCreateUserRequest(request);

            User user = userController.register(request);
            sendJson(
                    exchange,
                    201,
                    Map.of("data",toUserData(user))
            );

        } catch (JsonProcessingException e){
            sendError(
                    exchange,
                    400,
                    "INVALID_JSON",
                    "请求体不是合法的 JSON"
            );
        } catch (AppException e) {
            sendError(
                    exchange,
                    e.getHttpStatus(),
                    e.getCode(),
                    e.getMessage()
            );

        } catch (IllegalArgumentException e) {
            sendError(
                    exchange,
                    400,
                    "INVALID_PARAMETER",
                    e.getMessage()
            );

        } catch (RuntimeException e) {
            e.printStackTrace();

            sendError(
                    exchange,
                    500,
                    "INTERNAL_ERROR",
                    "服务器内部错误"
            );

        } finally {
            exchange.close();
        }
    }

    public void login(HttpExchange exchange)
            throws IOException {
        // 以后由你补充登录
    }

    /**
     * 从 /api/users?id=1 中读取 id。
     */
    private Long getRequiredId(
            HttpExchange exchange
    ) {
        String query =
                exchange.getRequestURI().getRawQuery();

        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException(
                    "缺少 id 参数"
            );
        }

        for (String parameter : query.split("&")) {
            String[] pair =
                    parameter.split("=", 2);

            String key = URLDecoder.decode(
                    pair[0],
                    StandardCharsets.UTF_8
            );

            if (!"id".equals(key)) {
                continue;
            }

            if (
                    pair.length < 2 ||
                            pair[1].isBlank()
            ) {
                throw new IllegalArgumentException(
                        "id 不能为空"
                );
            }

            String value = URLDecoder.decode(
                    pair[1],
                    StandardCharsets.UTF_8
            );

            try {
                Long id = Long.valueOf(value);

                if (id <= 0) {
                    throw new IllegalArgumentException(
                            "id 必须是正整数"
                    );
                }

                return id;

            } catch (NumberFormatException e) {
                throw new IllegalArgumentException(
                        "id 必须是正整数"
                );
            }
        }

        throw new IllegalArgumentException(
                "缺少 id 参数"
        );
    }

    /**
     * 校验注册参数。
     */
    private void validateCreateUserRequest(
            CreateUserRequest request
    ) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "请求体不能为空"
            );
        }

        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        if (
                username == null ||
                        username.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "username 不能为空"
            );
        }

        if (username.length() > 50) {
            throw new IllegalArgumentException(
                    "username 不能超过 50 个字符"
            );
        }

        if (
                email == null ||
                        email.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "email 不能为空"
            );
        }

        if (email.length() > 100) {
            throw new IllegalArgumentException(
                    "email 不能超过 100 个字符"
            );
        }

        if (!email.contains("@")) {
            throw new IllegalArgumentException(
                    "email 格式不正确"
            );
        }

        if (
                password == null ||
                        password.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "password 不能为空"
            );
        }

        if (
                password.length() < 6 ||
                        password.length() > 100
        ) {
            throw new IllegalArgumentException(
                    "password 长度必须在 6 到 100 个字符之间"
            );
        }
    }

    /**
     * 只返回允许暴露给前端的字段。
     */
    private Map<String, Object> toUserData(
            User user
    ) {
        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
        );
    }

    private void sendError(
            HttpExchange exchange,
            int httpStatus,
            String code,
            String message
    ) throws IOException {

        Map<String, Object> error = Map.of(
                "code", code,
                "message", message
        );

        Map<String, Object> response = Map.of(
                "error", error
        );

        sendJson(
                exchange,
                httpStatus,
                response
        );
    }

    private void sendJson(
            HttpExchange exchange,
            int httpStatus,
            Object data
    ) throws IOException {

        byte[] responseBody =
                objectMapper.writeValueAsBytes(data);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(
                httpStatus,
                responseBody.length
        );

        try (
                OutputStream outputStream =
                        exchange.getResponseBody()
        ) {
            outputStream.write(responseBody);
        }
    }
}