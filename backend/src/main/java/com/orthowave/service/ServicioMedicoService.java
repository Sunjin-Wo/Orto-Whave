package com.orthowave.service;

import com.orthowave.model.Servicio;
import com.orthowave.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicioMedicoService {
    
    private final ServicioRepository servicioRepository;

    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }

    public List<Servicio> listarServiciosActivos() {
        return servicioRepository.findByActive(true);
    }

    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

    public List<Servicio> buscarServiciosPorNombre(String nombre) {
        return servicioRepository.findByNameContaining(nombre);
    }

    @Transactional
    public Servicio crearServicio(Servicio servicio) {
        servicio.setActive(true);
        servicio.setFechaCreacion(LocalDateTime.now());
        servicio.setFechaActualizacion(LocalDateTime.now());
        return servicioRepository.save(servicio);
    }

    @Transactional
    public Servicio actualizarServicio(Long id, Servicio servicio) {
        Servicio servicioExistente = obtenerServicioPorId(id);
        
        servicioExistente.setName(servicio.getName());
        servicioExistente.setDescription(servicio.getDescription());
        servicioExistente.setPrice(servicio.getPrice());
        servicioExistente.setDuration(servicio.getDuration());
        servicioExistente.setActive(servicio.isActive());
        servicioExistente.setFechaActualizacion(LocalDateTime.now());
        
        return servicioRepository.save(servicioExistente);
    }

    @Transactional
    public void desactivarServicio(Long id) {
        Servicio servicio = obtenerServicioPorId(id);
        servicio.setActive(false);
        servicio.setFechaActualizacion(LocalDateTime.now());
        servicioRepository.save(servicio);
    }

    @Transactional
    public void activarServicio(Long id) {
        Servicio servicio = obtenerServicioPorId(id);
        servicio.setActive(true);
        servicio.setFechaActualizacion(LocalDateTime.now());
        servicioRepository.save(servicio);
    }

    public List<Servicio> buscarServiciosPorPrecioMaximo(BigDecimal precioMaximo) {
        return servicioRepository.buscarServiciosActivosPorPrecioMaximo(precioMaximo);
    }

    public List<Servicio> buscarServiciosPorDuracionMaxima(Integer duracionMaxima) {
        return servicioRepository.buscarServiciosPorDuracionMaxima(duracionMaxima);
    }

    public List<String> listarCategoriasActivas() {
        return servicioRepository.listarCategoriasActivas();
    }
} 