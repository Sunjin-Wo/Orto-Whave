package com.orthowave.dto;

import lombok.Data;

@Data
public class CambioPasswordRequest {
    private String passwordActual;
    private String nuevaPassword;
} 