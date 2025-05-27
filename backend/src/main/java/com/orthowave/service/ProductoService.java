package com.orthowave.service;

import com.orthowave.model.Producto;
import com.orthowave.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {
    
    private final ProductoRepository productoRepository;

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public List<Producto> buscarProductosPorCategoria(String categoria) {
        return productoRepository.findByCategory(categoria);
    }

    public List<Producto> buscarProductosDisponibles() {
        return productoRepository.buscarProductosDisponibles();
    }

    public List<Producto> buscarProductosPorRangoPrecio(BigDecimal precioMin, BigDecimal precioMax) {
        return productoRepository.buscarPorRangoPrecio(precioMin, precioMax);
    }

    @Transactional
    public Producto crearProducto(Producto producto) {
        producto.setFechaCreacion(LocalDateTime.now());
        producto.setFechaActualizacion(LocalDateTime.now());
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizarProducto(Long id, Producto producto) {
        Producto productoExistente = obtenerProductoPorId(id);
        
        productoExistente.setName(producto.getName());
        productoExistente.setDescription(producto.getDescription());
        productoExistente.setPrice(producto.getPrice());
        productoExistente.setCategory(producto.getCategory());
        productoExistente.setImageUrl(producto.getImageUrl());
        productoExistente.setStock(producto.getStock());
        productoExistente.setStatus(producto.getStatus());
        productoExistente.setFechaActualizacion(LocalDateTime.now());
        
        return productoRepository.save(productoExistente);
    }

    @Transactional
    public void actualizarStock(Long id, Integer cantidad) {
        Producto producto = obtenerProductoPorId(id);
        
        int nuevoStock = producto.getStock() + cantidad;
        if (nuevoStock < 0) {
            throw new RuntimeException("No hay suficiente stock disponible");
        }
        
        producto.setStock(nuevoStock);
        producto.setStatus(nuevoStock > 0 ? Producto.EstadoProducto.Disponible : Producto.EstadoProducto.Agotado);
        producto.setFechaActualizacion(LocalDateTime.now());
        
        productoRepository.save(producto);
    }

    @Transactional
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }

    public List<Producto> buscarProductosBajoStock(Integer stockMinimo) {
        return productoRepository.buscarProductosBajoStock(stockMinimo);
    }

    public List<Producto> buscarPorCategoriaYPrecioMaximo(String categoria, BigDecimal precioMaximo) {
        return productoRepository.buscarPorCategoriaYPrecioMaximo(categoria, precioMaximo);
    }
} 