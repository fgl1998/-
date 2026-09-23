package com.example.realworld.common.config;

import com.example.realworld.security.JwtAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig
        implements WebMvcConfigurer {

    private final JwtAuthInterceptor jwtAuthInterceptor;

    public WebMvcConfig(
            JwtAuthInterceptor jwtAuthInterceptor
    ) {
        this.jwtAuthInterceptor =
                jwtAuthInterceptor;
    }

    @Override
    public void addInterceptors(
            InterceptorRegistry registry
    ) {
        registry.addInterceptor(
                        jwtAuthInterceptor
                )
                // 所有 /api 开头的接口都拦截
                .addPathPatterns("/api/**")

                // 注册接口不需要登录
                .excludePathPatterns(
                        "/api/users/register"
                )

                // 登录接口不需要登录
                .excludePathPatterns(
                        "/api/users/login"
                );
    }
}