package com.ortowhave.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ortowhave.dto.request.LoginRequest;
import com.ortowhave.dto.request.RegisterRequest;
import com.ortowhave.dto.request.VerificationRequest;
import com.ortowhave.dto.response.JwtResponse;
import com.ortowhave.exception.EmailAlreadyExistsException;
import com.ortowhave.exception.InvalidVerificationCodeException;
import com.ortowhave.exception.PhoneNumberAlreadyExistsException;
import com.ortowhave.exception.ResourceNotFoundException;
import com.ortowhave.exception.VerificationCodeExpiredException;
import com.ortowhave.model.PendingRegistration;
import com.ortowhave.model.User;
import com.ortowhave.repository.PendingRegistrationRepository;
import com.ortowhave.repository.UserRepository;
import com.ortowhave.security.jwt.JwtUtils;
import com.ortowhave.security.service.UserDetailsImpl;
import com.ortowhave.util.VerificationCodeGenerator;

import java.time.LocalDateTime;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private VerificationCodeGenerator codeGenerator;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Transactional
    public void register(RegisterRequest registerRequest) {
        // Verificar si el email ya existe en usuarios
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email ya registrado");
        }
        
        // Verificar si el teléfono ya existe en usuarios
        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new PhoneNumberAlreadyExistsException("Número de teléfono ya registrado");
        }
        
        // Verificar si el email ya existe en registros pendientes
        if (pendingRegistrationRepository.existsByEmail(registerRequest.getEmail())) {
            // Si existe, eliminar el registro pendiente anterior
            PendingRegistration existingRegistration = pendingRegistrationRepository.findByEmail(registerRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró registro pendiente para este email"));
            pendingRegistrationRepository.delete(existingRegistration);
        }
        
        // Verificar si el teléfono ya existe en registros pendientes
        if (pendingRegistrationRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            // Si existe, eliminar el registro pendiente anterior
            PendingRegistration existingRegistration = pendingRegistrationRepository.findByPhoneNumber(registerRequest.getPhoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró registro pendiente para este teléfono"));
            pendingRegistrationRepository.delete(existingRegistration);
        }
        
        // Generar código de verificación
        String verificationCode = codeGenerator.generateCode();
        
        // Crear registro pendiente
        PendingRegistration pendingRegistration = new PendingRegistration();
        pendingRegistration.setFirstName(registerRequest.getFirstName());
        pendingRegistration.setLastName(registerRequest.getLastName());
        pendingRegistration.setEmail(registerRequest.getEmail());
        pendingRegistration.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        pendingRegistration.setPhoneNumber(registerRequest.getPhoneNumber());
        pendingRegistration.setVerificationCode(verificationCode);
        
        pendingRegistrationRepository.save(pendingRegistration);
        
        // Enviar correo de verificación
        emailService.sendVerificationEmail(registerRequest.getEmail(), verificationCode);
    }
    
    @Transactional
    public JwtResponse verifyEmail(VerificationRequest verificationRequest) {
        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmail(verificationRequest.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("No se encontró registro pendiente para este email"));
        
        // Verificar si el código es correcto
        if (!pendingRegistration.getVerificationCode().equals(verificationRequest.getCode())) {
            throw new InvalidVerificationCodeException("Código de verificación inválido");
        }
        
        // Verificar si el código ha expirado
        if (LocalDateTime.now().isAfter(pendingRegistration.getExpirationDate())) {
            throw new VerificationCodeExpiredException("El código de verificación ha expirado");
        }
        
        // Crear usuario verificado
        User user = new User();
        user.setFirstName(pendingRegistration.getFirstName());
        user.setLastName(pendingRegistration.getLastName());
        user.setEmail(pendingRegistration.getEmail());
        user.setPassword(pendingRegistration.getPassword());
        user.setPhoneNumber(pendingRegistration.getPhoneNumber());
        user.setRole("ROLE_USER");
        user.setActive(true);
        
        userRepository.save(user);
        
        // Marcar registro como verificado
        pendingRegistration.setVerified(true);
        pendingRegistrationRepository.save(pendingRegistration);
        
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(verificationRequest.getEmail(), pendingRegistration.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generar token JWT
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        return new JwtResponse(
            jwt,
            user.getId(),
            user.getFirstName() + " " + user.getLastName(),
            user.getEmail(),
            user.getRole()
        );
    }
    
    public JwtResponse login(LoginRequest loginRequest) {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generar token JWT
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getFirstName() + " " + userDetails.getLastName(),
            userDetails.getEmail(),
            userDetails.getAuthorities().iterator().next().getAuthority()
        );
    }
    
    @Transactional
    public void resendVerificationCode(String email) {
        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("No se encontró registro pendiente para este email"));
        
        // Generar nuevo código
        String newCode = codeGenerator.generateCode();
        
        // Actualizar código y fecha de expiración
        pendingRegistration.setVerificationCode(newCode);
        pendingRegistration.setExpirationDate(LocalDateTime.now().plusHours(24));
        
        pendingRegistrationRepository.save(pendingRegistration);
        
        // Enviar nuevo código por correo
        emailService.sendVerificationEmail(email, newCode);
    }
}
