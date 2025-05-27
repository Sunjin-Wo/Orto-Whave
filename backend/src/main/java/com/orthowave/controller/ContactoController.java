package com.orthowave.controller;

import com.orthowave.dto.MensajeContactoDTO;
import com.orthowave.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contacto")
@RequiredArgsConstructor
public class ContactoController {

    private final EmailService emailService;

    @PostMapping("/mensaje")
    public ResponseEntity<Void> enviarMensaje(@Valid @RequestBody MensajeContactoDTO mensaje) {
        // Aquí se procesaría el mensaje y se enviaría por correo
        // Por ahora solo devolvemos OK
        return ResponseEntity.ok().build();
    }

    @PostMapping("/suscripcion")
    public ResponseEntity<Void> suscribirseNewsletter(@RequestParam String email) {
        // Aquí se procesaría la suscripción al newsletter
        // Por ahora solo devolvemos OK
        return ResponseEntity.ok().build();
    }
} 