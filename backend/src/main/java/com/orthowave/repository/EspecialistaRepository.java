package com.orthowave.repository;

import com.orthowave.model.Especialista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EspecialistaRepository extends JpaRepository<Especialista, Long> {
    Optional<Especialista> findByNumeroLicencia(String numeroLicencia);
    List<Especialista> findByEspecialidad(String especialidad);
    
    @Query("SELECT e FROM Especialista e WHERE e.usuario.id = ?1")
    Optional<Especialista> findByUsuarioId(Long usuarioId);
    
    @Query("SELECT e FROM Especialista e WHERE e.usuario.nombre LIKE %?1% OR e.usuario.apellido LIKE %?1%")
    List<Especialista> buscarPorNombreOApellido(String termino);
    
    @Query("SELECT e FROM Especialista e WHERE e.especialidad = ?1 AND e.horasDisponibles LIKE %?2%")
    List<Especialista> buscarPorEspecialidadYDisponibilidad(String especialidad, String disponibilidad);
} 