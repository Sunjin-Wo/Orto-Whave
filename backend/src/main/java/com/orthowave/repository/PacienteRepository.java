package com.orthowave.repository;

import com.orthowave.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByDocumentoIdentidad(String documentoIdentidad);
    Optional<Paciente> findByEmail(String email);
    List<Paciente> findByNombreContainingOrApellidoContaining(String nombre, String apellido);
    
    @Query("SELECT p FROM Paciente p WHERE p.usuario.id = ?1")
    Optional<Paciente> findByUsuarioId(Long usuarioId);
    
    @Query("SELECT p FROM Paciente p WHERE p.historiaClinica LIKE %?1%")
    List<Paciente> buscarPorHistoriaClinica(String terminoBusqueda);
} 