package com.ortowhave.repository;

import com.ortowhave.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findBySpecialistId(Long specialistId);
    
    List<Appointment> findByAppointmentDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    List<Appointment> findByPatientIdAndAppointmentDateTimeAfter(Long patientId, LocalDateTime dateTime);
}
