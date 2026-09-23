package com.example.realworld.security;

import com.example.realworld.common.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthInterceptor
        implements HandlerInterceptor {

    private static final String AUTHORIZATION_HEADER =
            "Authorization";

    private static final String BEARER_PREFIX =
            "Bearer ";

    private final JwtService jwtService;

    public JwtAuthInterceptor(
            JwtService jwtService
    ) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        // 跨域预检请求直接放行
        if ("OPTIONS".equalsIgnoreCase(
                request.getMethod()
        )) {
            return true;
        }

        String authorization =
                request.getHeader(
                        AUTHORIZATION_HEADER
                );

        // 没有 Authorization 请求头
        if (authorization == null ||
                authorization.isBlank()) {

            throw new UnauthorizedException(
                    "请先登录"
            );
        }

        // 请求头不是 Bearer Token 格式
        if (!authorization.startsWith(
                BEARER_PREFIX
        )) {
            throw new UnauthorizedException(
                    "Authorization 格式错误"
            );
        }

        // 去掉前面的 "Bearer "
        String token =
                authorization.substring(
                        BEARER_PREFIX.length()
                ).trim();

        if (token.isBlank()) {
            throw new UnauthorizedException(
                    "Token 不能为空"
            );
        }

        // 验证 Token，并取得用户 ID
        Long currentUserId =
                jwtService.getUserId(token);

        // 把当前用户 ID 放入本次请求
        request.setAttribute(
                "currentUserId",
                currentUserId
        );

        // true 表示继续进入 Controller
        return true;
    }
}