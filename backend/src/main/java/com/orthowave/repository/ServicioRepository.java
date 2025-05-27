package com.orthowave.repository;

import com.orthowave.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByActive(boolean active);
    List<Servicio> findByNameContaining(String nombre);
    
    @Query("SELECT s FROM Servicio s WHERE s.price <= ?1 AND s.active = true")
    List<Servicio> buscarServiciosActivosPorPrecioMaximo(BigDecimal precioMaximo);
    
    @Query("SELECT s FROM Servicio s WHERE s.duration <= ?1 AND s.active = true")
    List<Servicio> buscarServiciosPorDuracionMaxima(Integer duracionMaximaMinutos);
    
    @Query("SELECT s FROM Servicio s WHERE s.name LIKE %?1% OR s.description LIKE %?1%")
    List<Servicio> buscarPorNombreODescripcion(String termino);
    
    @Query("SELECT DISTINCT s.category FROM Servicio s WHERE s.active = true")
    List<String> listarCategoriasActivas();
} 