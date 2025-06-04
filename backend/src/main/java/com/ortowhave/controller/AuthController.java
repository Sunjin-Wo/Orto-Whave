package com.ortowhave.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ortowhave.dto.request.LoginRequest;
import com.ortowhave.dto.request.RegisterRequest;
import com.ortowhave.dto.request.VerifyPatientRequest;
import com.ortowhave.dto.response.JwtResponse;
import com.ortowhave.dto.response.MessageResponse;
import com.ortowhave.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        authService.initiatePatientRegistration(registerRequest);
        return ResponseEntity.ok(new MessageResponse("Registro iniciado. Revisa tu correo para el código de verificación."));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(new MessageResponse(isValid ? "Token válido" : "Token inválido"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody VerifyPatientRequest verifyRequest) {
        JwtResponse jwtResponse = authService.verifyPatientRegistration(verifyRequest);
        return ResponseEntity.ok(jwtResponse);
    }
}
