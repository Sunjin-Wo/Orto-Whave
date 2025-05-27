package com.orthowave.controller;

import com.orthowave.model.Cita;
import com.orthowave.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Cita>> listarCitas() {
        return ResponseEntity.ok(citaService.listarCitas());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @seguridadService.esPacienteDeCita(#id)")
    public ResponseEntity<Cita> obtenerCita(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.obtenerCitaPorId(id));
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasRole('ADMIN') or #pacienteId == authentication.principal.id")
    public ResponseEntity<List<Cita>> listarCitasPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.listarCitasPorPaciente(pacienteId));
    }

    @GetMapping("/especialista/{especialistaId}")
    @PreAuthorize("hasRole('ADMIN') or #especialistaId == authentication.principal.id")
    public ResponseEntity<List<Cita>> listarCitasPorEspecialista(@PathVariable Long especialistaId) {
        return ResponseEntity.ok(citaService.listarCitasPorEspecialista(especialistaId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Cita> agendarCita(@Valid @RequestBody Cita cita) {
        return ResponseEntity.ok(citaService.agendarCita(cita));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Cita> actualizarCita(
            @PathVariable Long id,
            @Valid @RequestBody Cita cita) {
        return ResponseEntity.ok(citaService.actualizarCita(id, cita));
    }

    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @seguridadService.esPacienteDeCita(#id)")
    public ResponseEntity<Void> cancelarCita(
            @PathVariable Long id,
            @RequestBody String motivo) {
        citaService.cancelarCita(id, motivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<Cita>> buscarCitasPorRangoFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(citaService.buscarCitasPorRangoFecha(inicio, fin));
    }

    @GetMapping("/paciente/{pacienteId}/futuras")
    @PreAuthorize("hasRole('ADMIN') or #pacienteId == authentication.principal.id")
    public ResponseEntity<List<Cita>> buscarCitasFuturasPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.buscarCitasFuturasPaciente(pacienteId));
    }
} 