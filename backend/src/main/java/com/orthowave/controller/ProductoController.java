package com.orthowave.controller;

import com.orthowave.model.Producto;
import com.orthowave.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoService.listarProductos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerProductoPorId(id));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> buscarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(productoService.buscarProductosPorCategoria(categoria));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Producto>> listarProductosDisponibles() {
        return ResponseEntity.ok(productoService.buscarProductosDisponibles());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarPorRangoPrecio(
            @RequestParam BigDecimal precioMin,
            @RequestParam BigDecimal precioMax) {
        return ResponseEntity.ok(productoService.buscarProductosPorRangoPrecio(precioMin, precioMax));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.crearProducto(producto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, producto));
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer cantidad) {
        productoService.actualizarStock(id, cantidad);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bajo-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Producto>> buscarProductosBajoStock(
            @RequestParam(defaultValue = "5") Integer stockMinimo) {
        return ResponseEntity.ok(productoService.buscarProductosBajoStock(stockMinimo));
    }

    @GetMapping("/categoria/{categoria}/precio-maximo")
    public ResponseEntity<List<Producto>> buscarPorCategoriaYPrecioMaximo(
            @PathVariable String categoria,
            @RequestParam BigDecimal precioMaximo) {
        return ResponseEntity.ok(productoService.buscarPorCategoriaYPrecioMaximo(categoria, precioMaximo));
    }
} 