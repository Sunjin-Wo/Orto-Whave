package com.ortowhite.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ortowhite.models.Appointment;
import com.ortowhite.models.Patient;
import com.ortowhite.models.User;
import com.ortowhite.repositories.PatientRepository;
import com.ortowhite.repositories.UserRepository;
import com.ortowhite.repositories.AppointmentRepository;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    // Endpoint para el dashboard de administrador
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminDashboard() {
        try {
            Map<String, Object> dashboardData = new HashMap<>();
            
            long totalUsers = userRepository.count();
            long totalPatients = patientRepository.count();
            long totalAppointments = appointmentRepository.count();
            
            dashboardData.put("totalUsers", totalUsers);
            dashboardData.put("totalPatients", totalPatients);
            dashboardData.put("totalAppointments", totalAppointments);
            
            List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
            dashboardData.put("recentUsers", recentUsers);
            
            List<Patient> recentPatients = patientRepository.findTop5ByOrderById();
            dashboardData.put("recentPatients", recentPatients);
            
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener datos del dashboard: " + e.getMessage());
        }
    }
    
    // Endpoint para el dashboard de doctor
    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getDoctorDashboard() {
        try {
            Map<String, Object> dashboardData = new HashMap<>();
            
            long totalPatients = patientRepository.count();
            long totalAppointments = appointmentRepository.count();
            
            dashboardData.put("totalPatients", totalPatients);
            dashboardData.put("totalAppointments", totalAppointments);
            
            List<Patient> recentPatients = patientRepository.findTop5ByOrderById();
            dashboardData.put("recentPatients", recentPatients);
            
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener datos del dashboard: " + e.getMessage());
        }
    }
    
    // Endpoint para el dashboard de personal
    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getStaffDashboardData() {
        Map<String, Object> response = new HashMap<>();
        
        // Obtener total de pacientes
        long totalPatients = patientRepository.count();
        response.put("totalPatients", totalPatients);
        
        // Últimos pacientes registrados
        List<Patient> recentPatients = patientRepository.findTop5ByOrderById();
        response.put("recentPatients", recentPatients);
        
        return ResponseEntity.ok(response);
    }
    
    // Endpoint para estadísticas básicas (accesible a todos los roles)
    @GetMapping("/stats")
    public ResponseEntity<?> getBasicStats() {
        Map<String, Object> response = new HashMap<>();
        
        // Información básica que todos los usuarios pueden ver
        long totalPatients = patientRepository.count();
        response.put("totalPatients", totalPatients);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getPatientDashboard() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();
            
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Obtener información de las citas del paciente
            Optional<Patient> patientOpt = patientRepository.findByUserId(user.getId());
            
            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                List<Appointment> appointments = appointmentRepository.findByPatient(patient);
                
                dashboardData.put("patient", patient);
                dashboardData.put("appointments", appointments);
                
                return ResponseEntity.ok(dashboardData);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Paciente no encontrado para el usuario actual");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener datos del dashboard: " + e.getMessage());
        }
    }
} 