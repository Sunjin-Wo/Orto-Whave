package com.orthowave.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "orthopedic_services")
public class Servicio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String description;
    private BigDecimal price;
    private Integer duration;
    private boolean active;

    @Column(name = "created_at")
    private LocalDateTime fechaCreacion;

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;
} 