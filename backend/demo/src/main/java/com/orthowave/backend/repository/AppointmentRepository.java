package com.orthowave.backend.repository;

import com.orthowave.backend.model.Appointment;
import com.orthowave.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
    List<Appointment> findByDoctorAndAppointmentDateBetween(User doctor, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByPatientAndAppointmentDateBetween(User patient, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorAndAppointmentDateBetween(User doctor, LocalDateTime start, LocalDateTime end);
} 