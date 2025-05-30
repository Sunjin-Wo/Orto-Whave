package com.orthowave.service;

import com.orthowave.dto.AuthenticationRequest;
import com.orthowave.dto.AuthenticationResponse;
import com.orthowave.dto.RegisterRequest;
import com.orthowave.model.Rol;
import com.orthowave.model.Usuario;
import com.orthowave.model.VerificacionPendiente;
import com.orthowave.repository.UsuarioRepository;
import com.orthowave.repository.VerificacionPendienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final VerificacionPendienteRepository verificacionRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int CODIGO_LENGTH = 32;

    @Transactional
    public void registrarUsuario(RegisterRequest request) {
        // Forzar el rol a PACIENTE para el registro público
        request.setRol(Rol.PACIENTE);
        
        // Validar datos únicos
        validarDatosUnicos(request);

        // Verificar si hay una verificación pendiente y eliminarla
        verificacionRepository.findByEmail(request.getEmail())
                .ifPresent(verificacionRepository::delete);

        // Generar código de verificación único
        String codigoVerificacion = generarCodigoVerificacionUnico();

        // Crear verificación pendiente
        VerificacionPendiente verificacion = VerificacionPendiente.builder()
                .email(request.getEmail())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .rol(Rol.PACIENTE) // Forzar el rol a PACIENTE
                .codigoVerificacion(codigoVerificacion)
                .build();

        verificacionRepository.save(verificacion);
        log.info("Verificación pendiente creada para el email: {}", request.getEmail());

        // Enviar correo de verificación
        emailService.sendVerificationEmail(
                request.getEmail(),
                request.getNombre(),
                codigoVerificacion
        );
    }

    private void validarDatosUnicos(RegisterRequest request) {
        // Validar email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            log.warn("Intento de registro con email existente: {}", request.getEmail());
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        // Validar teléfono
        if (usuarioRepository.existsByTelefono(request.getTelefono())) {
            log.warn("Intento de registro con teléfono existente: {}", request.getTelefono());
            throw new RuntimeException("El número de teléfono ya está registrado");
        }

        // Validar si hay una cuenta verificada pendiente con el mismo email
        verificacionRepository.findByEmail(request.getEmail())
                .ifPresent(verificacion -> {
                    if (!verificacion.getFechaExpiracion().isBefore(LocalDateTime.now())) {
                        log.warn("Intento de registro con verificación pendiente: {}", request.getEmail());
                        throw new RuntimeException("Ya existe una verificación pendiente para este correo. Por favor, revisa tu bandeja de entrada o solicita un nuevo código.");
                    }
                });
    }

    private String generarCodigoVerificacionUnico() {
        String codigo;
        int intentos = 0;
        final int MAX_INTENTOS = 5;

        do {
            if (intentos >= MAX_INTENTOS) {
                log.error("No se pudo generar un código único después de {} intentos", MAX_INTENTOS);
                throw new RuntimeException("Error al generar código de verificación único");
            }

            byte[] randomBytes = new byte[CODIGO_LENGTH];
            secureRandom.nextBytes(randomBytes);
            codigo = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
            intentos++;
        } while (verificacionRepository.findByCodigoVerificacion(codigo).isPresent());

        log.debug("Código de verificación único generado en {} intentos", intentos);
        return codigo;
    }

    @Transactional
    public void verificarCuenta(String codigo) {
        VerificacionPendiente verificacion = verificacionRepository.findByCodigoVerificacion(codigo)
                .orElseThrow(() -> {
                    log.warn("Intento de verificación con código inválido: {}", codigo);
                    return new RuntimeException("Código de verificación inválido");
                });

        if (verificacion.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            verificacionRepository.delete(verificacion);
            log.warn("Intento de verificación con código expirado para: {}", verificacion.getEmail());
            throw new RuntimeException("El código de verificación ha expirado");
        }

        // Verificar nuevamente que no exista un usuario con el mismo email o teléfono
        if (usuarioRepository.existsByEmail(verificacion.getEmail())) {
            verificacionRepository.delete(verificacion);
            log.warn("Conflicto de email durante verificación: {}", verificacion.getEmail());
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        if (usuarioRepository.existsByTelefono(verificacion.getTelefono())) {
            verificacionRepository.delete(verificacion);
            log.warn("Conflicto de teléfono durante verificación: {}", verificacion.getTelefono());
            throw new RuntimeException("El número de teléfono ya está registrado");
        }

        // Crear usuario verificado
        Usuario usuario = Usuario.builder()
                .email(verificacion.getEmail())
                .nombre(verificacion.getNombre())
                .apellido(verificacion.getApellido())
                .password(verificacion.getPassword())
                .telefono(verificacion.getTelefono())
                .rol(verificacion.getRol())
                .activo(true)
                .fechaRegistro(LocalDateTime.now())
                .build();

        usuarioRepository.save(usuario);
        verificacionRepository.delete(verificacion);
        log.info("Usuario verificado y registrado exitosamente: {}", verificacion.getEmail());
    }

    @Transactional
    public void reenviarVerificacion(String email) {
        VerificacionPendiente verificacion = verificacionRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Intento de reenvío de verificación para email no pendiente: {}", email);
                    return new RuntimeException("No hay una verificación pendiente para este correo");
                });

        String nuevoCodigoVerificacion = generarCodigoVerificacionUnico();
        verificacion.setCodigoVerificacion(nuevoCodigoVerificacion);
        verificacion.setFechaExpiracion(LocalDateTime.now().plusHours(24));

        verificacionRepository.save(verificacion);
        log.info("Nuevo código de verificación generado para: {}", email);

        emailService.sendVerificationEmail(
                verificacion.getEmail(),
                verificacion.getNombre(),
                nuevoCodigoVerificacion
        );
    }

    @Transactional
    public void limpiarVerificacionesExpiradas() {
        LocalDateTime ahora = LocalDateTime.now();
        verificacionRepository.deleteByFechaExpiracionBefore(ahora);
        log.info("Limpieza de verificaciones expiradas completada: {}", ahora);
    }

    @Transactional
    public AuthenticationResponse autenticar(AuthenticationRequest request) {
        var usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.isEnabled()) {
            throw new RuntimeException("La cuenta no está verificada");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        var jwtToken = jwtService.generateToken(usuario);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }
} 