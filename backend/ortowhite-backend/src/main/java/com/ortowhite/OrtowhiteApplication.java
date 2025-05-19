package com.ortowhite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ComponentScan(basePackages = "com.ortowhite")
@EntityScan("com.ortowhite.models")
@EnableJpaRepositories("com.ortowhite.repositories")
@EnableAsync
public class OrtowhiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrtowhiteApplication.class, args);
    }
} 