package com.ortowhite.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
    scanBasePackages = {
        "com.ortowhite.auth.controller",
        "com.ortowhite.auth.service",
        "com.ortowhite.auth.config"
    }
)
public class AuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }
}