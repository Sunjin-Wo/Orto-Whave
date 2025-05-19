package com.ortowhite.services;

import com.ortowhite.models.Patient;
import com.ortowhite.models.User;
import com.ortowhite.repositories.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByDocumentId(String documentId) {
        return patientRepository.findByDocumentId(documentId);
    }

    public Patient getPatientByUser(User user) {
        return patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado para el usuario"));
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
} 