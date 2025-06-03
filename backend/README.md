# README - Backend Orto-Whave

## Descripción

Este repositorio contiene el backend desarrollado en SpringBoot para la aplicación Orto-Whave, implementando todas las funcionalidades requeridas:

1. Sistema de registro con verificación por correo electrónico (Hotmail)
2. Autenticación y verificación de usuarios predeterminados
3. Gestión de usuarios por parte del administrador
4. Dashboards específicos según el rol del usuario

## Estructura del Proyecto

- `backend/`: Código fuente del backend en SpringBoot
- `documentacion.md`: Documentación completa del proyecto
- `pruebas_validacion.md`: Resultados de las pruebas realizadas

## Requisitos Cumplidos

✅ Desarrollo en SpringBoot
✅ Sistema de registro con verificación por correo Hotmail
✅ Conexión a base de datos phpMyAdmin (puerto 3307)
✅ Verificación de usuarios predeterminados
✅ Códigos de verificación aleatorios y únicos
✅ Gestión de usuarios por administrador
✅ Dashboards específicos por rol

## Instrucciones de Instalación y Ejecución

1. Asegúrese de tener Java 17 y Maven instalados
2. Configure la base de datos MySQL en el puerto 3307 con las credenciales especificadas
3. Importe el script SQL `ortowhave.sql` para crear la estructura de la base de datos
4. Ejecute el proyecto con Maven:
   ```
   cd backend
   mvn spring-boot:run
   ```
5. La API estará disponible en `http://localhost:8080`

## Documentación

Para información detallada sobre la implementación, endpoints y configuración, consulte el archivo `documentacion.md`.

## Pruebas

Los resultados de las pruebas de validación se encuentran en el archivo `pruebas_validacion.md`.

## Contacto

Para cualquier consulta o soporte, contacte al equipo de desarrollo.
