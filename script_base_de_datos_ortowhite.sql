-- Script de creación de base de datos para OrtoWhave
-- Este script crea la estructura de la base de datos de acuerdo a los modelos encontrados en el backend

-- Eliminar la base de datos si existe y crearla nuevamente
DROP DATABASE IF EXISTS ortowhave;
CREATE DATABASE ortowhave CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ortowhave;

-- Tabla de roles de usuario
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de permisos
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de relación entre roles y permisos
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Tabla de usuarios
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Tabla de pacientes
CREATE TABLE patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    document_id VARCHAR(20) NOT NULL UNIQUE,
    document_type VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(20),
    birth_date DATE,
    address VARCHAR(255),
    gender VARCHAR(10),
    blood_type VARCHAR(5),
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    mobility_limitations TEXT,
    diagnosis TEXT,
    medical_history TEXT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de especialistas/doctores
CREATE TABLE specialists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    specialty VARCHAR(100),
    license_number VARCHAR(50),
    education TEXT,
    experience TEXT,
    available_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de citas
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    specialist_id BIGINT NOT NULL,
    appointment_date_time DATETIME NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(id)
);

-- Tabla para historial médico ortopédico
CREATE TABLE orthopedic_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    specialist_id BIGINT NOT NULL,
    record_date DATE NOT NULL,
    diagnosis TEXT,
    treatment_plan TEXT,
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(id)
);

-- Tabla para tratamientos de rehabilitación
CREATE TABLE rehabilitation_treatments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    specialist_id BIGINT NOT NULL,
    treatment_type VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    frequency VARCHAR(50),
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(id)
);

-- Tabla para registros de progreso de rehabilitación
CREATE TABLE treatment_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    treatment_id BIGINT NOT NULL,
    specialist_id BIGINT NOT NULL,
    progress_date DATE NOT NULL,
    description TEXT,
    mobility_improvement TEXT,
    pain_level INT,
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (treatment_id) REFERENCES rehabilitation_treatments(id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(id)
);

-- Tabla para productos ortopédicos
CREATE TABLE orthopedic_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    status ENUM('Disponible', 'Agotado', 'Alquiler') DEFAULT 'Disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para alquiler de productos
CREATE TABLE product_rentals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    approved_by_user_id BIGINT,
    start_date DATE NOT NULL,
    end_date DATE,
    deposit_amount DECIMAL(10,2),
    rental_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (product_id) REFERENCES orthopedic_products(id),
    FOREIGN KEY (approved_by_user_id) REFERENCES users(id)
);

-- Tabla para pagos y facturación
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    treatment_id BIGINT,
    product_id BIGINT,
    rental_id BIGINT,
    processed_by_user_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    invoice_number VARCHAR(50),
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (treatment_id) REFERENCES rehabilitation_treatments(id),
    FOREIGN KEY (product_id) REFERENCES orthopedic_products(id),
    FOREIGN KEY (rental_id) REFERENCES product_rentals(id),
    FOREIGN KEY (processed_by_user_id) REFERENCES users(id)
);

-- Tabla para servicios ortopédicos disponibles
CREATE TABLE orthopedic_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para prescripciones de productos ortopédicos
CREATE TABLE product_prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    specialist_id BIGINT NOT NULL,
    product_id BIGINT,
    prescription_date DATE NOT NULL,
    details TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (specialist_id) REFERENCES specialists(id),
    FOREIGN KEY (product_id) REFERENCES orthopedic_products(id)
);

-- Tabla para seguimiento de acceso/actividad de usuarios
CREATE TABLE user_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertar roles predefinidos
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Administrador del sistema con acceso completo'),
('ROLE_DOCTOR', 'Especialista/doctor con acceso a registros médicos e historiales'),
('ROLE_STAFF', 'Personal administrativo con acceso limitado a registros médicos'),
('ROLE_USER', 'Usuario/paciente con acceso solo a su información');

-- Insertar permisos básicos
INSERT INTO permissions (name, description) VALUES
('view_dashboard', 'Ver panel de control'),
('manage_users', 'Gestionar usuarios'),
('manage_patients', 'Gestionar pacientes'),
('view_patients', 'Ver listado de pacientes'),
('manage_appointments', 'Gestionar citas'),
('view_appointments', 'Ver citas'),
('manage_medical_records', 'Gestionar registros médicos'),
('view_medical_records', 'Ver registros médicos'),
('manage_treatments', 'Gestionar tratamientos'),
('view_treatments', 'Ver tratamientos'),
('manage_products', 'Gestionar productos'),
('view_products', 'Ver productos'),
('manage_services', 'Gestionar servicios'),
('view_services', 'Ver servicios'),
('manage_rentals', 'Gestionar alquileres'),
('view_rentals', 'Ver alquileres'),
('manage_payments', 'Gestionar pagos'),
('view_payments', 'Ver pagos'),
('view_reports', 'Ver reportes');

-- Asignar permisos a rol de administrador
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'),
    id 
FROM permissions;

-- Asignar permisos a rol de doctor
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_DOCTOR'),
    id 
FROM permissions 
WHERE name IN (
    'view_dashboard', 'view_patients', 'manage_patients', 
    'view_appointments', 'manage_appointments', 
    'view_medical_records', 'manage_medical_records',
    'view_treatments', 'manage_treatments',
    'view_products', 'view_services'
);

-- Asignar permisos a rol de personal
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_STAFF'),
    id 
FROM permissions 
WHERE name IN (
    'view_dashboard', 'view_patients', 
    'view_appointments', 'manage_appointments',
    'view_products', 'view_services',
    'view_rentals', 'manage_rentals',
    'view_payments', 'manage_payments'
);

-- Asignar permisos a rol de usuario
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'ROLE_USER'),
    id 
FROM permissions 
WHERE name IN (
    'view_appointments', 'view_products', 'view_services'
);

-- Insertar un usuario administrador por defecto
INSERT INTO users (email, password, role_id, first_name, last_name, active) 
VALUES (
    'admin@ortowhave.co', 
    '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 
    (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'),
    'Admin', 'OWC',
    TRUE
);

-- Insertar un usuario doctor por defecto
INSERT INTO users (email, password, role_id, first_name, last_name, active) 
VALUES (
    'doctor@ortowhave.co', 
    '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 
    (SELECT id FROM roles WHERE name = 'ROLE_DOCTOR'),
    'Doctor', 'Ejemplo',
    TRUE
);

-- Registrar al doctor en la tabla de especialistas
INSERT INTO specialists (user_id, specialty, license_number)
VALUES (
    (SELECT id FROM users WHERE email = 'doctor@ortowhave.co'),
    'Ortopedia y Traumatología',
    'LIC-12345'
);

-- Insertar un usuario de personal administrativo por defecto
INSERT INTO users (email, password, role_id, first_name, last_name, active) 
VALUES (
    'staff@ortowhave.co', 
    '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 
    (SELECT id FROM roles WHERE name = 'ROLE_STAFF'),
    'Staff', 'Ejemplo',
    TRUE
);

-- Insertar un usuario paciente por defecto
INSERT INTO users (email, password, role_id, first_name, last_name, active) 
VALUES (
    'paciente@ortowhave.co', 
    '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 
    (SELECT id FROM roles WHERE name = 'ROLE_USER'),
    'Paciente', 'Ejemplo',
    TRUE
);

-- Registrar al paciente en la tabla de pacientes
INSERT INTO patients (first_name, last_name, document_id, document_type, email, phone, user_id)
VALUES (
    'Paciente', 'Ejemplo', '1234567890', 'CC',
    'paciente@ortowhave.co', '3101234567',
    (SELECT id FROM users WHERE email = 'paciente@ortowhave.co')
);

-- Insertar servicios ortopédicos de ejemplo
INSERT INTO orthopedic_services (name, description, price, duration) VALUES
('Fisioterapia', 'Tratamientos personalizados para recuperación y rehabilitación física', 80000, 45),
('Rehabilitación Física', 'Programas especializados para recuperar la movilidad y funcionalidad', 100000, 60),
('Evaluación de Prótesis y Órtesis', 'Evaluación para soluciones en prótesis y dispositivos ortopédicos', 120000, 45),
('Diagnóstico Especializado', 'Evaluación experta de condiciones ortopédicas', 150000, 30);

-- Insertar productos ortopédicos de ejemplo
INSERT INTO orthopedic_products (name, description, price, category, image_url, stock, status) VALUES
('Muletas aluminio ajustables', 'Muletas de aluminio ligeras y ajustables para facilitar la movilidad', 120000, 'movilidad', '/images/products/Muletas de Aluminio.webp', 15, 'Disponible'),
('Andador plegable con asiento', 'Andador plegable con asiento integrado para mayor comodidad', 180000, 'movilidad', '/images/products/Andador plegable con asiento.webp', 8, 'Disponible'),
('Órtesis de rodilla articulada', 'Soporte ortopédico para la rodilla con articulación ajustable', 250000, 'órtesis', '/images/products/Órtesis de rodilla articulada.webp', 10, 'Disponible'),
('Collarín cervical', 'Soporte para el cuello que ayuda a aliviar el dolor y la tensión cervical', 85000, 'órtesis', '/images/products/Collarín cervical.webp', 0, 'Agotado'),
('Silla de ruedas plegable', 'Silla de ruedas ligera y plegable para facilitar el transporte', 450000, 'movilidad', '/images/products/Silla de ruedas plegable.webp', 5, 'Alquiler'),
('Cabestrillo para brazo', 'Soporte para inmovilizar el brazo durante la recuperación de lesiones', 65000, 'órtesis', '/images/products/Cabestrillo para brazo.webp', 20, 'Disponible'),
('Cojín antiescaras', 'Cojín especial para prevenir úlceras por presión en pacientes con movilidad reducida', 110000, 'confort', '/images/products/Cojín antiescaras.webp', 12, 'Disponible'),
('Férula inmovilizadora de muñeca', 'Férula ortopédica para inmovilizar la muñeca', 75000, 'órtesis', '/images/products/Férula inmovilizadora de muñeca.webp', 18, 'Disponible');

-- Nota: La contraseña hasheada equivale a 'password' en formato bcrypt. Cambiar en entorno de producción. 