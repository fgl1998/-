package com.example.realworld.user;

import com.example.realworld.common.AppException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class UserHttpHandler implements HttpHandler {

    private final UserController userController;
    private final ObjectMapper objectMapper;

    public UserHttpHandler(
            UserController userController
    ) {
        this.userController = userController;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void handle(HttpExchange exchange)
            throws IOException {

        try {
            if (!exchange.getRequestMethod().equals("GET")) {
                exchange.getResponseHeaders().set(
                        "Allow",
                        "GET"
                );

                sendError(
                        exchange,
                        405,
                        "METHOD_NOT_ALLOWED",
                        "只支持 GET 请求"
                );
                return;
            }

            Long id = getRequiredId(exchange);

            User user =
                    userController.getUserById(id);

            Map<String, Object> userData = Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail()
            );

            Map<String, Object> response = Map.of(
                    "data",
                    userData
            );

            sendJson(exchange, 200, response);

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

        } catch (Exception e) {
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

    private Long getRequiredId(HttpExchange exchange) {
        String query =
                exchange.getRequestURI().getRawQuery();

        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException(
                    "缺少 id 参数"
            );
        }

        for (String parameter : query.split("&")) {
            String[] pair = parameter.split("=", 2);

            String key = URLDecoder.decode(
                    pair[0],
                    StandardCharsets.UTF_8
            );

            if (!key.equals("id")) {
                continue;
            }

            if (pair.length < 2 || pair[1].isBlank()) {
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