-- Crear la base de datos si no existe
DROP DATABASE IF EXISTS ortowhave;
CREATE DATABASE ortowhave;

-- Seleccionar la base de datos
USE ortowhave;

-- Crear tabla de roles primero (ya que users depende de ella)
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de usuarios
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL UNIQUE,
  `role_id` bigint NOT NULL,
  `active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de pacientes
CREATE TABLE `patients` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `document_id` varchar(20) NOT NULL,
  `email` varchar(100),
  `phone` varchar(20),
  `user_id` bigint,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles básicos
INSERT INTO `roles` (`name`, `description`) VALUES
('ADMIN', 'Administrador del sistema'),
('DOCTOR', 'Doctor o especialista'),
('PATIENT', 'Paciente');

-- Insertar usuarios con contraseñas hasheadas (admin123, doctor123, paciente123)
INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `phone`, `role_id`) VALUES
('Admin', 'Sistema', 'admin@ortowhave.com', '$2a$10$3sH2XQGYK8LM3gSaYGBpAeKPGBJKgvPPnZwDGQqTESXSKHBGsXgR6', '1234567890', 1),
('Doctor', 'Principal', 'doctor@ortowhave.com', '$2a$10$YHVRGHkBXY9FPE8FRvYQPO8jKyXdoBp.QvF9yq3SB6k3DnxwL9YhO', '0987654321', 2),
('Paciente', 'Demo', 'paciente@ortowhave.com', '$2a$10$dR0eQb1KH8hPYz.K5/FZpejXQr0YxdzsqHYBaL8AIgHNh8tEq1ITC', '1122334455', 3);

-- Insertar paciente de ejemplo
INSERT INTO `patients` (`first_name`, `last_name`, `document_id`, `email`, `phone`, `user_id`) VALUES
('Paciente', 'Demo', '12345678', 'paciente@ortowhave.com', '1122334455', 3);

-- Script de la base de datos para Orto-White

-- Por favor, reemplace los siguientes placeholders de contraseña con los hashes BCrypt generados.
-- Puede usar una herramienta en línea como https://www.browserling.com/bcrypt para generar los hashes.
-- O si tiene un entorno de desarrollo de Spring Boot, puede usar el siguiente código para generarlos:
--
-- import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
--
-- public class PasswordEncoderUtil {
--     public static void main(String[] args) {
--         BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
--         System.out.println(encoder.encode("admin123"));
--         System.out.println(encoder.encode("doctor123"));
--         System.out.println(encoder.encode("paciente123"));
--     }
-- }

-- Reemplazar '$2a$10$...' con los hashes reales.
SET @admin_password = '$2a$10$3sH2XQGYK8LM3gSaYGBpAeKPGBJKgvPPnZwDGQqTESXSKHBGsXgR6';
SET @doctor_password = '$2a$10$YHVRGHkBXY9FPE8FRvYQPO8jKyXdoBp.QvF9yq3SB6k3DnxwL9YhO';
SET @patient_password = '$2a$10$dR0eQb1KH8hPYz.K5/FZpejXQr0YxdzsqHYBaL8AIgHNh8tEq1ITC';

CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `appointments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` bigint NOT NULL,
  `specialist_id` bigint NOT NULL,
  `appointment_date_time` timestamp NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `status` varchar(255),
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orthopedic_products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `image_url` varchar(255),
  `stock` int,
  `status` ENUM('Disponible', 'Agotado', 'Alquiler'),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orthopedic_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` bigint NOT NULL,
  `specialist_id` bigint NOT NULL,
  `record_date` date NOT NULL,
  `diagnosis` text,
  `treatment_plan` text,
  `images` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orthopedic_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2),
  `duration` int,
  `active` boolean DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` bigint NOT NULL,
  `treatment_id` bigint,
  `product_id` bigint,
  `rental_id` bigint,
  `processed_by_user_id` bigint,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(255),
  `invoice_number` varchar(255),
  `status` varchar(255),
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `registros_pendientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL UNIQUE,
  `codigo_verificacion` varchar(255) NOT NULL,
  `fecha_expiracion` timestamp NOT NULL,
  `verificado` boolean NOT NULL DEFAULT false,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_rentals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patient_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `approved_by_user_id` bigint,
  `start_date` date NOT NULL,
  `end_date` date,
  `deposit_amount` decimal(10,2),
  `rental_price` decimal(10,2) NOT NULL,
  `status` varchar(255),
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Definir relaciones
ALTER TABLE `role_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
ALTER TABLE `role_permissions` ADD FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);
ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
ALTER TABLE `patients` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `appointments` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);
ALTER TABLE `appointments` ADD FOREIGN KEY (`specialist_id`) REFERENCES `users` (`id`);
ALTER TABLE `orthopedic_records` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);
ALTER TABLE `orthopedic_records` ADD FOREIGN KEY (`specialist_id`) REFERENCES `users` (`id`);
ALTER TABLE `payments` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);
ALTER TABLE `payments` ADD FOREIGN KEY (`product_id`) REFERENCES `orthopedic_products` (`id`);
ALTER TABLE `payments` ADD FOREIGN KEY (`rental_id`) REFERENCES `product_rentals` (`id`);
ALTER TABLE `payments` ADD FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`);
ALTER TABLE `product_rentals` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);
ALTER TABLE `product_rentals` ADD FOREIGN KEY (`product_id`) REFERENCES `orthopedic_products` (`id`);
ALTER TABLE `product_rentals` ADD FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`); 