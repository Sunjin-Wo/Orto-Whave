package com.orthowave;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OrthoWaveApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrthoWaveApplication.class, args);
    }
} 