package com.orthowave.repository;

import com.orthowave.model.VerificacionPendiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificacionPendienteRepository extends JpaRepository<VerificacionPendiente, Long> {
    Optional<VerificacionPendiente> findByCodigoVerificacion(String codigo);
    Optional<VerificacionPendiente> findByEmail(String email);
    void deleteByFechaExpiracionBefore(LocalDateTime fecha);
} 