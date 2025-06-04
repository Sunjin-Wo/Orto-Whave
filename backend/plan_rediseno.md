# Plan de rediseño del backend para orto-whave

## Objetivos principales
1. Implementar registro con código de verificación exclusivamente para pacientes
2. Restringir la creación de doctores y administradores solo al administrador
3. Asegurar la redirección al dashboard correspondiente según el rol
4. Mantener los puertos para phpMyAdmin y 8081 sin cambios

## Cambios en el modelo de datos

### Modificaciones en el modelo User
- Agregar un campo `userType` para diferenciar claramente entre PATIENT, DOCTOR y ADMIN
- Mantener el campo `role` para compatibilidad con Spring Security

### Mejoras en PendingRegistration
- Asegurar que solo se use para pacientes
- Implementar la lógica de expiración de códigos de verificación

## Cambios en los servicios

### AuthService
- Modificar el método `register` para que solo registre pacientes pendientes de verificación
- Crear un nuevo método `verifyPatientRegistration` para validar códigos
- Modificar el método `login` para redirigir al dashboard correspondiente

### UserService
- Restringir la creación de usuarios tipo DOCTOR y ADMIN solo para administradores
- Implementar validaciones de roles en los métodos de gestión de usuarios

### EmailService
- Implementar el envío de correos con códigos de verificación para pacientes

## Cambios en los controladores

### AuthController
- Modificar el endpoint `/register` para crear registros pendientes de pacientes
- Agregar un nuevo endpoint `/verify` para validar códigos de verificación
- Actualizar el endpoint `/login` para incluir información del dashboard

### AdminController
- Asegurar que solo los administradores puedan crear doctores y otros administradores
- Implementar validaciones de roles en todos los endpoints

## Flujos de trabajo rediseñados

### Registro de pacientes
1. El paciente se registra a través del endpoint `/api/auth/register`
2. Se crea un registro pendiente y se envía un código de verificación por email
3. El paciente verifica su cuenta con el código a través del endpoint `/api/auth/verify`
4. Una vez verificado, se crea el usuario con tipo PATIENT y rol ROLE_PATIENT

### Creación de doctores y administradores
1. Solo un administrador puede crear estos usuarios a través del endpoint `/api/admin/users`
2. Se especifica el tipo (DOCTOR o ADMIN) y el rol correspondiente
3. No requiere verificación por código

### Inicio de sesión
1. El usuario inicia sesión a través del endpoint `/api/auth/login`
2. El sistema valida las credenciales y devuelve un token JWT
3. Se incluye información del dashboard correspondiente según el rol
4. El frontend redirige al usuario al dashboard adecuado
