package com.orthowave.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Cita {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "specialist_id", nullable = false)
    private Especialista especialista;

    @Column(name = "appointment_date_time", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "service_type", nullable = false)
    private String tipoServicio;

    private String status;
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime fechaCreacion;

    @Column(name = "updated_at")
    private LocalDateTime fechaActualizacion;
} 