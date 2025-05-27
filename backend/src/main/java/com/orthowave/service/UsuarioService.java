package com.orthowave.service;

import com.orthowave.model.Usuario;
import com.orthowave.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        Usuario usuarioExistente = obtenerUsuarioPorId(id);
        
        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setApellido(usuario.getApellido());
        usuarioExistente.setTelefono(usuario.getTelefono());
        
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        
        return usuarioRepository.save(usuarioExistente);
    }

    @Transactional
    public void desactivarUsuario(Long id) {
        Usuario usuario = obtenerUsuarioPorId(id);
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void activarUsuario(Long id) {
        Usuario usuario = obtenerUsuarioPorId(id);
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void cambiarPassword(Long id, String passwordActual, String nuevaPassword) {
        Usuario usuario = obtenerUsuarioPorId(id);
        
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }
        
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }
} 