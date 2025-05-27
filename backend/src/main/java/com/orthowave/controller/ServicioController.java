package com.orthowave.controller;

import com.orthowave.model.Servicio;
import com.orthowave.service.ServicioMedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioController {

    private final ServicioMedicoService servicioMedicoService;

    @GetMapping
    public ResponseEntity<List<Servicio>> listarServicios() {
        return ResponseEntity.ok(servicioMedicoService.listarServicios());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Servicio>> listarServiciosActivos() {
        return ResponseEntity.ok(servicioMedicoService.listarServiciosActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtenerServicio(@PathVariable Long id) {
        return ResponseEntity.ok(servicioMedicoService.obtenerServicioPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Servicio>> buscarServiciosPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(servicioMedicoService.buscarServiciosPorNombre(nombre));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> crearServicio(@Valid @RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioMedicoService.crearServicio(servicio));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> actualizarServicio(
            @PathVariable Long id,
            @Valid @RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioMedicoService.actualizarServicio(id, servicio));
    }

    @PutMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivarServicio(@PathVariable Long id) {
        servicioMedicoService.desactivarServicio(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activarServicio(@PathVariable Long id) {
        servicioMedicoService.activarServicio(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/precio")
    public ResponseEntity<List<Servicio>> buscarServiciosPorPrecioMaximo(
            @RequestParam BigDecimal precioMaximo) {
        return ResponseEntity.ok(servicioMedicoService.buscarServiciosPorPrecioMaximo(precioMaximo));
    }

    @GetMapping("/duracion")
    public ResponseEntity<List<Servicio>> buscarServiciosPorDuracionMaxima(
            @RequestParam Integer duracionMaxima) {
        return ResponseEntity.ok(servicioMedicoService.buscarServiciosPorDuracionMaxima(duracionMaxima));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> listarCategoriasActivas() {
        return ResponseEntity.ok(servicioMedicoService.listarCategoriasActivas());
    }
} 