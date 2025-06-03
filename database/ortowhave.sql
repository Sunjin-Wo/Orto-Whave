-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 27, 2025 at 05:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ortowhave`
--

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ortowhave CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ortowhave;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de registros pendientes
CREATE TABLE IF NOT EXISTS registros_pendientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    codigo_verificacion VARCHAR(6) NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    verificado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
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

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `specialist_id` bigint(20) NOT NULL,
  `appointment_date_time` datetime NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orthopedic_products`
--

CREATE TABLE `orthopedic_products` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `status` enum('Disponible','Agotado','Alquiler') DEFAULT 'Disponible',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orthopedic_products`
--

INSERT INTO `orthopedic_products` (`id`, `name`, `description`, `price`, `category`, `image_url`, `stock`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Muletas aluminio ajustables', 'Muletas de aluminio ligeras y ajustables para facilitar la movilidad', 120000.00, 'movilidad', '/images/products/Muletas de Aluminio.webp', 15, 'Disponible', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(2, 'Andador plegable con asiento', 'Andador plegable con asiento integrado para mayor comodidad', 180000.00, 'movilidad', '/images/products/Andador plegable con asiento.webp', 8, 'Disponible', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(3, 'Órtesis de rodilla articulada', 'Soporte ortopédico para la rodilla con articulación ajustable', 250000.00, 'órtesis', '/images/products/Órtesis de rodilla articulada.webp', 10, 'Disponible', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(4, 'Collarín cervical', 'Soporte para el cuello que ayuda a aliviar el dolor y la tensión cervical', 85000.00, 'órtesis', '/images/products/Collarín cervical.webp', 0, 'Agotado', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(5, 'Silla de ruedas plegable', 'Silla de ruedas ligera y plegable para facilitar el transporte', 450000.00, 'movilidad', '/images/products/Silla de ruedas plegable.webp', 5, 'Alquiler', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(6, 'Cabestrillo para brazo', 'Soporte para inmovilizar el brazo durante la recuperación de lesiones', 65000.00, 'órtesis', '/images/products/Cabestrillo para brazo.webp', 20, 'Disponible', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(7, 'Cojín antiescaras', 'Cojín especial para prevenir úlceras por presión en pacientes con movilidad reducida', 110000.00, 'confort', '/images/products/Cojín antiescaras.webp', 12, 'Disponible', '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(8, 'Férula inmovilizadora de muñeca', 'Férula ortopédica para inmovilizar la muñeca', 75000.00, 'órtesis', '/images/products/Férula inmovilizadora de muñeca.webp', 18, 'Disponible', '2025-05-16 15:47:02', '2025-05-16 15:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `orthopedic_records`
--

CREATE TABLE `orthopedic_records` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `specialist_id` bigint(20) NOT NULL,
  `record_date` date NOT NULL,
  `diagnosis` text DEFAULT NULL,
  `treatment_plan` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orthopedic_services`
--

CREATE TABLE `orthopedic_services` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orthopedic_services`
--

INSERT INTO `orthopedic_services` (`id`, `name`, `description`, `price`, `duration`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Fisioterapia', 'Tratamientos personalizados para recuperación y rehabilitación física', 80000.00, 45, 1, '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(2, 'Rehabilitación Física', 'Programas especializados para recuperar la movilidad y funcionalidad', 100000.00, 60, 1, '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(3, 'Evaluación de Prótesis y Órtesis', 'Evaluación para soluciones en prótesis y dispositivos ortopédicos', 120000.00, 45, 1, '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(4, 'Diagnóstico Especializado', 'Evaluación experta de condiciones ortopédicas', 150000.00, 30, 1, '2025-05-16 15:47:02', '2025-05-16 15:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `document_id` varchar(20) NOT NULL,
  `document_type` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `blood_type` varchar(5) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `mobility_limitations` text DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `medical_history` text DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `first_name`, `last_name`, `document_id`, `document_type`, `email`, `phone`, `birth_date`, `address`, `gender`, `blood_type`, `allergies`, `emergency_contact_name`, `emergency_contact_phone`, `mobility_limitations`, `diagnosis`, `medical_history`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Paciente', 'Ejemplo', '1234567890', 'CC', 'paciente@ortowhave.co', '3101234567', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(2, 'Sergio', 'Nicolas Pachon Lucas', '1014661023', 'CC', 'pachonluacassergionicolas@gmail.com', '3134621823', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2025-05-16 16:47:38', '2025-05-16 16:47:38');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `treatment_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `rental_id` bigint(20) DEFAULT NULL,
  `processed_by_user_id` bigint(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'view_dashboard', 'Ver panel de control', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(2, 'manage_users', 'Gestionar usuarios', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(3, 'manage_patients', 'Gestionar pacientes', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(4, 'view_patients', 'Ver listado de pacientes', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(5, 'manage_appointments', 'Gestionar citas', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(6, 'view_appointments', 'Ver citas', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(7, 'manage_medical_records', 'Gestionar registros médicos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(8, 'view_medical_records', 'Ver registros médicos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(9, 'manage_treatments', 'Gestionar tratamientos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(10, 'view_treatments', 'Ver tratamientos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(11, 'manage_products', 'Gestionar productos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(12, 'view_products', 'Ver productos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(13, 'manage_services', 'Gestionar servicios', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(14, 'view_services', 'Ver servicios', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(15, 'manage_rentals', 'Gestionar alquileres', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(16, 'view_rentals', 'Ver alquileres', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(17, 'manage_payments', 'Gestionar pagos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(18, 'view_payments', 'Ver pagos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(19, 'view_reports', 'Ver reportes', '2025-05-16 15:47:00', '2025-05-16 15:47:00');

-- --------------------------------------------------------

--
-- Table structure for table `product_prescriptions`
--

CREATE TABLE `product_prescriptions` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `specialist_id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `prescription_date` date NOT NULL,
  `details` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_rentals`
--

CREATE TABLE `product_rentals` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `approved_by_user_id` bigint(20) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `deposit_amount` decimal(10,2) DEFAULT NULL,
  `rental_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rehabilitation_treatments`
--

CREATE TABLE `rehabilitation_treatments` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `specialist_id` bigint(20) NOT NULL,
  `treatment_type` varchar(100) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'ROLE_ADMIN', 'Administrador del sistema con acceso completo', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(2, 'ROLE_DOCTOR', 'Especialista/doctor con acceso a registros médicos e historiales', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(3, 'ROLE_STAFF', 'Personal administrativo con acceso limitado a registros médicos', '2025-05-16 15:47:00', '2025-05-16 15:47:00'),
(4, 'ROLE_USER', 'Usuario/paciente con acceso solo a su información', '2025-05-16 15:47:00', '2025-05-16 15:47:00');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`) VALUES
(1, 1, '2025-05-16 15:47:00'),
(1, 2, '2025-05-16 15:47:00'),
(1, 3, '2025-05-16 15:47:00'),
(1, 4, '2025-05-16 15:47:00'),
(1, 5, '2025-05-16 15:47:00'),
(1, 6, '2025-05-16 15:47:00'),
(1, 7, '2025-05-16 15:47:00'),
(1, 8, '2025-05-16 15:47:00'),
(1, 9, '2025-05-16 15:47:00'),
(1, 10, '2025-05-16 15:47:00'),
(1, 11, '2025-05-16 15:47:00'),
(1, 12, '2025-05-16 15:47:00'),
(1, 13, '2025-05-16 15:47:00'),
(1, 14, '2025-05-16 15:47:00'),
(1, 15, '2025-05-16 15:47:00'),
(1, 16, '2025-05-16 15:47:00'),
(1, 17, '2025-05-16 15:47:00'),
(1, 18, '2025-05-16 15:47:00'),
(1, 19, '2025-05-16 15:47:00'),
(2, 1, '2025-05-16 15:47:01'),
(2, 3, '2025-05-16 15:47:01'),
(2, 4, '2025-05-16 15:47:01'),
(2, 5, '2025-05-16 15:47:01'),
(2, 6, '2025-05-16 15:47:01'),
(2, 7, '2025-05-16 15:47:01'),
(2, 8, '2025-05-16 15:47:01'),
(2, 9, '2025-05-16 15:47:01'),
(2, 10, '2025-05-16 15:47:01'),
(2, 12, '2025-05-16 15:47:01'),
(2, 14, '2025-05-16 15:47:01'),
(3, 1, '2025-05-16 15:47:01'),
(3, 4, '2025-05-16 15:47:01'),
(3, 5, '2025-05-16 15:47:01'),
(3, 6, '2025-05-16 15:47:01'),
(3, 12, '2025-05-16 15:47:01'),
(3, 14, '2025-05-16 15:47:01'),
(3, 15, '2025-05-16 15:47:01'),
(3, 16, '2025-05-16 15:47:01'),
(3, 17, '2025-05-16 15:47:01'),
(3, 18, '2025-05-16 15:47:01'),
(4, 6, '2025-05-16 15:47:01'),
(4, 12, '2025-05-16 15:47:01'),
(4, 14, '2025-05-16 15:47:01');

-- --------------------------------------------------------

--
-- Table structure for table `specialists`
--

CREATE TABLE `specialists` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `education` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `available_hours` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `specialists`
--

INSERT INTO `specialists` (`id`, `user_id`, `specialty`, `license_number`, `education`, `experience`, `available_hours`, `created_at`, `updated_at`) VALUES
(1, 2, 'Ortopedia y Traumatología', 'LIC-12345', NULL, NULL, NULL, '2025-05-16 15:47:02', '2025-05-16 15:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `treatment_progress`
--

CREATE TABLE `treatment_progress` (
  `id` bigint(20) NOT NULL,
  `treatment_id` bigint(20) NOT NULL,
  `specialist_id` bigint(20) NOT NULL,
  `progress_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `mobility_improvement` text DEFAULT NULL,
  `pain_level` int(11) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `verification_code` varchar(50) DEFAULT NULL,
  `verification_code_expiry` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role_id`, `first_name`, `last_name`, `phone`, `active`, `email_verified`, `verification_code`, `verification_code_expiry`, `last_login`, `profile_image`, `created_at`, `updated_at`) VALUES
(1, 'admin@ortowhave.co', '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 1, 'Admin', 'OWC', NULL, 1, 1, NULL, NULL, NULL, NULL, '2025-05-16 15:47:01', '2025-05-16 15:47:01'),
(2, 'doctor@ortowhave.co', '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 2, 'Doctor', 'Ejemplo', NULL, 1, 1, NULL, NULL, NULL, NULL, '2025-05-16 15:47:01', '2025-05-16 15:47:01'),
(3, 'staff@ortowhave.co', '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 3, 'Staff', 'Ejemplo', NULL, 1, 1, NULL, NULL, NULL, NULL, '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(4, 'paciente@ortowhave.co', '$2a$10$UtYOg5Ar.QwgA3FZq3y6de4Xd/3lzV/6V7UuWb1.VTb0QOGe/pB.e', 4, 'Paciente', 'Ejemplo', NULL, 1, 1, NULL, NULL, NULL, NULL, '2025-05-16 15:47:02', '2025-05-16 15:47:02'),
(5, 'pachonluacassergionicolas@gmail.com', '$2a$10$MQD5UdqvWFS/zoO8Z2F3zeLr.BSLLl/vKAxSpavQ.rbfNDvCGhROO', 4, 'Sergio', 'Nicolas Pachon Lucas', '3134621823', 1, 0, '285499', '2025-05-17 16:48:32', NULL, NULL, '2025-05-16 21:47:38', '2025-05-16 21:47:38');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity_logs`
--

CREATE TABLE `user_activity_logs` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `action` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `specialist_id` (`specialist_id`);

--
-- Indexes for table `orthopedic_products`
--
ALTER TABLE `orthopedic_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orthopedic_records`
--
ALTER TABLE `orthopedic_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `specialist_id` (`specialist_id`);

--
-- Indexes for table `orthopedic_services`
--
ALTER TABLE `orthopedic_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `document_id` (`document_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `treatment_id` (`treatment_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `rental_id` (`rental_id`),
  ADD KEY `processed_by_user_id` (`processed_by_user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `product_prescriptions`
--
ALTER TABLE `product_prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `specialist_id` (`specialist_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_rentals`
--
ALTER TABLE `product_rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `approved_by_user_id` (`approved_by_user_id`);

--
-- Indexes for table `rehabilitation_treatments`
--
ALTER TABLE `rehabilitation_treatments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `specialist_id` (`specialist_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `specialists`
--
ALTER TABLE `specialists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `treatment_progress`
--
ALTER TABLE `treatment_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `treatment_id` (`treatment_id`),
  ADD KEY `specialist_id` (`specialist_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orthopedic_products`
--
ALTER TABLE `orthopedic_products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orthopedic_records`
--
ALTER TABLE `orthopedic_records`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orthopedic_services`
--
ALTER TABLE `orthopedic_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `product_prescriptions`
--
ALTER TABLE `product_prescriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_rentals`
--
ALTER TABLE `product_rentals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rehabilitation_treatments`
--
ALTER TABLE `rehabilitation_treatments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `specialists`
--
ALTER TABLE `specialists`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `treatment_progress`
--
ALTER TABLE `treatment_progress`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`id`);

--
-- Constraints for table `orthopedic_records`
--
ALTER TABLE `orthopedic_records`
  ADD CONSTRAINT `orthopedic_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `orthopedic_records_ibfk_2` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`id`);

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `rehabilitation_treatments` (`id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `orthopedic_products` (`id`),
  ADD CONSTRAINT `payments_ibfk_4` FOREIGN KEY (`rental_id`) REFERENCES `product_rentals` (`id`),
  ADD CONSTRAINT `payments_ibfk_5` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `product_prescriptions`
--
ALTER TABLE `product_prescriptions`
  ADD CONSTRAINT `product_prescriptions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `product_prescriptions_ibfk_2` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`id`),
  ADD CONSTRAINT `product_prescriptions_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `orthopedic_products` (`id`);

--
-- Constraints for table `product_rentals`
--
ALTER TABLE `product_rentals`
  ADD CONSTRAINT `product_rentals_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `product_rentals_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `orthopedic_products` (`id`),
  ADD CONSTRAINT `product_rentals_ibfk_3` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `rehabilitation_treatments`
--
ALTER TABLE `rehabilitation_treatments`
  ADD CONSTRAINT `rehabilitation_treatments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `rehabilitation_treatments_ibfk_2` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);

--
-- Constraints for table `specialists`
--
ALTER TABLE `specialists`
  ADD CONSTRAINT `specialists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `treatment_progress`
--
ALTER TABLE `treatment_progress`
  ADD CONSTRAINT `treatment_progress_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `rehabilitation_treatments` (`id`),
  ADD CONSTRAINT `treatment_progress_ibfk_2` FOREIGN KEY (`specialist_id`) REFERENCES `specialists` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD CONSTRAINT `user_activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;