package com.ortowhite.api.service;

import com.ortowhite.api.dto.AuthRequest;
import com.ortowhite.api.dto.AuthResponse;
import com.ortowhite.api.dto.RegisterRequest;
import com.ortowhite.api.model.PendingRegistration;
import com.ortowhite.api.model.User;
import com.ortowhite.api.repository.PendingRegistrationRepository;
import com.ortowhite.api.repository.UserRepository;
import com.ortowhite.api.security.JwtService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
        String token = jwtService.generateToken(user);
        
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserDTO.fromUser(user))
            .build();
    }

    @Transactional
    public String registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        String verificationCode = generateVerificationCode();
        
        PendingRegistration pendingRegistration = new PendingRegistration();
        pendingRegistration.setFirstName(request.getFirstName());
        pendingRegistration.setLastName(request.getLastName());
        pendingRegistration.setEmail(request.getEmail());
        pendingRegistration.setPassword(passwordEncoder.encode(request.getPassword()));
        pendingRegistration.setPhoneNumber(request.getPhoneNumber());
        pendingRegistration.setVerificationCode(verificationCode);
        pendingRegistration.setExpirationTime(LocalDateTime.now().plusHours(24));
        pendingRegistration.setRole(User.Role.ROLE_USER);

        pendingRegistrationRepository.save(pendingRegistration);

        try {
            emailService.sendVerificationEmail(request.getEmail(), verificationCode, request.getFirstName());
            return "Se ha enviado un código de verificación a tu correo electrónico";
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de verificación");
        }
    }

    @Transactional
    public AuthResponse verifyEmail(String email, String code) {
        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmailAndVerificationCode(email, code)
            .orElseThrow(() -> new RuntimeException("Código de verificación inválido"));

        if (LocalDateTime.now().isAfter(pendingRegistration.getExpirationTime())) {
            pendingRegistrationRepository.delete(pendingRegistration);
            throw new RuntimeException("El código de verificación ha expirado");
        }

        User user = new User();
        user.setFirstName(pendingRegistration.getFirstName());
        user.setLastName(pendingRegistration.getLastName());
        user.setEmail(pendingRegistration.getEmail());
        user.setPassword(pendingRegistration.getPassword());
        user.setPhoneNumber(pendingRegistration.getPhoneNumber());
        user.setRole(pendingRegistration.getRole());

        user = userRepository.save(user);
        pendingRegistrationRepository.delete(pendingRegistration);

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserDTO.fromUser(user))
            .build();
    }

    @Transactional
    public AuthResponse registerDoctor(RegisterRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
            .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            
        if (admin.getRole() != User.Role.ROLE_ADMIN) {
            throw new RuntimeException("No tienes permisos para registrar doctores");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User doctor = new User();
        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setPhoneNumber(request.getPhoneNumber());
        doctor.setRole(User.Role.ROLE_DOCTOR);

        doctor = userRepository.save(doctor);
        String token = jwtService.generateToken(doctor);
        
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserDTO.fromUser(doctor))
            .build();
    }

    public AuthResponse.UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return AuthResponse.UserDTO.fromUser(user);
    }

    @Transactional
    public AuthResponse.UserDTO updateProfile(RegisterRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);
        return AuthResponse.UserDTO.fromUser(user);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
} 