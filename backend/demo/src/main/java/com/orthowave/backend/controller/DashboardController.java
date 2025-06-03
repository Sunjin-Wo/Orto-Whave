package com.orthowave.backend.controller;

import com.orthowave.backend.model.User;
import com.orthowave.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> getPatientDashboard(@AuthenticationPrincipal User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", user);
        dashboard.put("appointments", "Lista de citas próximas");
        dashboard.put("medicalHistory", "Historial médico");
        dashboard.put("products", "Productos recomendados");
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getDoctorDashboard(@AuthenticationPrincipal User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", user);
        dashboard.put("appointments", "Citas del día");
        dashboard.put("patients", "Lista de pacientes");
        dashboard.put("schedule", "Horario de atención");
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard(@AuthenticationPrincipal User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", user);
        dashboard.put("users", userRepository.count());
        dashboard.put("statistics", "Estadísticas generales");
        dashboard.put("settings", "Configuración del sistema");
        return ResponseEntity.ok(dashboard);
    }
} 