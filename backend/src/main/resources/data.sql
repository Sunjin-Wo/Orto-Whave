INSERT INTO usuarios (nombre, apellido, email, password, telefono, rol, activo, fecha_registro)
VALUES (
    'Admin',
    'Sistema',
    'admin@ortowhave.com',
    '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', -- contraseña: Admin123*
    '3000000000',
    'ROLE_ADMIN',
    true,
    NOW()
) ON DUPLICATE KEY UPDATE email=email;
