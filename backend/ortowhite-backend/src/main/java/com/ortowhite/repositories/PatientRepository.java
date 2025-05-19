package com.ortowhite.repositories;

import com.ortowhite.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(Long userId);
    Optional<Patient> findByDocumentId(String documentId);
    Optional<Patient> findByEmail(String email);
    List<Patient> findTop5ByOrderById();
} 