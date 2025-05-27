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
@Table(name = "orthopedic_records")
public class RegistroOrtopedico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "specialist_id", nullable = false)
    private Especialista especialista;

    @Column(name = "record_date", nullable = false)
    private LocalDate fechaRegistro;

    private String diagnosis;

    @Column(name = "treatment_plan")
    private String planTratamiento;

    private String images;

    @Column(name = "created_at")
    private LocalDateTime fechaCreacion;

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;
} 