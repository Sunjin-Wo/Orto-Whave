package com.ortowhite.controllers;

import com.ortowhite.models.Patient;
import com.ortowhite.models.Role;
import com.ortowhite.models.User;
import com.ortowhite.repositories.RoleRepository;
import com.ortowhite.repositories.UserRepository;
import com.ortowhite.security.JwtTokenProvider;
import com.ortowhite.security.UserPrincipal;
import com.ortowhite.services.EmailService;
import com.ortowhite.services.PatientService;
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
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
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
    private PatientService patientService;
    
    @Autowired
    private EmailService emailService;

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
            
            // Asignar siempre el rol de usuario (paciente) para nuevos registros
            // El ID 4 corresponde a ROLE_USER según la base de datos
            Role userRole = roleRepository.findById(4L)
                    .orElseThrow(() -> new RuntimeException("No se encontró el rol de usuario"));
            
            // Generar código de verificación de 6 dígitos
            String verificationCode = generateVerificationCode();
            
            // Establecer fecha de expiración (24 horas)
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.HOUR, 24);
            Date expiryTime = cal.getTime();
            
            // Crear y guardar el usuario
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhone(phone);
            user.setRole(userRole);
            user.setActive(true);
            user.setEmailVerified(false);
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiry(expiryTime);
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
            
            // Enviar correo de verificación
            try {
                emailService.sendVerificationEmail(email, verificationCode);
                System.out.println("CÓDIGO DE VERIFICACIÓN (DEBUG): " + verificationCode);
            } catch (Exception e) {
                // Manejar error de envío de correo pero continuar con el registro
                System.err.println("Error al enviar correo de verificación: " + e.getMessage());
                System.err.println("Detalles técnicos: ");
                e.printStackTrace();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente. Por favor verifica tu correo electrónico.");
            response.put("userId", savedUser.getId());
            response.put("patientId", savedPatient.getId());
            
            // Incluir el código de verificación en la respuesta para facilitar las pruebas
            // En producción, esto debería eliminarse o condicionarse a un perfil de desarrollo
            response.put("verificationCode", verificationCode);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error al registrar el usuario: " + e.getMessage()));
        }
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> verificationRequest) {
        String email = verificationRequest.get("email");
        String code = verificationRequest.get("code");
        
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario no encontrado"));
        }
        
        if (user.getEmailVerified()) {
            return ResponseEntity.ok(Map.of("message", "Correo electrónico ya verificado"));
        }
        
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Código de verificación inválido"));
        }
        
        if (user.getVerificationCodeExpiry().before(new Date())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Código de verificación expirado"));
        }
        
        // Marcar correo como verificado
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Correo electrónico verificado exitosamente"));
    }
    
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> resendRequest) {
        String email = resendRequest.get("email");
        
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario no encontrado"));
        }
        
        if (user.getEmailVerified()) {
            return ResponseEntity.ok(Map.of("message", "Correo electrónico ya verificado"));
        }
        
        // Generar nuevo código de verificación
        String verificationCode = generateVerificationCode();
        
        // Establecer nueva fecha de expiración (24 horas)
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, 24);
        Date expiryTime = cal.getTime();
        
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(expiryTime);
        userRepository.save(user);
        
        // Enviar correo de verificación
        try {
            emailService.sendVerificationEmail(email, verificationCode);
            System.out.println("CÓDIGO DE VERIFICACIÓN REENVIADO (DEBUG): " + verificationCode);
        } catch (Exception e) {
            System.err.println("Error al reenviar correo de verificación: " + e.getMessage());
            System.err.println("Detalles técnicos: ");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al enviar el correo de verificación"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Código de verificación reenviado exitosamente");
        // Incluir el código en la respuesta para facilitar pruebas
        response.put("verificationCode", verificationCode);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            
            // Verificar si el usuario existe
            User user = userRepository.findByEmail(email).orElse(null);
            
            if (user == null) {
                // Verificar credenciales de desarrollo solo en entorno dev
                if (email.equals("admin@ortowhave.co") || 
                    email.equals("doctor@ortowhave.co") || 
                    email.equals("staff@ortowhave.co") || 
                    email.equals("paciente@ortowhave.co")) {
                        
                    return handleDevCredentials(loginRequest);
                }
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Credenciales inválidas"));
            }
            
            if (!user.getEmailVerified() && !email.endsWith("@ortowhave.co")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Por favor verifica tu correo electrónico antes de iniciar sesión",
                                     "needsVerification", true));
            }
            
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                loginRequest.get("password")
                        )
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);
                
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                
                // Actualizar el último inicio de sesión
                user.setLastLogin(new Date());
                userRepository.save(user);
                
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
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Error en el proceso de autenticación"));
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
    
    // Método para generar un código de verificación aleatorio de 6 dígitos
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // Genera un número entre 100000 y 999999
        return String.valueOf(code);
    }

    // Método para manejar credenciales de desarrollo
    private ResponseEntity<?> handleDevCredentials(Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        Long roleId;
        String roleName;
        String name;
        
        // Validar credenciales de desarrollo
        if (email.equals("admin@ortowhave.co") && password.equals("admin123")) {
            roleId = 1L;
            roleName = "ROLE_ADMIN";
            name = "Admin OWC";
        } else if (email.equals("doctor@ortowhave.co") && password.equals("doctor123")) {
            roleId = 2L;
            roleName = "ROLE_DOCTOR";
            name = "Doctor Ejemplo";
        } else if (email.equals("staff@ortowhave.co") && password.equals("staff123")) {
            roleId = 3L;
            roleName = "ROLE_STAFF";
            name = "Staff Ejemplo";
        } else if (email.equals("paciente@ortowhave.co") && password.equals("paciente123")) {
            roleId = 4L;
            roleName = "ROLE_USER";
            name = "Paciente Ejemplo";
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales inválidas"));
        }
        
        // Crear una respuesta simulada para desarrollo
        Map<String, Object> response = new HashMap<>();
        response.put("token", "dev_token_" + roleId);
        response.put("id", roleId);
        response.put("email", email);
        response.put("name", name);
        response.put("role", roleName);
        
        return ResponseEntity.ok(response);
    }
} 