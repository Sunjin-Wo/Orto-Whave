package com.orthowave.backend.controller;

import com.orthowave.backend.model.User;
import com.orthowave.backend.service.AuthService;
import com.orthowave.backend.exception.AuthenticationException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) throws MessagingException {
        Map<String, String> response = authService.register(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        if (email == null || password == null) {
            throw new AuthenticationException("Credenciales incompletas");
        }
        Map<String, String> response = authService.login(email, password);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("Email verificado exitosamente");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> request) throws MessagingException {
        String email = request.get("email");
        authService.requestPasswordReset(email);
        return ResponseEntity.ok("Se ha enviado un correo con instrucciones para restablecer tu contraseña");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Contraseña actualizada exitosamente");
    }
} 