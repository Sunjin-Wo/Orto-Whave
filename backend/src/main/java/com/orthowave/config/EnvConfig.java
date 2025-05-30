package com.orthowave.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = "classpath:git.env", ignoreResourceNotFound = true)
public class EnvConfig {
    // Esta clase carga automáticamente las variables de entorno del archivo git.env
} 