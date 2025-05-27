package com.orthowave.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "rehabilitation_treatments")
public class TratamientoRehabilitacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "specialist_id", nullable = false)
    private Especialista especialista;

    @NotBlank
    @Column(name = "treatment_type", nullable = false)
    private String tipoTratamiento;

    @Column(name = "start_date")
    private LocalDate fechaInicio;

    @Column(name = "end_date")
    private LocalDate fechaFin;

    private String frequency;
    private String status;
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime fechaCreacion;

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;
} 