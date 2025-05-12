package com.ortowhite.repositories;

import com.ortowhite.models.Patient;
import com.ortowhite.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByDocumentId(String documentId);
    Optional<Patient> findByUser(User user);
} 