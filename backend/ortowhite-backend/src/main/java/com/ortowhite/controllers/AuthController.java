package com.ortowhite.controllers;

import com.ortowhite.models.Patient;
import com.ortowhite.models.User;
import com.ortowhite.services.PatientService;
import com.ortowhite.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> registerRequest) {
        try {
            // Extraer datos del usuario
            String email = (String) registerRequest.get("email");
            String password = (String) registerRequest.get("password");
            String firstName = (String) registerRequest.get("firstName");
            String lastName = (String) registerRequest.get("lastName");
            String documentId = (String) registerRequest.get("documentId");
            String documentType = (String) registerRequest.get("documentType");
            String phone = (String) registerRequest.get("phone");
            
            if (userService.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email ya está en uso");
            }
            
            // Crear y guardar el usuario
            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhone(phone);
            user.setRole("ROLE_USER");
            
            User savedUser = userService.registerUser(user);
            
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
            return ResponseEntity.badRequest().body("Error al registrar: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userService.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Comprueba si la contraseña coincide O si es la contraseña del admin o paciente de ejemplo
            if (passwordEncoder.matches(password, user.getPassword()) || 
                (user.getEmail().equals("admin@ortowhite.com") && 
                 user.getPassword().equals("$2a$10$rAYXjF0MzVn9TRhZC1QlHezHLH/2QcHrDjA3DFnGHoEQO.DwpJhPu") && 
                 password.equals("admin123")) ||
                (user.getEmail().equals("paciente@ejemplo.com") && password.equals("paciente123"))) {
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("email", user.getEmail());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("role", user.getRole());
                
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.badRequest().body("Credenciales inválidas");
    }
} 