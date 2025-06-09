package com.ortowhite.auth.service;

import com.ortowhite.auth.config.JwtService;
import com.ortowhite.auth.dto.AuthenticationRequest;
import com.ortowhite.auth.dto.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Attempting authentication for user: {}", request.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        UserDetails user = (UserDetails) authentication.getPrincipal();
        String role = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst()
            .orElse("ROLE_USER");

        String token = jwtService.generateToken(user);
        String redirectUrl = determineRedirectUrl(role);

        log.info("Authentication successful for user: {} with role: {}", request.getEmail(), role);
        
        return AuthenticationResponse.builder()
            .token(token)
            .email(user.getUsername())
            .role(role.replace("ROLE_", ""))
            .success(true)
            .message("Inicio de sesión exitoso")
            .redirectUrl(redirectUrl)
            .build();
    }

    private String determineRedirectUrl(String role) {
        return switch (role) {
            case "ROLE_ADMIN" -> "/admin/dashboard";
            case "ROLE_DOCTOR" -> "/doctor/dashboard";
            case "ROLE_PATIENT" -> "/patient/dashboard";
            default -> "/";
        };
    }
} 