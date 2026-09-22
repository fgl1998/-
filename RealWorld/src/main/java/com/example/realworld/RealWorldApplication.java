package com.example.realworld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@SpringBootApplication这是 Spring Boot 的启动类，从当前包向下寻找需要交给 Spring 管理的类。
@SpringBootApplication
public class RealWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealWorldApplication.class, args);
    }

}
