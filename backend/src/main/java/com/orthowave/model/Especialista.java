package com.orthowave.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialists")
public class Especialista {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario usuario;

    @Column(name = "specialty")
    private String especialidad;

    @Column(name = "license_number")
    private String numeroLicencia;

    private String education;
    private String experience;

    @Column(name = "available_hours")
    private String horasDisponibles;

    @Column(name = "created_at")
    private LocalDate fechaCreacion;

    @Column(name = "updated_at")
    private LocalDate fechaActualizacion;
} 