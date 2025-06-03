# OrthoWave Colombia - Backend

Backend de la aplicación OrthoWave Colombia desarrollado en Spring Boot. Este sistema proporciona funcionalidades de autenticación, gestión de usuarios, verificación por SMS y manejo de citas médicas para una clínica de ortopedia y traumatología.

## 🚀 Características Principales

- **Sistema de Autenticación JWT** con roles diferenciados
- **Verificación por SMS** usando Twilio
- **Gestión de usuarios** (Pacientes, Doctores, Administradores)
- **API RESTful** completamente documentada
- **Base de datos H2** para desarrollo (configurable para MySQL)
- **Seguridad robusta** con Spring Security
- **Manejo de citas médicas**
- **Gestión de productos terapéuticos**

## 🛠️ Tecnologías Utilizadas

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security**
- **Spring Data JPA**
- **JWT (JSON Web Tokens)**
- **Twilio SDK** para SMS
- **H2 Database** (desarrollo)
- **MySQL** (producción)
- **Maven**
- **Lombok**

## 📋 Requisitos Previos

- Java 17 o superior
- Maven 3.6 o superior
- Cuenta de Twilio (opcional, para SMS)

## ⚡ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd orthowave-backend
```

### 2. Configurar variables de entorno (opcional)
```bash
# Para SMS con Twilio
export TWILIO_ACCOUNT_SID=tu_account_sid
export TWILIO_AUTH_TOKEN=tu_auth_token
export TWILIO_PHONE_NUMBER=tu_numero_twilio

# Para JWT personalizado
export JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro

# Para email (futuro)
export EMAIL_USERNAME=tu_email
export EMAIL_PASSWORD=tu_password
```

### 3. Compilar y ejecutar
```bash
# Compilar
mvn clean compile

# Ejecutar
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

#### Registro de Usuario
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "phone": "+573001234567",
  "password": "password123",
  "roles": ["patient"]
}
```

#### Inicio de Sesión
```http
POST /api/auth/signin
Content-Type: application/json

{
  "emailOrPhone": "juan@example.com",
  "password": "password123"
}
```

#### Verificación de Teléfono
```http
POST /api/auth/verify-phone
Content-Type: application/json

{
  "phone": "+573001234567",
  "code": "123456"
}
```

### Dashboard (`/api/dashboard`)

#### Dashboard de Paciente
```http
GET /api/dashboard/patient
Authorization: Bearer <jwt_token>
```

#### Dashboard de Doctor
```http
GET /api/dashboard/doctor
Authorization: Bearer <jwt_token>
```

#### Dashboard de Administrador
```http
GET /api/dashboard/admin
Authorization: Bearer <jwt_token>
```

## 👥 Roles y Permisos

### ROLE_PATIENT
- Acceso a dashboard de paciente
- Agendar citas
- Ver historial médico
- Comprar productos

### ROLE_DOCTOR
- Acceso a dashboard de doctor
- Gestionar citas
- Ver pacientes asignados
- Actualizar disponibilidad

### ROLE_ADMIN
- Acceso completo al sistema
- Gestionar usuarios
- Ver estadísticas
- Configuración del sistema

## 🔐 Seguridad

- **JWT Tokens** para autenticación stateless
- **BCrypt** para encriptación de contraseñas
- **CORS** configurado para frontend
- **Validación de entrada** en todos los endpoints
- **Autorización basada en roles**

## 📊 Base de Datos

### Desarrollo (H2)
- Acceso a consola: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Usuario: `sa`
- Contraseña: `password`

### Producción (MySQL)
Modificar `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/orthowave_db
    username: tu_usuario
    password: tu_password
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
```

## 📱 Configuración SMS

### Con Twilio (Recomendado)
1. Crear cuenta en [Twilio](https://www.twilio.com/)
2. Obtener Account SID, Auth Token y número de teléfono
3. Configurar variables de entorno
4. Los SMS se enviarán automáticamente

### Sin Twilio (Desarrollo)
- Los códigos de verificación se mostrarán en los logs
- Útil para desarrollo y testing

## 🧪 Testing

```bash
# Ejecutar tests
mvn test

# Ejecutar tests con cobertura
mvn clean test jacoco:report
```

## 📝 Ejemplo de Flujo Completo

### 1. Registro de Paciente
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "María",
    "lastName": "García",
    "email": "maria@example.com",
    "phone": "+573001234567",
    "password": "password123",
    "roles": ["patient"]
  }'
```

### 2. Verificar Teléfono
```bash
curl -X POST http://localhost:8080/api/auth/verify-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+573001234567",
    "code": "123456"
  }'
```

### 3. Iniciar Sesión
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "maria@example.com",
    "password": "password123"
  }'
```

### 4. Acceder al Dashboard
```bash
curl -X GET http://localhost:8080/api/dashboard/patient \
  -H "Authorization: Bearer <jwt_token>"
```

## 🔧 Configuración Personalizada

### Tiempo de expiración JWT
```yaml
jwt:
  expiration: 86400000 # 24 horas en milisegundos
```

### Configuración SMS
```yaml
sms:
  verification:
    expiration-minutes: 5
    max-attempts: 3
```

### CORS
```yaml
cors:
  allowed-origins:
    - http://localhost:3000
    - https://tu-frontend.vercel.app
```

## 🚀 Despliegue

### Para Vercel/Netlify Functions
1. Compilar el proyecto: `mvn clean package`
2. El JAR estará en `target/orthowave-backend-0.0.1-SNAPSHOT.jar`
3. Subir a tu plataforma de despliegue preferida

### Variables de Entorno en Producción
```
JWT_SECRET=tu_jwt_secret_super_seguro_de_al_menos_32_caracteres
TWILIO_ACCOUNT_SID=tu_twilio_account_sid
TWILIO_AUTH_TOKEN=tu_twilio_auth_token
TWILIO_PHONE_NUMBER=tu_numero_twilio
DATABASE_URL=tu_url_de_base_de_datos
```

## 📞 Soporte

Para soporte y consultas:
- Email: soporte@orthowavecolombia.com
- Teléfono: +57 311 228 1755

---

**OrthoWave Colombia** - Sistema de gestión médica especializado en ortopedia y traumatología. 