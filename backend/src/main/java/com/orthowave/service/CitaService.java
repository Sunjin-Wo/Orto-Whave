package com.orthowave.service;

import com.orthowave.model.Cita;
import com.orthowave.model.Especialista;
import com.orthowave.model.Paciente;
import com.orthowave.repository.CitaRepository;
import com.orthowave.repository.EspecialistaRepository;
import com.orthowave.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaService {
    
    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final EspecialistaRepository especialistaRepository;
    private final EmailService emailService;

    public List<Cita> listarCitas() {
        return citaRepository.findAll();
    }

    public Cita obtenerCitaPorId(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
    }

    public List<Cita> listarCitasPorPaciente(Long pacienteId) {
        return citaRepository.findByPacienteId(pacienteId);
    }

    public List<Cita> listarCitasPorEspecialista(Long especialistaId) {
        return citaRepository.findByEspecialistaId(especialistaId);
    }

    @Transactional
    public Cita agendarCita(Cita cita) {
        // Validar que el paciente existe
        Paciente paciente = pacienteRepository.findById(cita.getPaciente().getId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        
        // Validar que el especialista existe
        Especialista especialista = especialistaRepository.findById(cita.getEspecialista().getId())
                .orElseThrow(() -> new RuntimeException("Especialista no encontrado"));
        
        // Validar disponibilidad del horario
        if (citaRepository.existeCitaEnHorario(especialista.getId(), cita.getFechaHora())) {
            throw new RuntimeException("El horario seleccionado no está disponible");
        }
        
        cita.setStatus("Programada");
        cita.setFechaCreacion(LocalDateTime.now());
        cita.setFechaActualizacion(LocalDateTime.now());
        
        Cita citaGuardada = citaRepository.save(cita);
        
        // Enviar correo de confirmación
        emailService.enviarConfirmacionCita(citaGuardada);
        
        return citaGuardada;
    }

    @Transactional
    public Cita actualizarCita(Long id, Cita cita) {
        Cita citaExistente = obtenerCitaPorId(id);
        
        citaExistente.setFechaHora(cita.getFechaHora());
        citaExistente.setTipoServicio(cita.getTipoServicio());
        citaExistente.setStatus(cita.getStatus());
        citaExistente.setNotes(cita.getNotes());
        citaExistente.setFechaActualizacion(LocalDateTime.now());
        
        return citaRepository.save(citaExistente);
    }

    @Transactional
    public void cancelarCita(Long id, String motivo) {
        Cita cita = obtenerCitaPorId(id);
        cita.setStatus("Cancelada");
        cita.setNotes(motivo);
        cita.setFechaActualizacion(LocalDateTime.now());
        
        citaRepository.save(cita);
        
        // Enviar correo de cancelación
        emailService.enviarNotificacionCancelacion(cita);
    }

    public List<Cita> buscarCitasPorRangoFecha(LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.buscarPorRangoFecha(inicio, fin);
    }

    public List<Cita> buscarCitasFuturasPaciente(Long pacienteId) {
        return citaRepository.buscarCitasFuturasPaciente(pacienteId, LocalDateTime.now());
    }
} 