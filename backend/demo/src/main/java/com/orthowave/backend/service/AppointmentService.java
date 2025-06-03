package com.orthowave.backend.service;

import com.orthowave.backend.model.Appointment;
import com.orthowave.backend.model.User;
import com.orthowave.backend.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Transactional
    public Appointment scheduleAppointment(Appointment appointment) {
        // Verificar disponibilidad del doctor
        if (isDoctorAvailable(appointment.getDoctor(), appointment.getAppointmentDate())) {
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Doctor not available at the selected time");
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long appointmentId, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointments(User patient) {
        return appointmentRepository.findByPatient(patient);
    }

    public List<Appointment> getDoctorAppointments(User doctor) {
        return appointmentRepository.findByDoctor(doctor);
    }

    public List<Appointment> getDoctorAppointmentsBetween(User doctor, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDoctorAndAppointmentDateBetween(doctor, start, end);
    }

    public List<Appointment> getPatientAppointmentsBetween(User patient, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByPatientAndAppointmentDateBetween(patient, start, end);
    }

    private boolean isDoctorAvailable(User doctor, LocalDateTime appointmentDate) {
        LocalDateTime endTime = appointmentDate.plusMinutes(30); // Duración por defecto
        return !appointmentRepository.existsByDoctorAndAppointmentDateBetween(doctor, appointmentDate, endTime);
    }
} 