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
import com.ortowhave.dto.request.VerifyPatientRequest;
import com.ortowhave.dto.response.JwtResponse;
import com.ortowhave.exception.EmailAlreadyExistsException;
import com.ortowhave.exception.PhoneNumberAlreadyExistsException;
import com.ortowhave.model.User;
import com.ortowhave.model.PendingRegistration;
import com.ortowhave.repository.UserRepository;
import com.ortowhave.repository.PendingRegistrationRepository;
import com.ortowhave.security.jwt.JwtUtils;
import com.ortowhave.security.service.UserDetailsImpl;
import com.ortowhave.service.EmailService;
import java.util.Random;
import java.time.LocalDateTime;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Transactional
    public JwtResponse register(RegisterRequest registerRequest) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email ya registrado");
        }
        
        // Verificar si el teléfono ya existe
        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new PhoneNumberAlreadyExistsException("Número de teléfono ya registrado");
        }
        
        // Crear usuario
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole("ROLE_USER");
        user.setActive(true);
        
        userRepository.save(user);
        
        // Autenticar usuario y generar token
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
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
    
    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }

    /**
     * Inicia el registro de un paciente: guarda en PendingRegistration y envía código.
     */
    @Transactional
    public void initiatePatientRegistration(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail()) || pendingRegistrationRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email ya registrado o pendiente de verificación");
        }
        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber()) || pendingRegistrationRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new PhoneNumberAlreadyExistsException("Número de teléfono ya registrado o pendiente de verificación");
        }
        // Generar código de verificación
        String verificationCode = String.format("%06d", new Random().nextInt(999999));
        PendingRegistration pending = new PendingRegistration();
        pending.setFirstName(registerRequest.getFirstName());
        pending.setLastName(registerRequest.getLastName());
        pending.setEmail(registerRequest.getEmail());
        pending.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        pending.setPhoneNumber(registerRequest.getPhoneNumber());
        pending.setVerificationCode(verificationCode);
        pending.setVerified(false);
        pending.setCreationDate(LocalDateTime.now());
        pending.setExpirationDate(LocalDateTime.now().plusHours(24));
        pendingRegistrationRepository.save(pending);
        emailService.sendVerificationEmail(registerRequest.getEmail(), verificationCode);
    }

    /**
     * Verifica el código y crea el usuario definitivo.
     */
    @Transactional
    public JwtResponse verifyPatientRegistration(VerifyPatientRequest verifyRequest) {
        PendingRegistration pending = pendingRegistrationRepository.findByEmailAndVerificationCode(verifyRequest.getEmail(), verifyRequest.getVerificationCode())
            .orElseThrow(() -> new RuntimeException("Código de verificación inválido o email no encontrado"));
        if (pending.getVerified()) {
            throw new RuntimeException("Este registro ya fue verificado");
        }
        if (pending.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código de verificación ha expirado");
        }
        // Crear usuario
        User user = new User();
        user.setFirstName(pending.getFirstName());
        user.setLastName(pending.getLastName());
        user.setEmail(pending.getEmail());
        user.setPassword(pending.getPassword());
        user.setPhoneNumber(pending.getPhoneNumber());
        user.setRole("ROLE_USER");
        user.setActive(true);
        userRepository.save(user);
        pending.setVerified(true);
        pendingRegistrationRepository.save(pending);
        // Autenticar usuario y generar token
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), verifyRequest.getVerificationCode())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        return new JwtResponse(
            jwt,
            user.getId(),
            user.getFirstName() + " " + user.getLastName(),
            user.getEmail(),
            user.getRole()
        );
    }
}
