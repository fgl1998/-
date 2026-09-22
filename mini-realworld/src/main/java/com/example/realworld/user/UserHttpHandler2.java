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

public class UserHttpHandler2 implements HttpHandler {

    private final UserController userController;
    private final ObjectMapper objectMapper;

    public UserHttpHandler2(
            UserController userController
    ) {
        this.userController = userController;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void handle(HttpExchange exchange)
            throws IOException {

        Long id = 1L;

        User user =
                userController.getUserById(id);

        Map<String, Object> response = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
        );

        byte[] responseBody =
                objectMapper.writeValueAsBytes(response);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(
                200,
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