# Documentación del Backend de Orto-Whave

## Descripción General

Este proyecto implementa el backend para la aplicación Orto-Whave, desarrollado en SpringBoot según los requerimientos especificados. El sistema proporciona una API RESTful que soporta todas las funcionalidades necesarias para la aplicación, incluyendo autenticación, registro con verificación por correo electrónico, y gestión de usuarios con diferentes roles.

## Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.1.0**
- **Spring Security con JWT**
- **Spring Data JPA**
- **MySQL (phpMyAdmin)**
- **Maven**

## Estructura del Proyecto

El proyecto sigue una arquitectura en capas:

- **Controladores**: Manejan las peticiones HTTP y definen los endpoints de la API.
- **Servicios**: Contienen la lógica de negocio.
- **Repositorios**: Gestionan el acceso a la base de datos.
- **Modelos**: Representan las entidades de la base de datos.
- **DTOs**: Objetos de transferencia de datos para las peticiones y respuestas.
- **Excepciones**: Manejo centralizado de errores.
- **Configuración**: Configuración de seguridad, correo electrónico y otras funcionalidades.

## Funcionalidades Principales

### 1. Sistema de Registro con Verificación por Correo

- Registro de nuevos usuarios con validación de datos.
- Generación de códigos de verificación aleatorios.
- Envío de correos electrónicos con códigos de verificación a través de Hotmail.
- Verificación de códigos para activar cuentas.

### 2. Autenticación y Autorización

- Autenticación basada en JWT (JSON Web Tokens).
- Soporte para usuarios predeterminados (admin, doctores, pacientes).
- Protección de rutas según roles.
- Gestión de sesiones.

### 3. Gestión de Usuarios por Administrador

- Creación de nuevos usuarios de cualquier rol.
- Edición de información de usuarios.
- Eliminación de usuarios.
- Asignación y cambio de roles.

### 4. Dashboards Específicos por Rol

- Dashboard para administradores.
- Dashboard para doctores.
- Dashboard para pacientes.
- Visualización de datos específicos según el rol.

## Endpoints de la API

### Autenticación

- `POST /api/auth/register`: Registro de nuevos usuarios.
- `POST /api/auth/verify-email`: Verificación de correo electrónico.
- `POST /api/auth/login`: Inicio de sesión.
- `POST /api/auth/resend-verification`: Reenvío de código de verificación.

### Administrador

- `GET /api/admin/dashboard`: Dashboard de administrador.
- `GET /api/admin/users`: Obtener todos los usuarios.
- `POST /api/admin/users`: Crear nuevo usuario.
- `GET /api/admin/users/{id}`: Obtener usuario por ID.
- `PUT /api/admin/users/{id}`: Actualizar usuario.
- `DELETE /api/admin/users/{id}`: Eliminar usuario.
- `PUT /api/admin/users/{id}/role`: Actualizar rol de usuario.

### Doctor

- `GET /api/doctor/dashboard`: Dashboard de doctor.
- `GET /api/doctor/patients`: Obtener todos los pacientes.
- `GET /api/doctor/profile`: Obtener perfil del doctor.

### Paciente

- `GET /api/patient/dashboard`: Dashboard de paciente.
- `GET /api/patient/profile`: Obtener perfil del paciente.
- `GET /api/patient/details/{userId}`: Obtener detalles del paciente.

## Configuración

### Base de Datos

La aplicación se conecta a una base de datos MySQL a través de phpMyAdmin en el puerto 3307:

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/ortowhave
spring.datasource.username=root
spring.datasource.password=Hikennoace.v2510
```

### Correo Electrónico

Configuración para el envío de correos a través de Hotmail:

```properties
spring.mail.host=smtp.office365.com
spring.mail.port=587
spring.mail.username=noresetowc@hotmail.com
spring.mail.password=cnavexzkfgmpmfxa
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Seguridad JWT

Configuración para la generación y validación de tokens JWT:

```properties
app.jwtSecret=ortoWhaveSecretKey2025SecureApplicationJwtTokenSigningKey
app.jwtExpirationMs=86400000
```

## Instrucciones de Ejecución

1. Asegúrese de tener Java 17 y Maven instalados.
2. Configure la base de datos MySQL en el puerto 3307 con las credenciales especificadas.
3. Importe el script SQL `ortowhave.sql` para crear la estructura de la base de datos.
4. Ejecute el proyecto con Maven:
   ```
   mvn spring-boot:run
   ```
5. La API estará disponible en `http://localhost:8080`

## Integración con el Frontend

El backend está diseñado para integrarse con el frontend existente. Los endpoints proporcionan todas las funcionalidades necesarias para:

- Registro y verificación de usuarios.
- Autenticación y manejo de sesiones.
- Gestión de usuarios por parte del administrador.
- Visualización de dashboards específicos según el rol.

Para la integración, el frontend debe:

1. Realizar peticiones a los endpoints correspondientes.
2. Almacenar y enviar el token JWT en las cabeceras de autenticación.
3. Manejar las redirecciones según el rol del usuario autenticado.

## Pruebas

Se han realizado pruebas exhaustivas de todas las funcionalidades. Los resultados se pueden encontrar en el archivo `pruebas_validacion.md`.

## Contacto

Para cualquier consulta o soporte, contacte al equipo de desarrollo.
