package com.ortowhite.controllers;

import com.ortowhite.models.Patient;
import com.ortowhite.models.Role;
import com.ortowhite.models.User;
import com.ortowhite.repositories.RoleRepository;
import com.ortowhite.repositories.UserRepository;
import com.ortowhite.security.JwtTokenProvider;
import com.ortowhite.security.UserPrincipal;
import com.ortowhite.services.PatientService;
import com.ortowhite.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;
    
    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody Map<String, Object> registerRequest) {
        try {
            // Extraer datos del usuario
            String email = (String) registerRequest.get("email");
            String password = (String) registerRequest.get("password");
            String firstName = (String) registerRequest.get("firstName");
            String lastName = (String) registerRequest.get("lastName");
            String documentId = (String) registerRequest.get("documentId");
            String documentType = (String) registerRequest.get("documentType");
            String phone = (String) registerRequest.get("phone");
            
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email ya está en uso"));
            }
            
            // Obtener el rol de usuario
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("No se encontró el rol de usuario"));
            
            // Crear y guardar el usuario
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhone(phone);
            user.setRole(userRole);
            user.setActive(true);
            user.setCreatedAt(new Date());
            user.setUpdatedAt(new Date());
            
            User savedUser = userRepository.save(user);
            
            // Crear y guardar el paciente asociado al usuario
            Patient patient = new Patient();
            patient.setFirstName(firstName);
            patient.setLastName(lastName);
            patient.setEmail(email);
            patient.setPhone(phone);
            patient.setDocumentId(documentId);
            patient.setDocumentType(documentType != null ? documentType : "CC");
            patient.setUser(savedUser);
            
            Patient savedPatient = patientService.savePatient(patient);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario y paciente registrados exitosamente");
            response.put("userId", savedUser.getId());
            response.put("patientId", savedPatient.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error al registrar el usuario: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody Map<String, String> loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("email"),
                            loginRequest.get("password")
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Actualizar el último inicio de sesión
            User user = userRepository.findById(userPrincipal.getId()).orElse(null);
            if (user != null) {
                user.setLastLogin(new Date());
                userRepository.save(user);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("id", userPrincipal.getId());
            response.put("email", userPrincipal.getEmail());
            response.put("name", userPrincipal.getName());
            response.put("role", userPrincipal.getRole());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales inválidas"));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", userPrincipal.getId());
            response.put("email", userPrincipal.getEmail());
            response.put("name", userPrincipal.getName());
            response.put("role", userPrincipal.getRole());
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Token inválido o expirado"));
    }
} 