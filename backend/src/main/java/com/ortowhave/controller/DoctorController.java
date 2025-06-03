package com.ortowhave.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ortowhave.dto.response.UserResponse;
import com.ortowhave.service.PatientService;
import com.ortowhave.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private PatientService patientService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<String> getDoctorDashboard() {
        return ResponseEntity.ok("Dashboard de doctor");
    }
    
    @GetMapping("/patients")
    public ResponseEntity<List<UserResponse>> getAllPatients() {
        List<UserResponse> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getDoctorProfile(@RequestParam String email) {
        UserResponse doctor = userService.getUserByEmail(email);
        return ResponseEntity.ok(doctor);
    }
}
