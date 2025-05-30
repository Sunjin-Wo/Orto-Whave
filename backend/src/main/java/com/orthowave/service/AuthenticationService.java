package com.orthowave.service;

import com.orthowave.config.JwtService;
import com.orthowave.dto.AuthenticationRequest;
import com.orthowave.dto.AuthenticationResponse;
import com.orthowave.dto.RegisterRequest;
import com.orthowave.model.Rol;
import com.orthowave.model.Usuario;
import com.orthowave.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        // Forzar el rol a PACIENTE para el registro público
        request.setRol(Rol.PACIENTE);
        return crearUsuario(request);
    }

    @Transactional
    public AuthenticationResponse crearUsuarioPorAdmin(RegisterRequest request) {
        // Verificar que el usuario actual sea admin
        var usuarioActual = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (usuarioActual.getRol() != Rol.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden crear usuarios");
        }

        return crearUsuario(request);
    }

    private AuthenticationResponse crearUsuario(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        var usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .rol(request.getRol())
                .activo(true)
                .build();

        usuarioRepository.save(usuario);
        var jwtToken = jwtService.generateToken(usuario);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        var jwtToken = jwtService.generateToken(usuario);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .rol(usuario.getRol())
                .build();
    }
} 