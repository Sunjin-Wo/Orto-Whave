package com.ortowhave.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ortowhave.dto.request.LoginRequest;
import com.ortowhave.dto.request.RegisterRequest;
import com.ortowhave.dto.request.ResendVerificationRequest;
import com.ortowhave.dto.request.VerificationRequest;
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
        authService.register(registerRequest);
        return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente. Por favor verifica tu correo."));
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerificationRequest verificationRequest) {
        JwtResponse jwtResponse = authService.verifyEmail(verificationRequest);
        return ResponseEntity.ok(jwtResponse);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }
    
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerificationCode(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("Código de verificación reenviado exitosamente."));
    }
}
