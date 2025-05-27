package com.orthowave.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MensajeContactoDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;
    
    @NotBlank(message = "El asunto es obligatorio")
    private String asunto;
    
    @NotBlank(message = "El mensaje es obligatorio")
    private String mensaje;
    
    private String telefono;
} 