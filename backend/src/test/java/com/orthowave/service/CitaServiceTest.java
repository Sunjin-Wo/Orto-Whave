package com.orthowave.service;

import com.orthowave.model.Cita;
import com.orthowave.model.Paciente;
import com.orthowave.model.Especialista;
import com.orthowave.repository.CitaRepository;
import com.orthowave.repository.PacienteRepository;
import com.orthowave.repository.EspecialistaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CitaServiceTest {

    @Mock
    private CitaRepository citaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private EspecialistaRepository especialistaRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private CitaService citaService;

    private Cita cita;
    private Paciente paciente;
    private Especialista especialista;

    @BeforeEach
    void setUp() {
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setEmail("paciente@example.com");

        especialista = new Especialista();
        especialista.setId(1L);
        especialista.setEspecialidad("Ortopedia");

        cita = new Cita();
        cita.setId(1L);
        cita.setPaciente(paciente);
        cita.setEspecialista(especialista);
        cita.setFechaHora(LocalDateTime.now().plusDays(1));
        cita.setStatus("Programada");
    }

    @Test
    void deberiaAgendarCita() {
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(especialistaRepository.findById(1L)).thenReturn(Optional.of(especialista));
        when(citaRepository.existeCitaEnHorario(anyLong(), any(LocalDateTime.class))).thenReturn(false);
        when(citaRepository.save(any(Cita.class))).thenReturn(cita);

        Cita citaAgendada = citaService.agendarCita(cita);

        assertNotNull(citaAgendada);
        assertEquals("Programada", citaAgendada.getStatus());
        verify(emailService).enviarConfirmacionCita(any(Cita.class));
    }

    @Test
    void deberiaCancelarCita() {
        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));
        when(citaRepository.save(any(Cita.class))).thenReturn(cita);

        citaService.cancelarCita(1L, "Motivo de cancelación");

        verify(citaRepository).save(argThat(c -> "Cancelada".equals(c.getStatus())));
        verify(emailService).enviarNotificacionCancelacion(any(Cita.class));
    }

    @Test
    void deberiaBuscarCitasPorRangoFecha() {
        LocalDateTime inicio = LocalDateTime.now();
        LocalDateTime fin = inicio.plusDays(7);
        
        when(citaRepository.buscarPorRangoFecha(inicio, fin))
            .thenReturn(Arrays.asList(cita));

        List<Cita> citas = citaService.buscarCitasPorRangoFecha(inicio, fin);

        assertNotNull(citas);
        assertFalse(citas.isEmpty());
        assertEquals(1, citas.size());
    }

    @Test
    void deberiaListarCitasPorPaciente() {
        when(citaRepository.findByPacienteId(1L)).thenReturn(Arrays.asList(cita));

        List<Cita> citas = citaService.listarCitasPorPaciente(1L);

        assertNotNull(citas);
        assertFalse(citas.isEmpty());
        assertEquals(1, citas.size());
    }

    @Test
    void deberiaListarCitasPorEspecialista() {
        when(citaRepository.findByEspecialistaId(1L)).thenReturn(Arrays.asList(cita));

        List<Cita> citas = citaService.listarCitasPorEspecialista(1L);

        assertNotNull(citas);
        assertFalse(citas.isEmpty());
        assertEquals(1, citas.size());
    }
} 