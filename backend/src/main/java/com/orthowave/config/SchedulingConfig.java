package com.orthowave.config;

import com.orthowave.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class SchedulingConfig {

    private final AuthService authService;

    // Ejecutar cada hora
    @Scheduled(fixedRate = 3600000)
    public void limpiarVerificacionesExpiradas() {
        authService.limpiarVerificacionesExpiradas();
    }
} 