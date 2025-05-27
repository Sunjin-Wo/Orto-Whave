package com.orthowave.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orthopedic_products")
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String description;

    @NotNull
    @Column(nullable = false)
    private BigDecimal price;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    private Integer stock;

    @Enumerated(EnumType.STRING)
    private EstadoProducto status;

    @Column(name = "created_at")
    private LocalDateTime fechaCreacion;

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;

    public enum EstadoProducto {
        Disponible, Agotado, Alquiler
    }
} 