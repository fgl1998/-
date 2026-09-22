package com.example.realworld.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

//@Configuration这是一个 Spring 配置类。
@Configuration
public class PasswordConfig {

//    @Bean把这个方法返回的对象交给 Spring 管理
    //之所以使用 @Bean，是因为 BCryptPasswordEncoder 是第三方类，我们不能修改它并添加 @Component
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}