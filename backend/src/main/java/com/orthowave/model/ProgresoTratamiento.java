package com.orthowave.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "treatment_progress")
public class ProgresoTratamiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "treatment_id", nullable = false)
    private TratamientoRehabilitacion tratamiento;

    @ManyToOne
    @JoinColumn(name = "specialist_id", nullable = false)
    private Especialista especialista;

    @Column(name = "progress_date", nullable = false)
    private LocalDate fechaProgreso;

    private String description;

    @Column(name = "mobility_improvement")
    private String mejoriaMovilidad;

    @Column(name = "pain_level")
    private Integer nivelDolor;

    private String images;

    @Column(name = "created_at")
    private LocalDateTime fechaCreacion;

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;
} 