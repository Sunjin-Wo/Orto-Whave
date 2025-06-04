package com.ortowhave.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ortowhave.dto.response.UserResponse;
import com.ortowhave.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestParam String email) {
        UserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<String> getUserDashboard() {
        return ResponseEntity.ok("Dashboard de usuario");
    }
    
    @GetMapping("/doctor/dashboard")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> getDoctorDashboard() {
        return ResponseEntity.ok("Dashboard de doctor");
    }
    
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Dashboard de administrador");
    }
    
    @GetMapping("/dashboard-redirect")
    public ResponseEntity<String> getDashboardRedirect(@RequestHeader("Authorization") String token) {
        String role = userService.extractRoleFromToken(token);
        String url;
        switch (role) {
            case "ROLE_ADMIN": url = "/admin/dashboard"; break;
            case "ROLE_DOCTOR": url = "/doctor/dashboard"; break;
            case "ROLE_USER": url = "/patient/dashboard"; break;
            default: url = "/user/dashboard";
        }
        return ResponseEntity.ok(url);
    }
}
