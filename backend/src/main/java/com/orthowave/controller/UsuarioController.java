package com.orthowave.controller;

import com.orthowave.model.Usuario;
import com.orthowave.service.UsuarioService;
import com.orthowave.dto.CambioPasswordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerUsuarioPorId(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Usuario> actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuario));
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("#id == authentication.principal.id")
    public ResponseEntity<Void> cambiarPassword(
            @PathVariable Long id,
            @RequestBody CambioPasswordRequest request) {
        usuarioService.cambiarPassword(id, request.getPasswordActual(), request.getNuevaPassword());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivarUsuario(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activarUsuario(@PathVariable Long id) {
        usuarioService.activarUsuario(id);
        return ResponseEntity.ok().build();
    }
} 