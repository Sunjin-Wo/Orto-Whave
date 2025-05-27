package com.orthowave.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "patients")
public class Paciente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "first_name", nullable = false)
    private String nombre;

    @NotBlank
    @Column(name = "last_name", nullable = false)
    private String apellido;

    @NotBlank
    @Column(name = "document_id", nullable = false, unique = true)
    private String documentoIdentidad;

    @Column(name = "document_type")
    private String tipoDocumento;

    @Email
    private String email;

    private String phone;

    @Column(name = "birth_date")
    private LocalDate fechaNacimiento;

    private String address;
    private String gender;

    @Column(name = "blood_type")
    private String tipoSangre;

    private String allergies;

    @Column(name = "emergency_contact_name")
    private String nombreContactoEmergencia;

    @Column(name = "emergency_contact_phone")
    private String telefonoContactoEmergencia;

    @Column(name = "mobility_limitations")
    private String limitacionesMovilidad;

    private String diagnosis;

    @Column(name = "medical_history")
    private String historiaClinica;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Usuario usuario;

    @Column(name = "created_at")
    private LocalDate fechaCreacion;

    @Column(name = "updated_at")
    private LocalDate fechaActualizacion;
} 