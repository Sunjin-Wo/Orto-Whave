package com.orthowave.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseHealthIndicator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Health health() {
        try {
            int result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result == 1) {
                return Health.up()
                    .withDetail("database", "MySQL")
                    .withDetail("status", "Conectado")
                    .build();
            }
            return Health.down()
                .withDetail("database", "MySQL")
                .withDetail("status", "Error en la consulta de prueba")
                .build();
        } catch (Exception e) {
            return Health.down()
                .withDetail("database", "MySQL")
                .withDetail("status", "Desconectado")
                .withDetail("error", e.getMessage())
                .build();
        }
    }
} 