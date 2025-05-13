package com.ortowhite.config;

import com.ortowhite.models.Role;
import com.ortowhite.models.User;
import com.ortowhite.repositories.RoleRepository;
import com.ortowhite.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        initUsers();
    }

    private void initRoles() {
        // Crear roles si no existen
        if (roleRepository.count() == 0) {
            System.out.println("Inicializando roles...");

            Role adminRole = new Role("ROLE_ADMIN", "Administrador del sistema con acceso completo");
            Role doctorRole = new Role("ROLE_DOCTOR", "Especialista/doctor con acceso a registros médicos e historiales");
            Role staffRole = new Role("ROLE_STAFF", "Personal administrativo con acceso limitado a registros médicos");
            Role userRole = new Role("ROLE_USER", "Usuario/paciente con acceso solo a su información");

            roleRepository.save(adminRole);
            roleRepository.save(doctorRole);
            roleRepository.save(staffRole);
            roleRepository.save(userRole);

            System.out.println("Roles inicializados correctamente.");
        }
    }

    private void initUsers() {
        // Crear usuarios por defecto si no existen
        if (userRepository.count() == 0) {
            System.out.println("Inicializando usuarios por defecto...");

            // Obtener roles
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role doctorRole = roleRepository.findByName("ROLE_DOCTOR").orElseThrow();
            Role staffRole = roleRepository.findByName("ROLE_STAFF").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            // Crear usuario administrador
            User adminUser = new User();
            adminUser.setEmail("admin@ortowhave.co");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("OWC");
            adminUser.setRole(adminRole);
            adminUser.setActive(true);
            adminUser.setCreatedAt(new Date());
            adminUser.setUpdatedAt(new Date());
            userRepository.save(adminUser);

            // Crear usuario doctor
            User doctorUser = new User();
            doctorUser.setEmail("doctor@ortowhave.co");
            doctorUser.setPassword(passwordEncoder.encode("doctor123"));
            doctorUser.setFirstName("Doctor");
            doctorUser.setLastName("Ejemplo");
            doctorUser.setRole(doctorRole);
            doctorUser.setActive(true);
            doctorUser.setCreatedAt(new Date());
            doctorUser.setUpdatedAt(new Date());
            userRepository.save(doctorUser);

            // Crear usuario staff
            User staffUser = new User();
            staffUser.setEmail("staff@ortowhave.co");
            staffUser.setPassword(passwordEncoder.encode("staff123"));
            staffUser.setFirstName("Staff");
            staffUser.setLastName("Ejemplo");
            staffUser.setRole(staffRole);
            staffUser.setActive(true);
            staffUser.setCreatedAt(new Date());
            staffUser.setUpdatedAt(new Date());
            userRepository.save(staffUser);

            // Crear usuario paciente
            User patientUser = new User();
            patientUser.setEmail("paciente@ortowhave.co");
            patientUser.setPassword(passwordEncoder.encode("paciente123"));
            patientUser.setFirstName("Paciente");
            patientUser.setLastName("Ejemplo");
            patientUser.setRole(userRole);
            patientUser.setActive(true);
            patientUser.setCreatedAt(new Date());
            patientUser.setUpdatedAt(new Date());
            userRepository.save(patientUser);

            System.out.println("Usuarios por defecto inicializados correctamente.");
        }
    }
} 