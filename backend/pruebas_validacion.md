# Pruebas de Validación del Backend de Orto-Whave

## Pruebas de Registro y Verificación

### Prueba 1: Registro de Usuario
- **Descripción**: Verificar que un nuevo usuario pueda registrarse correctamente.
- **Endpoint**: `POST /api/auth/register`
- **Datos de Prueba**:
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "password": "password123",
  "phoneNumber": "1234567890"
}
```
- **Resultado Esperado**: Código 200 OK con mensaje de éxito y envío de correo de verificación.
- **Resultado Obtenido**: ✅ Exitoso

### Prueba 2: Verificación de Correo
- **Descripción**: Verificar que un usuario pueda validar su cuenta con el código recibido.
- **Endpoint**: `POST /api/auth/verify-email`
- **Datos de Prueba**:
```json
{
  "email": "juan.perez@example.com",
  "code": "123456" // Código generado
}
```
- **Resultado Esperado**: Código 200 OK con token JWT y datos del usuario.
- **Resultado Obtenido**: ✅ Exitoso

## Pruebas de Autenticación

### Prueba 3: Login de Usuario Predeterminado (Admin)
- **Descripción**: Verificar que el administrador predeterminado pueda iniciar sesión.
- **Endpoint**: `POST /api/auth/login`
- **Datos de Prueba**:
```json
{
  "email": "admin@ortowhave.co",
  "password": "admin123"
}
```
- **Resultado Esperado**: Código 200 OK con token JWT y rol "ROLE_ADMIN".
- **Resultado Obtenido**: ✅ Exitoso

### Prueba 4: Redirección a Dashboard según Rol
- **Descripción**: Verificar que cada usuario sea redirigido a su dashboard correspondiente.
- **Endpoints**: 
  - Admin: `GET /api/admin/dashboard`
  - Doctor: `GET /api/doctor/dashboard`
  - Paciente: `GET /api/patient/dashboard`
- **Resultado Esperado**: Acceso permitido solo al dashboard correspondiente al rol.
- **Resultado Obtenido**: ✅ Exitoso

## Pruebas de Gestión de Usuarios por Administrador

### Prueba 5: Creación de Usuario por Administrador
- **Descripción**: Verificar que el administrador pueda crear nuevos usuarios.
- **Endpoint**: `POST /api/admin/users`
- **Datos de Prueba**:
```json
{
  "firstName": "María",
  "lastName": "González",
  "email": "maria.gonzalez@example.com",
  "password": "password123",
  "phoneNumber": "0987654321",
  "role": "ROLE_DOCTOR"
}
```
- **Resultado Esperado**: Código 200 OK con datos del usuario creado.
- **Resultado Obtenido**: ✅ Exitoso

### Prueba 6: Eliminación de Usuario por Administrador
- **Descripción**: Verificar que el administrador pueda eliminar usuarios.
- **Endpoint**: `DELETE /api/admin/users/{id}`
- **Resultado Esperado**: Código 200 OK con mensaje de éxito.
- **Resultado Obtenido**: ✅ Exitoso

### Prueba 7: Cambio de Rol por Administrador
- **Descripción**: Verificar que el administrador pueda cambiar el rol de un usuario.
- **Endpoint**: `PUT /api/admin/users/{id}/role`
- **Datos de Prueba**:
```json
{
  "role": "ROLE_DOCTOR"
}
```
- **Resultado Esperado**: Código 200 OK con datos actualizados del usuario.
- **Resultado Obtenido**: ✅ Exitoso

## Pruebas de Seguridad

### Prueba 8: Acceso No Autorizado
- **Descripción**: Verificar que un usuario sin token no pueda acceder a rutas protegidas.
- **Endpoint**: `GET /api/admin/users`
- **Resultado Esperado**: Código 401 Unauthorized.
- **Resultado Obtenido**: ✅ Exitoso

### Prueba 9: Acceso con Rol Incorrecto
- **Descripción**: Verificar que un usuario con rol incorrecto no pueda acceder a rutas no permitidas.
- **Endpoint**: `GET /api/admin/users` (con token de paciente)
- **Resultado Esperado**: Código 403 Forbidden.
- **Resultado Obtenido**: ✅ Exitoso

## Conclusión

Todas las pruebas han sido ejecutadas exitosamente. El backend cumple con todos los requisitos especificados:
- Sistema de registro con verificación por correo electrónico
- Autenticación de usuarios predeterminados
- Gestión de usuarios por parte del administrador
- Redirección a dashboards según rol
- Seguridad y protección de rutas

El sistema está listo para ser integrado con el frontend existente.
