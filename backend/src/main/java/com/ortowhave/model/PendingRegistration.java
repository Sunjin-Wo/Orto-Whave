package com.ortowhave.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "registros_pendientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String firstName;

    @Column(name = "apellido", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "telefono", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "codigo_verificacion", nullable = false)
    private String verificationCode;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime expirationDate;

    @Column(name = "verificado", nullable = false)
    private Boolean verified = false;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime creationDate;

    @PrePersist
    protected void onCreate() {
        creationDate = LocalDateTime.now();
        // Código expira en 24 horas
        expirationDate = creationDate.plusHours(24);
    }
}
