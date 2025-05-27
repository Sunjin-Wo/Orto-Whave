package com.orthowave.repository;

import com.orthowave.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByPacienteId(Long pacienteId);
    List<Cita> findByEspecialistaId(Long especialistaId);
    List<Cita> findByStatus(String status);
    
    @Query("SELECT c FROM Cita c WHERE c.fechaHora BETWEEN ?1 AND ?2")
    List<Cita> buscarPorRangoFecha(LocalDateTime inicio, LocalDateTime fin);
    
    @Query("SELECT c FROM Cita c WHERE c.especialista.id = ?1 AND c.fechaHora BETWEEN ?2 AND ?3")
    List<Cita> buscarPorEspecialistaYRangoFecha(Long especialistaId, LocalDateTime inicio, LocalDateTime fin);
    
    @Query("SELECT c FROM Cita c WHERE c.paciente.id = ?1 AND c.fechaHora >= ?2")
    List<Cita> buscarCitasFuturasPaciente(Long pacienteId, LocalDateTime desde);
    
    @Query("SELECT COUNT(c) > 0 FROM Cita c WHERE c.especialista.id = ?1 AND c.fechaHora = ?2")
    boolean existeCitaEnHorario(Long especialistaId, LocalDateTime fechaHora);
} 