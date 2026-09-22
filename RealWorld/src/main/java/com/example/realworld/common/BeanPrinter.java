package com.example.realworld.common;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class BeanPrinter implements CommandLineRunner {

    private final ApplicationContext applicationContext;

    public BeanPrinter(
            ApplicationContext applicationContext
    ) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void run(String... args) {
        System.out.println("===== Hello 模块中的 Bean =====");

        Arrays.stream(
                        applicationContext.getBeanDefinitionNames()
                )
                .filter(name -> name.startsWith("hello"))
                .sorted()
                .forEach(name -> {
                    Object bean =
                            applicationContext.getBean(name);

                    System.out.println(
                            name + " -> " +
                                    bean.getClass().getName()
                    );
                });
    }
}