package com.orthowave.dto;

import com.orthowave.model.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String nombre;
    private String apellido;
    private String email;
    private Rol rol;
} 