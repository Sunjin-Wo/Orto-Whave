package com.ortowhave.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ortowhave.dto.response.UserResponse;
import com.ortowhave.model.Patient;
import com.ortowhave.service.PatientService;
import com.ortowhave.service.UserService;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('USER')")
public class PatientController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private PatientService patientService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<String> getPatientDashboard() {
        return ResponseEntity.ok("Dashboard de paciente");
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getPatientProfile(@RequestParam String email) {
        UserResponse patient = userService.getUserByEmail(email);
        return ResponseEntity.ok(patient);
    }
    
    @GetMapping("/details/{userId}")
    public ResponseEntity<Patient> getPatientDetails(@PathVariable Long userId) {
        Patient patientDetails = patientService.getPatientDetailsByUserId(userId);
        return ResponseEntity.ok(patientDetails);
    }
}
