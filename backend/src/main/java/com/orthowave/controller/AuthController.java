package com.orthowave.controller;

import com.orthowave.dto.AuthenticationRequest;
import com.orthowave.dto.AuthenticationResponse;
import com.orthowave.dto.RegisterRequest;
import com.orthowave.service.AuthService;
import com.orthowave.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para registro y autenticación de usuarios")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationService authenticationService;

    @Operation(summary = "Registrar un nuevo paciente")
    @ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario ya existe")
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.registrarUsuario(request);
        return ResponseEntity.ok(Map.of(
            "message", "Se ha enviado un correo de verificación a " + request.getEmail()
        ));
    }

    @Operation(summary = "Crear un nuevo usuario (solo administradores)")
    @ApiResponse(responseCode = "200", description = "Usuario creado exitosamente")
    @ApiResponse(responseCode = "403", description = "No tienes permisos para crear usuarios")
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthenticationResponse> crearUsuario(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.crearUsuarioPorAdmin(request));
    }

    @Operation(summary = "Verificar cuenta de usuario")
    @ApiResponse(responseCode = "200", description = "Cuenta verificada exitosamente")
    @ApiResponse(responseCode = "400", description = "Código de verificación inválido o expirado")
    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyAccount(@RequestParam String code) {
        authService.verificarCuenta(code);
        return ResponseEntity.ok(Map.of(
            "message", "Cuenta verificada exitosamente"
        ));
    }

    @Operation(summary = "Reenviar correo de verificación")
    @ApiResponse(responseCode = "200", description = "Correo de verificación reenviado")
    @ApiResponse(responseCode = "404", description = "No hay verificación pendiente para el email")
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(@RequestParam String email) {
        authService.reenviarVerificacion(email);
        return ResponseEntity.ok(Map.of(
            "message", "Se ha enviado un nuevo correo de verificación"
        ));
    }

    @Operation(summary = "Iniciar sesión")
    @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso")
    @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.autenticar(request));
    }
} 