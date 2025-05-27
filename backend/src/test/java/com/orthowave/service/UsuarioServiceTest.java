package com.orthowave.service;

import com.orthowave.model.Usuario;
import com.orthowave.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test");
        usuario.setApellido("Usuario");
        usuario.setEmail("test@example.com");
        usuario.setPassword("password");
        usuario.setActivo(true);
    }

    @Test
    void deberiaListarUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario));

        List<Usuario> usuarios = usuarioService.listarUsuarios();

        assertNotNull(usuarios);
        assertEquals(1, usuarios.size());
        verify(usuarioRepository).findAll();
    }

    @Test
    void deberiaObtenerUsuarioPorId() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario encontrado = usuarioService.obtenerUsuarioPorId(1L);

        assertNotNull(encontrado);
        assertEquals(usuario.getEmail(), encontrado.getEmail());
        verify(usuarioRepository).findById(1L);
    }

    @Test
    void deberiaActualizarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario actualizado = usuarioService.actualizarUsuario(1L, usuario);

        assertNotNull(actualizado);
        assertEquals(usuario.getEmail(), actualizado.getEmail());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void deberiaCambiarPassword() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("nuevaPasswordEncriptada");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        assertDoesNotThrow(() -> 
            usuarioService.cambiarPassword(1L, "passwordActual", "nuevaPassword")
        );

        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void deberiaDesactivarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        usuarioService.desactivarUsuario(1L);

        verify(usuarioRepository).save(argThat(u -> !u.isActivo()));
    }
} 