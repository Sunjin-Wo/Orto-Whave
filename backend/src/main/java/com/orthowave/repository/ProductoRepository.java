package com.orthowave.repository;

import com.orthowave.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategory(String category);
    List<Producto> findByStatus(Producto.EstadoProducto status);
    List<Producto> findByNameContaining(String nombre);
    
    @Query("SELECT p FROM Producto p WHERE p.price BETWEEN ?1 AND ?2")
    List<Producto> buscarPorRangoPrecio(BigDecimal precioMin, BigDecimal precioMax);
    
    @Query("SELECT p FROM Producto p WHERE p.stock > 0 AND p.status = 'Disponible'")
    List<Producto> buscarProductosDisponibles();
    
    @Query("SELECT p FROM Producto p WHERE p.stock < ?1")
    List<Producto> buscarProductosBajoStock(Integer stockMinimo);
    
    @Query("SELECT p FROM Producto p WHERE p.category = ?1 AND p.price <= ?2 AND p.status = 'Disponible'")
    List<Producto> buscarPorCategoriaYPrecioMaximo(String categoria, BigDecimal precioMaximo);
} 